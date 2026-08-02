import type { Metadata } from "next";
import LesTool from "@/components/lesson-tools";
import type { LessonTool } from "@/content/types";

// Interne QA-pagina voor de negen opties- en hefboomtools: alle tools op één
// pagina, zonder een cursus te hoeven kopen. Zelfde regime als /lab: uit de
// sitemap gehouden en op noindex.
export const metadata: Metadata = {
  title: "Stijllab · Optietools",
  description: "Interne testpagina voor de interactieve optie- en hefboomtools.",
  robots: { index: false, follow: false },
};

const TOOLS: { tool: LessonTool; les: string }[] = [
  { tool: "optie-uitbetaling", les: "Opties Begrijpen · De vier posities" },
  { tool: "optie-keten", les: "Opties Begrijpen · De optieketen lezen" },
  { tool: "optie-tijdswaarde", les: "Opties Begrijpen · Intrinsieke waarde en tijdswaarde" },
  { tool: "optie-gedekt-schrijven", les: "Beschermen & Verdienen · De covered call" },
  { tool: "optie-strategiebouwer", les: "Beschermen & Verdienen · De collar / Volatiliteit & Spreads · Verticale spreads" },
  { tool: "optie-tijdverval", les: "Volatiliteit & Spreads · Theta en gamma" },
  { tool: "optie-volatiliteit", les: "Volatiliteit & Spreads · Vega en implied volatility" },
  { tool: "optie-greeks", les: "Volatiliteit & Spreads · De Grieken samen" },
  { tool: "hefboom-simulator", les: "Hefboomproducten · De hefboom" },
];

export default function LabOptiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <span className="inline-block rounded-full bg-paars-100 px-3 py-1 text-xs font-bold text-paars-700">
        Intern · niet zichtbaar voor bezoekers
      </span>
      <h1 className="mt-3 text-4xl font-extrabold text-ink">Optietools</h1>
      <p className="mt-3 leading-relaxed text-body">
        Alle negen interactieve tools van het opties-curriculum op één pagina,
        om ze te testen zonder een cursus te kopen. In de cursussen staat elke
        tool in precies één les (de strategiebouwer in twee).
      </p>
      {TOOLS.map(({ tool, les }) => (
        <section key={tool} className="mt-10">
          <div className="text-xs font-bold uppercase tracking-wider text-body">
            {les} · <code className="font-mono normal-case">{tool}</code>
          </div>
          <LesTool tool={tool} />
        </section>
      ))}
    </div>
  );
}
