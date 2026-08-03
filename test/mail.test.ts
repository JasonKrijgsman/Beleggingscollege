import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `verstuurMail()` GOOIT NOOIT — dat is de hele reden dat dit bestand een test
 * heeft.
 *
 * De functie draait in de Mollie-webhook, ná het moment waarop de aankoop al
 * op `paid` staat. Ontsnapt daar een exception, dan geeft de webhook een 500,
 * herhaalt Mollie tien keer over 26 uur, en loopt een klant met een geslaagde
 * betaling het risico dat zijn aankoop opnieuw verwerkt wordt. Liever een
 * klant zonder bevestigingsmail dan een klant met een kapotte aankoop.
 *
 * Deze tests pinnen dat contract vast vóór de ombouw van Resend (HTTP) naar
 * Migadu (SMTP) die nog openstaat — zie docs/e-mail-versturen.md. Die ombouw
 * vervangt precies het stuk dat hieronder wordt uitgeoefend, dus deze tests
 * zijn het vangnet eronder. Ze mogen daarbij aangepast worden op HOE er
 * verstuurd wordt, maar niet op DAT er nooit gegooid wordt.
 *
 * `mail.ts` leest zijn sleutel bij het laden van de module, dus elke test
 * laadt de module opnieuw met een eigen omgeving.
 */

const BERICHT = {
  aan: "klant@voorbeeld.nl",
  onderwerp: "Bevestiging van je aankoop: Waardebeleggen",
  tekst: "Je betaling is binnen.",
};

/** Laadt mail.ts vers, met of zonder API-sleutel. */
async function laadMail(sleutel?: string) {
  vi.resetModules();
  vi.stubEnv("RESEND_API_KEY", sleutel);
  vi.stubEnv("MAIL_AFZENDER", "Beleggingscollege <beheer@beleggingscollege.nl>");
  return import("@/lib/mail");
}

let waarschuwing: ReturnType<typeof vi.spyOn>;
let fout: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  // Het loggen hoort bij het contract (een stille mislukking is erger dan een
  // luide), dus we onderdrukken het niet alleen — we controleren het ook.
  waarschuwing = vi.spyOn(console, "warn").mockImplementation(() => {});
  fout = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("zonder API-sleutel", () => {
  it("verstuurt niets, gooit niet, en zegt luid waaróm", async () => {
    const { verstuurMail, mailIsGeconfigureerd } = await laadMail(undefined);
    const nep = vi.fn();
    vi.stubGlobal("fetch", nep);

    expect(mailIsGeconfigureerd).toBe(false);
    await expect(verstuurMail(BERICHT)).resolves.toEqual({
      verstuurd: false,
      reden: "niet geconfigureerd",
    });
    expect(nep).not.toHaveBeenCalled();
    expect(waarschuwing).toHaveBeenCalledOnce();
  });
});

describe("met API-sleutel — het gelukte geval", () => {
  it("stuurt het juiste verzoek naar Resend en geeft het id terug", async () => {
    const { verstuurMail, mailIsGeconfigureerd } = await laadMail("re_test123");
    const nep = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: "mail_abc" }),
    });
    vi.stubGlobal("fetch", nep);

    expect(mailIsGeconfigureerd).toBe(true);
    await expect(
      verstuurMail({ ...BERICHT, html: "<p>Hoi</p>", antwoordAan: "jason@voorbeeld.nl" })
    ).resolves.toEqual({ verstuurd: true, id: "mail_abc" });

    const [url, opties] = nep.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(opties.method).toBe("POST");
    expect(opties.headers.Authorization).toBe("Bearer re_test123");
    expect(JSON.parse(opties.body)).toEqual({
      from: "Beleggingscollege <beheer@beleggingscollege.nl>",
      to: ["klant@voorbeeld.nl"],
      subject: BERICHT.onderwerp,
      text: BERICHT.tekst,
      html: "<p>Hoi</p>",
      reply_to: "jason@voorbeeld.nl",
    });
  });

  it("laat html en reply_to weg als ze er niet zijn", async () => {
    const { verstuurMail } = await laadMail("re_test123");
    const nep = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: "mail_abc" }),
    });
    vi.stubGlobal("fetch", nep);

    await verstuurMail(BERICHT);
    const body = JSON.parse(nep.mock.calls[0][1].body);
    expect(body).not.toHaveProperty("html");
    expect(body).not.toHaveProperty("reply_to");
  });

  it("een antwoord zonder id levert nog steeds 'verstuurd'", async () => {
    const { verstuurMail } = await laadMail("re_test123");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) })
    );
    await expect(verstuurMail(BERICHT)).resolves.toEqual({
      verstuurd: true,
      id: "onbekend",
    });
  });
});

describe("alles wat er mis kan gaan — geen enkele exception ontsnapt", () => {
  it("Resend weigert (401): nette mislukking, gelogd", async () => {
    const { verstuurMail } = await laadMail("re_fout");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => "Unauthorized",
      })
    );
    await expect(verstuurMail(BERICHT)).resolves.toEqual({
      verstuurd: false,
      reden: "resend 401",
    });
    expect(fout).toHaveBeenCalledOnce();
  });

  it("Resend geeft 500 én de fouttekst is zelf onleesbaar", async () => {
    const { verstuurMail } = await laadMail("re_test123");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        // Zelfs het uitlezen van de foutmelding mislukt — de .catch() erop
        // is precies waarom dit geen exception wordt.
        text: async () => {
          throw new Error("stream kapot");
        },
      })
    );
    await expect(verstuurMail(BERICHT)).resolves.toEqual({
      verstuurd: false,
      reden: "resend 500",
    });
  });

  it("het netwerk valt weg (fetch rejecteert)", async () => {
    const { verstuurMail } = await laadMail("re_test123");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    await expect(verstuurMail(BERICHT)).resolves.toEqual({
      verstuurd: false,
      reden: "netwerkfout",
    });
    expect(fout).toHaveBeenCalledOnce();
  });

  it("fetch gooit meteen (synchroon), niet via een afgewezen belofte", async () => {
    const { verstuurMail } = await laadMail("re_test123");
    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        throw new Error("DNS stuk");
      })
    );
    await expect(verstuurMail(BERICHT)).resolves.toEqual({
      verstuurd: false,
      reden: "netwerkfout",
    });
  });

  it("Resend zegt ok maar stuurt onleesbare JSON", async () => {
    const { verstuurMail } = await laadMail("re_test123");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error("geen JSON");
        },
      })
    );
    await expect(verstuurMail(BERICHT)).resolves.toEqual({
      verstuurd: false,
      reden: "netwerkfout",
    });
  });
});

describe("ordernummer", () => {
  it("vult aan tot vier cijfers, per jaar", async () => {
    const { ordernummer } = await laadMail("re_test123");
    expect(ordernummer(2026, 1)).toBe("BC-2026-0001");
    expect(ordernummer(2026, 42)).toBe("BC-2026-0042");
    expect(ordernummer(2027, 1)).toBe("BC-2027-0001");
  });

  it("loopt netjes door boven de vier cijfers heen", async () => {
    const { ordernummer } = await laadMail("re_test123");
    expect(ordernummer(2026, 12345)).toBe("BC-2026-12345");
  });
});
