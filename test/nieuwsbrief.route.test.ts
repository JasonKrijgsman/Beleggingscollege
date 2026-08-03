import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

vi.mock("@/db", () => import("./helpers/pglite-db"));
vi.mock("@/auth", () => ({ auth: vi.fn() }));

import { POST } from "@/app/api/nieuwsbrief/route";
import { auth } from "@/auth";
import { newsletterSignups } from "@/db/schema";
import { wisRatelimieten } from "@/lib/ratelimiet";
import { db, leegAlleTabellen, maakGebruiker } from "./helpers/pglite-db";

/**
 * De nieuwsbrief-aanmelding is bewust saai en defensief. Vier eigenschappen
 * verdienen een wachter:
 *
 * 1. Bij een geldig adres komt ALTIJD hetzelfde antwoord terug, ook als het
 *    adres al bestond — anders is dit endpoint een orakel waarmee iemand
 *    adressen op lidmaatschap kan testen.
 * 2. Het toestemmingsmoment moet aantoonbaar zijn (AVG): tijdstip en IP
 *    worden vastgelegd.
 * 3. Wie zich afmeldde moet zich opnieuw kunnen aanmelden. Dat kon niet — de
 *    oude onConflictDoNothing deed dan niets terwijl het formulier "gelukt"
 *    meldde. Maar alleen de eigenaar mag dat: het endpoint is publiek, dus
 *    anders draait een willekeurige derde jouw afmelding terug.
 * 4. Eén IP kan hier niet eindeloos op blijven rammen.
 */

const authMock = vi.mocked(auth);

function verzoek(body: unknown, headers: Record<string, string> = {}): NextRequest {
  return new Request("https://example.test/api/nieuwsbrief", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json", ...headers },
  }) as unknown as NextRequest;
}

beforeEach(async () => {
  await leegAlleTabellen();
  vi.clearAllMocks();
  // De ratelimiet telt in het geheugen van het proces en zou anders over de
  // tests heen doortellen.
  wisRatelimieten();
  authMock.mockResolvedValue(null as never);
});

describe("validatie", () => {
  it.each(["geen-adres", "a@b", "iemand@", "@voorbeeld.nl", "spatie in@adres.nl"])(
    "weigert '%s' met 400",
    async (email) => {
      const res = await POST(verzoek({ email }));
      expect(res.status).toBe(400);
      expect(await db.select().from(newsletterSignups)).toHaveLength(0);
    }
  );

  it("weigert een adres langer dan 254 tekens", async () => {
    const res = await POST(
      verzoek({ email: `${"a".repeat(250)}@lang.nl` })
    );
    expect(res.status).toBe(400);
  });

  it("kapotte body: 400, geen crash", async () => {
    const res = await POST(
      new Request("https://example.test/api/nieuwsbrief", {
        method: "POST",
        body: "geen-json",
        headers: { "content-type": "application/json" },
      }) as unknown as NextRequest
    );
    expect(res.status).toBe(400);
  });
});

