import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import { auth } from "@/auth";

/** Server component: leest de sessie op de server, dus zonder flikkering
 *  tussen "ingelogd" en "uitgelogd" bij het laden van de pagina. */
export default async function AuthKnop() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Link
        href="/inloggen"
        className="hidden rounded-full px-3.5 py-1.5 text-sm font-semibold text-body transition-colors hover:bg-mist hover:text-ink sm:block"
      >
        Inloggen
      </Link>
    );
  }

  const naam = session.user.name?.split(" ")[0] ?? "Account";

  return (
    <Link
      href="/account"
      title={session.user.email ?? undefined}
      className="flex items-center gap-2 rounded-full border border-lijn bg-white py-1 pl-1 pr-3 text-sm font-bold text-ink transition-shadow hover:shadow-card"
    >
      {session.user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={session.user.image}
          alt=""
          className="h-6 w-6 rounded-full"
          referrerPolicy="no-referrer"
        />
      ) : (
        <CircleUserRound className="h-6 w-6 text-body" />
      )}
      <span className="hidden sm:inline">{naam}</span>
    </Link>
  );
}
