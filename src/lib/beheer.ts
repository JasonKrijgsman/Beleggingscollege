import "server-only";
import { auth } from "@/auth";

/**
 * Wie mag modereren? Er is geen rollenkolom in de database; het beheer is
 * één persoon en dat blijft voorlopig zo. De omgevingsvariabele
 * BEHEER_EMAILS (kommagescheiden) bepaalt wie beheerder is.
 *
 * Ontbreekt de variabele, dan is NIEMAND beheerder — de veilige kant.
 * Krijgt de zaak ooit een tweede paar handen, dan is dít het bestand dat
 * plaatsmaakt voor echte rollen in de database.
 */
export async function isBeheerder(): Promise<boolean> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email) return false;
  const lijst = (process.env.BEHEER_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return lijst.includes(email);
}
