import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323-var",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ACADEM'IA — L'apprentissage dont vous êtes le héros",
  description: "Tour Infinie du savoir — IA adaptative, quêtes, badges, récompenses pixel-art.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${pressStart2P.variable} ${vt323.variable}`}>
      <body className="crt-flicker">{children}</body>
    </html>
  );
}
