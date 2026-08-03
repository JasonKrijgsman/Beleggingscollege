import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

vi.mock("@/db", () => import("./helpers/pglite-db"));
vi.mock("@/auth", () => ({ auth: vi.fn() }));

import { POST } from "@/app/api/nieuwsbrief/route";
import { auth } from "@/auth";
import { newsletterSignups } from "@/db/schema";
import { db, leegAlleTabellen, maakGebruiker } from "./helpers/pglite-db";

/**
 * De nieuwsbrief-aanmelding is bewust saai en defensief. Twee eigenschappen
 * verdienen een wachter:
 *
 * 1. Bij een geldig adres komt ALTIJD hetzelfde antwoord terug, ook als het
 *    adres al bestond — anders is dit endpoint een orakel waarmee iemand
 *    adressen op lidmaatschap kan testen.
 * 2. Het toestemmingsmoment moet aantoonbaar zijn (AVG): tijdstip en IP
 *    worden vastgelegd.
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

    // onConflictDoNothing op de unieke e-mailkolom: geen tweede rij, en de
    // oorspronkelijke toestemmingsdatum blijft staan.
    expect(await db.select().from(newsletterSignups)).toHaveLength(1);
  });
});
