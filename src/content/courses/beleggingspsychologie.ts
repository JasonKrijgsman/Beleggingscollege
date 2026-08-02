import type { Course } from "../types";

// Teasercursus: toont de roadmap van het platform ("binnenkort").
const course: Course = {
  slug: "beleggingspsychologie",
  title: "Beleggingspsychologie",
  subtitle: "Je grootste tegenstander ben je zelf",
  description:
    "Waarom maken slimme mensen domme beleggingskeuzes? Over verliesaversie, kuddegedrag, overmoed — en de routines waarmee kalme beleggers hun eigen brein te slim af zijn.",
  level: "Beginner",
  accent: "paars",
  icon: "brain",
  price: "€49",
  learnPoints: [
    "Herken de zes duurste denkfouten van beleggers",
    "Waarom je brein verlies dubbel zo zwaar weegt als winst",
    "Kuddegedrag: waarom iedereen tegelijk koopt én verkoopt",
    "Bouw routines die emotie uit je beslissingen halen",
    "Lessen uit de gedragseconomie: Kahneman, Thaler en Housel",
  ],
  modules: [],
  comingSoon: true,
  order: 4,
};

export default course;
