import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { analyticsConfig } from "@/lib/analytics";

/**
 * De belangrijkste eigenschap van de bezoekmeting is dat hij UIT is zolang
 * hij niet is ingesteld. Dat is niet netjesheid: de privacyverklaring belooft
 * precies wat er gemeten wordt, en zolang die belofte niet juridisch getoetst
 * is mag een half ingevulde omgevingsvariabele niet stilletjes een script naar
 * bezoekers sturen. Daarom staat het hier vastgepind.
 */

const SCHOON = {
  NEXT_PUBLIC_UMAMI_URL: process.env.NEXT_PUBLIC_UMAMI_URL,
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
};

beforeEach(() => {
  delete process.env.NEXT_PUBLIC_UMAMI_URL;
  delete process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
});

afterEach(() => {
  for (const [k, v] of Object.entries(SCHOON)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
});

describe("meten staat uit tenzij het bewust aan staat", () => {
  it("geen variabelen ingevuld: niets", () => {
    expect(analyticsConfig()).toBeNull();
  });

  it("alleen een adres, geen website-id: nog steeds niets", () => {
    process.env.NEXT_PUBLIC_UMAMI_URL = "https://stats.beleggingscollege.com";
    expect(analyticsConfig()).toBeNull();
  });

  it("alleen een website-id, geen adres: nog steeds niets", () => {
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = "abc-123";
    expect(analyticsConfig()).toBeNull();
  });

  it("een lege of alleen-spaties waarde telt niet als ingevuld", () => {
    process.env.NEXT_PUBLIC_UMAMI_URL = "   ";
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = "abc-123";
    expect(analyticsConfig()).toBeNull();
  });
});

describe("als het aan staat", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_UMAMI_URL = "https://stats.beleggingscollege.com";
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = "abc-123";
  });

  it("wijst naar het script op de eigen statistiekomgeving", () => {
    expect(analyticsConfig()?.scriptUrl).toBe(
      "https://stats.beleggingscollege.com/script.js"
    );
  });

  it("een afsluitende schuine streep levert geen dubbele op", () => {
    process.env.NEXT_PUBLIC_UMAMI_URL = "https://stats.beleggingscollege.com/";
    expect(analyticsConfig()?.scriptUrl).toBe(
      "https://stats.beleggingscollege.com/script.js"
    );
  });

  it("telt alleen op het echte domein, zodat previews de cijfers niet vervuilen", () => {
    expect(analyticsConfig()?.domains).toBe("beleggingscollege.com");
  });
});

describe("meerdere domeinen tijdens de verhuizing", () => {
  /**
   * Tijdens de cutover naar de .nl serveren beide namen de site. Zonder deze
   * ontsnappingsklep telt er dan één niet mee, en dat gaat stil: je ziet de
   * cijfers zakken en denkt dat je bezoekers kwijt bent.
   */
  beforeEach(() => {
    process.env.NEXT_PUBLIC_UMAMI_URL = "https://stats.beleggingscollege.com";
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = "abc-123";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_UMAMI_DOMAINS;
  });

  it("de override vervangt het domein uit SITE_URL", () => {
    process.env.NEXT_PUBLIC_UMAMI_DOMAINS =
      "beleggingscollege.com,beleggingscollege.nl";
    expect(analyticsConfig()?.domains).toBe(
      "beleggingscollege.com,beleggingscollege.nl"
    );
  });

  it("spaties na de komma's verdwijnen — Umami matcht daar anders niet op", () => {
    process.env.NEXT_PUBLIC_UMAMI_DOMAINS =
      " beleggingscollege.com , beleggingscollege.nl ";
    expect(analyticsConfig()?.domains).toBe(
      "beleggingscollege.com,beleggingscollege.nl"
    );
  });

  it("een lege override valt terug op SITE_URL in plaats van niets te tellen", () => {
    process.env.NEXT_PUBLIC_UMAMI_DOMAINS = "   ";
    expect(analyticsConfig()?.domains).toBe("beleggingscollege.com");
  });
});

describe("het meetdomein volgt SITE_URL", () => {
  /**
   * SITE_URL wordt één keer bij het importeren bepaald, dus een omgevings-
   * variabele achteraf zetten heeft geen effect. Daarom hier de module opnieuw
   * laden mét de .nl erin: zo staat vastgelegd dat de domeinverhuizing géén
   * codewijziging in de meting vraagt.
   */
  it("bij de verhuizing naar de .nl verschuift het meetdomein vanzelf mee", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://beleggingscollege.nl");
    vi.stubEnv("NEXT_PUBLIC_UMAMI_URL", "https://stats.beleggingscollege.nl");
    vi.stubEnv("NEXT_PUBLIC_UMAMI_WEBSITE_ID", "abc-123");

    const opnieuw = await import("@/lib/analytics");
    expect(opnieuw.analyticsConfig()?.domains).toBe("beleggingscollege.nl");

    vi.unstubAllEnvs();
    vi.resetModules();
  });
});
