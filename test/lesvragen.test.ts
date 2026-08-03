import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/db", () => import("./helpers/pglite-db"));

import { lessonQuestions } from "@/db/schema";
import {
  MAX_WACHTEND_PER_GEBRUIKER,
  modereer,
  plaatsVraag,
  wachtendeVragen,
  zichtbareVragen,
} from "@/lib/lesvragen";
import { db, leegAlleTabellen, maakGebruiker } from "./helpers/pglite-db";

/**
 * "Vragen bij deze les" is redactioneel en alleen voor ingelogde gebruikers.
 * Deze tests draaien tegen een echte in-memory Postgres (PGlite) met het echte
 * schema, zodat de daadwerkelijke where-clausules meebewijzen. Ze bewaken de
 * misbruik- en zichtbaarheidsregels: lengtegrenzen, onbekende lessen, de
 * spamlimiet per gebruiker, en dat een vraag pas openbaar wordt ná moderatie.
 *
 * De gratis cursus en een van zijn echte lessen dienen als geldige les — alleen
 * dát ze bestaan doet ertoe, niet hun inhoud.
 */

const CURSUS = "beleggen-voor-beginners";
const LES = "waarom-beleggen";
const EEN_VRAAG = "Hoe weet ik of dit een goed moment is om te beginnen?";

beforeEach(async () => {
  await leegAlleTabellen();
  await maakGebruiker("u1");
});

async function zaai(overrides: {
  id: string;
  status?: string;
  antwoord?: string | null;
  answeredAt?: Date | null;
  lessonSlug?: string;
}) {
  await db.insert(lessonQuestions).values({
    id: overrides.id,
    userId: "u1",
    naam: "Test",
    courseSlug: CURSUS,
    lessonSlug: overrides.lessonSlug ?? LES,
    vraag: EEN_VRAAG,
    status: overrides.status ?? "wachtend",
    antwoord: overrides.antwoord ?? null,
    answeredAt: overrides.answeredAt ?? null,
  });
}

describe("plaatsVraag", () => {
  it("weigert een te korte vraag", async () => {
    expect((await plaatsVraag("u1", "Test", CURSUS, LES, "te kort")).ok).toBe(false);
  });

  it("weigert een te lange vraag", async () => {
    expect((await plaatsVraag("u1", "Test", CURSUS, LES, "a".repeat(1001))).ok).toBe(false);
  });

  it("weigert een onbekende les", async () => {
    expect((await plaatsVraag("u1", "Test", CURSUS, "bestaat-niet", EEN_VRAAG)).ok).toBe(false);
  });

  it("plaatst een geldige vraag als 'wachtend'", async () => {
    expect((await plaatsVraag("u1", "Test", CURSUS, LES, EEN_VRAAG)).ok).toBe(true);
    const wachtend = await wachtendeVragen();
    expect(wachtend).toHaveLength(1);
    expect(wachtend[0].status).toBe("wachtend");
  });

  it(`weigert de ${MAX_WACHTEND_PER_GEBRUIKER + 1}e openstaande vraag van dezelfde gebruiker`, async () => {
    for (let i = 0; i < MAX_WACHTEND_PER_GEBRUIKER; i++) {
      expect((await plaatsVraag("u1", "Test", CURSUS, LES, `${EEN_VRAAG} (${i})`)).ok).toBe(true);
    }
    expect((await plaatsVraag("u1", "Test", CURSUS, LES, EEN_VRAAG)).ok).toBe(false);
  });
});

describe("modereer", () => {
  it("beantwoorden maakt de vraag zichtbaar en vult het antwoord", async () => {
    await zaai({ id: "q1" });
    expect((await modereer("q1", "beantwoord", "Een helder, opbouwend antwoord.")).ok).toBe(true);
    const zichtbaar = await zichtbareVragen(CURSUS, LES);
    expect(zichtbaar).toHaveLength(1);
    expect(zichtbaar[0].antwoord).toContain("opbouwend");
  });

  it("weigert een leeg/te kort antwoord en laat de vraag wachtend", async () => {
    await zaai({ id: "q1" });
    expect((await modereer("q1", "beantwoord", "")).ok).toBe(false);
    expect(await zichtbareVragen(CURSUS, LES)).toHaveLength(0);
    expect(await wachtendeVragen()).toHaveLength(1);
  });

  it("afwijzen houdt de vraag zowel uit beeld als uit de wachtrij", async () => {
    await zaai({ id: "q1" });
    await modereer("q1", "afgewezen", "");
    expect(await zichtbareVragen(CURSUS, LES)).toHaveLength(0);
    expect(await wachtendeVragen()).toHaveLength(0);
  });

  it("is idempotent: een al beantwoorde vraag verandert niet meer", async () => {
    await zaai({ id: "q1" });
    await modereer("q1", "beantwoord", "Eerste antwoord blijft staan.");
    // Tweede moderatie mag niets overschrijven (guard op status = 'wachtend').
    await modereer("q1", "afgewezen", "");
    const zichtbaar = await zichtbareVragen(CURSUS, LES);
    expect(zichtbaar).toHaveLength(1);
    expect(zichtbaar[0].antwoord).toContain("Eerste antwoord");
  });
});

describe("zichtbareVragen", () => {
  it("toont alleen beantwoorde vragen van de juiste les, nieuwste eerst", async () => {
    await zaai({ id: "oud", status: "zichtbaar", antwoord: "Ouder antwoord", answeredAt: new Date("2026-08-01T10:00:00Z") });
    await zaai({ id: "nieuw", status: "zichtbaar", antwoord: "Nieuwer antwoord", answeredAt: new Date("2026-08-03T10:00:00Z") });
    await zaai({ id: "wacht", status: "wachtend" });
    await zaai({ id: "andere-les", status: "zichtbaar", antwoord: "Andere les", answeredAt: new Date("2026-08-02T10:00:00Z"), lessonSlug: "rente-op-rente" });

    const zichtbaar = await zichtbareVragen(CURSUS, LES);
    expect(zichtbaar.map((v) => v.id)).toEqual(["nieuw", "oud"]);
  });
});
