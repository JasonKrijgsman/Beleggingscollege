/**
 * Bezoekmeting — één bron voor of er gemeten wordt, en waarmee.
 *
 * WAAROM ZELF GEHOST. De site verkoopt zichzelf als de eerlijke tegenhanger
 * van partijen die je volgen. Google Analytics erin hangen zou die belofte
 * breken op de dag dat we hem het hardst nodig hebben. Umami draait daarom op
 * onze eigen Vercel-omgeving met onze eigen Neon-database in Frankfurt: de
 * cijfers zijn van ons, en er gaat geen bezoekgegeven naar een advertentiebedrijf.
 *
 * WAAROM GEEN TOESTEMMINGSBANNER. Umami zet geen cookies en schrijft niets
 * naar de opslag van de browser; unieke bezoekers worden per dag geteld via
 * een hash die niet naar een persoon te herleiden is en die de volgende dag
 * niet meer klopt. Daarmee valt het onder de uitzondering in artikel 11.7a
 * Telecommunicatiewet en is een banner niet verplicht. De privacyverklaring
 * legt dit uit; de juridische toetsing die voor alle drie de juridische
 * pagina's openstaat (docs/openstaand.md) hoort hier ook overheen te gaan.
 *
 * WAAROM EEN SUBDOMEIN EN GEEN PROXY. stats.beleggingscollege.com is van
 * onszelf, dus de bezoeker praat niet met een derde partij. Het verzoek via
 * onze eigen app doorsturen zou netjes lijken, maar dan ziet Umami het
 * IP-adres van Vercel in plaats van dat van de bezoeker en klopt de telling
 * van unieke bezoekers niet meer.
 *
 * UIT = ECHT UIT. Staat een van beide variabelen niet ingevuld, dan rendert
 * <Analytics /> niets: geen script, geen verzoek, geen meting. Zo is dit
 * bestand veilig te mergen voordat de Umami-instantie bestaat.
 */

import { SITE_URL } from "./site";

export type AnalyticsConfig = {
  scriptUrl: string;
  websiteId: string;
  /** Alleen tellen op dit domein, zodat previews de cijfers niet vervuilen. */
  domains: string;
};

/**
 * De configuratie, of `null` als er niet gemeten moet worden.
 * Geëxporteerd als functie en niet als constante, zodat een test de
 * omgevingsvariabelen kan zetten en het gedrag kan nalopen.
 */
export function analyticsConfig(): AnalyticsConfig | null {
  const u = process.env.NEXT_PUBLIC_UMAMI_URL?.trim();
  const id = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim();
  if (!u || !id) return null;

  // Een dubbele schuine streep in het scriptadres levert bij sommige
  // proxies een 404 op; die kant is goedkoper af te vangen dan te debuggen.
  const basis = u.replace(/\/+$/, "");

  return {
    scriptUrl: `${basis}/script.js`,
    websiteId: id,
    // SITE_URL is de bron voor het canonieke adres (zie src/lib/site.ts), dus
    // ook hier. Bij de verhuizing naar de .nl verschuift het meetdomein zo
    // vanzelf mee en hoeft hier niets aangepast te worden.
    domains: new URL(SITE_URL).host,
  };
}
