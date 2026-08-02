"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCcw } from "lucide-react";

/**
 * Nederlandse foutpagina. Zonder dit bestand kreeg een bezoeker bij een
 * serverfout (database even weg, storing) een kale Engelse Next.js-pagina —
 * precies op het moment dat iemand het minst vertrouwen heeft.
 *
 * Toon: reassurance-first. Geen techniek, geen schuld bij de bezoeker, en
 * eerlijk dat het aan ons ligt.
 */
export default function ErrorPagina({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In de serverlogs staat de echte fout al; dit helpt bij lokaal debuggen.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <div className="mx-auto inline-flex rounded-2xl bg-mist p-4">
        <RefreshCcw className="h-8 w-8 text-body" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-3xl font-extrabold text-ink">
        Er ging iets mis aan onze kant
      </h1>
      <p className="mt-3 leading-relaxed text-body">
        Niet aan jou — echt niet. Er hikt iets bij ons. Meestal is het zo
        voorbij; probeer het gerust nog eens.
      </p>
      <p className="mt-2 text-sm text-body">
        Je voortgang en je aankopen zijn veilig. Blijft dit terugkomen, mail
        dan even naar beheer@beleggingscollege.nl
        {error.digest ? ` en noem daarbij code ${error.digest}` : ""}.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          Probeer opnieuw
        </button>
        <Link
          href="/"
          className="rounded-full border border-lijn px-6 py-3 text-sm font-bold text-ink hover:bg-mist"
        >
          Naar de voorpagina
        </Link>
      </div>
    </div>
  );
}
