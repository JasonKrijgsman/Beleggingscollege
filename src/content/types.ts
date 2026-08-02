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

export type LessonTool = "rente-op-rente";

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

export type CourseAccent = "blauw" | "groen" | "navy" | "paars";
export type CourseIcon = "sprout" | "scale" | "chart" | "brain";

export type Course = {
  slug: string;
  title: string;
  subtitle: string;
  description: string; // catalogusbeschrijving (2-3 zinnen)
  level: "Beginner" | "Gevorderd" | "Expert";
  accent: CourseAccent;
  icon: CourseIcon;
  free?: boolean;
  price?: string; // bijv. "€14,99"
  heroQuote?: { text: string; source: string };
  learnPoints: string[]; // "Wat je leert" (4-6 punten)
  modules: Module[];
  comingSoon?: boolean;
  order: number;
};
