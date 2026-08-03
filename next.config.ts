import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SEO: permanente redirects van de oude WordPress-URL's (Strato-site) naar
  // hun nieuwe plek, zodat bestaande Google-resultaten en links hun waarde
  // behouden. Slapend tot de site live staat op beleggingscollege.nl.
  async redirects() {
    return [
      { source: "/trainingen", destination: "/cursussen", permanent: true },
      {
        source: "/courses/beleggen-voor-beginners-je-eerste-stappen-in-investeren",
        destination: "/cursussen/beleggen-voor-beginners",
        permanent: true,
      },
      {
        source: "/courses/value-investing-de-basis",
        destination: "/cursussen/waardebeleggen",
        permanent: true,
      },
      {
        source:
          "/courses/introductie-technische-analyse-grafieken-beheersen-markten-voorspellen",
        destination: "/cursussen/technische-analyse",
        permanent: true,
      },
      // Vangnet voor overige oude cursus-URL's
      { source: "/courses/:path*", destination: "/cursussen", permanent: true },
      { source: "/mijn-account", destination: "/leerpad", permanent: true },
      // /over-ons, /veelgestelde-vragen, /contact en /blog hebben inmiddels een
      // eigen pagina. Die oude WordPress-URL's blijven dus precies bestaan en
      // hoeven niet omgeleid te worden — dat is SEO-technisch het beste.
      {
        source: "/terugbetaal-en-retourneringsbeleid",
        destination: "/herroepingsrecht",
        permanent: true,
      },
      { source: "/privacy-policy-2", destination: "/privacy", permanent: true },
    ];
  },

  // Algemene browserbeveiligingsheaders. Dit is de goedkope helft van
  // CODEX-109: vier headers die niets kunnen breken omdat ze alleen dingen
  // verbieden die de site sowieso niet doet.
  //
  // BEWUST GEEN Content-Security-Policy. Die moet apart ontworpen worden
  // rond Google (inloggen), Mollie (afrekenen) en een eventuele
  // Payload-preview; een haastige CSP breekt precies die twee paden waar
  // geld en toegang aan hangen. Zie docs/openstaand.md §6, CODEX-109.
  //
  // Strict-Transport-Security staat er niet bij: Vercel zet die zelf al
  // (geverifieerd op de live site, max-age=63072000).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Geen MIME-sniffing: een geüpload of gegenereerd bestand mag nooit
          // als script geïnterpreteerd worden omdat de inhoud er zo uitziet.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Niet in een iframe van iemand anders — clickjacking op de
          // koopknop is het scenario dat dit afdekt.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Bij het weggaan naar een ander domein alleen de herkomst
          // meesturen, niet het volledige pad. Een pad als
          // /cursussen/…/certificaat zegt iets over de bezoeker.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // De site vraagt nergens om camera, microfoon of locatie. Dan kan
          // het net zo goed dicht: een ingesloten of gekaapt script kan er
          // dan ook niet om vragen.
          //
          // `payment=()` staat er bewust NIET bij. Afrekenen gaat vandaag via
          // een redirect naar Mollie, dus we zouden het kunnen dichtzetten —
          // maar zodra Mollie ooit als component in de pagina komt, breekt
          // dat stil het enige pad waar geld overheen gaat. Die weddenschap
          // is de winst niet waard.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
