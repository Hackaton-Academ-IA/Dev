import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confidentialité · ACADEM'IA",
  description: "Politique de confidentialité et de protection des données personnelles d'ACADEM'IA.",
};

function Article({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="font-pixel text-[11px] sm:text-[13px] glow-violet leading-relaxed">
        {num} — {title}
      </h2>
      <div className="font-mono-pixel text-[18px] sm:text-[20px] text-[var(--ink-dim)] leading-snug space-y-2 pl-2 border-l-4 border-[var(--neon-violet-2)]">
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

function Bullet({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="mt-[6px] w-3 h-3 border-2 border-black flex-none" style={{ background: color }} />
      <span>{children}</span>
    </li>
  );
}

export default function ConfidentialitePage() {
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
          <div className="titlebar titlebar-violet flex items-center justify-between flex-wrap gap-2">
            <span className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
              ◆ POLITIQUE DE CONFIDENTIALITÉ
            </span>
            <span className="font-mono-pixel text-[16px] text-white/70">MAJ : 2026-05-06</span>
          </div>

          <div className="p-5 sm:p-8 space-y-8">

            {/* Intro */}
            <p className="font-mono-pixel text-[18px] sm:text-[20px] text-[var(--ink-dim)] leading-snug">
              <span className="text-[var(--emerald)]">&gt; </span>
              ACADEM&apos;IA s&apos;engage à protéger vos données personnelles conformément au RGPD.
            </p>

            <div className="pix-div" />

            {/* Art 1 */}
            <Article num="ART. 1" title="RESPONSABLE DU TRAITEMENT">
              <p>ACADEM&apos;IA — équipe projet Hackathon Academ&apos;IA.</p>
              <p>
                Contact DPO :{" "}
                <a href="mailto:privacy@academ-ia.tech" className="text-[var(--elec-blue)] hover:text-white transition-colors">
                  privacy@academ-ia.tech
                </a>
              </p>
            </Article>

            <div className="pix-div" />

            {/* Art 2 */}
            <Article num="ART. 2" title="DONNÉES COLLECTÉES">
              <p>
                Nous collectons uniquement les données strictement nécessaires au fonctionnement
                du service et à la boucle de gameplay :
              </p>
              <ul className="space-y-2 mt-2">
                <Bullet color="var(--neon-violet)">
                  <strong className="text-[var(--ink)]">Compte :</strong>{" "}
                  adresse e-mail, pseudonyme, mot de passe haché (bcrypt).
                </Bullet>
                <Bullet color="var(--neon-violet)">
                  <strong className="text-[var(--ink)]">Profilage et jeu :</strong>{" "}
                  niveau actuel, points d&apos;expérience (XP), points de vie (HP), monnaie virtuelle (Coins),
                  série de connexions (streak), dates d&apos;activité précises (lastDailyAt, hpRegenAt),
                  historique des scores et réponses.
                </Bullet>
                <Bullet color="var(--neon-violet)">
                  <strong className="text-[var(--ink)]">Technique :</strong>{" "}
                  adresse IP (anonymisée), user-agent.
                </Bullet>
              </ul>
            </Article>

            <div className="pix-div" />

            {/* Art 3 */}
            <Article num="ART. 3" title="CONSERVATION DES DONNÉES ET INACTIVITÉ">
              <ul className="space-y-2">
                <li className="flex flex-wrap gap-2 items-start">
                  <span className="text-white font-mono-pixel">Données de compte et de jeu :</span>
                  <span>Conservées pendant toute la durée d&apos;utilisation active du service.</span>
                </li>
                <li className="flex flex-wrap gap-2 items-start">
                  <span className="text-white font-mono-pixel">Règle d&apos;inactivité :</span>
                  <span>
                    En cas d&apos;inactivité prolongée du joueur pendant une durée de{" "}
                    <Highlight>deux (2) ans</Highlight>, le compte et l&apos;intégralité des statistiques de jeu
                    seront automatiquement supprimés ou totalement anonymisés, conformément à la
                    réglementation européenne.
                  </span>
                </li>
              </ul>
            </Article>

            <div className="pix-div" />

            {/* Art 4 */}
            <Article num="ART. 4" title="VOS DROITS (DROIT À L&apos;OUBLI)">
              <p>
                Conformément au RGPD, vous disposez des droits d&apos;accès, de rectification,
                de portabilité et du{" "}
                <Highlight>droit à l&apos;oubli (effacement complet)</Highlight>.
              </p>
              <p className="mt-2">
                Pour demander la suppression immédiate de votre compte et de toutes vos statistiques
                de jeu, vous pouvez utiliser le bouton{" "}
                <span className="text-white">&quot;Supprimer mon compte&quot;</span>{" "}
                dans vos paramètres, ou nous contacter à{" "}
                <a href="mailto:privacy@academ-ia.tech" className="text-[var(--elec-blue)] hover:text-white transition-colors">
                  privacy@academ-ia.tech
                </a>.
              </p>
            </Article>

            <div className="pix-div" />

            {/* Footer nav */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/" className="arcade arcade-ghost text-[9px]">◀ RETOUR AU JEU</Link>
              <Link href="/legal/cgu" className="arcade arcade-ghost text-[9px]">◆ CGU</Link>
              <Link href="/legal/cgv" className="arcade arcade-ghost text-[9px]">◆ CGV</Link>
              <Link href="/legal/cookies" className="arcade arcade-ghost text-[9px]">◆ COOKIES</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
