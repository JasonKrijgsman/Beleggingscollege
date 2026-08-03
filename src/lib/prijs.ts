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
