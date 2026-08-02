import type { CourseAccent } from "@/content/types";

export type AccentClasses = {
  solid: string; // gevulde knop
  soft: string; // lichte chip/achtergrond
  text: string;
  border: string;
  gradient: string; // heroverloop (gebruik met bg-gradient-to-br)
  bar: string; // voortgangsbalk
  iconBox: string; // icoonvlak op kaarten
};

export const ACCENTS: Record<CourseAccent, AccentClasses> = {
  groen: {
    solid: "bg-groen-600 hover:bg-groen-700 text-white",
    soft: "bg-groen-50 text-groen-700",
    text: "text-groen-700",
    border: "border-groen-200",
    gradient: "from-groen-900 via-groen-700 to-groen-600",
    bar: "bg-groen-600",
    iconBox: "bg-groen-100 text-groen-700",
  },
  blauw: {
    solid: "bg-brand-600 hover:bg-brand-700 text-white",
    soft: "bg-brand-50 text-brand-700",
    text: "text-brand-700",
    border: "border-brand-200",
    gradient: "from-navy-900 via-brand-800 to-brand-600",
    bar: "bg-brand-600",
    iconBox: "bg-brand-100 text-brand-700",
  },
  navy: {
    solid: "bg-navy-600 hover:bg-navy-700 text-white",
    soft: "bg-navy-50 text-navy-700",
    text: "text-navy-700",
    border: "border-navy-200",
    gradient: "from-navy-950 via-navy-800 to-navy-600",
    bar: "bg-navy-600",
    iconBox: "bg-navy-100 text-navy-700",
  },
  paars: {
    solid: "bg-paars-600 hover:bg-paars-700 text-white",
    soft: "bg-paars-50 text-paars-700",
    text: "text-paars-700",
    border: "border-paars-200",
    gradient: "from-paars-900 via-paars-700 to-paars-600",
    bar: "bg-paars-600",
    iconBox: "bg-paars-100 text-paars-700",
  },
  petrol: {
    solid: "bg-petrol-600 hover:bg-petrol-700 text-white",
    soft: "bg-petrol-50 text-petrol-700",
    text: "text-petrol-700",
    border: "border-petrol-200",
    gradient: "from-petrol-950 via-petrol-800 to-petrol-600",
    bar: "bg-petrol-600",
    iconBox: "bg-petrol-100 text-petrol-700",
  },
  oranje: {
    solid: "bg-oranje-600 hover:bg-oranje-700 text-white",
    soft: "bg-oranje-50 text-oranje-700",
    text: "text-oranje-700",
    border: "border-oranje-200",
    gradient: "from-oranje-950 via-oranje-800 to-oranje-600",
    bar: "bg-oranje-600",
    iconBox: "bg-oranje-100 text-oranje-700",
  },
};
