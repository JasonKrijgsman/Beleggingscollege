import { describe, expect, it } from "vitest";
import {
  POLL_INTERVAL_MS,
  POLL_MAX_DUUR_MS,
  magNogVerversen,
} from "@/lib/gekocht-polling";

/**
 * De "gekocht"-pagina ververst zichzelf zolang de betaling pending is en stopt
 * daar na ~2 minuten mee (docs/openstaand.md §6). Deze test pint de grens vast:
 * een `<` die per ongeluk `<=` wordt, of een constante die verschuift, mag niet
 * stil doorglippen — anders blijft de pagina eindeloos de server wekken of
 * stopt ze te vroeg.
 */
describe("magNogVerversen", () => {
  it("blijft verversen zolang het venster niet om is", () => {
    expect(magNogVerversen(0)).toBe(true);
    expect(magNogVerversen(POLL_INTERVAL_MS)).toBe(true);
    expect(magNogVerversen(POLL_MAX_DUUR_MS - 1)).toBe(true);
  });

  it("stopt vanaf de tijdslimiet", () => {
    expect(magNogVerversen(POLL_MAX_DUUR_MS)).toBe(false);
    expect(magNogVerversen(POLL_MAX_DUUR_MS + POLL_INTERVAL_MS)).toBe(false);
  });

  it("verdeelt het venster in een handvol geruststellende controles", () => {
    // Niet elke seconde (te druk), niet één keer per minuut (voelt dood):
    // een paar seconden per controle, samen zo'n dertig binnen het venster.
    expect(POLL_INTERVAL_MS).toBeGreaterThanOrEqual(2000);
    expect(POLL_INTERVAL_MS).toBeLessThanOrEqual(5000);
    expect(POLL_MAX_DUUR_MS / POLL_INTERVAL_MS).toBeGreaterThanOrEqual(10);
  });
});
