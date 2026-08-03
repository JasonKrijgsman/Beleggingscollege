import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Uitgaande e-mail, via Migadu SMTP.
 *
 * VERZENDEN EN ONTVANGEN ZIJN TWEE VERSCHILLENDE DINGEN. Een postbus ontvangt
 * post. Transactionele mail versturen we zelf, en daar is geen postbus voor
 * nodig. We wachten hiervoor dus nergens op.
 *
 * WAAROM SMTP EN GEEN API: de keuze is Migadu (zie docs/e-mail-versturen.md) —
 * Jason betaalt er al voor en de post van dit domein gaat er toch heen. Migadu
 * heeft geen verzend-API, alleen SMTP. Dat is de hele reden dat hier
 * nodemailer staat in plaats van een `fetch` naar een HTTP-endpoint.
 *
 * WAAROM nodemailer OP 8.x VASTSTAAT: Auth.js (`next-auth`, `@auth/core`)
 * heeft een peer dependency op `nodemailer@^7 || ^8`. Ga je naar 9, dan
 * weigert npm de installatie en breekt de auth-adapter. Niet optrekken zonder
 * eerst te controleren wat Auth.js op dat moment accepteert.
 *
 * Antwoorden komen binnen op dezelfde postbus waarvandaan we versturen
 * (beheer@beleggingscollege.nl), omdat afzender en postbus hetzelfde adres
 * zijn. De klant ziet één adres en kan er ook echt op antwoorden.
 *
 * DE VALKUIL DIE JE MOET KENNEN: op beleggingscollege.nl staat een DMARC-regel
 * op `p=reject`, en het SPF-record hoort bij Migadu. Staan Migadu's DKIM- en
 * SPF-records niet in de DNS op het moment dat we gaan versturen, dan slaagt
 * geen van beide en wordt élke bevestigingsmail geweigerd door de ontvanger.
 * Niet in spam: geweigerd. Zet DMARC op `p=quarantine` tot verzenden bewezen
 * werkt. Zie docs/migadu-records.txt voor de records.
 */

/** Standaard Migadu; overschrijfbaar zodat een test of een andere provider kan. */
const HOST = process.env.MAIL_SMTP_HOST ?? "smtp.migadu.com";
const POORT = Number(process.env.MAIL_SMTP_PORT ?? 465);

/** Bij Migadu is de gebruikersnaam het volledige mailadres. */
const GEBRUIKER = process.env.MAIL_SMTP_GEBRUIKER;
const WACHTWOORD = process.env.MAIL_SMTP_WACHTWOORD;

/** Van welk adres we versturen. Moet een bestaande Migadu-postbus zijn. */
const AFZENDER =
  process.env.MAIL_AFZENDER ?? "Beleggingscollege <beheer@beleggingscollege.nl>";

export const mailIsGeconfigureerd = Boolean(GEBRUIKER && WACHTWOORD);

export type MailBericht = {
  aan: string;
  onderwerp: string;
  /** Platte tekst. Verplicht: sommige ontvangers tonen alleen dit, en een mail
   *  zonder tekstversie scoort slechter bij spamfilters. */
  tekst: string;
  html?: string;
  /** Waarheen een antwoord gaat, als dat een ander adres is dan de afzender. */
  antwoordAan?: string;
};

export type MailResultaat =
  | { verstuurd: true; id: string }
  | { verstuurd: false; reden: string };

/**
 * Eén transporter voor de hele module, lui aangemaakt.
 *
 * Lui, want bij het laden van de module weten we nog niet of er ooit gemaild
 * wordt — en zonder inloggegevens mag hier niets opgezet worden. Hergebruik
 * scheelt bovendien een TLS-handshake per mail zolang dezelfde instantie warm
 * blijft.
 */
let transporter: Transporter | null = null;

function haalTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: HOST,
      port: POORT,
      // 465 is impliciet TLS, 587 begint onversleuteld en doet STARTTLS.
      secure: POORT === 465,
      auth: { user: GEBRUIKER as string, pass: WACHTWOORD as string },
    });
  }
  return transporter;
}

/**
 * Vertaalt een willekeurige fout naar een korte, logbare reden.
 *
 * nodemailer hangt er twee bruikbare velden aan: `responseCode` (de
 * SMTP-status, bijv. 535 bij verkeerde inloggegevens) en `code` (bijv. EAUTH,
 * ECONNECTION, ETIMEDOUT). Allebei afwezig? Dan weten we het echt niet en is
 * "netwerkfout" de eerlijkste samenvatting.
 */
function redenVoor(fout: unknown): string {
  const f = fout as { responseCode?: unknown; code?: unknown };
  if (typeof f?.responseCode === "number") return `smtp ${f.responseCode}`;
  if (typeof f?.code === "string") return `smtp ${f.code.toLowerCase()}`;
  return "netwerkfout";
}

/**
 * Verstuurt een mail. Gooit nooit.
 *
 * Dat laatste is met opzet: deze functie wordt aangeroepen vanuit de
 * Mollie-webhook, ná het moment waarop de aankoop al op `paid` staat. Een
 * mislukte mail mag de webhook niet laten falen, want dan gaat Mollie
 * herhalen en loopt de klant het risico dat zijn betaling opnieuw verwerkt
 * wordt. Liever een klant zonder bevestigingsmail dan een klant met een
 * kapotte aankoop — en het mislukken wordt gelogd zodat het opvalt.
 *
 * Let op bij wijzigen: ook het opzetten van de transporter staat binnen de
 * try. Een kapotte configuratie is precies zo'n geval waarin er hier niets
 * mag ontsnappen.
 */
export async function verstuurMail(
  bericht: MailBericht
): Promise<MailResultaat> {
  if (!mailIsGeconfigureerd) {
    console.warn(
      `[mail] MAIL_SMTP_GEBRUIKER/MAIL_SMTP_WACHTWOORD ontbreken — mail ` +
        `"${bericht.onderwerp}" naar ${bericht.aan} is NIET verstuurd. ` +
        `Zie docs/e-mail-versturen.md.`
    );
    return { verstuurd: false, reden: "niet geconfigureerd" };
  }

  try {
    const info = await haalTransporter().sendMail({
      from: AFZENDER,
      to: bericht.aan,
      subject: bericht.onderwerp,
      text: bericht.tekst,
      ...(bericht.html ? { html: bericht.html } : {}),
      ...(bericht.antwoordAan ? { replyTo: bericht.antwoordAan } : {}),
    });

    return { verstuurd: true, id: info?.messageId ?? "onbekend" };
  } catch (fout) {
    console.error(
      `[mail] versturen mislukt voor "${bericht.onderwerp}" naar ${bericht.aan}`,
      fout
    );
    return { verstuurd: false, reden: redenVoor(fout) };
  }
}

/**
 * Ordernummer voor op de bevestiging: BC-2026-0001.
 *
 * De Belastingdienst wil een doorlopende reeks zonder gaten. Daarom tellen we
 * de bestaande aankopen per jaar in plaats van een willekeurig id te gebruiken.
 */
export function ordernummer(jaar: number, volgnummer: number): string {
  return `BC-${jaar}-${String(volgnummer).padStart(4, "0")}`;
}
