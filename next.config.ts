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
};

export default nextConfig;
