// Optierekenkunde voor de interactieve lestools: Black-Scholes, Greeks en
// uitbetaling op expiratie. Pure functies zonder "use client" en zonder
// @/content-import — hier staat niets geheims (formules, geen cursusinhoud),
// dus dit bestand mag veilig in de browserbundel.
//
// Conventies, gekozen voor leesbaarheid in de lessen:
// - Alle prijzen zijn per onderliggend aandeel; de UI vermenigvuldigt met de
//   contractgrootte 100 waar dat didactisch relevant is (de "×100-schrik").
// - Looptijd gaat in kalenderdagen (dagen / 365 jaar).
// - De rente staat standaard op 0: de rentevoet verandert niets aan de
//   inzichten die de tools onderwijzen en elke extra knop is ruis.
// - theta is per dag, vega per procentpunt IV — de eenheden waarin een
//   cursist denkt, niet de academische jaarconventies.

export type OptieType = "call" | "put";
export type Richting = "koop" | "schrijf";

export type OptieBeen = {
  type: OptieType;
  richting: Richting;
  strike: number;
  premie: number; // betaald (koop) of ontvangen (schrijf), per aandeel
  aantal?: number; // aantal contracten, standaard 1
};

/** Standaardnormale verdelingsfunctie (Abramowitz & Stegun 26.2.17, |fout| < 7,5e-8). */
export function normCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327 * Math.exp((-x * x) / 2);
  const p =
    d *
    t *
    (0.319381530 +
      t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x >= 0 ? 1 - p : p;
}

function normPdf(x: number): number {
  return 0.3989422804014327 * Math.exp((-x * x) / 2);
}

export type BsInvoer = {
  type: OptieType;
  spot: number; // koers onderliggende waarde
  strike: number; // uitoefenprijs
  dagen: number; // resterende looptijd in kalenderdagen
  iv: number; // implied volatility als fractie, bijv. 0.22
  rente?: number; // risicovrije rente als fractie, standaard 0
};

/** Intrinsieke waarde: wat uitoefenen nú zou opleveren (nooit negatief). */
export function intrinsiekeWaarde(type: OptieType, spot: number, strike: number): number {
  return Math.max(0, type === "call" ? spot - strike : strike - spot);
}

function d1d2({ spot, strike, dagen, iv, rente = 0 }: BsInvoer) {
  const t = dagen / 365;
  const d1 =
    (Math.log(spot / strike) + (rente + (iv * iv) / 2) * t) / (iv * Math.sqrt(t));
  return { t, d1, d2: d1 - iv * Math.sqrt(t) };
}

/** Theoretische optiepremie volgens Black-Scholes, per aandeel. */
export function bsPrijs(invoer: BsInvoer): number {
  const { type, spot, strike, dagen, iv, rente = 0 } = invoer;
  if (dagen <= 0 || iv <= 0) return intrinsiekeWaarde(type, spot, strike);
  const { t, d1, d2 } = d1d2(invoer);
  const disc = Math.exp(-rente * t);
  return type === "call"
    ? spot * normCdf(d1) - strike * disc * normCdf(d2)
    : strike * disc * normCdf(-d2) - spot * normCdf(-d1);
}

export type Greeks = {
  delta: number; // prijsverandering per €1 koersbeweging
  gamma: number; // verandering van delta per €1 koersbeweging
  vega: number; // prijsverandering per procentpunt IV
  theta: number; // prijsverandering per verstreken dag (vrijwel altijd negatief voor de koper)
};

/** De vier Grieken uit de cursussen, in per-dag/per-procentpunt-eenheden. */
export function bsGreeks(invoer: BsInvoer): Greeks {
  const { type, spot, strike, dagen, iv, rente = 0 } = invoer;
  if (dagen <= 0 || iv <= 0) {
    const itm = intrinsiekeWaarde(type, spot, strike) > 0;
    return { delta: itm ? (type === "call" ? 1 : -1) : 0, gamma: 0, vega: 0, theta: 0 };
  }
  const { t, d1, d2 } = d1d2(invoer);
  const disc = Math.exp(-rente * t);
  const delta = type === "call" ? normCdf(d1) : normCdf(d1) - 1;
  const gamma = normPdf(d1) / (spot * iv * Math.sqrt(t));
  const vega = (spot * normPdf(d1) * Math.sqrt(t)) / 100;
  const thetaJaar =
    -(spot * normPdf(d1) * iv) / (2 * Math.sqrt(t)) -
    (type === "call"
      ? rente * strike * disc * normCdf(d2)
      : -rente * strike * disc * normCdf(-d2));
  return { delta, gamma, vega, theta: thetaJaar / 365 };
}

/**
 * Winst of verlies van één positie op expiratie, per aandeel.
 * Koper: uitbetaling minus betaalde premie. Schrijver: het spiegelbeeld.
 */
export function payoffOpExpiratie(been: OptieBeen, eindkoers: number): number {
  const uitbetaling = intrinsiekeWaarde(been.type, eindkoers, been.strike);
  const perAandeel =
    been.richting === "koop" ? uitbetaling - been.premie : been.premie - uitbetaling;
  return perAandeel * (been.aantal ?? 1);
}

/** Gecombineerde winst/verlies van meerdere poten (en optioneel 100 aandelen). */
export function payoffCombinatie(
  benen: OptieBeen[],
  eindkoers: number,
  aandelen?: { aantal: number; koopprijs: number }
): number {
  let som = benen.reduce((n, been) => n + payoffOpExpiratie(been, eindkoers), 0);
  if (aandelen) som += ((eindkoers - aandelen.koopprijs) * aandelen.aantal) / 100;
  return som;
}

/** Break-evenpunten van een combinatie, gezocht op een koersgrid (tekenwissels). */
export function breakEvens(
  benen: OptieBeen[],
  van: number,
  tot: number,
  aandelen?: { aantal: number; koopprijs: number },
  stappen = 800
): number[] {
  const punten: number[] = [];
  let vorige = payoffCombinatie(benen, van, aandelen);
  for (let i = 1; i <= stappen; i++) {
    const koers = van + ((tot - van) * i) / stappen;
    const nu = payoffCombinatie(benen, koers, aandelen);
    if ((vorige < 0 && nu >= 0) || (vorige > 0 && nu <= 0)) {
      // Lineair interpoleren binnen de stap voor een strakke waarde.
      const vorigeKoers = van + ((tot - van) * (i - 1)) / stappen;
      const frac = vorige === nu ? 0 : vorige / (vorige - nu);
      punten.push(vorigeKoers + (koers - vorigeKoers) * frac);
    }
    vorige = nu;
  }
  return punten;
}
