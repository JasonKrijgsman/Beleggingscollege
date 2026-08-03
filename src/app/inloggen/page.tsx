import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, ShieldCheck } from "lucide-react";
import { auth, signIn } from "@/auth";
import { veiligTerugPad } from "@/lib/veilig-pad";

export const metadata: Metadata = {
  title: "Inloggen",
  description:
    "Log in bij Beleggingscollege om je voortgang te bewaren op al je apparaten.",
  robots: { index: false, follow: false },
};

export default async function InloggenPage({
  searchParams,
}: {
  searchParams: Promise<{ terug?: string }>;
}) {
  const session = await auth();
  const { terug } = await searchParams;
  // Alleen een intern pad; al het andere wordt /leerpad (open redirect, CODEX-102).
  const doel = veiligTerugPad(terug);
  if (session?.user) redirect(doel);

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold text-ink">Inloggen</h1>
      <p className="mt-3 leading-relaxed text-body">
        Met een account bewaren we je voortgang, je streak en je certificaten —
        ook als je van telefoon naar laptop wisselt.
      </p>

      <div className="mt-8 rounded-2xl border border-lijn bg-white p-6 shadow-card">
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: doel });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-lijn bg-white px-6 py-3 text-sm font-bold text-ink transition-colors hover:bg-mist"
          >
            {/* Google-logo, officiële kleuren */}
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.14 6.16-4.14Z"
              />
            </svg>
            Doorgaan met Google
          </button>
        </form>

        <ul className="mt-6 space-y-2 text-sm text-body">
          {[
            "Je voortgang volgt je naar elk apparaat",
            "Je streak blijft staan",
            "Je certificaten blijven bewaard",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-groen-600" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-white p-4 text-sm leading-relaxed text-body shadow-card">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
        <span>
          We vragen alleen je naam en e-mailadres, en gebruiken die uitsluitend
          voor je account. Geen nieuwsbrief zonder dat je daar zelf om vraagt.
          Lees de{" "}
          <Link className="underline hover:text-brand-700" href="/privacy">
            privacyverklaring
          </Link>
          .
        </span>
      </div>

      <p className="mt-6 text-center text-sm text-body">
        Liever eerst rondkijken?{" "}
        <Link
          className="font-semibold text-brand-700 hover:underline"
          href="/cursussen/beleggen-voor-beginners"
        >
          De gratis cursus werkt ook zonder account
        </Link>
        .
      </p>
    </div>
  );
}
