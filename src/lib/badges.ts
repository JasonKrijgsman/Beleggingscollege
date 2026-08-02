import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  CalendarCheck,
  Flame,
  GraduationCap,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  Star,
} from "lucide-react";

// Samenvatting van de voortgang waarop badges worden beoordeeld.
export type ProgressSummary = {
  xp: number;
  lessonsCompleted: number;
  coursesCompleted: number;
  totalCourses: number;
  perfectQuizzes: number;
  streakCurrent: number;
  completedLessonSlugs: string[]; // "cursus/les"
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  when: (s: ProgressSummary) => boolean;
};

export const BADGES: Badge[] = [
  {
    id: "eerste-les",
    name: "Eerste college",
    description: "Je eerste les afgerond. De belangrijkste stap is gezet.",
    icon: GraduationCap,
    when: (s) => s.lessonsCompleted >= 1,
  },
  {
    id: "op-dreef",
    name: "Op dreef",
    description: "Vijf lessen afgerond.",
    icon: Rocket,
    when: (s) => s.lessonsCompleted >= 5,
  },
  {
    id: "studiebol",
    name: "Studiebol",
    description: "Tien lessen afgerond.",
    icon: BookOpen,
    when: (s) => s.lessonsCompleted >= 10,
  },
  {
    id: "foutloos",
    name: "Foutloos",
    description: "Een quiz met een perfecte score afgesloten.",
    icon: Target,
    when: (s) => s.perfectQuizzes >= 1,
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Vijf perfecte quizscores.",
    icon: Star,
    when: (s) => s.perfectQuizzes >= 5,
  },
  {
    id: "warmgedraaid",
    name: "Warmgedraaid",
    description: "Drie dagen op rij geleerd.",
    icon: Flame,
    when: (s) => s.streakCurrent >= 3,
  },
  {
    id: "ijzeren-discipline",
    name: "IJzeren discipline",
    description: "Zeven dagen op rij geleerd — discipline verslaat talent.",
    icon: CalendarCheck,
    when: (s) => s.streakCurrent >= 7,
  },
  {
    id: "achtste-wereldwonder",
    name: "Achtste wereldwonder",
    description: "De les over rente op rente afgerond.",
    icon: Sparkles,
    when: (s) =>
      s.completedLessonSlugs.includes("beleggen-voor-beginners/rente-op-rente"),
  },
  {
    id: "cum-laude",
    name: "Cum laude",
    description: "Een volledige cursus afgerond.",
    icon: Award,
    when: (s) => s.coursesCompleted >= 1,
  },
  {
    id: "summa-cum-laude",
    name: "Summa cum laude",
    description: "Alle beschikbare cursussen afgerond.",
    icon: Trophy,
    when: (s) => s.totalCourses > 0 && s.coursesCompleted >= s.totalCourses,
  },
];

export function badgeById(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}
