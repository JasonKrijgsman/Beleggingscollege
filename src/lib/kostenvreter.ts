// Rekenwerk voor de kosten-vreter (Indexbeleggen & ETF's): vermogensopbouw
// met maandelijkse inleg, waarbij de jaarlijkse kosten van het bruto
// rendement af gaan. Puur, zonder "use client" en zonder @/content-import —
// hier staat niets geheims, dus dit bestand mag veilig in de browserbundel.

/**
 * Vermogensopbouw met maandinleg, netto jaarrendement = bruto − kosten.
 * De inleg wordt aan het einde van elke maand gestort; het resultaat bevat
 * één punt per jaar (index 0 = start, waarde 0).
 */
export function verloop(
  maandinleg: number,
  jaren: number,
  brutoPct: number,
  kostenPct: number
): number[] {
  const netto = (brutoPct - kostenPct) / 100;
  const groeiPerMaand = Math.pow(1 + netto, 1 / 12);
  const punten: number[] = [0];
  let waarde = 0;
  for (let m = 1; m <= jaren * 12; m++) {
    waarde = waarde * groeiPerMaand + maandinleg;
    if (m % 12 === 0) punten.push(waarde);
  }
  return punten;
}
