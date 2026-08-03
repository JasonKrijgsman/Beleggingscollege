import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";
import { courses } from "@/content";

/**
 * SEO-huisregel: nooit een URL wijzigen of verwijderen zonder permanente
 * redirect. `test/sitemap.test.ts` bewaakt dat de nieuwe URL's bestáán; dit
 * bestand bewaakt de andere kant — dat de redirects van de oude
 * WordPress-site nog ergens op uitkomen.
 *
 * Waarom dit een eigen wachter verdient: een redirect naar een verdwenen
 * pagina faalt volkomen stil. Google volgt de 301, krijgt een 404, en de
 * opgebouwde waarde van die oude URL verdampt zonder dat er ook maar iets
 * roods verschijnt. Zelfde soort valstrik als de hardgecodeerde lesslug in
 * `src/lib/badges.ts`: hernoem je de cursus `waardebeleggen`, dan blijft de
 * oude WordPress-URL netjes doorverwijzen — naar niets.
 */

type Redirect = { source: string; destination: string; permanent?: boolean };

async function alleRedirects(): Promise<Redirect[]> {
  const fn = nextConfig.redirects;
  expect(fn, "next.config.ts hoort redirects() te exporteren").toBeTypeOf(
    "function"
  );
  return (await fn!()) as Redirect[];
}

const cursusSlugs = new Set(courses.map((c) => c.slug));

/**
 * Bestaat er een pagina op dit pad?
 *
 * Twee gevallen dekken de hele huidige lijst: een echte map onder src/app met
 * een page.tsx, of /cursussen/<slug> waarbij de slug in de catalogus staat
 * (die route is dynamisch: src/app/cursussen/[slug]/page.tsx). Komt er ooit een
 * redirect naar een ánder dynamisch pad bij, dan hoort dit lijstje mee te
 * groeien — de test faalt dan luid in plaats van stil door te laten glippen.
 */
function paginaBestaat(pad: string): boolean {
  if (existsSync(`src/app${pad}/page.tsx`)) return true;
  const cursus = pad.match(/^\/cursussen\/([^/]+)$/);
  return cursus ? cursusSlugs.has(cursus[1]) : false;
}

describe("de redirects van de oude WordPress-site", () => {
  it("er staan er nog steeds een paar (anders is er iets weggevallen)", async () => {
    expect((await alleRedirects()).length).toBeGreaterThan(5);
  });

  it("elke bestemming komt uit op een pagina die echt bestaat", async () => {
    for (const { source, destination } of await alleRedirects()) {
      expect(
        paginaBestaat(destination),
        `redirect ${source} → ${destination} komt uit op een pagina die niet bestaat`
      ).toBe(true);
    }
  });

  it("zijn allemaal permanent (301) — anders erft de nieuwe URL de waarde niet", async () => {
    for (const r of await alleRedirects()) {
      expect(r.permanent, `${r.source} is geen permanente redirect`).toBe(true);
    }
  });

  it("verbergt geen bestaande pagina achter een redirect", async () => {
    // Een redirect wint van een echte route. Zou iemand ooit /blog of
    // /contact als source toevoegen, dan wordt die pagina onbereikbaar
    // zonder dat er een test omvalt — behalve deze.
    for (const { source } of await alleRedirects()) {
      if (source.includes(":")) continue; // patronen (/courses/:path*) niet
      expect(
        paginaBestaat(source),
        `${source} is zowel een echte pagina als een redirect-source`
      ).toBe(false);
    }
  });

  it("verwijst niet door naar iets dat zelf weer doorverwijst (geen ketens)", async () => {
    const redirects = await alleRedirects();
    const sources = new Set(
      redirects.filter((r) => !r.source.includes(":")).map((r) => r.source)
    );
    for (const { source, destination } of redirects) {
      expect(
        sources.has(destination),
        `${source} → ${destination} → ... : een keten kost SEO-waarde`
      ).toBe(false);
    }
  });
});
