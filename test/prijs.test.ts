import { describe, expect, it } from "vitest";
import { activeCourses } from "@/content";
import { bedragNaarCenten, centenNaarBedrag } from "@/lib/mollie";
import { prijsInCenten, prijsTekstNaarCenten } from "@/lib/prijs";
import { PRICING } from "@/lib/pricing";

/**
 * Catalogusprijs -> exact afgerekend bedrag. De prijs op de site is een
 * weergavetekst ("€49"); wat Mollie in rekening brengt komt uit
 * prijsTekstNaarCenten. Deze tests bewaken dat die twee nooit uit elkaar
 * lopen. Zie ook test/checkout.route.test.ts voor de route zelf.
 */

describe("prijsTekstNaarCenten", () => {
  it("rekent de huidige catalogusprijzen exact om", () => {
    expect(prijsTekstNaarCenten("€49")).toBe(4900);
    expect(prijsTekstNaarCenten("€14,99")).toBe(1499);
    expect(prijsTekstNaarCenten("€149")).toBe(14900);
    expect(prijsTekstNaarCenten("€12,42")).toBe(1242);
  });

  it("accepteert ook een punt als decimaalteken", () => {
    expect(prijsTekstNaarCenten("€14.99")).toBe(1499);
  });

  it("levert null voor alles wat geen positieve prijs is", () => {
    expect(prijsTekstNaarCenten("gratis")).toBeNull();
    expect(prijsTekstNaarCenten("")).toBeNull();
    expect(prijsTekstNaarCenten("€0")).toBeNull();
    expect(prijsTekstNaarCenten("€0,00")).toBeNull();
  });
});

describe("prijsInCenten", () => {
  it("geeft null voor een gratis cursus: die is niet te koop", () => {
    expect(prijsInCenten({ free: true, price: "€49" })).toBeNull();
  });

  it("geeft null voor een comingSoon-cursus", () => {
    expect(prijsInCenten({ comingSoon: true, price: "€49" })).toBeNull();
  });

  it("valt zonder eigen prijs terug op de losse-cursusprijs uit PRICING", () => {
    expect(prijsInCenten({})).toBe(prijsTekstNaarCenten(PRICING.losseCursus));
  });
});

describe("de catalogus zelf", () => {
  const koopbaar = activeCourses.filter((c) => !c.free && !c.comingSoon);

  it("bevat ten minste één koopbare cursus", () => {
    expect(koopbaar.length).toBeGreaterThan(0);
  });

  it.each(koopbaar.map((c) => [c.slug, c] as const))(
    "%s: prijs rekent exact om en overleeft de rondreis naar Mollie-formaat",
    (_slug, course) => {
      const centen = prijsInCenten(course);
      expect(centen).not.toBeNull();
      expect(Number.isInteger(centen)).toBe(true);
      expect(centen!).toBeGreaterThan(0);

      // Mollie eist een string met exact twee decimalen ("49.00").
      const bedrag = centenNaarBedrag(centen!);
      expect(bedrag).toMatch(/^\d+\.\d{2}$/);

      // En de controle in de webhook rekent dat weer terug: de rondreis
      // moet verliesvrij zijn, anders keurt de webhook echte betalingen af.
      expect(bedragNaarCenten(bedrag)).toBe(centen);
    }
  );

  it.each(koopbaar.map((c) => [c.slug, c] as const))(
    "%s: prijstekst houdt het eenvoudige formaat (bewaakt CODEX-107)",
    (_slug, course) => {
      // De regex-omrekening breekt stil op een duizendtalpunt: "€1.234,56"
      // zou € 1,23 worden. Tot de prijs een getal in centen is (CODEX-107)
      // bewaakt deze test dat elke catalogusprijs het eenvoudige formaat
      // "€<euro's>" of "€<euro's>,<centen>" houdt.
      const tekst = course.price ?? PRICING.losseCursus;
      expect(tekst).toMatch(/^€\d+(,\d{2})?$/);
    }
  );

  it("de weergaveprijzen in PRICING houden hetzelfde eenvoudige formaat", () => {
    expect(PRICING.losseCursus).toMatch(/^€\d+(,\d{2})?$/);
    expect(PRICING.abonnementMaand).toMatch(/^€\d+(,\d{2})?$/);
    expect(PRICING.abonnementJaar).toMatch(/^€\d+(,\d{2})?$/);
  });
});