describe("vastleggen", () => {
  it("normaliseert het adres en legt bron, tijdstip en IP vast", async () => {
    const res = await POST(
      verzoek(
        { email: "  Jason@Voorbeeld.NL  ", bron: "certificaat/waardebeleggen" },
        { "x-forwarded-for": "203.0.113.7, 10.0.0.1" }
      )
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const rijen = await db.select().from(newsletterSignups);
    expect(rijen).toHaveLength(1);
    expect(rijen[0].email).toBe("jason@voorbeeld.nl");
    expect(rijen[0].source).toBe("certificaat/waardebeleggen");
    // Alleen het eerste (client-)adres uit de keten, niet de hele proxyreeks.
    expect(rijen[0].consentIp).toBe("203.0.113.7");
    expect(rijen[0].consentedAt).toBeInstanceOf(Date);
    expect(rijen[0].userId).toBeNull();
  });

  it("gelooft x-real-ip boven de voorste waarde uit x-forwarded-for", async () => {
    // Eén waarde, door de rand gezet: daar valt niets verkeerd uit te kiezen.
    // De keten is de terugval en die is per definitie minder betrouwbaar.
    await POST(
      verzoek(
        { email: "echt@voorbeeld.nl" },
        {
          "x-real-ip": "203.0.113.9",
          "x-forwarded-for": "1.2.3.4, 203.0.113.9",
        }
      )
    );
    const rijen = await db.select().from(newsletterSignups);
    expect(rijen[0].consentIp).toBe("203.0.113.9");
  });

  it("koppelt het account als de aanmelder is ingelogd", async () => {
    await maakGebruiker("u1");
    authMock.mockResolvedValue({ user: { id: "u1" } } as never);
    await POST(verzoek({ email: "ingelogd@voorbeeld.nl" }));
    const rijen = await db.select().from(newsletterSignups);
    expect(rijen[0].userId).toBe("u1");
  });

  it("kapt een veel te lange bron af tot 80 tekens", async () => {
    await POST(verzoek({ email: "bron@voorbeeld.nl", bron: "x".repeat(200) }));
    const rijen = await db.select().from(newsletterSignups);
    expect(rijen[0].source).toHaveLength(80);
  });

  it("zonder bron: 'onbekend'", async () => {
    await POST(verzoek({ email: "zonder-bron@voorbeeld.nl" }));
    const rijen = await db.select().from(newsletterSignups);
    expect(rijen[0].source).toBe("onbekend");
  });
});

describe("geen orakel", () => {
  it("een tweede aanmelding met hetzelfde adres: zelfde antwoord, nog steeds één rij", async () => {
    const eerste = await POST(verzoek({ email: "dubbel@voorbeeld.nl" }));
    const tweede = await POST(verzoek({ email: "dubbel@voorbeeld.nl" }));

    expect(eerste.status).toBe(200);
    expect(tweede.status).toBe(200);
    expect(await eerste.json()).toEqual(await tweede.json());

    // Upsert op de unieke e-mailkolom: geen tweede rij.
    expect(await db.select().from(newsletterSignups)).toHaveLength(1);
  });

  it("een lopende aanmelding blijft ongemoeid: de oorspronkelijke toestemming schuift niet op", async () => {
    await POST(
      verzoek(
        { email: "lopend@voorbeeld.nl", bron: "eerste-bron" },
        { "x-forwarded-for": "203.0.113.1" }
      )
    );
    const [voor] = await db.select().from(newsletterSignups);

    await POST(
      verzoek(
        { email: "lopend@voorbeeld.nl", bron: "tweede-bron" },
        { "x-forwarded-for": "198.51.100.9" }
      )
    );
    const [na] = await db.select().from(newsletterSignups);

    // Idempotent: het toestemmingsbewijs (moment, IP) is het bewijs van de
    // éérste keer en mag niet door een herhaalde klik overschreven worden.
    expect(na.consentedAt.getTime()).toBe(voor.consentedAt.getTime());
    expect(na.consentIp).toBe("203.0.113.1");
    expect(na.source).toBe("eerste-bron");
    expect(na.unsubscribedAt).toBeNull();
  });
});

describe("opnieuw aanmelden na afmelden", () => {
  const AFGEMELD_OP = new Date("2026-07-01T12:00:00Z");

  /** Zet een adres neer dat ooit is bevestigd en zich daarna heeft afgemeld. */
  async function afgemeldAdres(email: string, consentedAt: Date) {
    await POST(verzoek({ email, bron: "certificaat/waardebeleggen" }));
    await db
      .update(newsletterSignups)
      .set({
        consentedAt,
        confirmedAt: new Date("2026-06-02T12:00:00Z"),
        unsubscribedAt: AFGEMELD_OP,
      })
      .where(eq(newsletterSignups.email, email));
  }

  it("de eigenaar zet zichzelf weer aan, met verse toestemming", async () => {
    // De toestemmingsdatum zetten we er ver vóór, zodat aantoonbaar is dát hij
    // ververst is.
    const OUD = new Date("2026-06-01T12:00:00Z");
    await afgemeldAdres("terug@voorbeeld.nl", OUD);

    // Eigenaarschap is hier één ding: ingelogd met precies dit adres.
    await maakGebruiker("u1", "terug@voorbeeld.nl");
    authMock.mockResolvedValue({
      user: { id: "u1", email: "Terug@Voorbeeld.NL" },
    } as never);

    const res = await POST(
      verzoek(
        { email: "terug@voorbeeld.nl", bron: "voettekst" },
        { "x-forwarded-for": "198.51.100.9" }
      )
    );
    expect(res.status).toBe(200);

    const rijen = await db.select().from(newsletterSignups);
    expect(rijen).toHaveLength(1);
    // Dit is het hele punt: hij staat weer aan in plaats van stil te blijven.
    expect(rijen[0].unsubscribedAt).toBeNull();
    // Nieuwe toestemming, dus een nieuw moment en het nieuwe IP.
    expect(rijen[0].consentedAt.getTime()).toBeGreaterThan(OUD.getTime());
    expect(rijen[0].consentIp).toBe("198.51.100.9");
    expect(rijen[0].source).toBe("voettekst");
    // De oude dubbele bevestiging verviel met de afmelding: er moet straks
    // opnieuw op een bevestigingslink geklikt worden vóór er post uitgaat.
    expect(rijen[0].confirmedAt).toBeNull();
    expect(rijen[0].userId).toBe("u1");
  });

  it("een uitgelogde aanvraag draait een afmelding NIET terug", async () => {
    await afgemeldAdres("rust@voorbeeld.nl", new Date("2026-06-01T12:00:00Z"));
    authMock.mockResolvedValue(null as never);

    const res = await POST(verzoek({ email: "rust@voorbeeld.nl" }));
    // Nog steeds hetzelfde antwoord — dit endpoint is geen orakel.
    expect(res.status).toBe(200);

    const rijen = await db.select().from(newsletterSignups);
    expect(rijen[0].unsubscribedAt?.getTime()).toBe(AFGEMELD_OP.getTime());
  });

  it("een ingelogde dérde kan andermans afmelding niet terugdraaien", async () => {
    await afgemeldAdres("slachtoffer@voorbeeld.nl", new Date("2026-06-01T12:00:00Z"));
    await maakGebruiker("u2", "iemand-anders@voorbeeld.nl");
    authMock.mockResolvedValue({
      user: { id: "u2", email: "iemand-anders@voorbeeld.nl" },
    } as never);

    await POST(verzoek({ email: "slachtoffer@voorbeeld.nl" }));

    const rijen = await db.select().from(newsletterSignups);
    // Het opt-outsignaal blijft staan; wissen zou het bewijs ervan uitgommen.
    expect(rijen[0].unsubscribedAt?.getTime()).toBe(AFGEMELD_OP.getTime());
    expect(rijen[0].userId).toBeNull();
  });

  it("vergeet het eerder gekoppelde account niet", async () => {
    await maakGebruiker("u1", "gekoppeld@voorbeeld.nl");
    authMock.mockResolvedValue({
      user: { id: "u1", email: "gekoppeld@voorbeeld.nl" },
    } as never);
    await POST(verzoek({ email: "gekoppeld@voorbeeld.nl" }));

    await db
      .update(newsletterSignups)
      .set({ unsubscribedAt: AFGEMELD_OP })
      .where(eq(newsletterSignups.email, "gekoppeld@voorbeeld.nl"));

    // Sessie zonder id (zou niet moeten kunnen, maar dan nog): de bestaande
    // koppeling mag daar niet door verdwijnen.
    authMock.mockResolvedValue({ user: { email: "gekoppeld@voorbeeld.nl" } } as never);
    await POST(verzoek({ email: "gekoppeld@voorbeeld.nl" }));

    const rijen = await db.select().from(newsletterSignups);
    expect(rijen[0].unsubscribedAt).toBeNull();
    expect(rijen[0].userId).toBe("u1");
  });
});

describe("ratelimiet", () => {
  it("na tien aanmeldingen vanaf hetzelfde IP volgt 429, en er komt niets meer bij", async () => {
    const ip = { "x-forwarded-for": "203.0.113.55" };
    for (let i = 0; i < 10; i++) {
      const res = await POST(verzoek({ email: `nr${i}@voorbeeld.nl` }, ip));
      expect(res.status).toBe(200);
    }

    const res = await POST(verzoek({ email: "elfde@voorbeeld.nl" }, ip));
    expect(res.status).toBe(429);
    expect(Number(res.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect((await res.json()).error).toBeTruthy();
    expect(await db.select().from(newsletterSignups)).toHaveLength(10);
  });

  it("telt per IP: een ander adres heeft zijn eigen emmer", async () => {
    for (let i = 0; i < 10; i++) {
      await POST(
        verzoek({ email: `nr${i}@voorbeeld.nl` }, { "x-forwarded-for": "203.0.113.55" })
      );
    }
    const ander = await POST(
      verzoek({ email: "buurman@voorbeeld.nl" }, { "x-forwarded-for": "203.0.113.56" })
    );
    expect(ander.status).toBe(200);
  });
});
