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
  /* Adres en btw-nummer komen bewust uit omgevingsvariabelen en staan dus
   * NIET in de repo. Jason wil zijn woonadres niet op internet; zolang er
   * geen zakelijk adres gekozen is (zie docs/openstaand.md) hoort het ook
   * nergens in git te belanden. Invullen = twee variabelen in Vercel zetten,
   * geen code wijzigen. */
  adres: process.env.BEDRIJF_ADRES ?? null,
  btwNummer: process.env.BEDRIJF_BTW_NUMMER ?? null,
};

/**
 * BTW-BEHANDELING.
 *
 * Jason heeft op 2 augustus 2026 bevestigd: GEEN kleineondernemersregeling.
 * De 21%-regel hieronder is dus de juiste. De KOR-tak blijft bestaan voor het
 * geval dat ooit verandert — wie in de KOR zit mag géén btw-bedrag vermelden,
 * en dan moet de mailtekst mee.
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

/**
 * De orderbevestiging.
 *
 * Deze mail is niet alleen een servicegebaar. Hij is de DERDE cumulatieve
 * voorwaarde waaronder het herroepingsrecht vervalt bij digitale inhoud
 * (art. 6:230p onderdeel g BW). Het vinkje bij het afrekenen alleen is niet
 * genoeg: gaat deze mail niet weg, dan houdt de klant zijn veertien dagen
 * bedenktijd én is hij bij ontbinding geen kosten verschuldigd (art. 6:230s BW).
 *
 * Daarom staat alle verplichte informatie HIER IN DE TEKST en niet achter een
 * link. Een hyperlink naar een webpagina is geen duurzame gegevensdrager —
 * HvJ EU 5 juli 2012, C-49/11 (Content Services). Links mogen aanvullend zijn,
 * nooit vervangend. Kort dit dus niet in omdat het lang oogt.
 *
 * Volledige onderbouwing met bronnen: docs/juridisch-orderbevestiging.md
 */
