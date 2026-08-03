import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { courseDurationMin, courses, getCourse } from "@/content";
import CourseDetail from "@/components/CourseDetail";
import { detail } from "@/content/view";
import { SITE_URL } from "@/lib/site";
import { auth } from "@/auth";
import { heeftToegangTot } from "@/lib/entitlements";
import KoopKnop from "@/components/KoopKnop";
import { PRICING } from "@/lib/pricing";
import { schemaOrgPrijs } from "@/lib/prijs";

// Deze pagina toont de koopknop en of je de cursus al hebt, en hangt dus af
// van wie er kijkt. Daarom per verzoek renderen in plaats van vooraf bouwen.
export const dynamic = "force-dynamic";

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ slug: string }>;
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  // Een eigen openGraph-blok vervángt dat van de root-layout, en daarmee ook
  // de afbeelding uit opengraph-image.tsx. Zonder de regel hieronder deelt
  // juist de pagina die je wilt laten rondgaan zónder kaartafbeelding.
  const ouderAfbeeldingen = (await parent).openGraph?.images ?? [];
  return {
    title: course.title,
    description: course.description,
    alternates: { canonical: `/cursussen/${course.slug}` },
    openGraph: {
      title: `${course.title} — ${course.subtitle}`,
      description: course.description,
      url: `/cursussen/${course.slug}`,
      images: ouderAfbeeldingen,
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

  // schema.org Course-markup voor rich results in Google. De geadverteerde
  // prijs komt via schemaOrgPrijs() uit dezelfde bron als wat de checkout
  // afrekent; test/prijs.test.ts bewaakt dat die twee nooit uit elkaar lopen.
  const prijs = schemaOrgPrijs(course);
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
        // Geen prijs te bepalen (hoort niet voor te komen bij een koopbare
        // cursus) -> liever geen Offer dan een verkeerde.
        ...(prijs !== null
          ? {
              offers: {
                "@type": "Offer",
                price: prijs,
                priceCurrency: "EUR",
                category: course.free ? "Free" : "Paid",
              },
            }
          : {}),
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
