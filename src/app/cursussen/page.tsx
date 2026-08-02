import type { Metadata } from "next";
import { courses } from "@/content";
import CourseCard from "@/components/CourseCard";

export const metadata: Metadata = {
  title: "Cursussen",
  description:
    "Alle cursussen van Beleggingscollege: van gratis beginnerscursus tot waardebeleggen en technische analyse.",
  alternates: { canonical: "/cursussen" },
};

export default function CursussenPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-extrabold text-ink">Cursussen</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-body">
        Elke cursus is opgebouwd uit korte lessen met een quiz, gebaseerd op de
        beste boeken over beleggen. Begin gratis met de basis en werk stap voor
        stap toe naar je certificaat.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <CourseCard key={c.slug} course={c} />
        ))}
      </div>
    </div>
  );
}
