import type { Course, CourseAccent, CourseIcon } from "./types";
import {
  activeCourses,
  courseDurationMin,
  courseLessonCount,
  courseXpTotal,
  flatLessons,
  totalQuizQuestions,
} from "./index";

/**
 * Uitgeklede vormen van een cursus, bedoeld om aan client components door te
 * geven.
 *
 * WAAROM DIT BESTAAT: er zijn twee manieren waarop lesinhoud in de browser kan
 * belanden, en ze zijn allebei een keer misgegaan.
 *
 * 1. Via props. Props van server components worden geserialiseerd en
 *    meegestuurd. Geef je een heel `Course`-object door, dan staan álle
 *    lesteksten, quizvragen én de juiste antwoorden (`correctIndex`) in de HTML.
 *
 * 2. Via imports. Een module met "use client" die `@/content` importeert, sleept
 *    de hele cursuscatalogus mee de browserbundel in — ook als hij er alleen een
 *    lestelling uit gebruikt. Zo stonden 21 lessen en 88 quizantwoorden in een
 *    publiek JS-bestand van 197 kB, op te vragen zonder in te loggen.
 *
 * Tegen (1) helpen de vormen hieronder: die bevatten met opzet geen inhoud.
 * Tegen (2) helpt `import "server-only"` boven in `./index` — daardoor faalt de
 * build zodra een client component de cursussen alsnog importeert. Client
 * components halen hun gegevens dus via props, niet via een import.
 *
 * Types uit dit bestand mogen client components wél importeren, maar uitsluitend
 * met `import type`: dat verdwijnt bij het compileren en haalt geen code op.
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

/**
 * De catalogus zoals de client hem mag kennen: per actieve cursus de
 * samenvatting plus een platte lijst lessen met alleen titels en cijfers.
 *
 * Dit is wat het leerpad en de voortgangsmotor nodig hebben. Zij importeerden
 * daarvoor `@/content` rechtstreeks en trokken hun de complete lesinhoud mee.
 * Nu berekent de server dit één keer en geeft het door als prop.
 */
export type CursusOutline = CursusSamenvatting & {
  lessen: LesRegel[];
};

export function catalogus(): CursusOutline[] {
  return activeCourses.map((course) => ({
    ...samenvatting(course),
    lessen: flatLessons(course).map(({ lesson }) => ({
      slug: lesson.slug,
      title: lesson.title,
      durationMin: lesson.durationMin,
      aantalQuizvragen: lesson.quiz.length,
      xp: lesson.xp,
    })),
  }));
}

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
