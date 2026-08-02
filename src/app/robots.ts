import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

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
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
