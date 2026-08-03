import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Lightbulb, Quote } from "lucide-react";
import { formatDate, getPost, posts } from "@/content/blog";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ slug: string }>;
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  // Zie de cursuspagina: een eigen openGraph-blok gooit de afbeelding uit de
  // root-layout weg, dus halen we die hier expliciet terug.
  const ouderAfbeeldingen = (await parent).openGraph?.images ?? [];
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      images: ouderAfbeeldingen,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    inLanguage: "nl",
    author: { "@type": "Organization", name: "Beleggingscollege" },
    publisher: { "@type": "Organization", name: "Beleggingscollege" },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-body hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" /> Alle artikelen
      </Link>

      <header>
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
          {post.tag}
        </span>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-body">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readingMin} min lezen
          </span>
        </div>
        <p className="mt-5 text-lg leading-relaxed text-body">{post.excerpt}</p>
      </header>

      <div className="mt-8 space-y-5">
        {post.body.map((block, i) => {
          if (block.type === "kop") {
            return (
              <h2 key={i} className="pt-3 text-xl font-bold text-ink">
                {block.text}
              </h2>
            );
          }
          if (block.type === "alinea") {
            return (
              <p key={i} className="leading-relaxed text-body">
                {block.text}
              </p>
            );
          }
          if (block.type === "lijst") {
            return (
              <ul key={i} className="space-y-2">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2.5 leading-relaxed text-body"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                    {item}
                  </li>
                ))}
              </ul>
            );
          }
          if (block.type === "citaat") {
            return (
              <figure
                key={i}
                className="rounded-2xl border-l-4 border-brand-200 bg-white p-6 shadow-card"
              >
                <Quote className="h-5 w-5 text-brand-300" />
                <blockquote className="mt-2 text-lg italic leading-relaxed text-ink">
                  {block.text}
                </blockquote>
                <figcaption className="mt-2 text-sm font-semibold text-body">
                  — {block.bron}
                </figcaption>
              </figure>
            );
          }
          return (
            <aside
              key={i}
              className="rounded-2xl border border-goud-300 bg-goud-100/50 p-6"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <Lightbulb className="h-4 w-4 text-goud-600" />
                {block.titel}
              </div>
              <p className="mt-2 leading-relaxed text-body">{block.text}</p>
            </aside>
          );
        })}
      </div>

      <aside className="mt-12 rounded-2xl bg-gradient-to-br from-groen-900 to-groen-600 p-7 text-center text-white">
        <h2 className="text-xl font-extrabold">Liever leren dan lezen?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
          De gratis cursus Beleggen voor Beginners neemt je in negen korte lessen
          mee door de basis. Geen account nodig.
        </p>
        <Link
          href="/cursussen/beleggen-voor-beginners"
          className="mt-5 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-bold text-groen-800 transition-transform hover:scale-105"
        >
          Start de gratis cursus
        </Link>
      </aside>
    </article>
  );
}
