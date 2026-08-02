// Controleert ná `next build` of er cursusinhoud in de publieke JS-bundel
// lekt. Dit is de bundelcontrole uit CLAUDE.md ("Controleer een lek nooit
// alleen in de HTML") als vast onderdeel van de pijplijn, in plaats van een
// grep die iemand moet onthouden.
//
// Waarom chunks en niet HTML: het grote lek van augustus 2026 (21 lessen en
// 88 quizantwoorden in een publiek JS-bestand van 197 kB) was in de HTML
// onzichtbaar. Lesgegevens die een pagina bewust doorgeeft (de quiz van de
// les die je bekijkt) staan in de RSC-payload van díe pagina — nooit in de
// statische chunks. Elke treffer hieronder is dus een echt lek.
//
// Gebruik: node scripts/controleer-bundel.mjs   (vereist een verse build)

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const CHUNKS_MAP = join(".next", "static", "chunks");
const CURSUS_MAP = join("src", "content", "courses");

if (!existsSync(CHUNKS_MAP)) {
  console.error(
    `Geen ${CHUNKS_MAP} gevonden. Draai eerst \`npm run build\`; deze controle ` +
      "leest de echte browserbundel en kan niet zonder."
  );
  process.exit(2);
}

/** Alle .js-bestanden onder een map, recursief (chunks heeft submappen). */
function jsBestanden(map) {
  const uit = [];
  for (const naam of readdirSync(map)) {
    const pad = join(map, naam);
    if (statSync(pad).isDirectory()) uit.push(...jsBestanden(pad));
    else if (naam.endsWith(".js")) uit.push(pad);
  }
  return uit;
}

// Waar we op zoeken: de dátavorm van het juiste antwoord ("correctIndex:",
// zoals hij in een gebundeld object-literal staat), plus elke quizvraag uit
// de cursusbestanden zelf. Vragen zijn lange, kenmerkende zinnen: staat er
// één in een chunk, dan is de cursusinhoud meegebundeld.
//
// Bewust mét dubbele punt: QuizBlock en QuizReview lezen q.correctIndex
// client-side om de quiz van de geopende les na te kijken, dus het kale woord
// staat als property-toegang legitiem in de chunks. De data zelf niet.
// (Strings met een backslash-escape slaan we over; die matchen na minificatie
// niet betrouwbaar. De veldnaam en de overige vragen vangen dat ruimschoots.)
const naalden = new Map([
  ["correctIndex:", "quizdata (het juiste antwoord) in een object-literal"],
]);

for (const bestand of readdirSync(CURSUS_MAP)) {
  if (!bestand.endsWith(".ts")) continue;
  const bron = readFileSync(join(CURSUS_MAP, bestand), "utf8");
  for (const match of bron.matchAll(/question:\s*"([^"]{20,})"/g)) {
    if (match[1].includes("\\")) continue;
    naalden.set(match[1], `quizvraag uit ${bestand}`);
  }
}

const bestanden = jsBestanden(CHUNKS_MAP);
const lekken = [];

for (const bestand of bestanden) {
  const inhoud = readFileSync(bestand, "utf8");
  for (const [naald, uitleg] of naalden) {
    if (inhoud.includes(naald)) {
      lekken.push({ bestand, naald, uitleg });
    }
  }
}

const aantalVragen = naalden.size - 1;
if (lekken.length > 0) {
  console.error("LEK: cursusinhoud gevonden in de publieke JS-bundel.\n");
  for (const lek of lekken.slice(0, 20)) {
    const kort =
      lek.naald.length > 60 ? `${lek.naald.slice(0, 57)}...` : lek.naald;
    console.error(`  ${lek.bestand}\n    bevat "${kort}" (${lek.uitleg})\n`);
  }
  if (lekken.length > 20) {
    console.error(`  ... en nog ${lekken.length - 20} treffers.\n`);
  }
  console.error(
    "Waarschijnlijke oorzaak: een client component importeert @/content, of " +
      "een pagina geeft een volledig Course-object door als prop. Zie " +
      "src/content/view.ts en docs/openstaand.md hoofdstuk 3."
  );
  process.exit(1);
}

console.log(
  `Bundel schoon: ${bestanden.length} chunks doorzocht op "correctIndex:" en ` +
    `${aantalVragen} quizvragen; niets gevonden.`
);
