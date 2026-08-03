import { describe, expect, it } from "vitest";
import {
  INLEG,
  berekenWaarde,
  maakReeks,
  paniekverkoperWaarde,
  type PaniekActie,
  type ReeksSpec,
} from "@/lib/paniek";

// Handgemaakte reeks met makkelijke verhoudingen, zodat elke verwachting
// hier met de hand na te rekenen is. De stand bij een actie doet er voor het
// rekenwerk niet toe (alleen maand en type tellen), maar we vullen hem in
// zoals de tool dat doet.
const reeks = [100, 120, 60, 90, 120];
const actie = (maand: number, type: PaniekActie["type"]): PaniekActie => ({
  maand,
  type,
  stand: reeks[maand],
});

describe("berekenWaarde", () => {
  it("is zonder acties in elke maand gelijk aan blijven zitten", () => {
    for (let m = 0; m < reeks.length; m++) {
      expect(berekenWaarde(reeks, [], m)).toBeCloseTo((INLEG * reeks[m]) / reeks[0], 8);
    }
  });

  it("staat na een verkoop stil in cash", () => {
    const acties = [actie(1, "verkoop")];
    // Verkocht op stand 120: de pot is dan 12.000 en blijft dat.
    expect(berekenWaarde(reeks, acties, 1)).toBeCloseTo(12_000, 8);
    expect(berekenWaarde(reeks, acties, 2)).toBeCloseTo(12_000, 8);
    expect(berekenWaarde(reeks, acties, 4)).toBeCloseTo(12_000, 8);
  });

  it("pakt na verkoop en later weer instappen het herstel vanaf de instapstand", () => {
    const acties = [actie(1, "verkoop"), actie(2, "instap")];
    expect(berekenWaarde(reeks, acties, 2)).toBeCloseTo(12_000, 8); // ingestapt op 60
    expect(berekenWaarde(reeks, acties, 3)).toBeCloseTo(18_000, 8); // 12.000 × 90/60
    expect(berekenWaarde(reeks, acties, 4)).toBeCloseTo(24_000, 8); // 12.000 × 120/60
  });

  it("telt verkopen én weer instappen in dezelfde maand allebei mee", () => {
    // Dit was de bug: alleen de éérste actie per maand werd toegepast, dus
    // wie in een gepauzeerde maand verkocht en meteen weer instapte, bleef
    // in de berekening voorgoed aan de zijlijn staan. Beide acties gebeuren
    // op dezelfde stand, dus het resultaat is exact blijven zitten.
    const acties = [actie(2, "verkoop"), actie(2, "instap")];
    for (let m = 0; m < reeks.length; m++) {
      expect(berekenWaarde(reeks, acties, m)).toBeCloseTo((INLEG * reeks[m]) / reeks[0], 8);
    }
  });

  it("laat bij drie acties in één maand de laatste bepalen of je in de markt zit", () => {
    const acties = [actie(2, "verkoop"), actie(2, "instap"), actie(2, "verkoop")];
    const opMaand2 = (INLEG * reeks[2]) / reeks[0]; // 6.000, daarna cash
    expect(berekenWaarde(reeks, acties, 3)).toBeCloseTo(opMaand2, 8);
    expect(berekenWaarde(reeks, acties, 4)).toBeCloseTo(opMaand2, 8);
  });

  it("past een actie in maand 0 toe vóór de eerste koersbeweging", () => {
    const acties = [actie(0, "verkoop"), actie(2, "instap")];
    expect(berekenWaarde(reeks, acties, 1)).toBe(INLEG);
    // Vanaf maand 2 weer in de markt: alleen de beweging 60 → 120 telt.
    expect(berekenWaarde(reeks, acties, 4)).toBeCloseTo((INLEG * reeks[4]) / reeks[2], 8);
  });

  it("verandert door een verkoop in de laatste maand niets meer aan de eindstand", () => {
    const laatste = reeks.length - 1;
    expect(berekenWaarde(reeks, [actie(laatste, "verkoop")], laatste)).toBeCloseTo(
      (INLEG * reeks[laatste]) / reeks[0],
      8
    );
  });

  it("is in maand 0 zonder acties precies de inleg", () => {
    expect(berekenWaarde(reeks, [], 0)).toBe(INLEG);
    expect(berekenWaarde(reeks, [], 0, 5_000)).toBe(5_000);
  });
});

describe("paniekverkoperWaarde", () => {
  it("blijft zonder diepe val gewoon zitten", () => {
    // Nooit 25% onder de start, dus identiek aan blijven zitten.
    expect(paniekverkoperWaarde([100, 90, 110])).toBeCloseTo(11_000, 8);
  });

  it("verkoopt op −25% en stapt pas na +30% vanaf de bodem weer in", () => {
    // m1: 80 → 8.000, blijft (−20%). m2: 70 → 7.000, stapt uit (−30%).
    // m3: 95 ≥ 70 × 1,3, dus weer instappen — maar die maand zelf mist hij.
    // m4: 7.000 × 120/95.
    expect(paniekverkoperWaarde([100, 80, 70, 95, 120])).toBeCloseTo((7_000 * 120) / 95, 6);
  });
});

describe("maakReeks", () => {
  const spec: ReeksSpec = {
    seed: 42,
    waypoints: [
      [0, 100],
      [4, 80],
      [10, 120],
    ],
  };

  it("is deterministisch en loopt van het eerste tot het laatste waypoint", () => {
    const a = maakReeks(spec);
    expect(maakReeks(spec)).toEqual(a);
    expect(a).toHaveLength(11);
    // Begin en einde krijgen geen ruis en liggen dus exact op het waypoint.
    expect(a[0]).toBe(100);
    expect(a[10]).toBe(120);
  });

  it("raakt elk waypoint op hooguit de ruis (±1,2) na", () => {
    const a = maakReeks(spec);
    for (const [m, stand] of spec.waypoints) {
      expect(Math.abs(a[m] - stand)).toBeLessThanOrEqual(1.2);
    }
  });
});
