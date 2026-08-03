// Rekenwerk voor de paniek-simulator (Beleggingspsychologie): de
// deterministische leerreeks en de waarde van de pot, door verkopen en weer
// instappen heen. Pure functies zonder "use client" en zonder
// @/content-import — hier staat niets geheims (leerreeksen, geen
// cursusinhoud), dus dit bestand mag veilig in de browserbundel.

export const INLEG = 10_000;

export type PaniekActie = {
  maand: number;
  type: "verkoop" | "instap";
  stand: number; // indexstand op het moment van de actie, voor de grafiek
};

/** Wat de reeksgenerator nodig heeft; de scenario's in de tool voldoen hieraan. */
export type ReeksSpec = {
  seed: number;
  /** [maandindex, indexstand] — tussenliggende maanden worden vloeiend ingevuld */
  waypoints: [number, number][];
};

/* Zelfde deterministische generator als in SteunWeerstandTool. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministische koersreeks: waypoints vloeiend verbonden, met vaste ruis ertussen. */
export function maakReeks({ seed, waypoints }: ReeksSpec): number[] {
  const willekeur = mulberry32(seed);
  const laatste = waypoints[waypoints.length - 1][0];
  const reeks: number[] = [];
  for (let m = 0; m <= laatste; m++) {
    // Vind het omliggende waypoint-paar.
    let i = 0;
    while (waypoints[i + 1][0] < m) i++;
    const [m0, v0] = waypoints[i];
    const [m1, v1] = waypoints[i + 1];
    const t = m1 === m0 ? 0 : (m - m0) / (m1 - m0);
    const glad = t * t * (3 - 2 * t);
    const basis = v0 + (v1 - v0) * glad;
    const ruis = m === 0 || m === laatste ? 0 : (willekeur() - 0.5) * 2.4;
    reeks.push(Math.max(5, basis + ruis));
  }
  return reeks;
}

/**
 * Waarde van de pot tot en met `totMaand`: door de reeks lopen en bij elke
 * actie wisselen tussen "beweegt mee" en "staat stil in cash". Een actie in
 * maand m telt vanaf de beweging naar maand m+1 — je verkoopt of koopt
 * immers op de stand van maand m zelf.
 *
 * In één (gepauzeerde) maand kunnen meerdere acties vallen: verkopen én
 * meteen weer instappen. Ze tellen allemaal mee, in volgorde — de laatste
 * bepaalt of je de maand erna in de markt zit. (De oude versie pakte alleen
 * de éérste actie per maand, waardoor wie verkocht en weer instapte in de
 * berekening voorgoed aan de zijlijn bleef staan.)
 */
export function berekenWaarde(
  reeks: number[],
  acties: PaniekActie[],
  totMaand: number,
  inleg = INLEG
): number {
  let waarde = inleg;
  let inMarkt = true;
  for (let m = 0; m <= totMaand; m++) {
    if (m > 0 && inMarkt) waarde *= reeks[m] / reeks[m - 1];
    for (const actie of acties) {
      if (actie.maand === m) inMarkt = actie.type === "instap";
    }
  }
  return waarde;
}

/**
 * De typische paniekverkoper: verkoopt zodra de stand 25% onder de start
 * zakt en stapt pas weer in nadat de markt 30% van de bodem is opgeveerd.
 */
export function paniekverkoperWaarde(reeks: number[], inleg = INLEG): number {
  let waarde = inleg;
  let inMarkt = true;
  let bodem = reeks[0];
  for (let m = 1; m < reeks.length; m++) {
    if (inMarkt) waarde *= reeks[m] / reeks[m - 1];
    bodem = Math.min(bodem, reeks[m]);
    if (inMarkt && reeks[m] <= reeks[0] * 0.75) inMarkt = false;
    else if (!inMarkt && reeks[m] >= bodem * 1.3) inMarkt = true;
  }
  return waarde;
}
