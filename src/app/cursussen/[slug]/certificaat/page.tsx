import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  courseLessonCount,
  courses,
  courseXpTotal,
  getCourse,
} from "@/content";
import CertificateView from "@/components/CertificateView";

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
    <CertificateView
      courseSlug={course.slug}
      courseTitle={course.title}
      courseSubtitle={course.subtitle}
      totalLessons={courseLessonCount(course)}
      totalXp={courseXpTotal(course)}
    />
  );
}
