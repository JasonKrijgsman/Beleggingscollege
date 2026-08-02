import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  courseLessonCount,
  courses,
  courseXpTotal,
  getCourse,
} from "@/content";
import CertificateView from "@/components/CertificateView";
import EmailCapture from "@/components/EmailCapture";

export function generateStaticParams() {
  return courses
    .filter((c) => !c.comingSoon)
    .map((c) => ({ slug: c.slug }));
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
    title: `Certificaat · ${course.title}`,
    robots: { index: false, follow: false },
  };
}

export default async function CertificaatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course || course.comingSoon) notFound();
  return (
    <>
      <CertificateView
        courseSlug={course.slug}
        courseTitle={course.title}
        courseSubtitle={course.subtitle}
        totalLessons={courseLessonCount(course)}
        totalXp={courseXpTotal(course)}
      />
      {/* Het moment waarop iemand net een cursus heeft afgerond is het enige
          moment waarop we om een e-mailadres vragen: de goodwill piekt en de
          vraag is eerlijk te beantwoorden ("wil je horen wanneer er meer is?").
          no-print: hoort niet op het papieren certificaat. */}
      <div className="no-print mx-auto max-w-2xl px-4 pb-16 sm:px-6">
        <EmailCapture bron={`certificaat/${course.slug}`} />
      </div>
    </>
  );
}
