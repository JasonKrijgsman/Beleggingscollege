/**
 * Houdt de `terug`-parameter van /inloggen binnen de eigen site.
 *
 * Zonder deze controle is /inloggen?terug= een open redirect: een
 * phishing-mail kan naar onze (vertrouwde) inlogpagina linken en een al
 * ingelogde bezoeker rechtstreeks naar een vreemde site doorsturen. Zie
 * CODEX-102 in docs/openstaand.md.
 *
 * Toegestaan is uitsluitend een intern pad dat met precies een "/" begint.
 * Alles wat daarbuiten valt - absolute URL's, protocol-relatieve "//host",
 * backslash-varianten die browsers als "//" lezen, en stuurtekens - levert
 * de veilige standaard op.
 */
const STANDAARD_PAD = "/leerpad";

export function veiligTerugPad(terug: unknown): string {
  if (typeof terug !== "string") return STANDAARD_PAD;
  if (!terug.startsWith("/")) return STANDAARD_PAD;
  // "//host" is protocol-relatief; "\" leest een browser als "/".
  if (terug.includes("\\") || terug.startsWith("//")) return STANDAARD_PAD;
  // Stuurtekens en witruimte horen niet in een pad (header-injectie).
  for (let i = 0; i < terug.length; i++) {
    const code = terug.charCodeAt(i);
    if (code <= 0x20 || code === 0x7f) return STANDAARD_PAD;
  }
  return terug;
}
