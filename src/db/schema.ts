import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/core/adapters";

/* ------------------------------------------------------------------
 * 1. Auth.js-tabellen
 *
 * Deze moeten EXACT overeenkomen met wat @auth/drizzle-adapter verwacht:
 * enkelvoudige tabelnamen en camelCase-kolommen. Dat is lelijk Postgres,
 * maar de adapter schrijft het voor. Onze eigen tabellen hieronder gebruiken
 * wel gewoon snake_case.
 *
 * Let op: verificationToken gebruikt `identifier`, NIET `email`. De docs op
 * authjs.dev tonen `email`, maar de broncode gebruikt `identifier`; met de
 * verkeerde naam breekt inloggen via een e-maillink.
 * ---------------------------------------------------------------- */

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
);

/** Nu ongebruikt, maar aanmaken kost niets en voorkomt een crash als we
 *  later passkeys aanzetten. */
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.credentialID] })]
);

/* ------------------------------------------------------------------
 * 2. Betalen en toegang — drie begrippen, drie tabellen
 *
 * Zie docs/ontwerp-betaalmodel.md: een betaalpoging (payment_attempts),
 * het toegangsrecht (entitlements) en de ordernummerteller (order_counters)
 * hebben elk hun eigen levensduur. `purchases` is de oude, gecombineerde
 * tabel: die blijft staan tot de contract-stap (aparte migratie) hem
 * opruimt, maar er wordt niet meer naar geschreven of uit gelezen.
 * ---------------------------------------------------------------- */

/** OUD — vervangen door payment_attempts + entitlements (expand-fase).
 *  Niet verwijderen tot de contract-migratie; zie docs/ontwerp-betaalmodel.md §3. */
export const purchases = pgTable(
  "purchases",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** Cursusslug uit src/content, bijv. "waardebeleggen". */
    courseSlug: text("course_slug").notNull(),
    /** Mollie payment id (tr_...). Uniek, zodat een dubbele webhook geen
     *  tweede aankoop kan aanmaken. */
    molliePaymentId: text("mollie_payment_id").notNull().unique(),
    /** paid | pending | failed | expired | canceled | refunded */
    status: text("status").notNull().default("pending"),
    /** Bedrag in eurocent, zodat we nooit met floats rekenen. */
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull().default("EUR"),

    /* Bewijs rond het herroepingsrecht. Zonder dit kunnen we bij een
     * geschil niet aantonen dat de klant uitdrukkelijk toestemming gaf om
     * direct te beginnen en daarmee afstand deed van de bedenktijd.
     * Bewaartermijn: minimaal 13 maanden (zie docs/betalingen-mollie.md). */
    withdrawalWaivedAt: timestamp("withdrawal_waived_at", { mode: "date" }),
    consentIp: text("consent_ip"),
    consentTermsVersion: text("consent_terms_version"),

    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    paidAt: timestamp("paid_at", { mode: "date" }),

    /* Wanneer de orderbevestiging is verstuurd. Mollie roept de webhook
     * gegarandeerd meerdere keren aan voor dezelfde betaling, dus zonder dit
     * veld krijgt een klant tien identieke mails. Tegelijk is dit het bewijs
     * dát de wettelijk verplichte bevestiging is verzonden. */
    confirmationSentAt: timestamp("confirmation_sent_at", { mode: "date" }),

    /** Volgnummer voor op de bevestiging, bijv. BC-2026-0001. Doorlopend en
     *  zonder gaten, want dat eist de Belastingdienst. */
    orderNumber: text("order_number").unique(),
  },
  (t) => [
    index("purchases_user_idx").on(t.userId),
    // Eén betaalde aankoop per cursus per gebruiker.
    uniqueIndex("purchases_user_course_idx").on(t.userId, t.courseSlug),
  ]
);

/** Eén rij per Mollie-betaling. Append-only: rijen worden nooit verwijderd,
 *  mollie_payment_id / bedrag / consent / created_at worden nooit herschreven.
 *  De rij die "paid" haalt is de order; daar horen ordernummer en mailbewijs bij. */
