import type { MetadataRoute } from "next";
import { activeCourses, courses, flatLessons } from "@/content";
import { sortedPosts } from "@/content/blog";

const BASE = "https://beleggingscollege.nl";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/cursussen`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.7 },
    ...sortedPosts().map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(`${p.date}T12:00:00`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: `${BASE}/over-ons`, changeFrequency: "yearly", priority: 0.5 },
    {
      url: `${BASE}/veelgestelde-vragen`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.4 },
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
