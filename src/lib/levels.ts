export type Level = { name: string; minXp: number };

// Nederlandse niveaus: van toeschouwer tot meesterbelegger.
export const LEVELS: Level[] = [
  { name: "Toeschouwer", minXp: 0 },
  { name: "Spaarder", minXp: 100 },
  { name: "Starter", minXp: 250 },
  { name: "Belegger", minXp: 450 },
  { name: "Analist", minXp: 700 },
  { name: "Strateeg", minXp: 1000 },
  { name: "Portefeuillebouwer", minXp: 1400 },
  { name: "Meesterbelegger", minXp: 1900 },
];

export function levelForXp(xp: number) {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) index = i;
  }
  const level = LEVELS[index];
  const next = index + 1 < LEVELS.length ? LEVELS[index + 1] : null;
  const progress = next
    ? Math.min(1, (xp - level.minXp) / (next.minXp - level.minXp))
    : 1;
  return { level, index, next, progress };
}
