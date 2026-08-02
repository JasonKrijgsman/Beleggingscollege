// Blogartikelen.
//
// EEN ARTIKEL TOEVOEGEN: kopieer een blok hieronder, pas het aan en zet het
// bovenaan de lijst (nieuwste eerst). Meer is niet nodig — de overzichtspagina,
// de artikelpagina, de sitemap en de SEO-tags gaan vanzelf mee.
//
// Regels:
// - `slug` wordt de URL: /blog/<slug>. Kies hem goed en wijzig hem daarna NOOIT
//   zonder redirect in next.config.ts (zie de SEO-huisregels in CLAUDE.md).
// - `date` in formaat "JJJJ-MM-DD".
// - `body` is een lijst blokken. Zie de types hieronder voor wat er kan.

export type BlogBlock =
  | { type: "alinea"; text: string }
  | { type: "kop"; text: string }
  | { type: "lijst"; items: string[] }
  | { type: "citaat"; text: string; bron: string }
  | { type: "kader"; titel: string; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  /** Korte samenvatting: gebruikt op het overzicht én als meta description. */
  excerpt: string;
  date: string;
  /** Leestijd in minuten. */
  readingMin: number;
  tag: string;
  body: BlogBlock[];
};

export const posts: BlogPost[] = [
  {
    slug: "waarom-we-geen-koerstips-geven",
    title: "Waarom je hier geen koerstips vindt",
    excerpt:
      "Tips voelen als een kortere weg, maar ze maken je afhankelijk in plaats van zelfstandig. Een uitleg van wat we wél doen, en waarom dat op de lange termijn meer oplevert.",
    date: "2026-08-03",
    readingMin: 4,
    tag: "Onze aanpak",
    body: [
      {
        type: "alinea",
        text: "Als je begint met beleggen, is de verleiding groot om te zoeken naar iemand die je vertelt wat je moet kopen. Het internet staat er vol mee: lijstjes met aandelen die 'klaar zijn om te exploderen', video's over de ene kans die je niet mag missen, appgroepen waar tips rondgaan. Wij doen daar niet aan mee. Niet omdat we het niet zouden kunnen, maar omdat het je niet verder helpt.",
      },
      { type: "kop", text: "Een tip lost precies één keer iets op" },
      {
        type: "alinea",
        text: "Stel dat iemand je een goede tip geeft en je verdient er geld mee. Wat heb je dan geleerd? Dat die persoon het die keer bij het rechte eind had. De volgende keer sta je weer met lege handen en moet je opnieuw op iemand anders vertrouwen. Kennis werkt andersom: als je begrijpt waaróm een bedrijf waardevol is, kun je die redenering de rest van je leven op elk bedrijf loslaten.",
      },
      {
        type: "citaat",
        text: "Geef een man een vis en hij eet één dag. Leer hem vissen en hij eet zijn leven lang.",
        bron: "Spreekwoord dat toevallig ook over beleggen gaat",
      },
      { type: "kop", text: "Wie tips geeft, verdient aan jouw ongeduld" },
      {
        type: "alinea",
        text: "Het is nuttig om je af te vragen hoe iemand die tips uitdeelt zijn geld verdient. Vaak niet aan de tips zelf, maar aan de abonnementen, de cursussen of de aandacht eromheen. Dat verdienmodel werkt het best als je ongeduldig blijft en blijft terugkomen. Onderwijs heeft een ongemakkelijker verdienmodel: als het goed werkt, heb je ons op een gegeven moment niet meer nodig.",
      },
      {
        type: "kader",
        titel: "En de wet dan?",
        text: "Er is ook een nuchtere juridische kant. Wie persoonlijk beleggingsadvies geeft, heeft in Nederland een vergunning van de AFM nodig en moet jouw financiële situatie kennen. Wij zijn opleider, geen adviseur. Alles wat je hier leest is educatief bedoeld.",
      },
      { type: "kop", text: "Wat we in plaats daarvan doen" },
      {
        type: "lijst",
        items: [
          "We leggen uit hoe iets werkt, met een rekenvoorbeeld erbij, zodat je het zelf kunt narekenen.",
          "We vertellen erbij wanneer een methode níét werkt. Elke aanpak heeft grenzen.",
          "We verwijzen naar de boeken waar het idee vandaan komt, zodat je verder kunt lezen bij de bron.",
          "We beloven geen rendement. Niemand kan dat, en wie het wel doet verkoopt je iets.",
        ],
      },
      {
        type: "alinea",
        text: "Dat is een langzamere weg. Maar het is de enige die ertoe leidt dat je over tien jaar je eigen beslissingen kunt onderbouwen, ook als er niemand meesluistert.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Nieuwste eerst. */
export function sortedPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
