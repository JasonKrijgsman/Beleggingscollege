import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { courseDurationMin, courses, getCourse } from "@/content";
import CourseDetail from "@/components/CourseDetail";
import { detail } from "@/content/view";
import { SITE_URL } from "@/lib/site";
import { auth } from "@/auth";
import { heeftToegangTot } from "@/lib/entitlements";
import KoopKnop from "@/components/KoopKnop";
import { PRICING } from "@/lib/pricing";

// Deze pagina toont de koopknop en of je de cursus al hebt, en hangt dus af
// van wie er kijkt. Daarom per verzoek renderen in plaats van vooraf bouwen.
export const dynamic = "force-dynamic";

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

  const session = await auth();
  const ingelogd = Boolean(session?.user);
  const alGekocht = await heeftToegangTot(slug);

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
          url: SITE_URL,
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
      <CourseDetail
        course={detail(course)}
        inBezit={alGekocht && !course.free}
        koopSlot={
          course.free || course.comingSoon || alGekocht ? null : (
            <KoopKnop
              slug={course.slug}
              titel={course.title}
              prijs={course.price ?? PRICING.losseCursus}
              ingelogd={ingelogd}
            />
          )
        }
      />
    </>
  );
}
