import Script from "next/script";
import { analyticsConfig } from "@/lib/analytics";

/**
 * Laadt de Umami-teller, of niets.
 *
 * De afweging staat in src/lib/analytics.ts. Twee dingen die hier zichtbaar
 * horen te blijven omdat ze beloftes zijn en geen instellingen:
 *
 * - `data-do-not-track` respecteert de Do Not Track-instelling van de browser.
 *   Dat hoeft niet van de wet en de meeste sites doen het niet. Wij wel: wie
 *   expliciet zegt niet gevolgd te willen worden, wordt niet geteld.
 * - `data-domains` zorgt dat alleen het echte domein telt. Zonder die regel
 *   schrijft elke preview-deploy en elke lokale sessie mee in de cijfers,
 *   en dan meet je vooral jezelf.
 *
 * `afterInteractive` en niet `beforeInteractive`: de meting mag nooit vóór de
 * pagina zelf laden. Valt de Umami-instantie om, dan merkt een bezoeker daar
 * niets van.
 */
export default function Analytics() {
  const config = analyticsConfig();
  if (!config) return null;

  return (
    <Script
      src={config.scriptUrl}
      data-website-id={config.websiteId}
      data-domains={config.domains}
      data-do-not-track="true"
      strategy="afterInteractive"
    />
  );
}
