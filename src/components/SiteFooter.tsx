import Link from "next/link";
import Logo from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="no-print mt-20 border-t border-lijn bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm leading-relaxed text-body">
            Eerlijk beleggingsonderwijs, geworteld in de beste boeken ooit
            geschreven over de beurs. Geen beloftes, wel begrip.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">
            Leren
          </h3>
          <ul className="space-y-2 text-sm text-body">
            <li>
              <Link className="hover:text-brand-700" href="/cursussen">
                Alle cursussen
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-brand-700"
                href="/cursussen/beleggen-voor-beginners"
              >
                Gratis beginnerscursus
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-700" href="/leerpad">
                Mijn leerpad
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-700" href="/over-ons">
                Over ons
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">
            Meer
          </h3>
          <ul className="space-y-2 text-sm text-body">
            <li>
              <Link className="hover:text-brand-700" href="/blog">
                Blog
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-700" href="/veelgestelde-vragen">
                Veelgestelde vragen
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-700" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-body">
            Beleggen brengt risico&apos;s met zich mee. Je kunt (een deel van)
            je inleg verliezen. Beleggingscollege geeft onderwijs — geen
            persoonlijk beleggingsadvies.
          </p>
        </div>
      </div>
      <div className="border-t border-lijn py-5 text-center text-xs text-body">
        <div className="mb-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link className="hover:text-brand-700" href="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-brand-700" href="/voorwaarden">
            Algemene voorwaarden
          </Link>
          <Link className="hover:text-brand-700" href="/herroepingsrecht">
            Herroepingsrecht
          </Link>
        </div>
        {/* Het btw-id (NL...B30) is het nummer dat je hoort te publiceren
            (art. 3:15d BW). Het omzetbelastingnummer is een ánder nummer, is
            afgeleid van Jasons BSN en mag hier nooit staan. */}
        © {new Date().getFullYear()} Beleggingscollege (KVK 71856633 · btw
        NL004813328B30) · beleggingscollege.nl
      </div>
    </footer>
  );
}
