import { describe, expect, it } from "vitest";
import {
  VRAGEN,
  berekenUitslag,
  maxScores,
  parseUitslag,
  type BiasKey,
  type BiasVraag,
} from "@/lib/biastest";

const ALLE_BIASSEN: BiasKey[] = [
  "verliesaversie",
  "overmoed",
  "kuddegedrag",
  "ankereffect",
  "bevestiging",
  "recency",
];

describe("de vragenlijst zelf", () => {
  it("heeft vijftien situaties met elk minstens twee opties", () => {
    expect(VRAGEN).toHaveLength(15);
    for (const vraag of VRAGEN) {
      expect(vraag.opties.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("kan op elke neiging scoren (max > 0), anders valt er niets te normaliseren", () => {
    const max = maxScores(VRAGEN);
    for (const bias of ALLE_BIASSEN) {
      expect(max[bias]).toBeGreaterThan(0);
    }
  });

  it("heeft in elke situatie minstens één scoreloze (nuchtere) optie", () => {
    for (const vraag of VRAGEN) {
      expect(
        vraag.opties.some((optie) => Object.keys(optie.scores).length === 0)
      ).toBe(true);
    }
  });
});

describe("berekenUitslag op de echte vragenlijst", () => {
  it("geeft overal 0% aan wie overal de nuchtere optie kiest", () => {
    const antwoorden = VRAGEN.map((vraag) =>
      vraag.opties.findIndex((optie) => Object.keys(optie.scores).length === 0)
    );
    const { percentages } = berekenUitslag(antwoorden);
    for (const bias of ALLE_BIASSEN) {
      expect(percentages[bias]).toBe(0);
    }
  });

  it("geeft 100% voor een neiging aan wie er per situatie maximaal op scoort", () => {
    for (const bias of ALLE_BIASSEN) {
      const antwoorden = VRAGEN.map((vraag) => {
        let beste = 0;
        vraag.opties.forEach((optie, i) => {
          if ((optie.scores[bias] ?? 0) > (vraag.opties[beste].scores[bias] ?? 0)) beste = i;
        });
        return beste;
      });
      expect(berekenUitslag(antwoorden).percentages[bias]).toBe(100);
    }
  });
});

describe("berekenUitslag met een eigen, met de hand nagerekende fixture", () => {
  // Hoogst haalbaar: overmoed 2 + 1 = 3, recency 1 + 2 = 3.
  const fixture: BiasVraag[] = [
    {
      situatie: "eerste",
      opties: [
        { tekst: "neutraal", scores: {} },
        { tekst: "beide", scores: { overmoed: 2, recency: 1 } },
      ],
    },
    {
      situatie: "tweede",
      opties: [
        { tekst: "licht", scores: { overmoed: 1 } },
        { tekst: "zwaar", scores: { recency: 2 } },
      ],
    },
  ];

  it("normaliseert tegen het hoogst haalbare per neiging", () => {
    // Keuzes: optie 1 en optie 0 → overmoed 3 van 3, recency 1 van 3.
    const { percentages, volgorde } = berekenUitslag([1, 0], fixture);
    expect(percentages.overmoed).toBe(100);
    expect(percentages.recency).toBe(33); // afgerond van 33,33…
    expect(percentages.verliesaversie).toBe(0);
    expect(volgorde[0]).toBe("overmoed");
    expect(volgorde[1]).toBe("recency");
  });

  it("maakt van een neiging die in geen enkele vraag voorkomt 0%, geen NaN", () => {
    // De fixture kent alleen overmoed en recency; de rest heeft max 0 en
    // zou zonder deling-door-nul-bescherming NaN opleveren.
    const { percentages } = berekenUitslag([1, 1], fixture);
    for (const bias of ALLE_BIASSEN) {
      if (bias === "overmoed" || bias === "recency") continue;
      expect(percentages[bias]).toBe(0);
    }
  });

  it("sorteert de volgorde van sterkste naar zwakste neiging", () => {
    const { percentages, volgorde } = berekenUitslag([1, 1], fixture);
    expect(volgorde).toHaveLength(ALLE_BIASSEN.length);
    for (let i = 1; i < volgorde.length; i++) {
      expect(percentages[volgorde[i - 1]]).toBeGreaterThanOrEqual(percentages[volgorde[i]]);
    }
  });
});

describe("parseUitslag (kapotte of oude localStorage-inhoud)", () => {
  it("leest een geldige uitslag terug", () => {
    const geldig = {
      datum: "2026-05-01",
      percentages: {
        verliesaversie: 40, overmoed: 10, kuddegedrag: 0,
        ankereffect: 25, bevestiging: 0, recency: 60,
      },
    };
    expect(parseUitslag(JSON.stringify(geldig))).toEqual(geldig);
  });

  it("accepteert een oudere uitslag waarin een neiging ontbreekt", () => {
    // De weergave slaat de vergelijking voor ontbrekende neigingen over.
    const oud = { datum: "2026-01-15", percentages: { verliesaversie: 40 } };
    expect(parseUitslag(JSON.stringify(oud))).toEqual(oud);
  });

  it.each([
    [null],
    [""],
    ["geen json {"],
    ['"alleen een tekst"'],
    ["42"],
    ["null"],
    ['{"percentages":{"overmoed":10}}'], // datum ontbreekt
    ['{"datum":"2026-01-01"}'], // percentages ontbreekt
    ['{"datum":"","percentages":{}}'], // lege datum
    ['{"datum":42,"percentages":{}}'],
    ['{"datum":"2026-01-01","percentages":"hoog"}'],
    ['{"datum":"2026-01-01","percentages":{"overmoed":"hoog"}}'],
    ['{"datum":"2026-01-01","percentages":{"overmoed":null}}'],
  ])("levert null op voor %j", (ruw) => {
    expect(parseUitslag(ruw)).toBeNull();
  });
});
