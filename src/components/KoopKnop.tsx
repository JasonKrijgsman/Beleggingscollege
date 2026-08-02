"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldCheck } from "lucide-react";

export default function KoopKnop({
  slug,
  prijs,
  titel,
  ingelogd,
}: {
  slug: string;
  prijs: string;
  titel: string;
  ingelogd: boolean;
}) {
  const router = useRouter();
  const [akkoord, setAkkoord] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  if (!ingelogd) {
    return (
      <div className="rounded-2xl border border-lijn bg-white p-6 shadow-card">
        <h3 className="text-lg font-bold text-ink">
          {titel} kopen voor {prijs}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-body">
          Je hebt een account nodig, zodat je aankoop bewaard blijft en je op elk
          apparaat verder kunt.
        </p>
        <Link
          href={`/inloggen?terug=/cursussen/${slug}`}
          className="mt-4 inline-block rounded-full bg-navy-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-navy-700"
        >
          Inloggen en kopen
        </Link>
      </div>
    );
  }

  async function koop() {
    setBezig(true);
    setFout(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, herroepingAkkoord: akkoord }),
      });
      const data = await res.json();

      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      if (data.alGekocht) {
        router.refresh();
        return;
      }
      setFout(data.error ?? "Er ging iets mis. Probeer het later opnieuw.");
    } catch {
      setFout("We konden geen verbinding maken. Probeer het later opnieuw.");
    } finally {
      setBezig(false);
    }
  }

  return (
    <div className="rounded-2xl border border-lijn bg-white p-6 shadow-card">
      <h3 className="text-lg font-bold text-ink">
        {titel} kopen voor {prijs}
      </h3>
      <p className="mt-1 text-sm text-body">
        Eenmalig betalen, daarna levenslang toegang. Betaal met iDEAL, kaart,
        PayPal of Apple Pay.
      </p>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-mist p-4 text-sm leading-relaxed text-ink">
        <input
          type="checkbox"
          checked={akkoord}
          onChange={(e) => setAkkoord(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-navy-600"
        />
        <span>
          Ja, ik wil direct beginnen met de cursus. Ik weet dat ik daarmee
          afstand doe van mijn recht om de koop binnen 14 dagen te herroepen,
          zodra ik toegang heb.{" "}
          <Link
            href="/herroepingsrecht"
            target="_blank"
            className="underline hover:text-brand-700"
          >
            Wat betekent dit?
          </Link>
        </span>
      </label>

      {fout && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {fout}
        </p>
      )}

      <button
        type="button"
        onClick={koop}
        disabled={!akkoord || bezig}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors ${
          !akkoord || bezig
            ? "cursor-not-allowed bg-mist text-body"
            : "bg-navy-600 text-white hover:bg-navy-700"
        }`}
      >
        {bezig && <Loader2 className="h-4 w-4 animate-spin" />}
        {/* De tekst moet ondubbelzinnig duidelijk maken dat er een
            betalingsverplichting ontstaat (art. 6:230v lid 3 BW). "Bestellen"
            of "Doorgaan" volstaat daarvoor niet; "Betaal" met het bedrag erbij
            laat geen ruimte voor misverstand. */}
        {bezig ? "Bezig…" : `Betaal ${prijs}`}
      </button>

      <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-body">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-groen-600" />
        Betaling loopt via Mollie. Wij zien je bank- of kaartgegevens niet.
      </p>
    </div>
  );
}
