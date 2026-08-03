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
 * Deze tests pinden dat contract vast vóór de ombouw van Resend (HTTP) naar
 * Migadu (SMTP), en zijn bij die ombouw meeverhuisd naar nodemailer. HOE er
 * verstuurd wordt mag veranderen; DAT er nooit gegooid wordt niet.
 *
 * `mail.ts` leest zijn instellingen bij het laden van de module, dus elke test
 * laadt de module opnieuw met een eigen omgeving.
 */

const h = vi.hoisted(() => ({ createTransport: vi.fn() }));

vi.mock("nodemailer", () => ({
  // mail.ts importeert de default; `Transporter` is een type en verdwijnt bij
  // het compileren, dus die hoeft hier niet te bestaan.
  default: { createTransport: h.createTransport },
}));

const BERICHT = {
  aan: "klant@voorbeeld.nl",
  onderwerp: "Bevestiging van je aankoop: Waardebeleggen",
  tekst: "Je betaling is binnen.",
};

type Omgeving = { gebruiker?: string; wachtwoord?: string; poort?: string };

/** Laadt mail.ts vers, met of zonder inloggegevens. */
async function laadMail({ gebruiker, wachtwoord, poort }: Omgeving = {}) {
  vi.resetModules();
  vi.stubEnv("MAIL_SMTP_GEBRUIKER", gebruiker);
  vi.stubEnv("MAIL_SMTP_WACHTWOORD", wachtwoord);
  vi.stubEnv("MAIL_SMTP_PORT", poort);
  vi.stubEnv("MAIL_SMTP_HOST", undefined);
  vi.stubEnv("MAIL_AFZENDER", "Beleggingscollege <beheer@beleggingscollege.nl>");
  return import("@/lib/mail");
}

/** Inloggegevens die "wel geconfigureerd" betekenen. */
const INGELOGD = {
  gebruiker: "beheer@beleggingscollege.nl",
  wachtwoord: "geheim123",
};

/** Een transporter waarvan sendMail doet wat de test wil. */
function metSendMail(sendMail: ReturnType<typeof vi.fn>) {
  h.createTransport.mockReturnValue({ sendMail });
  return sendMail;
}

let waarschuwing: ReturnType<typeof vi.spyOn>;
let fout: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  h.createTransport.mockReset();
  // Het loggen hoort bij het contract (een stille mislukking is erger dan een
  // luide), dus we onderdrukken het niet alleen — we controleren het ook.
  waarschuwing = vi.spyOn(console, "warn").mockImplementation(() => {});
  fout = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("zonder inloggegevens", () => {
  it("verstuurt niets, gooit niet, en zegt luid waaróm", async () => {
    const { verstuurMail, mailIsGeconfigureerd } = await laadMail();
    const sendMail = metSendMail(vi.fn());

    expect(mailIsGeconfigureerd).toBe(false);
    await expect(verstuurMail(BERICHT)).resolves.toEqual({
      verstuurd: false,
      reden: "niet geconfigureerd",
    });
    expect(sendMail).not.toHaveBeenCalled();
    // Zonder gegevens mag er zelfs geen verbinding opgezet worden.
    expect(h.createTransport).not.toHaveBeenCalled();
    expect(waarschuwing).toHaveBeenCalledOnce();
  });

  it("een half ingevulde configuratie telt óók als niet geconfigureerd", async () => {
    const { mailIsGeconfigureerd } = await laadMail({
      gebruiker: "beheer@beleggingscollege.nl",
    });
    expect(mailIsGeconfigureerd).toBe(false);
  });
});

