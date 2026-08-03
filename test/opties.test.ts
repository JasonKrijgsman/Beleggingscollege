import { describe, expect, it } from "vitest";
import {
  breakEvens,
  bsGreeks,
  bsPrijs,
  intrinsiekeWaarde,
  normCdf,
  payoffCombinatie,
  payoffOpExpiratie,
  type BsInvoer,
  type OptieBeen,
} from "@/lib/opties";

/**
 * De optierekenkunde voedt acht lestools in drie betaalde cursussen. Een
 * tekenfout of verkeerde eenheid leert betalende cursisten verkeerde getallen,
 * en tot nu toe was /lab/opties (handmatig kijken) de enige controle.
 *
 * De referentiewaarden hieronder komen uit een ONAFHANKELIJKE berekening:
 * de normale verdeling via numerieke integratie (Simpson) in plaats van de
 * Abramowitz & Stegun-benadering die de code zelf gebruikt. Zo bewijzen de
 * tests de formules, niet alleen dat de code zichzelf napraat.
 */

describe("normCdf", () => {
  it("kent de ankerpunten van de normale verdeling", () => {
    expect(normCdf(0)).toBeCloseTo(0.5, 7);
    expect(normCdf(1.96)).toBeCloseTo(0.975, 4);
    expect(normCdf(6)).toBeCloseTo(1, 6);
    expect(normCdf(-6)).toBeCloseTo(0, 6);
  });

  it("is symmetrisch: Φ(-x) = 1 - Φ(x)", () => {
    for (const x of [0.1, 0.5, 1, 1.5, 2.33]) {
      expect(normCdf(-x)).toBeCloseTo(1 - normCdf(x), 7);
    }
  });
});

describe("intrinsiekeWaarde", () => {
  it("call: koers min strike, nooit negatief", () => {
    expect(intrinsiekeWaarde("call", 110, 100)).toBe(10);
    expect(intrinsiekeWaarde("call", 90, 100)).toBe(0);
  });

  it("put: strike min koers, nooit negatief", () => {
    expect(intrinsiekeWaarde("put", 90, 100)).toBe(10);
    expect(intrinsiekeWaarde("put", 110, 100)).toBe(0);
  });

  it("at-the-money is nul", () => {
    expect(intrinsiekeWaarde("call", 100, 100)).toBe(0);
    expect(intrinsiekeWaarde("put", 100, 100)).toBe(0);
  });
});

describe("bsPrijs", () => {
  const atm: BsInvoer = { type: "call", spot: 100, strike: 100, dagen: 365, iv: 0.2 };

  it("ATM-call, 1 jaar, 20% IV: de klassieke 7,97", () => {
    expect(bsPrijs(atm)).toBeCloseTo(7.9656, 3);
  });

  it("call 100/95, 183 dagen, 25% IV, 2% rente: 10,22", () => {
    expect(
      bsPrijs({ type: "call", spot: 100, strike: 95, dagen: 183, iv: 0.25, rente: 0.02 })
    ).toBeCloseTo(10.2223, 3);
  });

  it("OTM-call 100/110, 30 dagen, 30% IV: 0,61", () => {
    expect(
      bsPrijs({ type: "call", spot: 100, strike: 110, dagen: 30, iv: 0.3 })
    ).toBeCloseTo(0.6087, 3);
  });

  it("put-callpariteit: call - put = spot - strike·e^(-rt)", () => {
    const invoer = { spot: 100, strike: 95, dagen: 183, iv: 0.25, rente: 0.02 };
    const call = bsPrijs({ ...invoer, type: "call" });
    const put = bsPrijs({ ...invoer, type: "put" });
    const t = invoer.dagen / 365;
    expect(call - put).toBeCloseTo(100 - 95 * Math.exp(-invoer.rente * t), 6);
  });

  it("zonder rente en spot = strike zijn call en put even duur", () => {
    expect(bsPrijs(atm)).toBeCloseTo(bsPrijs({ ...atm, type: "put" }), 6);
  });

  it("op of na expiratie (dagen ≤ 0) valt de premie terug op intrinsieke waarde", () => {
    expect(bsPrijs({ type: "call", spot: 110, strike: 100, dagen: 0, iv: 0.2 })).toBe(10);
    expect(bsPrijs({ type: "put", spot: 110, strike: 100, dagen: 0, iv: 0.2 })).toBe(0);
  });

  it("zonder volatiliteit (iv ≤ 0) idem", () => {
    expect(bsPrijs({ type: "call", spot: 110, strike: 100, dagen: 30, iv: 0 })).toBe(10);
  });

  it("meer looptijd of meer IV maakt een optie nooit goedkoper", () => {
    expect(bsPrijs({ ...atm, dagen: 730 })).toBeGreaterThan(bsPrijs(atm));
    expect(bsPrijs({ ...atm, iv: 0.4 })).toBeGreaterThan(bsPrijs(atm));
  });
});

