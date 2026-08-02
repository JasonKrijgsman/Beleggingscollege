import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { courseDurationMin, courses, getCourse } from "@/content";
import CourseDetail from "@/components/CourseDetail";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return {
    title: course.title,
    description: course.description,
    alternates: { canonical: `/cursussen/${course.slug}` },
    openGraph: {
      title: `${course.title} — ${course.subtitle}`,
      description: course.description,
      url: `/cursussen/${course.slug}`,
    },
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  // schema.org Course-markup voor rich results in Google
  const jsonLd = course.comingSoon
    ? null
    : {
        "@context": "https://schema.org",
        "@type": "Course",
        name: course.title,
        description: course.description,
        inLanguage: "nl",
        provider: {
          "@type": "Organization",
          name: "Beleggingscollege",
          url: "https://beleggingscollege.nl",
        },
        ...(course.free ? { isAccessibleForFree: true } : {}),
        offers: {
          "@type": "Offer",
          price: course.free
            ? "0"
            : (course.price ?? "€14,99").replace("€", "").replace(",", "."),
          priceCurrency: "EUR",
          category: course.free ? "Free" : "Paid",
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "Online",
          courseWorkload: `PT${courseDurationMin(course)}M`,
        },
      };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CourseDetail course={course} />
    </>
  );
}
