// Genereert docs/plattegrond.md: de plattegrond van de site, rechtstreeks uit
// de code. Draai na elke nieuwe pagina of API-route:
//
//   npm run plattegrond
//
// Waarom dit bestaat: documentatie die met de hand wordt bijgehouden gaat
// liegen zodra niemand kijkt — dat is deze site al eens overkomen. Dit
// document kán niet verouderen, want het wordt uit src/app zelf afgeleid.
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const APP = "src/app";
const SPECIAAL = new Set([
  "layout.tsx", "error.tsx", "global-error.tsx", "not-found.tsx",
  "icon.svg", "apple-icon.tsx", "opengraph-image.tsx",
  "sitemap.ts", "robots.ts", "globals.css",
]);

function wandel(dir, verzameld = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) wandel(p, verzameld);
    else if (e === "page.tsx" || e === "route.ts") verzameld.push(p);
  }
  return verzameld;
}

function routeVanPad(bestand) {
  const rel = relative(APP, bestand).split(sep);
  rel.pop(); // page.tsx / route.ts
  const delen = rel
    .filter((d) => !(d.startsWith("(") && d.endsWith(")"))) // routegroepen
    .map((d) => d);
  return "/" + delen.join("/");
}

function analyseer(bestand) {
  const bron = readFileSync(bestand, "utf8");
  return {
    client: /^\s*["']use client["']/.test(bron),
    noindex: /noindex/.test(bron),
    forceDynamic: /dynamic\s*=\s*["']force-dynamic["']/.test(bron),
    staticParams: /generateStaticParams/.test(bron),
    dynamicParams: /dynamicParams\s*=\s*true/.test(bron),
    sessie: /\bauth\(\)/.test(bron),
    toegang: /heeftToegangTot|gekochteCursussen/.test(bron),
    metadata: /generateMetadata|export const metadata/.test(bron),
    regels: bron.split("\n").length,
  };
}

const bestanden = wandel(APP).sort();
const paginas = [];
const apis = [];

for (const b of bestanden) {
  const route = routeVanPad(b);
  const info = analyseer(b);
  if (b.endsWith("route.ts")) apis.push({ route, info });
  else paginas.push({ route, info });
}

function rendering(i) {
  if (i.forceDynamic) return "per verzoek";
  if (i.staticParams && i.dynamicParams) return "vrij gratis vooraf, rest per verzoek";
  if (i.staticParams) return "vooraf gebouwd";
  if (i.sessie || i.toegang) return "per verzoek (sessie)";
  if (i.client) return "client";
  return "statisch";
}

function opmerking(p) {
  const o = [];
  if (p.info.toegang) o.push("toegangscontrole");
  else if (p.info.sessie) o.push("leest sessie");
  if (p.info.noindex) o.push("noindex");
  if (!p.info.metadata && !p.info.client) o.push("⚠ geen eigen metadata");
  return o.join(", ") || "—";
}

const datum = new Date().toISOString().slice(0, 10);
let md = `# Plattegrond van de site

Gegenereerd op ${datum} uit \`src/app\` door \`scripts/plattegrond.mjs\`.
**Niet met de hand bewerken** — draai \`npm run plattegrond\` na elke nieuwe pagina
of API-route, dan kan dit document niet gaan liegen.

## Pagina's (${paginas.length})

| Route | Rendering | Bijzonderheden |
|---|---|---|
`;
for (const p of paginas) {
  md += `| \`${p.route}\` | ${rendering(p.info)} | ${opmerking(p)} |\n`;
}

md += `
Rendering-legenda: **vooraf gebouwd** = bij de build als HTML klaargezet (snel, maar
bevriest de inhoud — daarom mag een betaalde les dit nooit volledig zijn);
**per verzoek** = op de server gebouwd op het moment dat iemand hem opvraagt (nodig
zodra de pagina van de bezoeker afhangt); **client** = de pagina zelf is een
client-component (de gegevens komen dan via props of API).

## API-routes (${apis.length})

| Route | Wat er speelt |
|---|---|
`;
for (const a of apis) {
  const o = [];
  if (a.info.sessie) o.push("vereist sessie");
  else o.push("publiek");
  md += `| \`${a.route}\` | ${o.join(", ")} |\n`;
}

md += `
## Vaste onderdelen

| Bestand | Rol |
|---|---|
| \`sitemap.ts\` | genereert /sitemap.xml (ingediend bij Search Console) |
| \`robots.ts\` | genereert /robots.txt |
| \`icon.svg\` + \`apple-icon.tsx\` | favicon — zelfde beeldmerk als LogoMark; samen wijzigen |
| \`opengraph-image.tsx\` | de kaart bij gedeelde links |
| \`error.tsx\` + \`global-error.tsx\` | Nederlandse foutpagina's |
| \`not-found.tsx\` | 404 |

## Huisregels bij uitbreiden

- **Nooit een route wijzigen of weghalen zonder permanente redirect** in \`next.config.ts\`.
- Elke nieuwe pagina krijgt eigen \`generateMetadata\` (titel + beschrijving + canonical).
- Betaalde inhoud: rendering per verzoek, toegang uitsluitend via
  \`heeftToegangTot()\` — zie CLAUDE.md voor de valkuilen die al eens misgingen.
`;

writeFileSync("docs/plattegrond.md", md);
console.log(`geschreven: docs/plattegrond.md — ${paginas.length} pagina's, ${apis.length} API-routes`);
for (const p of paginas.filter((x) => !x.info.metadata && !x.info.client)) {
  console.log(`  ⚠ geen eigen metadata: ${p.route}`);
}
