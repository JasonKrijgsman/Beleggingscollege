// Prijsmodel van Beleggingscollege.
//
// Twee manieren om toegang te krijgen, zodat mensen kunnen kiezen:
//  1. Losse cursus kopen  -> eenmalig betalen, levenslange toegang tot díe cursus
//  2. College+ abonnement -> alles, inclusief nieuwe cursussen, per maand opzegbaar
//
// LET OP: de losse prijs moet duidelijk hoger liggen dan één maand College+,
// anders kannibaliseert losse verkoop het abonnement. Definitieve onderbouwing
// en marktvergelijking: docs/prijsstrategie.md.

export const PRICING = {
  /** Prijs per losse cursus (eenmalig, levenslange toegang). */
  losseCursus: "€29",
  /** College+ per maand. */
  abonnementMaand: "€14,99",
  /** Gratis kennismakingscursus. */
  gratisCursusSlug: "beleggen-voor-beginners",
} as const;

export const COLLEGE_PLUS_VOORDELEN = [
  "Toegang tot álle cursussen, ook nieuwe releases",
  "Interactieve tools en rekenmachines",
  "Vragen stellen aan de AI-studiecoach",
  "Certificaat voor elke afgeronde cursus",
  "Maandelijks opzegbaar",
] as const;

export const LOSSE_CURSUS_VOORDELEN = [
  "Levenslange toegang tot deze cursus",
  "Alle lessen, quizzen en XP",
  "Certificaat bij afronding",
  "Eenmalig betalen, geen abonnement",
] as const;
