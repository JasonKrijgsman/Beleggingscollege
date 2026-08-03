import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/db";
import { paymentAttempts } from "@/db/schema";
import { courses, flatLessons, getCourse } from "@/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bedankt voor je aankoop",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return courses.filter((c) => !c.free).map((c) => ({ slug: c.slug }));
}

export default async function GekochtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  // Er kunnen meerdere betaalpogingen naast elkaar bestaan (dubbelklik, een
  // eerdere mislukte poging); de klant komt hier net terug van Mollie, dus de
  // níéuwste poging is de betaling waar deze pagina over gaat.
  let status: string | null = null;
  if (userId) {
    const rijen = await db
      .select({ status: paymentAttempts.status })
      .from(paymentAttempts)
      .where(
        and(
          eq(paymentAttempts.userId, userId),
          eq(paymentAttempts.courseSlug, slug)
        )
      )
      .orderBy(desc(paymentAttempts.createdAt))
      .limit(1);
    status = rijen[0]?.status ?? null;
  }

  const eersteLes = flatLessons(course)[0]?.lesson.slug;

  // Zonder sessie weten we niets over deze betaling. Dan mogen we ook niets
  // beweren — zeker niet dat er niets is afgeschreven, want misschien is er
  // net wél betaald en is alleen de sessie verlopen. Vraag om in te loggen.
  if (!userId) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <Clock className="mx-auto h-14 w-14 text-body" />
        <h1 className="mt-4 text-3xl font-extrabold text-ink">
          Log in om je aankoop te zien
        </h1>
        <p className="mt-3 leading-relaxed text-body">
          Je bent op dit moment niet ingelogd, dus we kunnen hier niet laten
          zien hoe het met je bestelling staat. Log in met hetzelfde account als
          waarmee je de aankoop deed, dan zie je het meteen.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={`/inloggen?terug=/cursussen/${slug}/gekocht`}
            className="rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white hover:bg-brand-700"
          >
            Inloggen
          </Link>
          <Link
            href={`/cursussen/${slug}`}
            className="rounded-full border border-lijn px-6 py-3 text-sm font-bold text-ink hover:bg-mist"
          >
            Terug naar de cursus
          </Link>
        </div>
      </div>
    );
  }

  // De webhook zet 'mismatch' als het betaalde bedrag niet klopt met wat wij
  // hadden vastgelegd. Er is dan wél geld onderweg, dus dit mag nooit in de
  // "niets afgeschreven"-tekst belanden.
  if (status === "mismatch") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <XCircle className="mx-auto h-14 w-14 text-goud-500" />
        <h1 className="mt-4 text-3xl font-extrabold text-ink">
          Er klopt iets niet aan de betaling
        </h1>
        <p className="mt-3 leading-relaxed text-body">
          Het bedrag dat bij ons binnenkwam komt niet overeen met de prijs van{" "}
          <strong className="text-ink">{course.title}</strong>. We hebben de
          cursus daarom nog niet vrijgegeven, en we zoeken dit met de hand uit.
        </p>
        <p className="mt-2 text-sm text-body">
          Mail even naar beheer@beleggingscollege.nl. Is er geld afgeschreven,
          dan krijg je dat terug of zetten we de cursus alsnog open — wat jij
          het liefste hebt.
        </p>
        <Link
          href={`/cursussen/${slug}`}
          className="mt-8 inline-block rounded-full border border-lijn px-6 py-3 text-sm font-bold text-ink hover:bg-mist"
        >
          Terug naar {course.title}
        </Link>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <CheckCircle2 className="mx-auto h-14 w-14 text-groen-600" />
        <h1 className="mt-4 text-3xl font-extrabold text-ink">
          Gelukt — de cursus is van jou
        </h1>
        <p className="mt-3 leading-relaxed text-body">
          Je hebt nu levenslang toegang tot{" "}
          <strong className="text-ink">{course.title}</strong>. Je vindt hem
          voortaan ook terug onder Mijn account.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {eersteLes && (
            <Link
              href={`/cursussen/${slug}/les/${eersteLes}`}
              className="rounded-full bg-groen-600 px-7 py-3 text-sm font-bold text-white hover:bg-groen-700"
            >
              Begin met de eerste les
            </Link>
          )}
          <Link
            href={`/cursussen/${slug}`}
            className="rounded-full border border-lijn px-6 py-3 text-sm font-bold text-ink hover:bg-mist"
          >
            Bekijk het curriculum
          </Link>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <Clock className="mx-auto h-14 w-14 text-goud-500" />
        <h1 className="mt-4 text-3xl font-extrabold text-ink">
          We wachten nog op de bevestiging
        </h1>
        <p className="mt-3 leading-relaxed text-body">
          Je betaling is onderweg. Sommige betaalmethodes hebben even nodig —
          meestal is het binnen een minuut rond. Ververs deze pagina zo nog even.
        </p>
        <p className="mt-2 text-sm text-body">
          Duurt het langer dan een kwartier? Mail dan gerust naar
          beheer@beleggingscollege.nl, dan zoeken we het uit.
        </p>
        <Link
          href={`/cursussen/${slug}/gekocht`}
          className="mt-8 inline-block rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          Opnieuw controleren
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <XCircle className="mx-auto h-14 w-14 text-body" />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">
        De betaling is niet afgerond
      </h1>
      <p className="mt-3 leading-relaxed text-body">
        Er is niets afgeschreven. Je kunt het gewoon opnieuw proberen — of de
        gratis beginnerscursus volgen als je eerst wilt kijken of onze aanpak bij
        je past.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={`/cursussen/${slug}`}
          className="rounded-full bg-navy-600 px-7 py-3 text-sm font-bold text-white hover:bg-navy-700"
        >
          Terug naar {course.title}
        </Link>
        <Link
          href="/cursussen/beleggen-voor-beginners"
          className="rounded-full border border-lijn px-6 py-3 text-sm font-bold text-ink hover:bg-mist"
        >
          Gratis cursus
        </Link>
      </div>
    </div>
  );
}
