import "server-only";
import type { Session } from "next-auth";
import { auth } from "@/auth";

/**
 * Bepaalt of de HUIDIGE bezoeker beheerder is — de enige poort voor alles
 * onder /beheer, zoals heeftToegangTot() dat is voor betaalde cursussen.
 *
 * Er is geen rollenkolom in de database; het beheer is één persoon en dat
 * blijft voorlopig zo. De omgevingsvariabele ADMIN_EMAILS (kommagescheiden
 * e-mailadressen, hoofdletterongevoelig) bepaalt wie beheerder is.
 * Ontbreekt de variabele of is hij leeg, dan is NIEMAND beheerder — de
 * veilige kant. Krijgt de zaak ooit een tweede paar handen, dan is dít het
 * bestand dat plaatsmaakt voor echte rollen in de database.
 *
 * Geeft de sessie terug (handig voor "ingelogd als" en straks voor een
 * audittrail bij beheeracties), of null voor iedereen die geen beheerder is.
 */
export async function beheerSessie(): Promise<Session | null> {
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email) return null;

  // BEHEER_EMAILS was de naam in de eerste iteratie (/beheer/vragen) en
  // blijft als terugval werken, zodat een omgeving die al is ingesteld
  // zichzelf niet stil buitensluit.
  const lijst = (process.env.ADMIN_EMAILS ?? process.env.BEHEER_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return lijst.includes(email) ? session : null;
}

/** Dun laagje over beheerSessie(), zodat er maar één poort is. */
export async function isBeheerder(): Promise<boolean> {
  return (await beheerSessie()) !== null;
}
