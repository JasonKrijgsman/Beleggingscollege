import "server-only";

/**
 * Uitgaande e-mail.
 *
 * VERZENDEN EN ONTVANGEN ZIJN TWEE VERSCHILLENDE DINGEN. Een postbus (bij
 * Strato) ontvangt post. Transactionele mail versturen we via een API, en
 * daar is geen postbus voor nodig. We wachten hiervoor dus nergens op.
 *
 * STATUS (3 aug 2026): dit bestand praat nog met Resend, maar de gekozen
 * verzender is Migadu (alleen SMTP) — die ombouw staat nog open, zie
 * docs/e-mail-versturen.md. Er gaat nu niets de deur uit zolang er geen key is.
 *
 * We versturen via Resend. Antwoorden komen gewoon binnen op de bestaande
 * postbus beheer@beleggingscollege.nl bij Strato, omdat we vanaf datzelfde
 * adres versturen. De klant ziet één adres en kan er ook echt op antwoorden.
 *
 * DE VALKUIL DIE JE MOET KENNEN: op beleggingscollege.nl staat een DMARC-regel
 * op `p=reject`, en er is géén SPF-record. Uitgaande post van Strato slaagt nu
 * omdat Strato met DKIM ondertekent. Zodra Resend namens dit domein gaat
 * versturen, moet Resend zijn eigen DKIM-records in de DNS krijgen — anders
 * wordt élke bevestigingsmail geweigerd door de ontvanger. Niet in spam:
 * geweigerd. Zie docs/e-mail-versturen.md voor de records.
 */

const key = process.env.RESEND_API_KEY;

/** Van welk adres we versturen. Moet in Resend geverifieerd zijn. */
const AFZENDER =
  process.env.MAIL_AFZENDER ?? "Beleggingscollege <beheer@beleggingscollege.nl>";

export const mailIsGeconfigureerd = Boolean(key);

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
 * Verstuurt een mail. Gooit nooit.
 *
 * Dat laatste is met opzet: deze functie wordt aangeroepen vanuit de
 * Mollie-webhook, ná het moment waarop de aankoop al op `paid` staat. Een
 * mislukte mail mag de webhook niet laten falen, want dan gaat Mollie
 * herhalen en loopt de klant het risico dat zijn betaling opnieuw verwerkt
 * wordt. Liever een klant zonder bevestigingsmail dan een klant met een
 * kapotte aankoop — en het mislukken wordt gelogd zodat het opvalt.
 */
export async function verstuurMail(
  bericht: MailBericht
): Promise<MailResultaat> {
  if (!key) {
    console.warn(
      `[mail] RESEND_API_KEY ontbreekt — mail "${bericht.onderwerp}" naar ` +
        `${bericht.aan} is NIET verstuurd. Zie docs/e-mail-versturen.md.`
    );
    return { verstuurd: false, reden: "niet geconfigureerd" };
  }

  try {
    const antwoord = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: AFZENDER,
        to: [bericht.aan],
        subject: bericht.onderwerp,
        text: bericht.tekst,
        ...(bericht.html ? { html: bericht.html } : {}),
        ...(bericht.antwoordAan ? { reply_to: bericht.antwoordAan } : {}),
      }),
    });

    if (!antwoord.ok) {
      const tekst = await antwoord.text().catch(() => "");
      console.error(
        `[mail] Resend gaf ${antwoord.status} voor "${bericht.onderwerp}" ` +
          `naar ${bericht.aan}: ${tekst.slice(0, 300)}`
      );
      return { verstuurd: false, reden: `resend ${antwoord.status}` };
    }

    const data = (await antwoord.json()) as { id?: string };
    return { verstuurd: true, id: data.id ?? "onbekend" };
  } catch (fout) {
    console.error("[mail] versturen mislukt", fout);
    return { verstuurd: false, reden: "netwerkfout" };
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
