import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Persoonlijke pagina's horen niet in Google
        disallow: ["/leerpad", "/cursussen/*/certificaat"],
      },
    ],
    sitemap: "https://beleggingscollege.nl/sitemap.xml",
  };
}
