import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isBeheerder } from "@/lib/beheer";
import { wachtendeVragen, AFM_STANDAARDANTWOORD } from "@/lib/lesvragen";
import { getCourse } from "@/content";
import ModeratieLijst from "@/components/ModeratieLijst";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vragen modereren",
  robots: { index: false, follow: false },
};

/**
 * Moderatie van lesvragen — alleen voor de beheerder (BEHEER_EMAILS).
 * Voor ieder ander gedraagt deze pagina zich als onbestaand (404), zodat er
 * niets te ontdekken valt.
 */
export default async function BeheerVragenPage() {
  if (!(await isBeheerder())) notFound();

  const wachtend = await wachtendeVragen();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold text-ink">Vragen modereren</h1>
      <p className="mt-2 text-sm leading-relaxed text-body">
        {wachtend.length === 0
          ? "De wachtrij is leeg. Zo hoort een maandagochtend te beginnen."
          : `${wachtend.length} ${wachtend.length === 1 ? "vraag wacht" : "vragen wachten"} op antwoord — oudste eerst. Beantwoorden maakt de vraag openbaar bij de les; afwijzen laat hem stil verdwijnen.`}
      </p>
      <ModeratieLijst
        vragen={wachtend.map((v) => {
          const course = getCourse(v.courseSlug);
          const lesTitel = course?.modules
            .flatMap((m) => m.lessons)
            .find((l) => l.slug === v.lessonSlug)?.title;
          return {
            id: v.id,
            naam: v.naam,
            vraag: v.vraag,
            gesteldOp: v.createdAt.toLocaleDateString("nl-NL", {
              day: "numeric",
              month: "long",
            }),
            lesTitel: lesTitel ?? v.lessonSlug,
            cursusTitel: course?.title ?? v.courseSlug,
            lesUrl: `/cursussen/${v.courseSlug}/les/${v.lessonSlug}`,
          };
        })}
        standaardAntwoord={AFM_STANDAARDANTWOORD}
      />
    </div>
  );
}
