// Prijsmodel van Beleggingscollege.
//
// Twee manieren om toegang te krijgen, zodat mensen kunnen kiezen:
//  1. Losse cursus kopen  -> eenmalig betalen, levenslange toegang tot díe cursus
//  2. College+ abonnement -> alles, inclusief nieuwe cursussen, per maand opzegbaar
//
// Bedragen onderbouwd in docs/prijsstrategie.md (marktonderzoek NL, augustus 2026).
// Vuistregel tegen kannibalisatie: een losse cursus moet 3 tot 5 maanden abonnement
// kosten. €49 / €14,99 = 3,3 maanden. Zit goed.
//
// Presentatie: MAAND is de instap en staat vooraan. Vrijwel niemand kiest meteen
// een jaarabonnement; dat is de upgrade nadat iemand maanden heeft meegedraaid.

export const PRICING = {
  /** Prijs per losse cursus (eenmalig, levenslange toegang). */
  losseCursus: "€49",
  /** College+ per maand — de instap. */
  abonnementMaand: "€14,99",
  /** College+ per jaar — voordeliger, voor wie al weet dat hij blijft. */
  abonnementJaar: "€149",
  /** Effectieve maandprijs bij een jaarabonnement, voor de "je bespaart"-tekst. */
  abonnementJaarPerMaand: "€12,42",
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