export const paymentAttempts = pgTable(
  "payment_attempts",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseSlug: text("course_slug").notNull(),
    /** Uniek: een dubbele webhook kan nooit een tweede rij voor dezelfde
     *  betaling maken; twee checkouts maken juist wél twee rijen. */
    molliePaymentId: text("mollie_payment_id").notNull().unique(),
    /** pending | paid | failed | expired | canceled | mismatch | refunded */
    status: text("status").notNull().default("pending"),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull().default("EUR"),

    /* Consentbewijs, zoals voorheen op purchases — per póging vastgelegd,
     * zodat een retry het bewijs van een eerdere poging niet overschrijft. */
    withdrawalWaivedAt: timestamp("withdrawal_waived_at", { mode: "date" }),
    consentIp: text("consent_ip"),
    consentTermsVersion: text("consent_terms_version"),

    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    paidAt: timestamp("paid_at", { mode: "date" }),

    /* Mailbewijs, met een atomaire claim (docs/ontwerp-betaalmodel.md §2.4). */
    confirmationClaimedAt: timestamp("confirmation_claimed_at", { mode: "date" }),
    confirmationSentAt: timestamp("confirmation_sent_at", { mode: "date" }),

    orderNumber: text("order_number").unique(),
  },
  (t) => [
    index("payment_attempts_user_course_idx").on(t.userId, t.courseSlug),
    // Voor de opruimronde uit docs/openstaand.md §6 (hangende pendings naslaan).
    index("payment_attempts_status_idx").on(t.status, t.createdAt),
  ]
);

/** Eén recht per gebruiker per cursus — de enige bron van waarheid voor
 *  toegang, en het enige dat heeftToegangTot() leest. Toegang wordt NOOIT
 *  afgeleid uit iets in de browser: een les komt pas de deur uit als hier
 *  een rij staat met status "actief". */
export const entitlements = pgTable(
  "entitlements",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseSlug: text("course_slug").notNull(),
    /** actief | ingetrokken */
    status: text("status").notNull().default("actief"),
    /** De betaalpoging (= order) die dit recht als laatste verleende. */
    attemptId: text("attempt_id")
      .notNull()
      .references(() => paymentAttempts.id),
    grantedAt: timestamp("granted_at", { mode: "date" }).notNull().defaultNow(),
    revokedAt: timestamp("revoked_at", { mode: "date" }),
    /** Bijv. "refund" of "misbruik" — voor het audittrail van /beheer. */
    revokedReason: text("revoked_reason"),
  },
  (t) => [
    uniqueIndex("entitlements_user_course_idx").on(t.userId, t.courseSlug),
    index("entitlements_user_idx").on(t.userId),
  ]
);

/** Doorlopende ordernummers zonder tellen-dan-proberen: één rij per jaar,
 *  opgehoogd mét RETURNING binnen de paid-verwerking. Rolt die terug,
 *  dan rolt de teller mee — geen gaten. */
export const orderCounters = pgTable("order_counters", {
  jaar: integer("jaar").primaryKey(),
  laatste: integer("laatste").notNull().default(0),
});

/* ------------------------------------------------------------------
 * 3. Voortgang — vervangt localStorage zodra iemand is ingelogd
 * ---------------------------------------------------------------- */

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseSlug: text("course_slug").notNull(),
    lessonSlug: text("lesson_slug").notNull(),
    /** Beste quizscore, niet de laatste. */
    quizCorrect: integer("quiz_correct").notNull().default(0),
    quizTotal: integer("quiz_total").notNull().default(0),
    xpAwarded: integer("xp_awarded").notNull().default(0),
    completedAt: timestamp("completed_at", { mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.courseSlug, t.lessonSlug] }),
    index("lesson_progress_user_idx").on(t.userId),
  ]
);