describe("met inloggegevens — het gelukte geval", () => {
  it("verbindt met Migadu en geeft het message-id terug", async () => {
    const { verstuurMail, mailIsGeconfigureerd } = await laadMail(INGELOGD);
    const sendMail = metSendMail(
      vi.fn().mockResolvedValue({ messageId: "<abc@migadu>" })
    );

    expect(mailIsGeconfigureerd).toBe(true);
    await expect(
      verstuurMail({ ...BERICHT, html: "<p>Hoi</p>", antwoordAan: "jason@voorbeeld.nl" })
    ).resolves.toEqual({ verstuurd: true, id: "<abc@migadu>" });

    expect(h.createTransport).toHaveBeenCalledWith({
      host: "smtp.migadu.com",
      port: 465,
      secure: true,
      auth: { user: INGELOGD.gebruiker, pass: INGELOGD.wachtwoord },
    });
    expect(sendMail).toHaveBeenCalledWith({
      from: "Beleggingscollege <beheer@beleggingscollege.nl>",
      to: "klant@voorbeeld.nl",
      subject: BERICHT.onderwerp,
      text: BERICHT.tekst,
      html: "<p>Hoi</p>",
      replyTo: "jason@voorbeeld.nl",
    });
  });

  it("laat html en replyTo weg als ze er niet zijn", async () => {
    const { verstuurMail } = await laadMail(INGELOGD);
    const sendMail = metSendMail(
      vi.fn().mockResolvedValue({ messageId: "<abc@migadu>" })
    );

    await verstuurMail(BERICHT);
    const opties = sendMail.mock.calls[0][0];
    expect(opties).not.toHaveProperty("html");
    expect(opties).not.toHaveProperty("replyTo");
  });

  it("een antwoord zonder messageId levert nog steeds 'verstuurd'", async () => {
    const { verstuurMail } = await laadMail(INGELOGD);
    metSendMail(vi.fn().mockResolvedValue({}));

    await expect(verstuurMail(BERICHT)).resolves.toEqual({
      verstuurd: true,
      id: "onbekend",
    });
  });

  it("zet de verbinding één keer op, ook bij meerdere mails", async () => {
    const { verstuurMail } = await laadMail(INGELOGD);
    metSendMail(vi.fn().mockResolvedValue({ messageId: "<a@migadu>" }));

    await verstuurMail(BERICHT);
    await verstuurMail(BERICHT);
    expect(h.createTransport).toHaveBeenCalledOnce();
  });

  it("poort 587 draait STARTTLS in plaats van impliciete TLS", async () => {
    const { verstuurMail } = await laadMail({ ...INGELOGD, poort: "587" });
    metSendMail(vi.fn().mockResolvedValue({ messageId: "<a@migadu>" }));

    await verstuurMail(BERICHT);
    expect(h.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({ port: 587, secure: false })
    );
  });
});

describe("alles wat er mis kan gaan — geen enkele exception ontsnapt", () => {
  it("Migadu weigert de inloggegevens (SMTP 535)", async () => {
    const { verstuurMail } = await laadMail(INGELOGD);
    metSendMail(
      vi.fn().mockRejectedValue(
        Object.assign(new Error("Invalid login"), {
          responseCode: 535,
          code: "EAUTH",
        })
      )
    );

    // responseCode wint van code: die is specifieker.
    await expect(verstuurMail(BERICHT)).resolves.toEqual({
      verstuurd: false,
      reden: "smtp 535",
    });
    expect(fout).toHaveBeenCalledOnce();
  });

  it("een fout zonder SMTP-status valt terug op de code", async () => {
    const { verstuurMail } = await laadMail(INGELOGD);
    metSendMail(
      vi.fn().mockRejectedValue(
        Object.assign(new Error("connection refused"), { code: "ECONNECTION" })
      )
    );

    await expect(verstuurMail(BERICHT)).resolves.toEqual({
      verstuurd: false,
      reden: "smtp econnection",
    });
  });

  it("het netwerk valt weg zonder enig herkenbaar veld", async () => {
    const { verstuurMail } = await laadMail(INGELOGD);
    metSendMail(vi.fn().mockRejectedValue(new Error("ECONNRESET")));

    await expect(verstuurMail(BERICHT)).resolves.toEqual({
      verstuurd: false,
      reden: "netwerkfout",
    });
    expect(fout).toHaveBeenCalledOnce();
  });

  it("sendMail gooit meteen (synchroon), niet via een afgewezen belofte", async () => {
    const { verstuurMail } = await laadMail(INGELOGD);
    metSendMail(
      vi.fn(() => {
        throw new Error("stuk");
      })
    );

    await expect(verstuurMail(BERICHT)).resolves.toEqual({
      verstuurd: false,
      reden: "netwerkfout",
    });
  });

  it("zelfs het opzetten van de verbinding mag gooien", async () => {
    const { verstuurMail } = await laadMail(INGELOGD);
    h.createTransport.mockImplementation(() => {
      throw new Error("configuratie deugt niet");
    });

    await expect(verstuurMail(BERICHT)).resolves.toEqual({
      verstuurd: false,
      reden: "netwerkfout",
    });
  });

  it("een fout die helemaal geen Error is (null) blijft netjes", async () => {
    const { verstuurMail } = await laadMail(INGELOGD);
    metSendMail(vi.fn().mockRejectedValue(null));

    await expect(verstuurMail(BERICHT)).resolves.toEqual({
      verstuurd: false,
      reden: "netwerkfout",
    });
  });
});

describe("ordernummer", () => {
  it("vult aan tot vier cijfers, per jaar", async () => {
    const { ordernummer } = await laadMail(INGELOGD);
    expect(ordernummer(2026, 1)).toBe("BC-2026-0001");
    expect(ordernummer(2026, 42)).toBe("BC-2026-0042");
    expect(ordernummer(2027, 1)).toBe("BC-2027-0001");
  });

  it("loopt netjes door boven de vier cijfers heen", async () => {
    const { ordernummer } = await laadMail(INGELOGD);
    expect(ordernummer(2026, 12345)).toBe("BC-2026-12345");
  });
});
