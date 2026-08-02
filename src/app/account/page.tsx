import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, LogOut, Mail, ShieldCheck, Trash2 } from "lucide-react";
import { auth, signOut } from "@/auth";
import { gekochteCursussen } from "@/lib/entitlements";
import { getCourse } from "@/content";

export const metadata: Metadata = {
  title: "Mijn account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/inloggen?terug=/account");

  const gekocht = await gekochteCursussen();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-extrabold text-ink">Mijn account</h1>

      <section className="mt-8 rounded-2xl border border-lijn bg-white p-6 shadow-card">
        <h2 className="text-lg font-bold text-ink">Je gegevens</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex flex-wrap gap-x-3">
            <dt className="w-32 shrink-0 font-semibold text-body">Naam</dt>
            <dd className="text-ink">{session.user.name ?? "—"}</dd>
          </div>
          <div className="flex flex-wrap gap-x-3">
            <dt className="w-32 shrink-0 font-semibold text-body">E-mail</dt>
            <dd className="text-ink">{session.user.email ?? "—"}</dd>
          </div>
          <div className="flex flex-wrap gap-x-3">
            <dt className="w-32 shrink-0 font-semibold text-body">Inloggen via</dt>
            <dd className="text-ink">Google</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-body">
          Naam en e-mailadres komen van je Google-account. Wil je die wijzigen,
          dan doe je dat daar; wij nemen het over bij je volgende login.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-lijn bg-white p-6 shadow-card">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
          <BookOpen className="h-5 w-5 text-brand-600" />
          Je cursussen
        </h2>
        {gekocht.length === 0 ? (
          <p className="mt-3 text-sm leading-relaxed text-body">
            Je hebt nog geen cursus gekocht. De{" "}
            <Link
              className="font-semibold text-brand-700 hover:underline"
              href="/cursussen/beleggen-voor-beginners"
            >
              gratis beginnerscursus
            </Link>{" "}
            kun je altijd volgen — daar heb je geen aankoop voor nodig.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {gekocht.map((slug) => {
              const course = getCourse(slug);
              return (
                <li key={slug}>
                  <Link
                    className="flex items-center justify-between rounded-xl border border-lijn px-4 py-3 text-sm font-semibold text-ink hover:bg-mist"
                    href={`/cursussen/${slug}`}
                  >
                    {course?.title ?? slug}
                    <span className="text-xs font-bold text-groen-700">
                      Levenslang toegang
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-lijn bg-white p-6 shadow-card">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
          <ShieldCheck className="h-5 w-5 text-brand-600" />
          Privacy en je gegevens
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-body">
          Je hebt het recht je gegevens in te zien, te corrigeren of te laten
          verwijderen. Stuur daarvoor een mail; we reageren binnen twee
          werkdagen. Verwijderen we je account, dan verdwijnt ook je voortgang —
          aankopen bewaren we alleen zolang de wet ons daartoe verplicht.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="mailto:beheer@beleggingscollege.nl?subject=Verzoek%20over%20mijn%20gegevens"
            className="flex items-center gap-2 rounded-full border border-lijn px-5 py-2 text-sm font-bold text-ink hover:bg-mist"
          >
            <Mail className="h-4 w-4" /> Gegevens opvragen
          </a>
          <a
            href="mailto:beheer@beleggingscollege.nl?subject=Verzoek%20account%20verwijderen"
            className="flex items-center gap-2 rounded-full border border-lijn px-5 py-2 text-sm font-bold text-ink hover:bg-mist"
          >
            <Trash2 className="h-4 w-4" /> Account verwijderen
          </a>
        </div>
      </section>

      <form
        className="mt-8"
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="flex items-center gap-2 rounded-full bg-mist px-5 py-2.5 text-sm font-bold text-ink hover:bg-lijn"
        >
          <LogOut className="h-4 w-4" /> Uitloggen
        </button>
      </form>
    </div>
  );
}
