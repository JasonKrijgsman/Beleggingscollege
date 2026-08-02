import type { Metadata } from "next";
import LabClient from "./LabClient";

// Speeltuin voor de visuele stijl. Niet bedoeld voor bezoekers: uit de sitemap
// gehouden en op noindex, zodat Google er niet mee aan de haal gaat.
export const metadata: Metadata = {
  title: "Stijllab",
  description: "Interne speeltuin voor de isometrische stijl.",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <span className="inline-block rounded-full bg-paars-100 px-3 py-1 text-xs font-bold text-paars-700">
          Intern · niet zichtbaar voor bezoekers
        </span>
        <h1 className="mt-3 text-4xl font-extrabold text-ink">Stijllab</h1>
        <p className="mt-3 leading-relaxed text-body">
          Drie richtingen voor de isometrische stijl met parallax-diepte. Kies
          hieronder een variant, scroll en beweeg je muis. Zeg daarna welke
          richting het dichtst bij je idee zit — dan werken we díé uit.
        </p>
      </div>
      <LabClient />
    </>
  );
}
