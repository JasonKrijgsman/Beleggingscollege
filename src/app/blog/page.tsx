import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { formatDate, sortedPosts } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artikelen over beleggen, geworteld in de klassieke boeken. Uitleg, rekenvoorbeelden en eerlijke kanttekeningen — geen koerstips.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = sortedPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-extrabold text-ink">Blog</h1>
      <p className="mt-3 leading-relaxed text-body">
        Losse artikelen over beleggen: uitleg, rekenvoorbeelden en de
        kanttekeningen die er meestal bij ontbreken. Geen koerstips — wel de
        redenering erachter.
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-lijn bg-white p-6 text-body shadow-card">
          Er staan nog geen artikelen online. Binnenkort meer.
        </p>
      ) : (
        <div className="mt-10 space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-lijn bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-pop"
            >
              <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                {post.tag}
              </span>
              <h2 className="mt-3 text-xl font-bold leading-snug text-ink">
                {post.title}
              </h2>
              <p className="mt-2 leading-relaxed text-body">{post.excerpt}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-body">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingMin} min lezen
                </span>
                <span className="ml-auto flex items-center gap-1 text-brand-700 transition-transform group-hover:translate-x-0.5">
                  Lees verder <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
