import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, desc, eq, ilike, inArray, isNull, lt, or } from "drizzle-orm";
import { auth } from "@/auth";
import { beheerSessie } from "@/lib/beheer";
import { db } from "@/db";
import { purchases, users } from "@/db/schema";
import { getCourse } from "@/content";

// Dit scherm toont klantgegevens en moet dus per verzoek renderen, met een
// verse sessie. Nooit vooraf bouwen of cachen.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beheer",
  robots: { index: false, follow: false },
};

/* ------------------------------------------------------------------ */

const datumTijd = new Intl.DateTimeFormat("nl-NL", {
  dateStyle: "medium",
  timeStyle: "short",
  // De server draait op UTC; de administratie leeft in Nederlandse tijd.
  timeZone: "Europe/Amsterdam",
});

function bedrag(cents: number, currency: string): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

/** % en _ zijn jokers in LIKE; de zoekterm is letterlijk bedoeld. */
function escapeLike(term: string): string {
  return term.replace(/[\\%_]/g, (t) => `\\${t}`);
}

function cursusTitel(slug: string): string {
  return getCourse(slug)?.title ?? slug;
}

type AankoopRij = {
  id: string;
  createdAt: Date;
  status: string;
  amountCents: number;
  currency: string;
  molliePaymentId: string;
  orderNumber: string | null;
  confirmationSentAt: Date | null;
  courseSlug: string;
  email: string | null;
};

