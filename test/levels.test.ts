import { describe, expect, it } from "vitest";
import { LEVELS, levelForXp } from "@/lib/levels";

describe("levelForXp", () => {
  it("begint op Toeschouwer met 0 XP", () => {
    const r = levelForXp(0);
    expect(r.level.name).toBe("Toeschouwer");
    expect(r.index).toBe(0);
    expect(r.progress).toBe(0);
    expect(r.next?.name).toBe("Spaarder");
  });

  it("wisselt exact op de ondergrens van het volgende level", () => {
    expect(levelForXp(99).level.name).toBe("Toeschouwer");
    expect(levelForXp(100).level.name).toBe("Spaarder");
  });

  it("bereikt het hoogste level en blijft daar", () => {
    const top = LEVELS[LEVELS.length - 1];
    const r = levelForXp(top.minXp);
    expect(r.level.name).toBe("Meesterbelegger");
    expect(r.next).toBeNull();
    expect(r.progress).toBe(1);
    // Ver voorbij de bovengrens verandert er niets meer.
    expect(levelForXp(1_000_000).level.name).toBe("Meesterbelegger");
  });

  it("berekent de voortgang naar het volgende level tussen 0 en 1", () => {
    // Halverwege Toeschouwer (0) en Spaarder (100).
    expect(levelForXp(50).progress).toBeCloseTo(0.5);
    const r = levelForXp(75);
    expect(r.progress).toBeGreaterThan(0);
    expect(r.progress).toBeLessThan(1);
  });

  it("de levels lopen strikt op in minXp (bewaakt de tabel zelf)", () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].minXp).toBeGreaterThan(LEVELS[i - 1].minXp);
    }
    expect(LEVELS[0].minXp).toBe(0);
  });
});
