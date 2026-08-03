import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { activeCourses, courses } from "@/content";
import { catalogus, detail, samenvatting } from "@/content/view";

/**
 * De server/client-grens van de cursusinhoud. Twee lekken zijn hier eerder
 * echt gebeurd (zie docs/openstaand.md hoofdstuk 3): lesinhoud via props en
 * de complete catalogus via een import in een client component. De
 * view-modellen in src/content/view.ts zijn de afgesproken veilige vorm;
 * deze tests bewaken dat daar nooit inhoud in terugsluipt.
 *
 * De sluitsteen is scripts/controleer-bundel.mjs, die ná de build de echte
 * browserbundel doorzoekt — want de HTML controleren was precies de fout
 * waardoor het importlek maandenlang onopgemerkt bleef.
 */

// Velden die lesinhoud of quizantwoorden dragen. Geen van deze sleutels mag
// ooit in een view-model voorkomen.
const VERBODEN_SLEUTELS = [
  "correctIndex",
  "options",
  "question",
  "explanation",
  "quiz",
  "sections",
  "paragraphs",
  "intro",
  "keyTakeaways",
  "bookRefs",
  "example",
];

function alleSleutels(waarde: unknown, verzameld = new Set<string>()) {
  if (Array.isArray(waarde)) {
    for (const v of waarde) alleSleutels(v, verzameld);
  } else if (waarde && typeof waarde === "object") {
    for (const [k, v] of Object.entries(waarde)) {
      verzameld.add(k);
      alleSleutels(v, verzameld);
    }
  }
  return verzameld;
}

describe("view-modellen bevatten geen lesinhoud", () => {
  it("catalogus() draagt geen verboden sleutels", () => {
    const sleutels = alleSleutels(catalogus());
    for (const verboden of VERBODEN_SLEUTELS) {
      expect(sleutels.has(verboden), `sleutel "${verboden}" lekt`).toBe(false);
    }
  });

  it.each(courses.map((c) => [c.slug, c] as const))(
    "detail(%s) en samenvatting dragen geen verboden sleutels",
    (_slug, course) => {
      const sleutels = alleSleutels([detail(course), samenvatting(course)]);
      for (const verboden of VERBODEN_SLEUTELS) {
        expect(sleutels.has(verboden), `sleutel "${verboden}" lekt`).toBe(
          false
        );
      }
    }
  );

  it("geen enkel juist quizantwoord komt letterlijk in de view-modellen voor", () => {
    const json = JSON.stringify([
      catalogus(),
      ...courses.map((c) => detail(c)),
    ]);
    for (const course of courses) {
      for (const mod of course.modules) {
        for (const les of mod.lessons) {
          for (const vraag of les.quiz) {
            const antwoord = vraag.options[vraag.correctIndex];
            // Korte antwoorden ("Ja", een percentage) kunnen toevallig in
            // publieke teksten staan; alleen kenmerkende zinnen zijn een
            // betrouwbaar leksignaal. De needle in JSON-vorm, zodat ook
            // antwoorden met aanhalingstekens goed vergeleken worden.
            if (antwoord.length < 12) continue;
            const needle = JSON.stringify(antwoord).slice(1, -1);
            expect(
              json.includes(needle),
              `antwoord "${antwoord}" (${course.slug}/${les.slug}) lekt`
            ).toBe(false);
          }
        }
      }
    }
  });
});

describe("catalogusregels", () => {
  it("activeCourses bevat geen comingSoon-cursussen", () => {
    expect(activeCourses.every((c) => !c.comingSoon)).toBe(true);
  });

  it("er is precies één gratis cursus en die is beleggen-voor-beginners", () => {
    const gratis = courses.filter((c) => c.free);
    expect(gratis.map((c) => c.slug)).toEqual(["beleggen-voor-beginners"]);
  });

  it("elke quizvraag heeft vier opties en een geldig antwoord", () => {
    for (const course of courses) {
      for (const mod of course.modules) {
        for (const les of mod.lessons) {
          for (const vraag of les.quiz) {
            expect(vraag.options).toHaveLength(4);
            expect(vraag.correctIndex).toBeGreaterThanOrEqual(0);
            expect(vraag.correctIndex).toBeLessThan(vraag.options.length);
          }
        }
      }
    }
  });
});

describe("de importgrens zelf", () => {
  it('src/content/index.ts begint met import "server-only" (struikeldraad)', () => {
    // Dit is de regel die de build laat falen zodra een client component
    // @/content importeert. Verdwijnt hij, dan is de bescherming weg terwijl
    // alles nog gewoon lijkt te werken — precies het stille-lek-scenario.
    const bron = readFileSync("src/content/index.ts", "utf8");
    expect(bron).toMatch(/import\s+"server-only"/);
  });

  it('src/lib/entitlements.ts is en blijft server-only', () => {
    const bron = readFileSync("src/lib/entitlements.ts", "utf8");
    expect(bron).toMatch(/import\s+"server-only"/);
  });
});
