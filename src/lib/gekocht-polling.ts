// Pure planning voor het automatisch verversen van de "gekocht"-pagina zolang
// een betaling nog `pending` is. Bewust géén React en géén timers hier: zo is
// het stopgedrag (na ~2 minuten valt de klant terug op de handmatige knop) in
// een test vast te pinnen, los van de browser. De component in
// `src/components/GekochtStatusPoller.tsx` leunt hierop.

/** Hoe vaak we automatisch naslaan of de webhook de betaling al heeft rond
 *  gemaakt. Een paar seconden is genoeg om geruststellend te voelen zonder de
 *  server onnodig te wekken. */
export const POLL_INTERVAL_MS = 4000;

/** Na dit venster stopt het automatisch pollen. Een betaling die dan nog niet
 *  binnen is, is vrijwel zeker geen kwestie van seconden meer; we laten de
 *  klant dan bewust zelf beslissen om opnieuw te controleren in plaats van
 *  eindeloos door te blijven verversen. */
export const POLL_MAX_DUUR_MS = 120_000;

/** Mag er, gegeven hoeveel tijd er sinds de start van het pollen is verstreken,
 *  nóg een keer automatisch ververst worden? Vanaf de tijdslimiet niet meer. */
export function magNogVerversen(verstrekenMs: number): boolean {
  return verstrekenMs < POLL_MAX_DUUR_MS;
}
