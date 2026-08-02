import type { Course, CourseAccent, CourseIcon } from "./types";
import {
  courseDurationMin,
  courseLessonCount,
  courseXpTotal,
  totalQuizQuestions,
} from "./index";

/**
 * Uitgeklede vormen van een cursus, bedoeld om aan client components door te
 * geven.
 *
 * WAAROM DIT BESTAAT: props van server components worden geserialiseerd en
 * meegestuurd naar de browser. Geef je het hele Course-object door, dan staan
 * álle lesteksten, quizvragen én de juiste antwoorden (`correctIndex`) gewoon
 * in de HTML — ook bij een betaalde cursus, en ook voor wie niet betaald heeft.
 *
 * Regel: client components krijgen NOOIT een `Course`. Ze krijgen een van de
 * vormen hieronder, die met opzet geen lesinhoud bevatten.
 */

export type CursusSamenvatting = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  level: Course["level"];
  accent: CourseAccent;
  icon: CourseIcon;
  free?: boolean;
  price?: string;
  comingSoon?: boolean;
  aantalLessen: number;
  duurMinuten: number;
  totaalXp: number;
};

export function samenvatting(course: Course): CursusSamenvatting {
  return {
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    level: course.level,
    accent: course.accent,
    icon: course.icon,
    free: course.free,
    price: course.price,
    comingSoon: course.comingSoon,
    aantalLessen: courseLessonCount(course),
    duurMinuten: courseDurationMin(course),
    totaalXp: courseXpTotal(course),
  };
}

/** Eén les zoals hij in het curriculumoverzicht staat: titel en cijfers, geen
 *  inhoud. Het aantal quizvragen mag wel — dat is een aantal, geen antwoord. */
export type LesRegel = {
  slug: string;
  title: string;
  durationMin: number;
  aantalQuizvragen: number;
  xp: number;
};

export type ModuleRegel = {
  slug: string;
  title: string;
  description: string;
  lessen: LesRegel[];
};

export type CursusDetail = CursusSamenvatting & {
  heroQuote?: { text: string; source: string };
  learnPoints: string[];
  modules: ModuleRegel[];
  aantalQuizvragen: number;
};

export function detail(course: Course): CursusDetail {
  return {
    ...samenvatting(course),
    heroQuote: course.heroQuote,
    learnPoints: course.learnPoints,
    aantalQuizvragen: totalQuizQuestions(course),
    modules: course.modules.map((m) => ({
      slug: m.slug,
      title: m.title,
      description: m.description,
      lessen: m.lessons.map((l) => ({
        slug: l.slug,
        title: l.title,
        durationMin: l.durationMin,
        aantalQuizvragen: l.quiz.length,
        xp: l.xp,
      })),
    })),
  };
}
