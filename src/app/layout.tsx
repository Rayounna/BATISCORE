import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BATISCORE — Notez et trouvez les meilleurs artisans BTP",
    template: "%s | BATISCORE",
  },
  description:
    "Consultez le score de fiabilité des artisans et entreprises du bâtiment. Avis vérifiés, certifications RGE, données SIRET officielles.",
  keywords: [
    "artisan BTP",
    "note artisan",
    "avis plombier",
    "score entreprise bâtiment",
    "RGE",
    "fiabilité artisan",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "BATISCORE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
