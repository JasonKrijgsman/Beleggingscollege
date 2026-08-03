import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/db", () => import("./helpers/pglite-db"));
vi.mock("@/auth", () => ({ auth: vi.fn() }));

import LessonPage from "@/app/cursussen/[slug]/les/[les]/page";
import LesVergrendeld from "@/components/LesVergrendeld";
import { auth } from "@/auth";
import { entitlements, paymentAttempts } from "@/db/schema";
import { db, leegAlleTabellen, maakGebruiker } from "./helpers/pglite-db";

/**
 * DE POORT, van de andere kant bekeken.
 *
 * De rooktest in e2e/ bewijst dat een betaalde les DICHT zit voor een anonieme
 * bezoeker. Wat daar niet te bewijzen viel is het spiegelbeeld — dat de les
 * ook echt OPEN gaat voor iemand die betaald heeft. Dat is de duurste stille
 * fout die dit product kan maken: iemand rekent €49 af en blijft naar een
 * slotje kijken.
 *
 * In de browser lukte dat hier niet: de draaiende server heeft daarvoor een
 * échte database nodig (Neon praat over HTTP, PGlite draait in-process) plus
 * een geldige sessiecookie, en de enige manier om die twee werelden te laten
 * raken was een testluik in src/db/index.ts — precies het bestand waar
 * CLAUDE.md voor waarschuwt en waar alle authenticatie, aankopen en voortgang
 * samenkomen. Dat risico is deze test niet waard.
 *
 * Dus toetsen we de poort waar hij zit: in het server component zelf, met de
 * échte `heeftToegangTot`, de échte aankooprijen (PGlite met de echte
 * migraties) en de échte pagina. Alleen de sessie is nep. Wat hier niet in zit
 * is of de browser het vervolgens ook schildert — dát deel dekt de rooktest al
 * af op de gratis les, die exact dezelfde component en LessonRunner gebruikt.
 */

const authMock = vi.mocked(auth);

function zetSessie(userId: string | null) {
  authMock.mockResolvedValue(
    (userId ? { user: { id: userId, name: "Test" } } : null) as never
  );
}

/** Verzamelt alle tekst uit een React-boom (alleen children, geen props). */
function tekstUit(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(tekstUit).join(" ");
  if (typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: unknown } }).props;
    return tekstUit(props?.children);
  }
  return "";
}

function toon(slug: string, les: string) {
  return LessonPage({ params: Promise.resolve({ slug, les }) });
}

const BETAALD = { cursus: "waardebeleggen", les: "wat-is-waardebeleggen" };
const GRATIS = { cursus: "beleggen-voor-beginners", les: "waarom-beleggen" };

// Een zin die alleen in de lesinhoud van de betaalde les staat.
const UIT_DE_LES = "pindakaas";

/**
 * Een betaalpoging met de gegeven status, plus — alleen als die "paid" is —
 * het recht dat de webhook in dezelfde transactie zou verlenen. Zo blijft de
 * bewering van deze tests exact dezelfde: alleen een bétaalde order opent de
 * les, elke andere status niet.
 */
async function koop(userId: string, courseSlug: string, status: string) {
  const attemptId = `poging-${userId}-${courseSlug}-${status}`;
  await db.insert(paymentAttempts).values({
    id: attemptId,
    userId,
    courseSlug,
    molliePaymentId: `tr_${userId}_${courseSlug}_${status}`,
    status,
    amountCents: 4900,
    currency: "EUR",
  });
  if (status === "paid") {
    await db.insert(entitlements).values({
      userId,
      courseSlug,
      status: "actief",
      attemptId,
    });
  }
}

beforeEach(async () => {
  await leegAlleTabellen();
  vi.clearAllMocks();
  await maakGebruiker("koper");
  await maakGebruiker("kijker");
});

describe("een betaalde les gaat open voor wie hem gekocht heeft", () => {
  it("met een aankoop op 'paid' staat de volledige lesinhoud er", async () => {
    zetSessie("koper");
    await koop("koper", BETAALD.cursus, "paid");

    const pagina = await toon(BETAALD.cursus, BETAALD.les);
    expect(pagina.type).not.toBe(LesVergrendeld);

    const tekst = tekstUit(pagina);
    expect(tekst).toContain("Wat is waardebeleggen?");
    expect(tekst).toContain(UIT_DE_LES);
    expect(tekst).toContain("Prijs en waarde zijn niet hetzelfde");
  });

  it("de aankoop van cursus A opent cursus B niet", async () => {
    zetSessie("koper");
    await koop("koper", "technische-analyse", "paid");

    const pagina = await toon(BETAALD.cursus, BETAALD.les);
    expect(pagina.type).toBe(LesVergrendeld);
    expect(tekstUit(pagina)).not.toContain(UIT_DE_LES);
  });
});

describe("en blijft dicht voor alle andere gevallen", () => {
  it("uitgelogd: op slot, geen lesinhoud", async () => {
    zetSessie(null);
    const pagina = await toon(BETAALD.cursus, BETAALD.les);
    expect(pagina.type).toBe(LesVergrendeld);
    expect(tekstUit(pagina)).not.toContain(UIT_DE_LES);
  });

  it("ingelogd zonder aankoop: op slot", async () => {
    zetSessie("kijker");
    const pagina = await toon(BETAALD.cursus, BETAALD.les);
    expect(pagina.type).toBe(LesVergrendeld);
  });

  it.each(["pending", "failed", "expired", "canceled"])(
    "een aankoop met status '%s' geeft geen toegang",
    async (status) => {
      zetSessie("koper");
      await koop("koper", BETAALD.cursus, status);

      const pagina = await toon(BETAALD.cursus, BETAALD.les);
      expect(pagina.type).toBe(LesVergrendeld);
      expect(tekstUit(pagina)).not.toContain(UIT_DE_LES);
    }
  );

  it("de aankoop van iemand anders telt niet", async () => {
    await koop("koper", BETAALD.cursus, "paid");
    zetSessie("kijker");

    const pagina = await toon(BETAALD.cursus, BETAALD.les);
    expect(pagina.type).toBe(LesVergrendeld);
  });
});

describe("de gratis cursus blijft voor iedereen open", () => {
  it("ook zonder account staat de lesinhoud er", async () => {
    zetSessie(null);
    const pagina = await toon(GRATIS.cursus, GRATIS.les);
    expect(pagina.type).not.toBe(LesVergrendeld);
    expect(tekstUit(pagina)).toContain("Waarom beleggen?");
  });
});

describe("onbekende paden", () => {
  it("een niet-bestaande cursus of les valt door naar notFound()", async () => {
    zetSessie(null);
    await expect(toon("bestaat-niet", GRATIS.les)).rejects.toThrow();
    await expect(toon(GRATIS.cursus, "bestaat-niet")).rejects.toThrow();
  });
});