/**
 * Vragen bij een les — de gekozen communityvorm (zie docs/ideeen.md).
 *
 * Bewust GEEN algemeen forum: vragen hangen onder een les en worden pas
 * zichtbaar nadat Jason ze zélf uitkiest, goedkeurt én beantwoordt. REDACTIONEEL,
 * geen helpdesk: er is GEEN beloofde antwoordtermijn en GEEN zichtbare wachtrij.
 * Een onbeantwoorde vraag verschijnt nergens publiek en wordt ook niet aan de
 * vraagsteller teruggetoond; die krijgt alleen een bevestiging. Zie src/lib/lesvragen.ts.
 */
export const lessonQuestions = pgTable(
  "lesson_questions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    /** Verwijdert iemand zijn account, dan verdwijnen ook zijn vragen (AVG). */
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** Voornaam zoals bij het stellen, zodat de weergave niet meebeweegt met
     *  latere naamswijzigingen bij Google. */
    naam: text("naam").notNull().default(""),
    courseSlug: text("course_slug").notNull(),
    lessonSlug: text("lesson_slug").notNull(),
    vraag: text("vraag").notNull(),
    /** Jasons antwoord; verplicht vóór een vraag zichtbaar wordt. */
    antwoord: text("antwoord"),
    /** wachtend | zichtbaar | afgewezen */
    status: text("status").notNull().default("wachtend"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    answeredAt: timestamp("answered_at", { mode: "date" }),
  },
  (t) => [
    index("lesson_questions_les_idx").on(t.courseSlug, t.lessonSlug, t.status),
    index("lesson_questions_user_idx").on(t.userId),
  ]
);

/**
 * Nieuwsbrief-aanmeldingen, verzameld op het moment van afronding — als de
 * goodwill piekt, niet als een popup bij binnenkomst.
 *
 * AVG: we leggen het moment en het IP van de toestemming vast, en wat erbij
 * beloofd is (bron). Er is nog geen dubbele bevestiging omdat er nog geen
 * uitgaande mail is (zie docs/e-mail-versturen.md); tot die er is wordt er
 * dus ook niets naar deze adressen VERSTUURD. Eerst bevestigen, dan mailen.
 */
export const newsletterSignups = pgTable("newsletter_signups", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  /** Gekoppeld account, als de aanmelder ingelogd was. */
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  /** Waar op de site de aanmelding vandaan komt, bijv. "certificaat/waardebeleggen". */
  source: text("source").notNull(),
  consentedAt: timestamp("consented_at", { mode: "date" }).notNull().defaultNow(),
  consentIp: text("consent_ip"),
  /** Wordt gezet zodra de dubbele bevestiging bestaat en is aangeklikt. */
  confirmedAt: timestamp("confirmed_at", { mode: "date" }),
  unsubscribedAt: timestamp("unsubscribed_at", { mode: "date" }),
});

/** Afgeleide waarden staan hier zodat de header en het leerpad niet elke
 *  keer alles opnieuw hoeven uit te rekenen. */
export const userStats = pgTable("user_stats", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  xp: integer("xp").notNull().default(0),
  streakCurrent: integer("streak_current").notNull().default(0),
  streakBest: integer("streak_best").notNull().default(0),
  /** Lokale datum "JJJJ-MM-DD" van de laatste afgeronde les. Bewust tekst:
   *  een streak hoort te lopen op de kalenderdag van de gebruiker, niet op UTC. */
  streakLastDate: text("streak_last_date"),
  /** Verdiende badge-id's uit src/lib/badges.ts. */
  badges: text("badges").array().notNull().default([]),
  displayName: text("display_name"),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
/** OUD — de opvolgers zijn PaymentAttempt en Entitlement. */
export type Purchase = typeof purchases.$inferSelect;
export type PaymentAttempt = typeof paymentAttempts.$inferSelect;
export type Entitlement = typeof entitlements.$inferSelect;
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type UserStats = typeof userStats.$inferSelect;
