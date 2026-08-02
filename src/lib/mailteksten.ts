import "server-only";
import { SITE_URL } from "./site";
import { HERROEPING_TEKST_VERSIE } from "./mollie";

/* ------------------------------------------------------------------
 * Bedrijfsgegevens — verplicht in elke handelsmail (art. 3:15d BW)
 * ---------------------------------------------------------------- */

export const BEDRIJF = {
  naam: "Beleggingscollege",
  kvk: "71856633",
  email: "beheer@beleggingscollege.nl",
  // TODO: vestigingsadres en btw-identificatienummer invullen. Allebei
  // verplicht op de bevestiging; zie docs/wat-de-winkel-mist.md punt 6.
  adres: null as string | null,
  btwNummer: null as string | null,
};

/**
 * BTW-BEHANDELING — CONTROLEER DIT VOORDAT ER ECHT VERKOCHT WORDT.
 *
 * Hier staat 21% ingesteld, het normale tarief voor een commerciële online
 * cursus. Maar er is een reëel alternatief dat de tekst van deze mail
 * verandert: de **kleineondernemersregeling (KOR)**. Wie daarvoor gekozen
 * heeft en onder € 20.000 omzet per jaar blijft, brengt géén btw in rekening
 * en mag ook geen btw-bedrag vermelden. In plaats daarvan hoort er te staan
 * dat er geen btw is berekend op grond van de KOR.
 *
 * Een eenmanszaak die net begint zit vaak in de KOR. Zet `KOR` op true als dat
 * zo is; dan verdwijnt de btw-regel uit de mail en komt de juiste zin ervoor
 * in de plaats.
 */
export const KOR = false;
export const BTW_TARIEF = 0.21;

/* ------------------------------------------------------------------
 * Hulpjes
 * ---------------------------------------------------------------- */

function euro(centen: number): string {
  return `€ ${(centen / 100).toFixed(2).replace(".", ",")}`;
}

function datumNl(d: Date): string {
  return d.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Btw uit een brutobedrag halen. Bij de KOR is dat nul. */
export function btwUitBruto(centen: number): { netto: number; btw: number } {
  if (KOR) return { netto: centen, btw: 0 };
  const netto = Math.round(centen / (1 + BTW_TARIEF));
  return { netto, btw: centen - netto };
}

export type Mailtekst = { onderwerp: string; tekst: string; html: string };

/* ------------------------------------------------------------------
 * De orderbevestiging
 * ---------------------------------------------------------------- */

export function orderbevestigingMail(v: {
  voornaam: string;
  cursusnaam: string;
  cursusSlug: string;
  bedragCenten: number;
  datum: Date;
  ordernummer: string;
}): Mailtekst {
  const { netto, btw } = btwUitBruto(v.bedragCenten);
  const aanhef = v.voornaam ? `Hoi ${v.voornaam},` : "Hoi,";
  const cursusUrl = `${SITE_URL}/cursussen/${v.cursusSlug}`;
  const accountUrl = `${SITE_URL}/account`;

  const btwRegel = KOR
    ? "Geen btw in rekening gebracht op grond van de kleineondernemersregeling."
    : `Waarvan btw (21%): ${euro(btw)} — bedrag exclusief btw: ${euro(netto)}`;

  const adresRegel = BEDRIJF.adres ? `\n${BEDRIJF.adres}` : "";
  const btwNummerRegel = BEDRIJF.btwNummer
    ? `\nBtw-nummer: ${BEDRIJF.btwNummer}`
    : "";

  const tekst = `${aanhef}

Je aankoop is rond. ${v.cursusnaam} staat vanaf nu voor je klaar, en blijft
van jou — er loopt geen abonnement en er wordt niets verlengd.

Beginnen doe je hier:
${cursusUrl}

Je vindt de cursus voortaan ook terug onder Mijn account:
${accountUrl}

Eén ding dat je van tevoren moet weten: je punten, badges en vinkjes worden op
dit moment in je browser bewaard, niet op onze servers. Ga je op een ander
apparaat verder, dan staat de cursus gewoon open, maar begint die telling
opnieuw. Aan het meeverhuizen daarvan wordt gewerkt.

Loopt er iets niet zoals het hoort, of heb je een vraag over een les? Antwoord
gewoon op deze mail. Die komt bij mij terecht, niet bij een helpdesk.

Veel plezier,
Jason Krijgsman
${BEDRIJF.naam}

────────────────────────────────────────────
JE BESTELLING

Ordernummer:    ${v.ordernummer}
Datum:          ${datumNl(v.datum)}
Product:        ${v.cursusnaam} — eenmalige aankoop, levenslange toegang
Totaalbedrag:   ${euro(v.bedragCenten)}
${btwRegel}

OVER JE HERROEPINGSRECHT
Bij een aankoop op afstand heb je normaal veertien dagen bedenktijd. Bij het
afrekenen heb je uitdrukkelijk gevraagd om direct te kunnen beginnen, en daarbij
erkend dat je daarmee je herroepingsrecht verliest zodra je toegang hebt. Omdat
je die toegang meteen hebt gekregen, is dat recht komen te vervallen. Deze mail
bevestigt die toestemming, zoals de wet voorschrijft.
(Versie van de tekst waarmee je akkoord ging: ${HERROEPING_TEKST_VERSIE})

Vind je desondanks dat er iets niet klopt — een technisch probleem, of iets
anders dan je verwachtte? Mail me dan. We komen er wel uit.

VERKOPER
${BEDRIJF.naam}${adresRegel}
KVK: ${BEDRIJF.kvk}${btwNummerRegel}
${BEDRIJF.email}

Algemene voorwaarden: ${SITE_URL}/voorwaarden
Herroepingsrecht:     ${SITE_URL}/herroepingsrecht
Privacyverklaring:    ${SITE_URL}/privacy

Beleggen brengt risico's met zich mee. Je kunt (een deel van) je inleg
verliezen. Beleggingscollege geeft onderwijs — geen persoonlijk beleggingsadvies.
`;

  return {
    onderwerp: `Je aankoop: ${v.cursusnaam}`,
    tekst,
    html: alsHtml(tekst),
  };
}

/**
 * Zet de platte tekst om naar eenvoudige HTML.
 *
 * Bewust minimaal: geen afbeeldingen, geen kolommen, geen webfonts. Een
 * transactionele mail die er in elk mailprogramma hetzelfde uitziet is meer
 * waard dan een mooie die in Outlook uit elkaar valt. De tekstversie blijft
 * altijd meegestuurd.
 */
function alsHtml(tekst: string): string {
  const veilig = tekst
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const metLinks = veilig.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" style="color:#0072CE">$1</a>'
  );

  return `<!doctype html><html lang="nl"><body style="margin:0;padding:24px;background:#f5f6f8">
<div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;border-radius:12px;
font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;
line-height:1.6;color:#53565A;white-space:pre-wrap">${metLinks}</div>
</body></html>`;
}
