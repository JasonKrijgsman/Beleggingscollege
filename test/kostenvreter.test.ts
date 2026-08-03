import { describe, expect, it } from "vitest";
import { verloop } from "@/lib/kostenvreter";

// Onafhankelijke controle via de meetkundige-reeksformule: bij maandgroei g
// en een inleg aan het einde van elke maand is de waarde na n maanden
// inleg × (gⁿ − 1) / (g − 1), en inleg × n als g = 1. Dat is een andere
// afleiding dan de maand-voor-maandlus in verloop() zelf.
function slotwaarde(maandinleg: number, maanden: number, nettoPctPerJaar: number): number {
  const g = Math.pow(1 + nettoPctPerJaar / 100, 1 / 12);
  return g === 1 ? maandinleg * maanden : (maandinleg * (Math.pow(g, maanden) - 1)) / (g - 1);
}

describe("verloop", () => {
  it("levert één punt per jaar, beginnend op 0", () => {
    const reeks = verloop(200, 30, 7, 0.2);
    expect(reeks).toHaveLength(31);
    expect(reeks[0]).toBe(0);
  });

  it("is zonder kosten gelijk aan de bruto groei (gesloten formule)", () => {
    const reeks = verloop(100, 10, 7, 0);
    for (let jaar = 1; jaar <= 10; jaar++) {
      expect(reeks[jaar]).toBeCloseTo(slotwaarde(100, jaar * 12, 7), 6);
    }
    // Eén met de hand nagerekend punt: 100 per maand, 7% bruto, na 1 jaar.
    expect(reeks[1]).toBeCloseTo(1238.04, 1);
  });

  it("telt alleen het nettorendement: bruto 7 − kosten 2 = bruto 6 − kosten 1", () => {
    expect(verloop(200, 30, 7, 2)).toEqual(verloop(200, 30, 6, 1));
  });

  it("laat bij kosten gelijk aan het rendement precies de inleg over", () => {
    const reeks = verloop(150, 10, 7, 7);
    for (let jaar = 0; jaar <= 10; jaar++) {
      expect(reeks[jaar]).toBe(150 * 12 * jaar);
    }
  });

  it("geeft bij 0 jaar alleen het startpunt", () => {
    expect(verloop(200, 0, 7, 1.5)).toEqual([0]);
  });

  it("houdt bij extreem hoge kosten minder over dan de inleg, maar meer dan nul", () => {
    const reeks = verloop(100, 20, 7, 30); // netto −23% per jaar
    const eind = reeks[reeks.length - 1];
    expect(eind).toBeGreaterThan(0);
    expect(eind).toBeLessThan(100 * 12 * 20);
  });

  it("geeft met hogere kosten vanaf jaar 1 in elk jaar een strikt lager bedrag", () => {
    const goedkoop = verloop(200, 30, 7, 0.2);
    const duur = verloop(200, 30, 7, 1.5);
    for (let jaar = 1; jaar <= 30; jaar++) {
      expect(duur[jaar]).toBeLessThan(goedkoop[jaar]);
    }
  });

  it("blijft ook over 40 jaar vlak bij de gesloten formule (afronding stapelt niet op)", () => {
    const reeks = verloop(1000, 40, 10, 0.5);
    const verwacht = slotwaarde(1000, 480, 9.5);
    expect(Math.abs(reeks[40] - verwacht) / verwacht).toBeLessThan(1e-9);
  });
});