export function orderbevestigingMail(v: {
  voornaam: string;
  cursusnaam: string;
  cursusSlug: string;
  aantalLessen: number;
  bedragCenten: number;
  datum: Date;
  ordernummer: string;
}): Mailtekst {
  const { netto, btw } = btwUitBruto(v.bedragCenten);
  const aanhef = v.voornaam ? `Hoi ${v.voornaam},` : "Hoi,";
  const cursusUrl = `${SITE_URL}/cursussen/${v.cursusSlug}`;
  const accountUrl = `${SITE_URL}/account`;

  const btwRegel = KOR
    ? "Btw: geen btw in rekening gebracht op grond van de kleineondernemersregeling."
    : `Waarvan btw (21%): ${euro(btw)} — bedrag exclusief btw: ${euro(netto)}`;

  const adresRegel = BEDRIJF.adres ?? "[vestigingsadres nog niet ingevuld]";
  const btwNummerRegel = BEDRIJF.btwNummer ?? "[btw-nummer nog niet ingevuld]";

  const tekst = `${aanhef}

Je betaling is binnen en ${v.cursusnaam} staat voor je klaar. Hier begin je:

${cursusUrl}

Eén ding weet je liever vooraf dan achteraf: je XP, badges en afvinkjes worden
op dit moment in je browser bewaard, niet op de server. Ga je verder op een
ander apparaat, dan staat de cursus gewoon open — je aankoop hangt aan je
account — maar begint die telling daar opnieuw.

Loopt er iets vast, of heb je een vraag over een les? Antwoord gewoon op deze
mail. Die komt bij mij terecht, niet bij een helpdesk.

Veel plezier met de cursus,

Jason Krijgsman
${BEDRIJF.naam}

────────────────────────────────────────────

Hieronder het zakelijke deel. Niet spannend, maar het hoort erbij: dit is
tegelijk je bon en je wettelijke bevestiging. Bewaar deze mail.

JE BESTELLING

Ordernummer: ${v.ordernummer}
Datum: ${datumNl(v.datum)}
Product: ${v.cursusnaam} — online cursus van ${v.aantalLessen} lessen, met een
  printbaar certificaat na afronding
Soort overeenkomst: eenmalige aankoop. Geen abonnement, geen minimumduur, geen
  automatische verlenging, geen tweede afschrijving.
Uitvoering: direct na je betaling beschikbaar in je account (${accountUrl}).
  Geen levertermijn, er wordt niets verzonden.
Betaald via: betaaldienstverlener Mollie
Totaalbedrag: ${euro(v.bedragCenten)} inclusief btw
${btwRegel}
Bijkomende kosten: geen. Dit is het volledige bedrag.

Deze mail bevestigt ook dat ik je bestelling heb ontvangen.

Wat "levenslange toegang" hier betekent: je houdt toegang tot deze cursus zonder
ooit bij te betalen, zolang Beleggingscollege bestaat en de cursus aanbiedt.
Meer kan ik niet beloven — een website waarvan vaststaat dat hij er over dertig
jaar nog is, bestaat niet. Haal ik een cursus definitief weg, dan laat ik dat
minstens drie maanden van tevoren weten en kun je het materiaal in die periode
opslaan of afdrukken. Updates aan deze cursus krijg je er zonder bijbetaling bij.

JE TOESTEMMING OM DIRECT TE BEGINNEN

Twee dingen moet ik apart bevestigen. Dit zijn ze.

1. Je uitdrukkelijke verzoek om direct te beginnen.
Bij het afrekenen heb je aangevinkt dat je direct wilt beginnen met de cursus.
Daarmee heb je me uitdrukkelijk gevraagd de cursus meteen open te zetten: dus
binnen de bedenktijd van veertien dagen, voordat die was verstreken.

2. Je erkenning dat je daarmee je herroepingsrecht verliest.
In diezelfde verklaring heb je erkend dat je je recht om de koop binnen veertien
dagen te herroepen verliest zodra de levering begint. Dat moment was je betaling:
vanaf toen stond de cursus volledig voor je open.

Versie van de tekst die je hebt aangevinkt: ${HERROEPING_TEKST_VERSIE}. Ik bewaar
die verklaring met datum en tijd bij je bestelling, zodat later precies na te
gaan is wat er stond.

OVER HET HERROEPINGSRECHT

Bij een koop op afstand heb je normaal veertien dagen bedenktijd, gerekend vanaf
de dag waarop de overeenkomst is gesloten — hier ${datumNl(v.datum)}. Herroepen
doe je door dat binnen die termijn ondubbelzinnig te laten weten: een mail aan
${BEDRIJF.email} volstaat. Bij een geldige herroeping krijg je het volledige
bedrag binnen veertien dagen terug.

Door je toestemming hierboven is dat recht bij deze aankoop vervallen. Je kunt
de koop dus niet meer binnen veertien dagen ongedaan maken.

Daarnaast staat mijn eigen belofte, en die is ruimer dan de wet: heb je net
gekocht, ben je nauwelijks begonnen en past de cursus toch niet bij je? Mail me
binnen veertien dagen. Ik kijk daar redelijk naar en betaal in zulke gevallen
terug. Ik wil geen geld van iemand die er niets aan heeft.

WAT JE NODIG HEBT

De cursus werkt in elke moderne browser, op computer, tablet of telefoon. Verder
heb je alleen een internetverbinding nodig. Er is geen download en geen app.

Je toegang hangt aan het account waarmee je bent ingelogd (via Google) en is
persoonlijk: je kunt hem niet doorgeven of doorverkopen. De lessen zijn alleen
zichtbaar als je bent ingelogd en de aankoop bij jouw account hoort.

Je voortgang — XP, badges en afvinkjes — staat op dit moment in de opslag van je
browser. Wis je die, of ga je naar een ander apparaat of een andere browser, dan
begint die telling opnieuw. Je aankoop en je toegang staan wél op je account.

JE WETTELIJKE RECHTEN

De cursus moet zijn wat er is toegezegd: de lessen, de inhoud en de functies
zoals beschreven op de site en in deze mail. Klopt dat niet, dan heb je recht op
herstel — en lukt herstel niet of duurt het te lang, dan op een passende korting
of op ontbinding met terugbetaling. Dat recht is wettelijk, staat los van deze
mail en kan niet worden weggeschreven.

KLACHT OF PROBLEEM

Mail ${BEDRIJF.email}; je krijgt binnen twee werkdagen een inhoudelijke reactie.
Kom je er met mij niet uit, dan kun je gratis advies vragen bij ACM ConsuWijzer
(consuwijzer.nl). Koop je vanuit een ander EU-land, dan helpt het Europees
Consumenten Centrum je verder. Beleggingscollege is niet aangesloten bij een
geschillencommissie of keurmerk; er is dus geen buitengerechtelijke
geschillenprocedure waaraan ik mij heb onderworpen.

VERKOPER

${BEDRIJF.naam}, handelsnaam van de eenmanszaak van Jason Krijgsman
${adresRegel}
E-mail: ${BEDRIJF.email}
KvK-nummer: ${BEDRIJF.kvk}
Btw-identificatienummer: ${btwNummerRegel}

Op dit adres kun je ook een klacht indienen.

ALGEMENE VOORWAARDEN

De algemene voorwaarden staan op ${SITE_URL}/voorwaarden, het modelformulier
voor herroeping op ${SITE_URL}/herroepingsrecht. Wat ik met je gegevens doe lees
je op ${SITE_URL}/privacy.

TOT SLOT

Beleggingscollege geeft onderwijs, geen persoonlijk beleggingsadvies. Wat je in
de lessen leert is algemene uitleg, geen aanbeveling om iets te kopen of te
verkopen. Beleggen brengt risico's mee: je kunt een deel van je inleg verliezen,
of je hele inleg.
`;

  return {
    onderwerp: `Bevestiging van je aankoop: ${v.cursusnaam}`,
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
