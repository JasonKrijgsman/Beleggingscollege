import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/lib/progress";
import { SITE_URL } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Beleggingscollege — Stap veilig in de wereld van beleggen",
    template: "%s — Beleggingscollege",
  },
  description:
    "Eerlijk beleggingsonderwijs, geworteld in de beste boeken. Interactieve cursussen, quizzen, badges en certificaten — zonder get-rich-quick-onzin.",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Beleggingscollege",
    title: "Beleggingscollege — Stap veilig in de wereld van beleggen",
    description:
      "Eerlijk beleggingsonderwijs, geworteld in de beste boeken. Interactieve cursussen, quizzen, badges en certificaten.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={openSans.variable}>
      <body className="font-sans flex min-h-screen flex-col">
        <ProgressProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ProgressProvider>
      </body>
    </html>
  );
}
