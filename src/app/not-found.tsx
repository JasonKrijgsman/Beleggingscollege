import type { Metadata } from "next";
import Link from "next/link";

// Zonder eigen titel erft de 404 die van de homepage, en dan staat er in het
// tabblad dat je precies gevonden hebt wat je zocht.
export const metadata: Metadata = {
  title: "Pagina niet gevonden",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center sm:px-6">
      <div className="text-6xl font-extrabold text-brand-200">404</div>
      <h1 className="mt-3 text-2xl font-extrabold text-ink">
        Deze pagina is niet gevonden
      </h1>
      <p className="mt-2 text-body">
        Net als een goed aandeel op de verkeerde koers: hier is niets te halen.
      </p>
      <Link
        href="/"
        className="mt-7 inline-block rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white hover:bg-brand-700"
      >
        Naar de homepagina
      </Link>
    </div>
  );
}