const STATUS_STIJL: Record<string, string> = {
  paid: "bg-groen-100 text-groen-800",
  pending: "bg-goud-100 text-goud-600",
  mismatch: "bg-red-50 text-red-700",
  refunded: "bg-navy-100 text-navy-700",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
        STATUS_STIJL[status] ?? "bg-mist text-body"
      }`}
    >
      {status}
    </span>
  );
}

function AandachtBlok({
  titel,
  uitleg,
  rijen,
  kader,
}: {
  titel: string;
  uitleg: string;
  rijen: AankoopRij[];
  kader: string;
}) {
  if (rijen.length === 0) return null;
  return (
    <div className={`rounded-2xl border p-5 ${kader}`}>
      <h3 className="text-sm font-bold text-ink">
        {titel}{" "}
        <span className="font-semibold text-body">({rijen.length})</span>
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-body">{uitleg}</p>
      <ul className="mt-3 space-y-2">
        {rijen.map((r) => (
          <li
            key={r.id}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm"
          >
            <span className="whitespace-nowrap text-body">
              {datumTijd.format(r.createdAt)}
            </span>
            <span className="font-semibold text-ink">{r.email ?? "—"}</span>
            <span className="text-body">{cursusTitel(r.courseSlug)}</span>
            <span className="whitespace-nowrap text-ink">
              {bedrag(r.amountCents, r.currency)}
            </span>
            <span className="font-mono text-xs text-body">
              {r.molliePaymentId}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default async function BeheerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Zelfde patroon als /account: uitgelogd netjes naar het inlogscherm.
  // Ingelogd maar geen beheerder: 404, zodat de pagina niet eens lijkt te
  // bestaan. beheerSessie() is de enige poort — geen tweede check elders.
  const session = await auth();
  if (!session?.user) redirect("/inloggen?terug=/beheer");
  if (!(await beheerSessie())) notFound();

  const { q } = await searchParams;
  const zoek = (q ?? "").trim();
  const patroon = `%${escapeLike(zoek)}%`;

  const aankoopSelect = {
    id: purchases.id,
    createdAt: purchases.createdAt,
    status: purchases.status,
    amountCents: purchases.amountCents,
    currency: purchases.currency,
    molliePaymentId: purchases.molliePaymentId,
    orderNumber: purchases.orderNumber,
    confirmationSentAt: purchases.confirmationSentAt,
    courseSlug: purchases.courseSlug,
    email: users.email,
  };

  const eenUurGeleden = new Date(Date.now() - 60 * 60 * 1000);

  const [aandacht, aankopen, klanten] = await Promise.all([
    // Alles wat menselijke aandacht vraagt, ongefilterd — een zoekopdracht
    // mag een mismatch niet uit beeld duwen.
    db
      .select(aankoopSelect)
      .from(purchases)
      .innerJoin(users, eq(purchases.userId, users.id))
      .where(
        or(
          eq(purchases.status, "mismatch"),
          and(
            eq(purchases.status, "pending"),
            lt(purchases.createdAt, eenUurGeleden)
          ),
          and(
            eq(purchases.status, "paid"),
            isNull(purchases.confirmationSentAt)
          )
        )
      )
      .orderBy(desc(purchases.createdAt)),

    db
      .select(aankoopSelect)
      .from(purchases)
      .innerJoin(users, eq(purchases.userId, users.id))
      .where(
        zoek
          ? or(
              ilike(users.email, patroon),
              eq(purchases.molliePaymentId, zoek)
            )
          : undefined
      )
      .orderBy(desc(purchases.createdAt))
      .limit(50),

    // De Auth.js-tabel heeft geen createdAt, dus "nieuwste eerst" bestaat
    // hier niet; alfabetisch op e-mail is het bruikbaarste dat er wél is.
    db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(zoek ? ilike(users.email, patroon) : undefined)
      .orderBy(users.email)
      .limit(50),
  ]);

  const mismatches = aandacht.filter((a) => a.status === "mismatch");
  const hangend = aandacht.filter((a) => a.status === "pending");
  const zonderBevestiging = aandacht.filter((a) => a.status === "paid");
  const nietsAanDeHand = aandacht.length === 0;

  // Aankopen van de getoonde klanten, in één keer, daarna in JS gegroepeerd.
  const klantAankopen =
    klanten.length > 0
      ? await db
          .select({
            userId: purchases.userId,
            courseSlug: purchases.courseSlug,
            status: purchases.status,
          })
          .from(purchases)
          .where(
            inArray(
              purchases.userId,
              klanten.map((k) => k.id)
            )
          )
      : [];

  const perKlant = new Map<string, { totaal: number; paid: string[] }>();
  for (const a of klantAankopen) {
    const rij = perKlant.get(a.userId) ?? { totaal: 0, paid: [] };
    rij.totaal += 1;
    if (a.status === "paid") rij.paid.push(a.courseSlug);
    perKlant.set(a.userId, rij);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-extrabold text-ink">Beheer</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-body">
        Alleen-lezen overzicht van klanten en aankopen. Acties — mail opnieuw
        sturen, toegang intrekken, een terugbetaling vastleggen — bestaan hier
        bewust nog niet; zie docs/openstaand.md. Ingelogd als{" "}
        <span className="font-semibold text-ink">{session.user.email}</span>.
      </p>
      <p className="mt-3 text-sm">
        <Link
          href="/beheer/vragen"
          className="font-semibold text-brand-700 hover:underline"
        >
          Lesvragen modereren →
        </Link>
      </p>

      <form method="get" className="mt-6 flex flex-wrap items-center gap-3">
        <label htmlFor="q" className="sr-only">
          Zoek op e-mailadres of Mollie-id
        </label>
        <input
          id="q"
          type="search"
          name="q"
          defaultValue={zoek}
          placeholder="E-mailadres of Mollie-id (tr_…)"
          className="w-full max-w-sm rounded-full border border-lijn bg-white px-4 py-2 text-sm text-ink shadow-card outline-none placeholder:text-body/60 focus:border-brand-400"
        />
        <button
          type="submit"
          className="rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700"
        >
          Zoeken
        </button>
        {zoek && (
          <Link
            href="/beheer"
            className="text-sm font-semibold text-brand-700 hover:underline"
          >
            Wis zoekopdracht
          </Link>
        )}
      </form>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">Vraagt aandacht</h2>
        {nietsAanDeHand ? (
          <p className="mt-3 rounded-2xl border border-lijn bg-white p-5 text-sm text-body shadow-card">
            Niets aan de hand: geen mismatches, geen betalingen die blijven
            hangen en geen onverstuurde bevestigingen.
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            <AandachtBlok
              titel="Bedrag klopt niet (mismatch)"
              uitleg="Het binnengekomen bedrag wijkt af van wat wij hadden vastgelegd. Er is wél geld onderweg en de cursus is niet vrijgegeven — zoek dit met de hand uit in het Mollie-dashboard (zie docs/betalingen-mollie.md)."
              rijen={mismatches}
              kader="border-red-200 bg-red-50"
            />
            <AandachtBlok
              titel="Langer dan een uur pending"
              uitleg="Meestal een afgebroken checkout die Mollie vanzelf laat verlopen. Blijft een betaling dagen staan, controleer dan de status in het Mollie-dashboard."
              rijen={hangend}
              kader="border-goud-200 bg-goud-100/40"
            />
            <AandachtBlok
              titel="Betaald, bevestiging nog niet gemaild"
              uitleg="Dit is verwacht: het versturen van mail staat bewust nog uit (zie docs/e-mail-versturen.md). Zodra verzenden aanstaat hoort deze lijst leeg te lopen."
              rijen={zonderBevestiging}
              kader="border-lijn bg-white"
            />
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">Aankopen</h2>
        <p className="mt-1 text-xs text-body">
          {zoek
            ? `Gefilterd op “${zoek}” (e-mailadres bevat de term, of het Mollie-id is exact gelijk).`
            : "De laatste 50, nieuwste eerst."}
        </p>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-lijn bg-white shadow-card">
          <table className="w-full min-w-[64rem] text-left text-sm">
            <thead>
              <tr className="border-b border-lijn text-xs uppercase tracking-wide text-body">
                <th className="px-4 py-3 font-semibold">Datum</th>
                <th className="px-4 py-3 font-semibold">Koper</th>
                <th className="px-4 py-3 font-semibold">Cursus</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Bedrag</th>
                <th className="px-4 py-3 font-semibold">Mollie-id</th>
                <th className="px-4 py-3 font-semibold">Ordernr.</th>
                <th className="px-4 py-3 font-semibold">Bevestiging</th>
              </tr>
            </thead>
            <tbody>
              {aankopen.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-body">
                    {zoek
                      ? `Geen aankopen gevonden voor “${zoek}”.`
                      : "Nog geen aankopen."}
                  </td>
                </tr>
              ) : (
                aankopen.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-lijn align-top last:border-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-body">
                      {datumTijd.format(a.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-ink">{a.email ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-ink">
                        {cursusTitel(a.courseSlug)}
                      </span>
                      <span className="block text-xs text-body">
                        {a.courseSlug}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-ink">
                      {bedrag(a.amountCents, a.currency)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-body">
                      {a.molliePaymentId}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-body">
                      {a.orderNumber ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-body">
                      {a.confirmationSentAt
                        ? datumTijd.format(a.confirmationSentAt)
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">Klanten</h2>
        <p className="mt-1 text-xs text-body">
          {zoek
            ? `Gefilterd op “${zoek}” in het e-mailadres.`
            : "Maximaal 50, alfabetisch op e-mailadres — de accounttabel kent geen aanmaakdatum."}
        </p>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-lijn bg-white shadow-card">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-lijn text-xs uppercase tracking-wide text-body">
                <th className="px-4 py-3 font-semibold">Naam</th>
                <th className="px-4 py-3 font-semibold">E-mail</th>
                <th className="px-4 py-3 text-right font-semibold">Aankopen</th>
                <th className="px-4 py-3 font-semibold">Toegang tot</th>
              </tr>
            </thead>
            <tbody>
              {klanten.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-body">
                    {zoek
                      ? `Geen klanten gevonden voor “${zoek}”.`
                      : "Nog geen klanten."}
                  </td>
                </tr>
              ) : (
                klanten.map((k) => {
                  const rij = perKlant.get(k.id);
                  return (
                    <tr
                      key={k.id}
                      className="border-b border-lijn align-top last:border-0"
                    >
                      <td className="px-4 py-3 text-ink">{k.name ?? "—"}</td>
                      <td className="px-4 py-3 text-ink">{k.email ?? "—"}</td>
                      <td className="px-4 py-3 text-right text-body">
                        {rij?.totaal ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        {rij && rij.paid.length > 0 ? (
                          <ul className="space-y-0.5">
                            {rij.paid.map((slug) => (
                              <li key={slug} className="text-ink">
                                {cursusTitel(slug)}{" "}
                                <span className="text-xs text-body">
                                  ({slug})
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-body">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
