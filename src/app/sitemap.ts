import type { MetadataRoute } from "next";
import { activeCourses, courses, flatLessons } from "@/content";

const BASE = "https://beleggingscollege.nl";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/cursussen`, changeFrequency: "weekly", priority: 0.9 },
    ...courses.map((c) => ({
      url: `${BASE}/cursussen/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...activeCourses.flatMap((c) =>
      flatLessons(c).map((x) => ({
        url: `${BASE}/cursussen/${c.slug}/les/${x.lesson.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    ),
  ];
}
