import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

/**
 * Wat iemand ziet die (nog) geen toegang heeft.
 *
 * LET OP — geef hier NOOIT het hele Course-object aan door. React stuurt props
 * van server components mee in de payload van de pagina, dus dan zou de
 * volledige cursus (alle lessen, secties en quizvragen) gewoon in de HTML
 * staan. Precies wat we willen voorkomen.
 *
 * Daarom alleen losse, onschuldige waarden: een slug, een titel en een prijs.
 */
export default function LesVergrendeld({
  courseSlug,
  courseTitel,
  lesTitel,
  prijs,
}: {
  courseSlug: string;
  courseTitel: string;
  lesTitel: string;
  prijs: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Link
        href={`/cursussen/${courseSlug}`}
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-body hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" /> {courseTitel}
      </Link>

      <div className="rounded-2xl border border-lijn bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mist">
          <Lock className="h-6 w-6 text-body" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-ink">{lesTitel}</h1>
        <p className="mt-2 text-sm font-semibold text-body">
          Onderdeel van {courseTitel}
        </p>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-body">
          Deze les hoort bij een betaalde cursus. Koop hem eenmalig voor {prijs}{" "}
          en houd hem voor altijd, of neem later College+ voor toegang tot alles.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href={`/cursussen/${courseSlug}`}
            className="rounded-full bg-navy-600 px-7 py-3 text-sm font-bold text-white hover:bg-navy-700"
          >
            Naar de cursus
          </Link>
          <Link
            href="/cursussen/beleggen-voor-beginners"
            className="rounded-full border border-lijn px-6 py-3 text-sm font-bold text-ink hover:bg-mist"
          >
            Eerst de gratis cursus
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-sm leading-relaxed text-body">
        Twijfel je of dit iets voor je is? De gratis cursus Beleggen voor
        Beginners is volledig — negen lessen, quizzen en een certificaat — en
        geeft een eerlijk beeld van hoe we lesgeven.
      </p>
    </div>
  );
}
