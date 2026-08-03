import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { activeCourses, courses, flatLessons } from "@/content";
import { sortedPosts } from "@/content/blog";
import { SITE_URL } from "@/lib/site";

/**
 * SEO-huisregel nummer één: URL's zijn de SEO-waarde. Deze test maakt van die
 * regel een CI-poort: elke cursus, les en blogpost hoort in de sitemap, en
 * persoonlijke of interne pagina's horen er juist NIET in. Valt hier iets om,
 * dan is er een URL verdwenen (redirect toevoegen in next.config.ts!) of
 * lekt er een noindex-pagina naar Google.
 */

const urls = sitemap().map((r) => r.url);

describe("wat er in de sitemap MOET staan", () => {
  it("de kernpagina's", () => {
    for (const pad of ["", "/cursussen", "/blog", "/over-ons", "/veelgestelde-vragen", "/contact"]) {
      expect(urls).toContain(`${SITE_URL}${pad}`);
    }
  });

  it("elke cursusdetailpagina", () => {
    for (const c of courses) {
      expect(urls).toContain(`${SITE_URL}/cursussen/${c.slug}`);
    }
  });

  it("elke les van elke actieve cursus", () => {
    for (const c of activeCourses) {
      for (const { lesson } of flatLessons(c)) {
        expect(urls).toContain(`${SITE_URL}/cursussen/${c.slug}/les/${lesson.slug}`);
      }
    }
  });

  it("elke blogpost", () => {
    expect(sortedPosts().length).toBeGreaterThan(0);
    for (const p of sortedPosts()) {
      expect(urls).toContain(`${SITE_URL}/blog/${p.slug}`);
    }
  });
});

describe("wat er NIET in mag staan", () => {
  it("geen persoonlijke, interne of concept-pagina's", () => {
    for (const verboden of [
      "/certificaat",
      "/leerpad",
      "/beheer",
      "/lab",
      "/account",
      "/inloggen",
      "/privacy",
      "/voorwaarden",
      "/herroepingsrecht",
    ]) {
      expect(urls.filter((u) => u.includes(verboden))).toEqual([]);
    }
  });

  it("alles hangt onder SITE_URL en niets dubbel", () => {
    for (const u of urls) expect(u.startsWith(SITE_URL)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("robots.txt", () => {
  const r = robots();

  it("blokkeert het leerpad en de certificaten", () => {
    const disallow = r.rules instanceof Array ? r.rules[0].disallow : r.rules?.disallow;
    expect(disallow).toContain("/leerpad");
    expect(disallow).toContain("/cursussen/*/certificaat");
  });

  it("wijst naar de sitemap op het canonieke domein", () => {
    expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
