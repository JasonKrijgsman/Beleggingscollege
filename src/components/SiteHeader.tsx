"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Zap } from "lucide-react";
import Logo from "./Logo";
import { useProgress } from "@/lib/progress";
import { levelForXp } from "@/lib/levels";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active =
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? "bg-brand-50 text-brand-700"
          : "text-body hover:text-ink hover:bg-mist"
      }`}
    >
      {label}
    </Link>
  );
}

export default function SiteHeader() {
  const { state, ready } = useProgress();
  const { level, next, progress } = levelForXp(state.xp);
  const hasStreak = ready && state.streak.current > 0;

  return (
    <header className="no-print sticky top-0 z-40 border-b border-lijn bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 sm:flex">
          <NavLink href="/cursussen" label="Cursussen" />
          <NavLink href="/leerpad" label="Mijn leerpad" />
        </nav>
        <div className="flex items-center gap-2.5">
          {hasStreak && (
            <div
              className="flex items-center gap-1 rounded-full bg-goud-100 px-2.5 py-1 text-sm font-bold text-goud-600"
              title={`${state.streak.current} dag(en) op rij geleerd`}
            >
              <Flame className="anim-flame h-4 w-4" />
              {state.streak.current}
            </div>
          )}
          {ready && state.xp > 0 ? (
            <Link
              href="/leerpad"
              className="group flex items-center gap-2 rounded-full border border-lijn bg-white py-1 pl-2.5 pr-3 shadow-sm transition-shadow hover:shadow-card"
              title={`${level.name} — ${state.xp} XP${next ? `, nog ${next.minXp - state.xp} XP tot ${next.name}` : ""}`}
            >
              <Zap className="h-4 w-4 text-goud-500" fill="currentColor" />
              <div className="leading-tight">
                <div className="text-xs font-bold text-ink">
                  {state.xp.toLocaleString("nl-NL")} XP
                </div>
                <div className="mt-0.5 h-1 w-16 overflow-hidden rounded-full bg-lijn">
                  <div
                    className="h-full rounded-full bg-brand-600 transition-all duration-700"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
              </div>
            </Link>
          ) : (
            <Link
              href="/cursussen/beleggen-voor-beginners"
              className="rounded-full bg-groen-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-groen-700"
            >
              Start gratis
            </Link>
          )}
          <nav className="flex items-center gap-1 sm:hidden">
            <NavLink href="/cursussen" label="Cursussen" />
            <NavLink href="/leerpad" label="Leerpad" />
          </nav>
        </div>
      </div>
    </header>
  );
}
