import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies · ACADEM'IA",
  description: "Politique de gestion des cookies d'ACADEM'IA — aucun traceur tiers, session via Better-Auth.",
};

function Article({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="font-pixel text-[11px] sm:text-[13px] glow-blue leading-relaxed">
        {num} — {title}
      </h2>
      <div className="font-mono-pixel text-[18px] sm:text-[20px] text-[var(--ink-dim)] leading-snug space-y-2 pl-2 border-l-4 border-[var(--elec-blue-2)]">
        {children}
      </div>
    </div>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="glow-emerald font-mono-pixel">{children}</span>
  );
}

function NegativeHighlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono-pixel" style={{ color: "#ff4d4d", textShadow: "1px 1px 0 #000" }}>{children}</span>
  );
}

export default function CookiesPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="stars-far" />
      <div className="stars-mid" />
      <div className="stars-near" />
      <div className="stage-glow" />

      <div className="relative z-10 max-w-[820px] mx-auto px-4 py-10 sm:px-8 sm:py-14 space-y-6">

        {/* ── Back button ── */}
        <div>
          <Link href="/" className="arcade arcade-ghost text-[9px]">◀ RETOUR AU JEU</Link>
        </div>

        {/* ── Main panel ── */}
        <div className="rpg-box rpg-box-corners relative">
          <div className="rpg-corner-tr" />
          <div className="rpg-corner-bl" />

          {/* Titlebar */}
          <div className="titlebar titlebar-blue flex items-center justify-between flex-wrap gap-2">
            <span className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
              ◆ POLITIQUE DES COOKIES
            </span>
            <span className="font-mono-pixel text-[16px] text-white/70">MAJ : 2026-05-05</span>
          </div>

          <div className="p-5 sm:p-8 space-y-8">

            {/* Intro */}
            <p className="font-mono-pixel text-[18px] sm:text-[20px] text-[var(--ink-dim)] leading-snug">
              <span className="text-[var(--elec-blue)]">&gt; </span>
              Un cookie est un petit fichier déposé sur votre appareil lors de votre visite.
              La présente politique détaille les seuls cookies utilisés par ACADEM&apos;IA et la façon
              dont vous pouvez les contrôler.
            </p>

            {/* TL;DR chip */}
            <div className="flex items-center gap-3 p-3 border-4 border-black bg-[#07050f]" style={{ boxShadow: "inset 0 0 0 2px #074326" }}>
              <span className="chip chip-emerald flex-none">TL;DR</span>
              <p className="font-mono-pixel text-[18px] text-[var(--emerald)] leading-snug">
                <Highlight>Zéro cookie publicitaire. Zéro traceur tiers. Un unique cookie de session.</Highlight>
              </p>
            </div>

            <div className="pix-div" />

            <Article num="ART. 1" title="COOKIE DE SESSION — BETTER-AUTH">
              <p>
                ACADEM&apos;IA utilise{" "}
                <span className="text-white">Better-Auth</span>, une bibliothèque d&apos;authentification
                open-source. À la connexion, <Highlight>un unique cookie httpOnly est déposé</Highlight>{" "}
                sur votre navigateur.
              </p>
              <p className="mt-2">Caractéristiques de ce cookie :</p>
              <ul className="space-y-1 mt-1">
                {[
                  { label: "Nom :", value: "better-auth.session_token" },
                  { label: "Type :", value: "httpOnly, Secure, SameSite=Lax" },
                  { label: "Durée :", value: "session active, ou 30 jours d'inactivité" },
                  { label: "Finalité :", value: "maintenir votre connexion de manière sécurisée" },
                  { label: "Partage :", value: "aucun — données non transmises à des tiers" },
                ].map((row, i) => (
                  <li key={i} className="flex flex-wrap gap-2">
                    <span className="text-white">{row.label}</span>
                    <span>{row.value}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                Ce cookie est <span className="text-white">strictement nécessaire</span> au fonctionnement
                du service. Il ne peut pas être désactivé sans se déconnecter.
              </p>
            </Article>

            <div className="pix-div" />

            <Article num="ART. 2" title="ABSENCE DE TRACEURS ANALYTICS">
              <p>
                <Highlight>ACADEM&apos;IA ne dépose aucun cookie de traçage, analytics, publicitaire
                ou de profilage comportemental.</Highlight>
              </p>
              <p className="mt-2">
                Les outils suivants ne sont <NegativeHighlight>PAS</NegativeHighlight> utilisés sur notre plateforme :
              </p>
              <ul className="space-y-1 mt-2">
                {[
                  "Google Analytics / Google Tag Manager",
                  "Meta Pixel (Facebook)",
                  "Hotjar, Mixpanel, Amplitude",
                  "Publicité comportementale (DSP, retargeting)",
                  "Tout autre outil de tracking tiers",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="mt-[6px] w-3 h-3 border-2 border-black flex-none" style={{ background: "var(--danger)" }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                Aucune donnée de navigation n&apos;est vendue ou partagée avec des annonceurs.
                Votre comportement sur ACADEM&apos;IA vous appartient.
              </p>
            </Article>

            <div className="pix-div" />

            <Article num="ART. 3" title="GESTION ET SUPPRESSION">
              <p>
                Vous pouvez supprimer ou bloquer les cookies à tout moment via les paramètres de
                votre navigateur (Paramètres → Confidentialité → Cookies).
              </p>
              <p className="mt-2">
                La suppression du cookie de session entraîne votre <span className="text-white">déconnexion immédiate</span>.
                Vos données de progression restent sauvegardées sur nos serveurs et seront
                récupérées à votre prochaine connexion.
              </p>
              <p className="mt-2">
                Pour désactiver le cookie de session de façon permanente, supprimez votre compte
                via <span className="text-[var(--elec-blue)]">Profil → Supprimer le compte</span>.
                Vos données seront effacées sous 30 jours conformément à notre politique de
                confidentialité.
              </p>
            </Article>

            <div className="pix-div" />

            {/* Footer nav */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/" className="arcade arcade-ghost text-[9px]">◀ RETOUR AU JEU</Link>
              <Link href="/legal/confidentialite" className="arcade arcade-ghost text-[9px]">◆ CONFIDENTIALITÉ</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
