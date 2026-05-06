import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CGU · ACADEM'IA",
  description: "Conditions Générales d'Utilisation de la plateforme ACADEM'IA.",
};

function Article({
  num,
  color,
  title,
  children,
}: {
  num: string;
  color: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t-4 border-black pt-5 space-y-3">
      <div className="flex items-baseline gap-3">
        <span className="font-pixel text-[9px]" style={{ color }}>
          {num}
        </span>
        <h2 className="font-pixel text-[16px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
          {title}
        </h2>
      </div>
      <div className="font-mono-pixel text-[18px] text-[var(--ink-dim)] leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

function Bullet({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <p className="flex gap-2">
      <span style={{ color }}>▸</span>
      <span>{children}</span>
    </p>
  );
}

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-[#04030a] py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Back button */}
        <Link href="/" className="arcade arcade-ghost text-[9px] inline-flex">
          ◀ RETOUR AU JEU
        </Link>

        {/* Main box */}
        <div className="rpg-box rpg-box-corners relative">
          <span className="rpg-corner-tr" />
          <span className="rpg-corner-bl" />

          <div className="titlebar titlebar-blue flex items-center justify-between">
            <span className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
              ▣ ACADEM&apos;IA — CGU.TXT
            </span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[var(--elec-blue)] border-2 border-black" />
              <span className="w-3 h-3 bg-[var(--gold)] border-2 border-black" />
              <span className="w-3 h-3 bg-[var(--danger)] border-2 border-black" />
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">

            {/* Header */}
            <div className="space-y-2">
              <p className="font-pixel text-[9px] text-[var(--elec-blue)]">▶ CONDITIONS GÉNÉRALES D&apos;UTILISATION</p>
              <h1 className="font-pixel text-[18px] sm:text-[22px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
                CGU · RÈGLES DU JEU
              </h1>
              <p className="font-mono-pixel text-[18px] text-[var(--ink-dim)]">
                <span className="text-[var(--elec-blue)]">&gt; </span>
                En accédant à ACADEM&apos;IA, vous acceptez les présentes conditions.
                Lisez-les — elles sont courtes et honnêtes.
              </p>
            </div>

            {/* Article 1 — Objet */}
            <Article num="ART. 01" color="var(--elec-blue)" title="OBJET">
              <p>
                Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et
                l&apos;utilisation de la plateforme ACADEM&apos;IA, accessible à l&apos;adresse academ-ia.tech.
              </p>
              <p>
                ACADEM&apos;IA est une plateforme d&apos;apprentissage gamifiée <span className="text-[var(--ink)]">sous la forme d&apos;un jeu 2D</span> utilisant
                l&apos;intelligence artificielle pour générer des quêtes pédagogiques adaptatives.
              </p>
              <p>
                L&apos;utilisation du service implique l&apos;acceptation pleine et entière des présentes CGU.
              </p>
            </Article>

            {/* Article 2 — Accès */}
            <Article num="ART. 02" color="var(--neon-violet)" title="ACCÈS AU SERVICE · FREEMIUM / PREMIUM">
              <p>Le service ACADEM&apos;IA est proposé selon deux modes d&apos;accès :</p>

              <div className="panel border-4 border-black p-4 space-y-2 mt-2">
                <p className="font-pixel text-[10px] text-[var(--emerald)]">▶ MODE STARTER (GRATUIT)</p>
                <Bullet color="var(--emerald)">Accès illimité aux quêtes de niveau Initié.</Bullet>
                <Bullet color="var(--emerald)">Tableau de bord personnel avec suivi de progression.</Bullet>
                <Bullet color="var(--emerald)">Pas de carte bancaire requise.</Bullet>
              </div>

              <div className="panel border-4 border-black p-4 space-y-2 mt-2">
                <p className="font-pixel text-[10px] text-[var(--gold)]">★ MODE HÉROS (PREMIUM)</p>
                <Bullet color="var(--gold)">Accès à toutes les difficultés et génération IA illimitée.</Bullet>
                <Bullet color="var(--gold)">Suivi des statistiques complet.</Bullet>
                <Bullet color="var(--gold)">Résiliation possible à tout moment, sans frais.</Bullet>
              </div>
            </Article>

            {/* Article 3 — Fair-play et modération */}
            <Article num="ART. 03" color="var(--hot-pink)" title="RÈGLES DE FAIR-PLAY ET MODÉRATION">
              <p>
                ACADEM&apos;IA repose sur la confiance et l&apos;équité entre joueurs. L&apos;objectif est de maintenir
                un classement (high score) juste. Les comportements suivants sont{" "}
                <span className="text-[var(--danger)]">strictement interdits</span> :
              </p>

              <div className="border-4 border-[var(--danger)] p-4 space-y-2 bg-[#1a0408]">
                <p className="font-pixel text-[9px] text-[var(--danger)]">⚠ COMPORTEMENTS BANNIS</p>
                <Bullet color="var(--danger)">
                  <strong className="text-[var(--ink)]">Bots & automatisation :</strong> l&apos;utilisation de scripts
                  ou d&apos;IA tierces pour répondre aux quêtes.
                </Bullet>
                <Bullet color="var(--danger)">
                  <strong className="text-[var(--ink)]">Exploitation de bugs :</strong> toute utilisation volontaire
                  d&apos;une faille du jeu pour s&apos;enrichir (Coins, XP).
                </Bullet>
                <Bullet color="var(--danger)">
                  <strong className="text-[var(--ink)]">Comportements toxiques :</strong> l&apos;utilisation de pseudonymes
                  injurieux, discriminatoires ou hors charte.
                </Bullet>
                <Bullet color="var(--danger)">
                  <strong className="text-[var(--ink)]">Manipulation du high score :</strong> toute tentative
                  de falsifier ses scores.
                </Bullet>
              </div>

              <div className="border-4 border-[var(--gold)] p-4 space-y-2 bg-[#1a1200] mt-2">
                <p className="font-pixel text-[9px] text-[var(--gold)]">⚠ DROIT DE SANCTION</p>
                <p>
                  En cas de non-respect de ces règles, l&apos;administration d&apos;ACADEM&apos;IA se réserve le droit
                  d&apos;appliquer les sanctions suivantes, sans préavis :
                </p>
                <Bullet color="var(--gold)">
                  <strong className="text-[var(--ink)]">Pénalités en jeu :</strong> réduction de vos points de vie (HP)
                  ou annulation de vos gains.
                </Bullet>
                <Bullet color="var(--gold)">
                  <strong className="text-[var(--ink)]">Verrouillage IA :</strong> blocage temporaire de la génération
                  de quêtes pendant 24h.
                </Bullet>
                <Bullet color="var(--danger)">
                  <strong className="text-[var(--ink)]">User Game Over :</strong> suppression pure et simple du compte
                  fautif par un administrateur et retrait définitif des classements.
                </Bullet>
              </div>
            </Article>

            {/* Article 4 — IA Gemini */}
            <Article num="ART. 04" color="var(--emerald)" title="L&apos;INTELLIGENCE ARTIFICIELLE (GEMINI)">
              <p>
                ACADEM&apos;IA intègre un système d&apos;Intelligence Artificielle générative pour créer
                des défis sur mesure.
              </p>

              <div className="panel border-4 border-black p-4 space-y-2 mt-2">
                <p className="font-pixel text-[9px] text-[var(--emerald)]">◆ DISCLAIMER IA</p>
                <p>
                  Les questions du &quot;Défi de l&apos;IA&quot; sont générées de manière automatisée. Bien que nous visions
                  l&apos;excellence pédagogique, l&apos;équipe d&apos;ACADEM&apos;IA décline toute responsabilité en cas
                  d&apos;erreurs factuelles (hallucinations), d&apos;inexactitudes ou de contenus inattendus générés
                  par l&apos;IA. Vérifiez toujours vos connaissances avec des sources officielles.
                </p>
              </div>

              <div className="panel border-4 border-black p-4 space-y-2 mt-2">
                <p className="font-pixel text-[9px] text-[var(--elec-blue)]">◆ PARTAGE DE DONNÉES</p>
                <p>
                  Lors de la création d&apos;une &quot;Nouvelle quête&quot;, les thèmes et les données de requêtes sont
                  transmis à l&apos;API de Google (Gemini).{" "}
                  <span className="text-[var(--ink)]">Aucune donnée personnelle identifiante (nom, e-mail) n&apos;est
                  transmise à ces services tiers.</span>
                </p>
              </div>
            </Article>

            {/* Article 5 — As-Is */}
            <Article num="ART. 05" color="var(--gold)" title='CLAUSE "AS-IS" · PROTOTYPE 48H'>
              <div className="border-4 border-[var(--gold)] p-4 bg-[#1a1200] space-y-2">
                <p className="font-pixel text-[9px] text-[var(--gold)]">★ AVERTISSEMENT PROTOTYPE</p>
                <p>
                  ACADEM&apos;IA est un prototype développé en{" "}
                  <span className="text-[var(--gold)]">48 heures</span> dans le cadre d&apos;un sprint / hackathon.
                  La plateforme est fournie{" "}
                  <strong className="text-[var(--ink)]">« en l&apos;état » (as-is)</strong> sans garantie de
                  disponibilité continue ni de persistance des données. En continuant, vous acceptez les
                  limitations inhérentes à un produit expérimental.
                </p>
              </div>
            </Article>

            {/* Acceptance */}
            <div className="border-t-4 border-black pt-5">
              <div className="panel p-4 space-y-2">
                <p className="font-pixel text-[10px] text-[var(--emerald)]">▶ ACCEPTATION</p>
                <p className="font-mono-pixel text-[18px] text-[var(--ink-dim)]">
                  En créant un compte ou en utilisant le service, vous confirmez avoir lu, compris
                  et accepté l&apos;intégralité des présentes CGU.
                </p>
              </div>
            </div>

            {/* Footer note */}
            <div className="border-t-4 border-black pt-4">
              <p className="font-mono-pixel text-[16px] text-[var(--ink-dim)]">
                Dernière mise à jour : <span className="text-[var(--ink)]">Mai 2026</span>
                &nbsp;·&nbsp; Version : <span className="text-[var(--elec-blue)]">v1.16-bit</span>
                &nbsp;·&nbsp;{" "}
                <Link href="/legal/mentions" className="text-[var(--elec-blue)] hover:text-white">
                  Mentions légales
                </Link>
                &nbsp;·&nbsp;{" "}
                <Link href="/legal/confidentialite" className="text-[var(--neon-violet)] hover:text-white">
                  Confidentialité
                </Link>
                &nbsp;·&nbsp;{" "}
                <Link href="/legal/cgv" className="text-[var(--gold)] hover:text-white">
                  CGV
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom back link */}
        <div className="text-center pb-6">
          <Link href="/" className="font-mono-pixel text-[18px] text-[var(--ink-dim)] hover:text-white transition-colors">
            ◀ Retour à l&apos;accueil
          </Link>
        </div>

      </div>
    </div>
  );
}
