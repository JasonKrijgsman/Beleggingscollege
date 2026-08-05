"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { POLL_INTERVAL_MS, magNogVerversen } from "@/lib/gekocht-polling";

/**
 * Zolang een betaling nog `pending` is, ververst deze component de pagina zelf
 * elke paar seconden zodat de klant niet met een "we wachten nog"-scherm blijft
 * zitten dat als een mislukte betaling voelt (docs/openstaand.md §6).
 *
 * Het verversen gaat via `router.refresh()`: dat draait de bestaande
 * server-component opnieuw, mét de echte toegangspoort `heeftToegangTot()`. We
 * bouwen hier dus géén tweede statusroute en vellen geen eigen oordeel over
 * toegang — de server blijft de enige bron. Wordt de betaling rond, dan rendert
 * de server de pending-tak (en daarmee deze component) niet meer, en ruimt de
 * cleanup het interval op.
 *
 * Na `POLL_MAX_DUUR_MS` stoppen we automatisch en valt de klant terug op de
 * knop hieronder. Die knop is een echte link naar dezelfde pagina, zodat hij
 * ook zónder JavaScript werkt (dan een volledige herlaadbeurt).
 */
export default function GekochtStatusPoller({ slug }: { slug: string }) {
  const router = useRouter();
  const startRef = useRef<number | null>(null);
  const [gestopt, setGestopt] = useState(false);

  useEffect(() => {
    if (gestopt) return;
    // De start zetten we één keer; hij overleeft de router.refresh()-rondes,
    // zodat de 2-minutengrens over de echte verstreken tijd loopt en niet bij
    // elke verversing opnieuw begint.
    if (startRef.current === null) startRef.current = Date.now();

    const interval = setInterval(() => {
      const verstreken = Date.now() - (startRef.current ?? Date.now());
      if (magNogVerversen(verstreken)) {
        router.refresh();
      } else {
        setGestopt(true);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [gestopt, router]);

  function nuControleren() {
    // Handmatig controleren: opnieuw ophalen én de teller resetten, zodat het
    // automatisch meekijken weer een venster lang aangaat als het al gestopt
    // was.
    startRef.current = Date.now();
    setGestopt(false);
    router.refresh();
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <a
        href={`/cursussen/${slug}/gekocht`}
        onClick={(e) => {
          e.preventDefault();
          nuControleren();
        }}
        className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white hover:bg-brand-700"
      >
        <RefreshCw className="h-4 w-4" />
        Opnieuw controleren
      </a>
      <p
        className="flex items-center gap-2 text-xs text-body"
        aria-live="polite"
      >
        {gestopt ? (
          "We kijken niet meer automatisch mee. Klik hierboven om nog eens te controleren."
        ) : (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            We controleren dit vanzelf — je hoeft niets te doen.
          </>
        )}
      </p>
    </div>
  );
}
