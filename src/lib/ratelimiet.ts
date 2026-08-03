/**
 * Een piepklein ratelimietje voor de publieke schrijfroutes.
 *
 * Vast venster (fixed window), geteld in het geheugen van dít proces.
 *
 * WEES EERLIJK OVER WAT DIT IS. Op Vercel draait de site in meerdere
 * instanties die komen en gaan; elke instantie telt zijn eigen vensters en een
 * koude start begint weer bij nul. Dit is dus een drempel tegen iemand die één
 * formulier zit te hameren, GEEN garantie tegen een verdeelde aanval. Een echte
 * limiet vraagt gedeelde toestand (database of Redis) en dat is een grotere
 * beslissing dan deze route rechtvaardigt — de databasekant wordt bovendien al
 * beschermd door de eigen regels van elke route (maximaal drie openstaande
 * vragen per gebruiker, één rij per e-mailadres).
 *
 * Bewust zonder afhankelijkheden: een pakket erbij voor vijftien regels is
 * duurder dan de vijftien regels.
 */

/** Harde bovengrens op het aantal gevolgde sleutels. Geheugen van een
 *  serverless-instantie is niet gratis, en een lijst die alleen groeit is een
 *  lek dat je pas merkt als het te laat is.
 *
 *  Alléén verlopen vensters opruimen is hier geen grens maar een wens: wie met
 *  steeds nieuwe sleutels strooit — en bij de nieuwsbriefroute is de sleutel
 *  een IP uit een header — houdt alle vensters lopend, en dan valt er niets te
 *  verlopen. Daarom gooit `dwingGrensAf()` er zo nodig ook lopende vensters
 *  uit. */
export const MAX_SLEUTELS = 5000;

/** Als lopende vensters weg moeten, ruimen we in één keer tot hier terug. Dan
 *  hoeft dat sorteerwerk niet bij élke volgende poging opnieuw. */
const NA_OPRUIMEN = 4500;

type Venster = { /** einde van het venster in ms sinds epoch */ tot: number; aantal: number };

const vensters = new Map<string, Venster>();

export type RatelimietUitslag =
  | { toegestaan: true }
  | { toegestaan: false; naSeconden: number };

/**
 * Telt één poging voor `sleutel` en zegt of die nog binnen de limiet valt.
 *
 * @param sleutel  scheidt de tellers, bijv. `"lesvragen:<userId>"`. Neem het
 *                 routepad mee: anders delen twee routes één emmer.
 * @param max      aantal toegestane pogingen per venster.
 * @param vensterMs lengte van het venster in milliseconden.
 */
export function verbruikPoging(
  sleutel: string,
  max: number,
  vensterMs: number
): RatelimietUitslag {
  const nu = Date.now();
  const lopend = vensters.get(sleutel);

  if (!lopend || nu >= lopend.tot) {
    // Nieuw venster (of het vorige is verlopen): deze poging telt als eerste.
    vensters.set(sleutel, { tot: nu + vensterMs, aantal: 1 });
    if (vensters.size > MAX_SLEUTELS) dwingGrensAf(nu);
    return { toegestaan: true };
  }

  if (lopend.aantal >= max) {
    // Niet ophogen: anders schuift een blijvende hamerpartij het venster nooit
    // dicht en blijft de beller ook na afkoeling geblokkeerd.
    return {
      toegestaan: false,
      naSeconden: Math.max(1, Math.ceil((lopend.tot - nu) / 1000)),
    };
  }

  lopend.aantal += 1;
  return { toegestaan: true };
}

function dwingGrensAf(nu: number): void {
  // Eerst het goedkope en gratis deel: alles wat toch al afgelopen is.
  for (const [sleutel, venster] of vensters) {
    if (nu >= venster.tot) vensters.delete(sleutel);
  }
  if (vensters.size <= MAX_SLEUTELS) return;

  /*
   * Nog steeds vol, dus loopt élk venster nog. Dan is er geen nette keuze meer,
   * alleen een eerlijke: de vensters die het eerst aflopen gaan eruit.
   *
   * Wees precies over wat je hiermee opgeeft. Wie zijn venster kwijtraakt begint
   * bij de volgende poging weer bij nul, dus wie meer dan vijfduizend verschillende
   * sleutels per venster kan verzinnen, kan zichzelf zo een schone lei kopen.
   * Dat is de mindere van de twee kwaden: een teller die je kunt resetten is
   * hinderlijk, een Map die alleen groeit legt de instantie om.
   */
  const opAflooptijd = [...vensters.entries()].sort((a, b) => a[1].tot - b[1].tot);
  const teveel = vensters.size - NA_OPRUIMEN;
  for (let i = 0; i < teveel; i++) vensters.delete(opAflooptijd[i][0]);
}

/** Alleen voor tests: begin met schone tellers. */
export function wisRatelimieten(): void {
  vensters.clear();
}

/** Alleen voor tests: bewijst dat het opruimen daadwerkelijk opruimt. */
export function aantalGevolgdeSleutels(): number {
  return vensters.size;
}
