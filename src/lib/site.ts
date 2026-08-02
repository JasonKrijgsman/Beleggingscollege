// Het canonieke adres van de site.
//
// Waarom een variabele en geen vaste tekst: beleggingscollege.nl staat nog vast
// bij Strato, dus draaien we tijdelijk op beleggingscollege.com. Zodra de .nl is
// verhuisd zetten we NEXT_PUBLIC_SITE_URL in Vercel op https://beleggingscollege.nl
// en voegen we een permanente redirect toe van .com naar .nl. Dan hoeft er verder
// niets in de code te veranderen: canonicals, sitemap en Open Graph volgen vanzelf.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://beleggingscollege.com";

/** Het domein zonder protocol, bijv. voor in teksten en het certificaat. */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
