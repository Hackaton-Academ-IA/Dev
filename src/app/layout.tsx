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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://academia-app.vercel.app";

export const metadata: Metadata = {
  title: "Academ'IA",
  description: "Apprends. Monte en niveau. Recommence.",
  keywords: ["IA", "Learning RPG", "Gamification", "Next.js", "Apprentissage adaptatif"],
  openGraph: {
    title: "Academ'IA",
    description: "Apprends. Monte en niveau. Recommence.",
    url: APP_URL,
    siteName: "Academ'IA",
    images: [{ url: "/images/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Academ'IA",
    description: "Apprends. Monte en niveau. Recommence.",
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png?v=20260506", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg?v=20260506", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico?v=20260506",
    apple: [
      { url: "/apple-touch-icon.png?v=20260506", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest?v=20260506",
  appleWebApp: {
    title: "Academ'IA",
    capable: true,
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${pressStart2P.variable} ${vt323.variable}`} suppressHydrationWarning>
      <body className="crt-flicker">{children}</body>
    </html>
  );
}