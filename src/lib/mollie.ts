import "server-only";
import createMollieClient from "@mollie/api-client";

// De API-key staat uitsluitend in omgevingsvariabelen. Test-keys beginnen met
// test_, live-keys met live_ — het verschil bepaalt of er echt geld beweegt.
const key = process.env.MOLLIE_API_KEY;

export const mollieIsGeconfigureerd = Boolean(key);
export const mollieIsTestmodus = Boolean(key?.startsWith("test_"));

let client: ReturnType<typeof createMollieClient> | undefined;

export function mollie() {
  if (!key) {
    throw new Error(
      "MOLLIE_API_KEY ontbreekt. Zet hem in .env.local en in Vercel. " +
        "Zie docs/betalingen-mollie.md."
    );
  }
  if (!client) client = createMollieClient({ apiKey: key });
  return client;
}

/** Prijs in centen omzetten naar het formaat dat Mollie eist: een string met
 *  exact twee decimalen. "49" of 49 wordt geweigerd; het moet "49.00" zijn. */
export function centenNaarBedrag(centen: number): string {
  return (centen / 100).toFixed(2);
}

/** Andersom, voor het controleren van wat er daadwerkelijk betaald is. */
export function bedragNaarCenten(bedrag: string): number {
  return Math.round(parseFloat(bedrag) * 100);
}

/** Versie van de herroepingstekst waarmee de klant akkoord ging. Verhoog dit
 *  zodra de tekst op /herroepingsrecht inhoudelijk wijzigt, zodat we bij een
 *  geschil kunnen aantonen wélke tekst iemand destijds geaccepteerd heeft. */
export const HERROEPING_TEKST_VERSIE = "herroeping-2026-08-v2";
