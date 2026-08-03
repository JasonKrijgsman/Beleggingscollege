// Contentschema voor Beleggingscollege-cursussen.
// Alle teksten zijn Nederlands (je/jij-vorm), tenzij het om vakjargon gaat.

export type QuizQuestion = {
  question: string;
  options: string[]; // precies 4 antwoordopties
  correctIndex: number; // index in options van het juiste antwoord
  explanation: string; // waarom dit antwoord klopt (getoond na beantwoorden)
};

export type LessonSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  example?: { title: string; body: string }; // uitgelicht (reken)voorbeeld
};

export type BookRef = {
  title: string;
  author: string;
  year?: number;
  note: string; // waarom dit boek relevant is voor deze les (1-2 zinnen)
};

export type LessonTool =
  | "rente-op-rente" // rekenmachine samengestelde groei (gratis cursus)
  | "intrinsieke-waarde" // waardering + veiligheidsmarge (Waardebeleggen)
  | "steun-weerstand" // niveaus intekenen op een grafiek (Technische Analyse)
  | "optie-uitbetaling" // uitbetalingsdiagram van één positie (Opties Begrijpen)
  | "optie-keten" // oefen-optieketen als brokerscherm (Opties Begrijpen)
  | "optie-tijdswaarde" // intrinsieke waarde vs. tijdswaarde (Opties Begrijpen)
  | "optie-strategiebouwer" // poten combineren tot spreads (Beschermen & Verdienen, Volatiliteit & Spreads)
  | "optie-gedekt-schrijven" // covered-call-simulator (Beschermen & Verdienen)
  | "optie-tijdverval" // tijdsverval over de looptijd (Volatiliteit & Spreads)
  | "optie-volatiliteit" // implied volatility-verkenner (Volatiliteit & Spreads)
  | "optie-greeks" // Greeks-speeltuin (Volatiliteit & Spreads)
  | "hefboom-simulator" // knock-out en financieringskosten (Hefboomproducten)
  | "bias-test" // 15 situatievragen, drie neigingen + tegenmaatregel (Beleggingspsychologie)
  | "paniek-simulator"; // historische crash dag voor dag doorstaan (Beleggingspsychologie)

export type Lesson = {
  slug: string;
  title: string;
  durationMin: number; // geschatte leestijd
  intro: string; // 1-2 zinnen als opening
  sections: LessonSection[]; // 3-5 inhoudelijke secties
  tool?: LessonTool; // optionele interactieve tool in de les
  bookRefs?: BookRef[]; // "Uit de boekenkast" (0-2 per les)
  keyTakeaways: string[]; // 3-5 kernpunten
  quiz: QuizQuestion[]; // 3-5 vragen
  xp: number; // XP bij afronden (standaard 50)
};

export type Module = {
  slug: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export type CourseAccent =
  | "blauw"
  | "groen"
  | "navy"
  | "paars"
  | "petrol" // de opties-leerlijn (drie cursussen, één familie)
  | "oranje"; // Hefboomproducten (waarschuwingskleur, bewust)
export type CourseIcon =
  | "sprout"
  | "scale"
  | "chart"
  | "brain"
  | "target" // Opties Begrijpen (de uitoefenprijs als doel)
  | "shield" // Beschermen & Verdienen met Opties
  | "activity" // Volatiliteit & Spreads
  | "gauge"; // Hefboomproducten

export type Course = {
  slug: string;
  title: string;
  subtitle: string;
  description: string; // catalogusbeschrijving (2-3 zinnen)
  level: "Beginner" | "Gevorderd" | "Expert";
  accent: CourseAccent;
  icon: CourseIcon;
  free?: boolean;
  // Eenmalige aanschafprijs van deze losse cursus (levenslange toegang).
  // Elke betaalde cursus zit óók in het College+-abonnement; zie PRICING in
  // src/lib/pricing.ts voor de abonnementsprijs en de voordelen per optie.
  price?: string; // bijv. "€29"
  heroQuote?: { text: string; source: string };
  learnPoints: string[]; // "Wat je leert" (4-6 punten)
  modules: Module[];
  comingSoon?: boolean;
  order: number;
};
