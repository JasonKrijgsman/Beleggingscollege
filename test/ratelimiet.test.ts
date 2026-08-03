import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  aantalGevolgdeSleutels,
  verbruikPoging,
  wisRatelimieten,
} from "@/lib/ratelimiet";

/**
 * De ratelimiet is met opzet klein: een vast venster in het geheugen van dit
 * proces. Dat maakt hem op serverless een drempel en geen garantie — en juist
 * daarom moet het gedrag dat hij wél belooft vastliggen: tellen tot de grens,
 * daarna weigeren, en na afloop van het venster weer schoon beginnen.
 *
 * De klok staat stil (nepklok), zodat het venster hier stuurbaar is in plaats
 * van afhankelijk van hoe snel de testrunner is.
 */

const VENSTER = 60_000;

beforeEach(() => {
  wisRatelimieten();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-08-03T12:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("verbruikPoging", () => {
  it("laat precies `max` pogingen door en weigert daarna", () => {
    for (let i = 0; i < 3; i++) {
      expect(verbruikPoging("a", 3, VENSTER).toegestaan).toBe(true);
    }
    expect(verbruikPoging("a", 3, VENSTER).toegestaan).toBe(false);
  });

  it("noemt hoeveel seconden er nog op het venster staan", () => {
    for (let i = 0; i < 3; i++) verbruikPoging("a", 3, VENSTER);
    vi.setSystemTime(new Date("2026-08-03T12:00:30Z"));

    const uitslag = verbruikPoging("a", 3, VENSTER);
    expect(uitslag.toegestaan).toBe(false);
    if (!uitslag.toegestaan) expect(uitslag.naSeconden).toBe(30);
  });

  it("blijft weigeren binnen het venster, ook bij doorrammen", () => {
    for (let i = 0; i < 3; i++) verbruikPoging("a", 3, VENSTER);
    for (let i = 0; i < 50; i++) {
      expect(verbruikPoging("a", 3, VENSTER).toegestaan).toBe(false);
    }
  });

  it("begint na het venster weer bij nul — ook na doorrammen", () => {
    for (let i = 0; i < 3; i++) verbruikPoging("a", 3, VENSTER);
    // Doorrammen mag het venster niet oprekken; anders komt wie eenmaal
    // geblokkeerd is er nooit meer uit.
    for (let i = 0; i < 20; i++) verbruikPoging("a", 3, VENSTER);

    vi.setSystemTime(new Date("2026-08-03T12:01:00Z"));
    expect(verbruikPoging("a", 3, VENSTER).toegestaan).toBe(true);
    expect(verbruikPoging("a", 3, VENSTER).toegestaan).toBe(true);
    expect(verbruikPoging("a", 3, VENSTER).toegestaan).toBe(true);
    expect(verbruikPoging("a", 3, VENSTER).toegestaan).toBe(false);
  });

  it("houdt sleutels gescheiden", () => {
    for (let i = 0; i < 3; i++) verbruikPoging("a", 3, VENSTER);
    expect(verbruikPoging("a", 3, VENSTER).toegestaan).toBe(false);
    expect(verbruikPoging("b", 3, VENSTER).toegestaan).toBe(true);
  });

  it("laat verlopen vensters niet eindeloos oplopen in het geheugen", () => {
    // Ruim boven de opruimdrempel (5000): een lijst die alleen groeit is een
    // lek dat je pas merkt als een instantie omvalt.
    for (let i = 0; i < 6000; i++) verbruikPoging(`ip-${i}`, 1, VENSTER);
    expect(aantalGevolgdeSleutels()).toBe(6000);

    vi.setSystemTime(new Date("2026-08-03T12:02:00Z"));
    verbruikPoging("nieuw", 1, VENSTER);

    // Alles van vóór het venster is weg; alleen de verse sleutel blijft.
    expect(aantalGevolgdeSleutels()).toBe(1);
    expect(verbruikPoging("ip-0", 1, VENSTER).toegestaan).toBe(true);
  });
});
