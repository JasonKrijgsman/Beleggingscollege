import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  BookOpen,
  BookOpenCheck,
  Check,
  Flame,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import {
  activeCourses,
  courseLessonCount,
  courses,
  totalQuizQuestions,
} from "@/content";
import CourseCard from "@/components/CourseCard";
import { LEVELS } from "@/lib/levels";
import {
  COLLEGE_PLUS_VOORDELEN,
  LOSSE_CURSUS_VOORDELEN,
  PRICING,
} from "@/lib/pricing";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const totalLessons = activeCourses.reduce((n, c) => n + courseLessonCount(c), 0);
const totalQuestions = activeCourses.reduce((n, c) => n + totalQuizQuestions(c), 0);

function HeroPreviewCard() {
  return (
    <div className="relative hidden lg:block">
      <div className="anim-float rounded-2xl border border-white/10 bg-white p-5 shadow-pop">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-ink">Jouw leerpad</div>
          <div className="flex items-center gap-1 rounded-full bg-goud-100 px-2.5 py-1 text-xs font-bold text-goud-600">
            <Flame className="h-3.5 w-3.5" /> 6 dagen
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white">
            <Zap className="h-5 w-5" fill="currentColor" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs font-semibold text-body">
              <span>Level: Belegger</span>
              <span>620 XP</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-mist">
              <div className="h-full w-[68%] rounded-full bg-brand-600" />
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {[
            { label: "Rente op rente", done: true },
            { label: "Risico en rendement", done: true },
            { label: "Aandelen, obligaties en meer", done: false },
          ].map((l) => (
            <div
              key={l.label}
              className="flex items-center gap-2.5 rounded-lg border border-lijn px-3 py-2 text-sm font-semibold"
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  l.done ? "bg-groen-600 text-white" : "border-2 border-lijn"
                }`}
              >
                {l.done && <Check className="h-3 w-3" />}
              </span>
              <span className={l.done ? "text-body line-through" : "text-ink"}>
                {l.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="anim-float absolute -bottom-8 -left-10 rounded-2xl border border-white/10 bg-white p-4 shadow-pop [animation-delay:1.2s]">
        <div className="flex items-center gap-2 text-sm font-bold text-ink">
          <Award className="h-5 w-5 text-goud-500" />
          Badge verdiend!
        </div>
        <p className="mt-0.5 text-xs font-semibold text-body">
          Achtste wereldwonder — les over rente op rente afgerond
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-brand-800 text-white">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,340 L150,300 L300,320 L450,240 L600,270 L750,180 L900,210 L1050,110 L1200,60"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
        </svg>
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:py-28">
          <div>
            <span className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-groen-300" />
              Eerlijk beleggingsonderwijs, geen snelle-rijkdom-praatjes
            </span>
            <h1 className="anim-fade-up mt-5 text-4xl font-extrabold leading-tight sm:text-5xl [animation-delay:0.1s]">
              Stap veilig in de wereld van beleggen
            </h1>
            <p className="anim-fade-up mt-4 max-w-xl text-lg leading-relaxed text-white/80 [animation-delay:0.2s]">
              Beleggen hoeft niet ingewikkeld te zijn. Leer het vak zoals de
              meesters het leerden — uit de beste boeken ooit geschreven —
              maar dan interactief: met quizzen, XP, badges en een certificaat
              als kroon op je werk.
            </p>
            <div className="anim-fade-up mt-7 flex flex-wrap gap-3 [animation-delay:0.3s]">
              <Link
                href="/cursussen/beleggen-voor-beginners"
                className="rounded-full bg-groen-600 px-7 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-groen-500"
              >
                Start de gratis cursus
              </Link>
              <Link
                href="/cursussen"
                className="rounded-full border border-white/30 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Bekijk alle cursussen
              </Link>
            </div>
            <div className="anim-fade-up mt-9 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-white/70 [animation-delay:0.4s]">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> {totalLessons} lessen
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> {totalQuestions} quizvragen
              </span>
              <span className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> Certificaat per cursus
              </span>
            </div>
          </div>
          <HeroPreviewCard />
        </div>
      </section>

      {/* Waarom Beleggingscollege */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: BookOpenCheck,
              kleur: "bg-brand-100 text-brand-700",
              titel: "Geworteld in de boeken",
              tekst:
                "Geen goeroe die tegen een camera praat. Elke les is gebouwd op klassiekers van Graham, Bogle, Fisher en meer — met bronvermelding, zodat je verder kunt lezen.",
            },
            {
              icon: ShieldCheck,
              kleur: "bg-groen-100 text-groen-700",
              titel: "Eerlijk over risico",
              tekst:
                "We beloven geen rendementen en verkopen geen dromen. Je leert hoe beleggen écht werkt — inclusief wat er mis kan gaan en wat de wetenschap zegt.",
            },
            {
              icon: Trophy,
              kleur: "bg-goud-100 text-goud-600",
              titel: "Leren dat blijft plakken",
              tekst:
                "Quizzen na elke les, XP en levels, streaks en badges. Saaie theorie wordt een spel dat je wilt uitspelen — en afsluit met een certificaat.",
            },
          ].map((f) => (
            <div
              key={f.titel}
              className="rounded-2xl border border-lijn bg-white p-7 shadow-card"
            >
              <div className={`inline-flex rounded-xl p-3 ${f.kleur}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">{f.titel}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{f.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cursusaanbod */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-ink">Onze cursussen</h2>
            <p className="mt-2 max-w-xl text-body">
              Begin gratis met de basis, groei door naar waardebeleggen en
              technische analyse. Elk kwartaal komt er een cursus bij.
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      </section>

      {/* Gamification / levels */}
      <section className="mt-12 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold text-ink">
                Van Toeschouwer tot Meesterbelegger
              </h2>
              <p className="mt-3 leading-relaxed text-body">
                Elke afgeronde les levert XP op. Elke perfecte quiz een bonus.
                Elke dag dat je terugkomt verlengt je streak. Zo bouw je niet
                alleen kennis op, maar ook bewijs van je discipline — de
                eigenschap die goede beleggers onderscheidt van gelukzoekers.
              </p>
              <ul className="mt-6 space-y-3 text-sm font-semibold text-ink">
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-goud-100 text-goud-600">
                    <Zap className="h-4 w-4" fill="currentColor" />
                  </span>
                  50 XP per les, plus quizbonus tot 25 XP
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-goud-100 text-goud-600">
                    <Flame className="h-4 w-4" />
                  </span>
                  Streaks belonen dagelijkse discipline
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-goud-100 text-goud-600">
                    <Award className="h-4 w-4" />
                  </span>
                  10 badges te verdienen, van &quot;Eerste college&quot; tot
                  &quot;Summa cum laude&quot;
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-lijn bg-mist p-6">
              <div className="text-sm font-bold uppercase tracking-wider text-body">
                De levels
              </div>
              <div className="mt-4 space-y-2">
                {LEVELS.map((lvl, i) => (
                  <div
                    key={lvl.name}
                    className="flex items-center gap-3 rounded-xl bg-white px-4 py-2.5"
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                        i < 2
                          ? "bg-lijn text-body"
                          : i < 5
                            ? "bg-brand-100 text-brand-700"
                            : "bg-goud-100 text-goud-600"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-bold text-ink">
                      {lvl.name}
                    </span>
                    <span className="text-xs font-semibold text-body">
                      {lvl.minXp === 0
                        ? "start"
                        : `${lvl.minXp.toLocaleString("nl-NL")} XP`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* De boekenkast — waar de lessen op gebaseerd zijn */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold text-ink">
          Uit de boekenkast, niet uit een hype
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-body">
          We verzinnen geen methodes. Elke les staat op werk dat zich over
          decennia heeft bewezen — met bronvermelding, zodat je zelf verder kunt
          lezen.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              titel: "The Intelligent Investor",
              auteur: "Benjamin Graham, 1949",
              waarom:
                "De grondlegger van waardebeleggen. Hiervan komt Mr. Market en de veiligheidsmarge — twee ideeën die nog altijd de kern van de cursus vormen.",
            },
            {
              titel: "The Little Book of Common Sense Investing",
              auteur: "John C. Bogle, 2007",
              waarom:
                "Waarom kosten en spreiding meer bepalen dan slim kiezen. Bogle bedacht het indexfonds en hield vol dat saai werkt.",
            },
            {
              titel: "The Psychology of Money",
              auteur: "Morgan Housel, 2020",
              waarom:
                "Beleggen mislukt zelden door rekenwerk en bijna altijd door gedrag. Dit boek legt uit waarom geduld de zeldzaamste vaardigheid is.",
            },
          ].map((b) => (
            <figure
              key={b.titel}
              className="rounded-2xl border border-lijn bg-white p-7 shadow-card"
            >
              <div className="flex h-12 w-9 items-center justify-center rounded-md bg-navy-600 text-white shadow">
                <BookOpen className="h-4 w-4" />
              </div>
              <figcaption className="mt-4">
                <div className="font-bold leading-snug text-ink">{b.titel}</div>
                <div className="mt-0.5 text-xs font-semibold text-body">
                  {b.auteur}
                </div>
              </figcaption>
              <p className="mt-3 text-sm leading-relaxed text-body">
                {b.waarom}
              </p>
            </figure>
          ))}
        </div>
      </section>

      {/* Prijzen */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold text-ink">
          Begin gratis, kies daarna zelf
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-body">
          Eén cursus die je interesseert? Koop hem los en houd hem voor altijd.
          Wil je alles volgen? Dan is College+ al snel voordeliger.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {/* Gratis */}
          <div className="rounded-2xl border border-lijn bg-white p-8 shadow-card">
            <h3 className="text-lg font-bold text-ink">Gratis</h3>
            <div className="mt-2 text-3xl font-extrabold text-ink">€0</div>
            <p className="mt-1 text-sm font-semibold text-body">
              Om te proeven
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-body">
              {[
                "Volledige cursus Beleggen voor Beginners",
                "Quizzen, XP, levels en badges",
                "Certificaat bij afronding",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-groen-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/cursussen/${PRICING.gratisCursusSlug}`}
              className="mt-6 block rounded-full bg-groen-600 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-groen-700"
            >
              Start nu gratis
            </Link>
          </div>

          {/* Losse cursus */}
          <div className="rounded-2xl border border-lijn bg-white p-8 shadow-card">
            <h3 className="text-lg font-bold text-ink">Losse cursus</h3>
            <div className="mt-2 text-3xl font-extrabold text-ink">
              {PRICING.losseCursus}
              <span className="text-sm font-semibold text-body"> eenmalig</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-body">
              Voor één onderwerp
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-body">
              {LOSSE_CURSUS_VOORDELEN.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-navy-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/cursussen"
              className="mt-6 block rounded-full border-2 border-navy-600 py-2.5 text-center text-sm font-bold text-navy-700 transition-colors hover:bg-navy-50"
            >
              Bekijk de cursussen
            </Link>
          </div>

          {/* College+ */}
          <div className="relative rounded-2xl border-2 border-brand-600 bg-white p-8 shadow-pop">
            <span className="absolute -top-3 right-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
              Onze aanbeveling
            </span>
            <h3 className="text-lg font-bold text-ink">College+</h3>
            <div className="mt-2 text-3xl font-extrabold text-ink">
              {PRICING.abonnementMaand}
              <span className="text-sm font-semibold text-body"> / maand</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-body">
              Voor wie doorleert · maandelijks opzegbaar
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-body">
              {COLLEGE_PLUS_VOORDELEN.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 cursor-not-allowed rounded-full bg-mist py-2.5 text-center text-sm font-bold text-body">
              Beschikbaar bij lancering
            </div>
            <p className="mt-3 text-center text-xs text-body">
              Later liever per jaar? Dat kan voor {PRICING.abonnementJaar} —
              omgerekend {PRICING.abonnementJaarPerMaand} per maand.
            </p>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-body">
          Alle bedragen zijn inclusief btw. Een losse cursus houd je voor altijd;
          College+ is maandelijks opzegbaar en geeft toegang zolang je abonnement
          loopt. Stop je? Dan blijven je certificaten van je.
        </p>
      </section>

      {/* Slot-CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-groen-900 via-groen-700 to-groen-600 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-extrabold">
            Weet je niet waar je moet beginnen?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Ervaar onze aanpak met de gratis beginnerscursus. Geen
            verplichtingen, geen account nodig. Alleen waardevolle kennis.
          </p>
          <Link
            href="/cursussen/beleggen-voor-beginners"
            className="mt-7 inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-groen-800 shadow-lg transition-transform hover:scale-105"
          >
            Start de gratis cursus
          </Link>
        </div>
      </section>
    </>
  );
}
