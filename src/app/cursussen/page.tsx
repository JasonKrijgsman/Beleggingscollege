import type { Metadata } from "next";
import { courses } from "@/content";
import CourseCard from "@/components/CourseCard";
import { samenvatting } from "@/content/view";
import { PRICING } from "@/lib/pricing";
import { gekochteCursussen } from "@/lib/entitlements";

// De catalogus toont per bezoeker wat hij al bezit, dus per verzoek renderen.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cursussen",
  description:
    "Alle cursussen van Beleggingscollege: van gratis beginnerscursus tot waardebeleggen en technische analyse.",
  alternates: { canonical: "/cursussen" },
};

export default async function CursussenPage() {
  const inBezit = new Set(await gekochteCursussen());
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-extrabold text-ink">Cursussen</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-body">
        Elke cursus is opgebouwd uit korte lessen met een quiz, gebaseerd op de
        beste boeken over beleggen. Begin gratis met de basis en werk stap voor
        stap toe naar je certificaat.
      </p>
      <p className="mt-4 max-w-2xl rounded-xl bg-white p-4 text-sm leading-relaxed text-body shadow-card">
        <strong className="text-ink">Losse cursus of alles-in-één?</strong> Je
        koopt elke cursus los — de meeste voor {PRICING.losseCursus} — en houdt hem dan voor
        altijd. Volg je er meer dan één, dan ben je met College+ (
        {PRICING.abonnementMaand} per maand, maandelijks opzegbaar) sneller uit.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <CourseCard
            key={c.slug}
            course={samenvatting(c)}
            inBezit={inBezit.has(c.slug)}
          />
        ))}
      </div>
    </div>
  );
}
