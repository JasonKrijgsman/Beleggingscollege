import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

vi.mock("@/db", () => import("./helpers/pglite-db"));
vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/beheer", () => ({ isBeheerder: vi.fn() }));

import { POST as vraagPOST } from "@/app/api/lesvragen/route";
import { POST as moderatiePOST } from "@/app/api/lesvragen/moderatie/route";
import { auth } from "@/auth";
import { isBeheerder } from "@/lib/beheer";
import { zichtbareVragen } from "@/lib/lesvragen";
import { lessonQuestions, purchases } from "@/db/schema";
import { db, leegAlleTabellen, maakGebruiker } from "./helpers/pglite-db";

/**
 * De HTTP-schil om lesvragen heen. De lespagina toont het formulier alleen aan
 * wie de les mag zien, maar de UI is geen autorisatie: dit endpoint moet zélf
 * opnieuw langs de echte toegangspoort (heeftToegangTot, hier ongemockt, met
 * echte purchases-rijen in PGlite). De moderatieroute verhult bovendien zijn
 * bestaan voor wie geen beheerder is.
 */

const authMock = vi.mocked(auth);
const beheerderMock = vi.mocked(isBeheerder);

function zetSessie(userId: string | null) {
  authMock.mockResolvedValue(
    (userId ? { user: { id: userId, name: "Test" } } : null) as never
  );
}

function verzoek(url: string, body: unknown): NextRequest {
  return new Request(`https://example.test${url}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  }) as unknown as NextRequest;
}

const GRATIS = { courseSlug: "beleggen-voor-beginners", lessonSlug: "waarom-beleggen" };
const BETAALD = { courseSlug: "waardebeleggen", lessonSlug: "wat-is-waardebeleggen" };
const EEN_VRAAG = "Hoe weet ik of dit een goed moment is om te beginnen?";

beforeEach(async () => {
  await leegAlleTabellen();
  vi.clearAllMocks();
  await maakGebruiker("u1");
  zetSessie("u1");
  beheerderMock.mockResolvedValue(false);
});

describe("POST /api/lesvragen", () => {
  it("zonder sessie: 401", async () => {
    zetSessie(null);
    const res = await vraagPOST(
      verzoek("/api/lesvragen", { ...GRATIS, vraag: EEN_VRAAG })
    );
    expect(res.status).toBe(401);
  });

  it("betaalde cursus zonder aankoop: 403 — de UI is geen autorisatie", async () => {
    const res = await vraagPOST(
      verzoek("/api/lesvragen", { ...BETAALD, vraag: EEN_VRAAG })
    );
    expect(res.status).toBe(403);
    expect(await db.select().from(lessonQuestions)).toHaveLength(0);
  });

  it("betaalde cursus mét aankoop: 200 en de vraag staat te wachten", async () => {
    await db.insert(purchases).values({
      userId: "u1",
      courseSlug: BETAALD.courseSlug,
      molliePaymentId: "tr_test",
      status: "paid",
      amountCents: 4900,
      currency: "EUR",
    });
    const res = await vraagPOST(
      verzoek("/api/lesvragen", { ...BETAALD, vraag: EEN_VRAAG })
    );
    expect(res.status).toBe(200);
    const rijen = await db.select().from(lessonQuestions);
    expect(rijen).toHaveLength(1);
    expect(rijen[0].status).toBe("wachtend");
  });

  it("een aankoop die niet op 'paid' staat telt niet: 403", async () => {
    await db.insert(purchases).values({
      userId: "u1",
      courseSlug: BETAALD.courseSlug,
      molliePaymentId: "tr_pending",
      status: "pending",
      amountCents: 4900,
      currency: "EUR",
    });
    const res = await vraagPOST(
      verzoek("/api/lesvragen", { ...BETAALD, vraag: EEN_VRAAG })
    );
    expect(res.status).toBe(403);
  });

  it("gratis cursus: toegankelijk, maar een te korte vraag blijft 400", async () => {
    const res = await vraagPOST(
      verzoek("/api/lesvragen", { ...GRATIS, vraag: "te kort" })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBeTruthy();
  });

  it("kapotte body: geen toegang tot cursus '' dus 403, geen crash", async () => {
    const res = await vraagPOST(verzoek("/api/lesvragen", null));
    expect(res.status).toBe(403);
  });
});

describe("POST /api/lesvragen/moderatie", () => {
  async function zaaiVraag(id: string) {
    await db.insert(lessonQuestions).values({
      id,
      userId: "u1",
      naam: "Test",
      courseSlug: GRATIS.courseSlug,
      lessonSlug: GRATIS.lessonSlug,
      vraag: EEN_VRAAG,
      status: "wachtend",
    });
  }

  it("geen beheerder: 404 — het endpoint bevestigt zijn bestaan niet", async () => {
    await zaaiVraag("q1");
    const res = await moderatiePOST(
      verzoek("/api/lesvragen/moderatie", {
        id: "q1",
        actie: "beantwoord",
        antwoord: "Een helder antwoord.",
      })
    );
    expect(res.status).toBe(404);
    expect(await zichtbareVragen(GRATIS.courseSlug, GRATIS.lessonSlug)).toHaveLength(0);
  });

  it("beheerder + geldig antwoord: 200 en de vraag wordt openbaar", async () => {
    beheerderMock.mockResolvedValue(true);
    await zaaiVraag("q1");
    const res = await moderatiePOST(
      verzoek("/api/lesvragen/moderatie", {
        id: "q1",
        actie: "beantwoord",
        antwoord: "Een helder, opbouwend antwoord.",
      })
    );
    expect(res.status).toBe(200);
    expect(await zichtbareVragen(GRATIS.courseSlug, GRATIS.lessonSlug)).toHaveLength(1);
  });

  it("beheerder + onbekende actie of ontbrekend id: 400", async () => {
    beheerderMock.mockResolvedValue(true);
    expect(
      (
        await moderatiePOST(
          verzoek("/api/lesvragen/moderatie", { id: "q1", actie: "verwijder" })
        )
      ).status
    ).toBe(400);
    expect(
      (
        await moderatiePOST(
          verzoek("/api/lesvragen/moderatie", { actie: "beantwoord" })
        )
      ).status
    ).toBe(400);
  });

  it("beheerder + leeg antwoord bij 'beantwoord': 400 en de vraag blijft wachten", async () => {
    beheerderMock.mockResolvedValue(true);
    await zaaiVraag("q1");
    const res = await moderatiePOST(
      verzoek("/api/lesvragen/moderatie", {
        id: "q1",
        actie: "beantwoord",
        antwoord: "",
      })
    );
    expect(res.status).toBe(400);
    expect(await zichtbareVragen(GRATIS.courseSlug, GRATIS.lessonSlug)).toHaveLength(0);
  });
});