describe("bsGreeks", () => {
  const atm: BsInvoer = { type: "call", spot: 100, strike: 100, dagen: 365, iv: 0.2 };

  it("ATM-call: delta 0,54, gamma 0,0198, vega 0,397, theta -0,0109", () => {
    const g = bsGreeks(atm);
    expect(g.delta).toBeCloseTo(0.5398, 3);
    expect(g.gamma).toBeCloseTo(0.019848, 5);
    // Per procentpunt IV en per kalenderdag — de eenheden uit de lessen.
    expect(g.vega).toBeCloseTo(0.396953, 5);
    expect(g.theta).toBeCloseTo(-0.010875, 5);
  });

  it("putdelta = calldelta - 1", () => {
    const call = bsGreeks(atm);
    const put = bsGreeks({ ...atm, type: "put" });
    expect(put.delta).toBeCloseTo(call.delta - 1, 7);
  });

  it("gamma en vega zijn voor call en put identiek", () => {
    const call = bsGreeks(atm);
    const put = bsGreeks({ ...atm, type: "put" });
    expect(put.gamma).toBeCloseTo(call.gamma, 7);
    expect(put.vega).toBeCloseTo(call.vega, 7);
  });

  it("theta is negatief voor de koper (zonder rente, call én put)", () => {
    expect(bsGreeks(atm).theta).toBeLessThan(0);
    expect(bsGreeks({ ...atm, type: "put" }).theta).toBeLessThan(0);
  });

  it("op expiratie: delta ±1 in-the-money, 0 out-of-the-money, rest 0", () => {
    expect(bsGreeks({ type: "call", spot: 110, strike: 100, dagen: 0, iv: 0.2 })).toEqual({
      delta: 1,
      gamma: 0,
      vega: 0,
      theta: 0,
    });
    expect(
      bsGreeks({ type: "put", spot: 90, strike: 100, dagen: 0, iv: 0.2 }).delta
    ).toBe(-1);
    expect(
      bsGreeks({ type: "call", spot: 90, strike: 100, dagen: 0, iv: 0.2 }).delta
    ).toBe(0);
  });
});

describe("payoffOpExpiratie", () => {
  it("gekochte call: uitbetaling minus premie", () => {
    const been: OptieBeen = { type: "call", richting: "koop", strike: 100, premie: 5 };
    expect(payoffOpExpiratie(been, 120)).toBe(15);
    expect(payoffOpExpiratie(been, 90)).toBe(-5); // maximaal verlies: de premie
  });

  it("geschreven put: het spiegelbeeld van de koper", () => {
    const been: OptieBeen = { type: "put", richting: "schrijf", strike: 100, premie: 4 };
    expect(payoffOpExpiratie(been, 90)).toBe(-6);
    expect(payoffOpExpiratie(been, 110)).toBe(4); // maximale winst: de premie
  });

  it("koper en schrijver van hetzelfde contract tellen op tot nul", () => {
    const koop: OptieBeen = { type: "call", richting: "koop", strike: 100, premie: 5 };
    const schrijf: OptieBeen = { ...koop, richting: "schrijf" };
    for (const eind of [80, 100, 105, 130]) {
      expect(payoffOpExpiratie(koop, eind) + payoffOpExpiratie(schrijf, eind)).toBe(0);
    }
  });

  it("aantal contracten vermenigvuldigt", () => {
    const been: OptieBeen = {
      type: "call",
      richting: "koop",
      strike: 100,
      premie: 5,
      aantal: 3,
    };
    expect(payoffOpExpiratie(been, 120)).toBe(45);
  });
});

describe("payoffCombinatie", () => {
  const straddle: OptieBeen[] = [
    { type: "call", richting: "koop", strike: 100, premie: 3 },
    { type: "put", richting: "koop", strike: 100, premie: 2 },
  ];

  it("long straddle: op de strike verlies je beide premies", () => {
    expect(payoffCombinatie(straddle, 100)).toBe(-5);
    expect(payoffCombinatie(straddle, 110)).toBe(5);
    expect(payoffCombinatie(straddle, 90)).toBe(5);
  });

  it("covered call: winst gemaximeerd op (strike - koopprijs) + premie", () => {
    const call: OptieBeen[] = [
      { type: "call", richting: "schrijf", strike: 55, premie: 2 },
    ];
    const aandelen = { aantal: 100, koopprijs: 50 };
    // Boven de strike is de winst afgetopt op (55 - 50) + 2 = 7 per aandeel.
    expect(payoffCombinatie(call, 60, aandelen)).toBe(7);
    expect(payoffCombinatie(call, 70, aandelen)).toBe(7);
    // Eronder verzacht de premie het koersverlies.
    expect(payoffCombinatie(call, 40, aandelen)).toBe(-8);
  });
});

describe("breakEvens", () => {
  it("gekochte call: strike plus premie", () => {
    const punten = breakEvens(
      [{ type: "call", richting: "koop", strike: 50, premie: 2 }],
      0,
      100
    );
    expect(punten).toHaveLength(1);
    expect(punten[0]).toBeCloseTo(52, 6);
  });

  it("long straddle: strike ± totale premie", () => {
    const punten = breakEvens(
      [
        { type: "call", richting: "koop", strike: 100, premie: 3 },
        { type: "put", richting: "koop", strike: 100, premie: 2 },
      ],
      50,
      150
    );
    expect(punten).toHaveLength(2);
    expect(punten[0]).toBeCloseTo(95, 6);
    expect(punten[1]).toBeCloseTo(105, 6);
  });

  it("zonder tekenwissel op het grid: geen punten", () => {
    // Een geschreven put ver boven het bereik van de grid is overal winst.
    const punten = breakEvens(
      [{ type: "put", richting: "schrijf", strike: 50, premie: 5 }],
      50,
      100
    );
    expect(punten).toEqual([]);
  });
});
