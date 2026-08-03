import type { Course } from "@/content/types";
import { PRICING } from "./pricing";

/**
 * Wat een cursus kost, in eurocenten — de enige vorm waarin er gerekend wordt.
 *
 * De prijs komt uit onze eigen catalogus, nooit uit de request: anders bepaalt
 * de klant zelf wat hij betaalt. Dit stond eerst als privéfunctie in de
 * checkout-route; het staat hier los zodat de omrekening direct testbaar is.
 *
 * Bekende beperking (CODEX-107): de prijs wordt uit de wéérgavetekst ("€49")
 * gepeuterd in plaats van andersom. Een prijs met duizendtalpunt zou stil
 * verkeerd omrekenen; de catalogustest bewaakt daarom dat elke prijs het
 * eenvoudige formaat houdt tot de echte omkering er is.
 */
export function prijsInCenten(
  course: Pick<Course, "free" | "comingSoon" | "price">
): number | null {
  if (course.free || course.comingSoon) return null;
  const tekst = course.price ?? PRICING.losseCursus; // bijv. "€49"
  return prijsTekstNaarCenten(tekst);
}

/** "€49" -> 4900, "€14,99" -> 1499. Niet-prijzen leveren null op. */
export function prijsTekstNaarCenten(tekst: string): number | null {
  const centen = Math.round(
    parseFloat(tekst.replace(/[^0-9,.]/g, "").replace(",", ".")) * 100
  );
  return Number.isFinite(centen) && centen > 0 ? centen : null;
}

/**
 * De prijs zoals schema.org hem adverteert, afgeleid uit exact dezelfde
 * berekening als de checkout (prijsInCenten). Zo kan de geadverteerde prijs
 * nooit afwijken van wat er wordt afgerekend — een afwijking is misleidende
 * reclame. Voorheen had de cursuspagina hier een eigen fallback ("€14,99")
 * terwijl de checkout terugviel op PRICING.losseCursus (€49).
 *
 * - Gratis cursus   -> "0"
 * - Koopbare cursus -> "49.00"-stijl: punt als decimaalteken, twee decimalen —
 *   hetzelfde formaat als centenNaarBedrag() in mollie.ts en geldig voor
 *   schema.org.
 * - comingSoon (of een kapotte prijstekst) -> null: er valt niets te
 *   adverteren, dus géén Offer. De cursuspagina zet voor comingSoon sowieso
 *   geen schema.org-markup; dit houdt dat gedrag in stand.
 */
export function schemaOrgPrijs(
  course: Pick<Course, "free" | "comingSoon" | "price">
): string | null {
  if (course.free) return "0";
  const centen = prijsInCenten(course);
  return centen === null ? null : (centen / 100).toFixed(2);
}
