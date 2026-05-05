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
            <span className="font-mono-pixel text-[16px] text-white/70">MAJ : 2026-05-05</span>
          </div>

          <div className="p-5 sm:p-8 space-y-8">

            {/* Intro */}
            <p className="font-mono-pixel text-[18px] sm:text-[20px] text-[var(--ink-dim)] leading-snug">
              <span className="text-[var(--emerald)]">&gt; </span>
              ACADEM&apos;IA s&apos;engage à protéger vos données personnelles conformément au RGPD
              (Règlement UE 2016/679). Le présent document décrit quelles données sont collectées,
              pourquoi, et comment vous pouvez exercer vos droits.
            </p>

            <div className="pix-div" />

            <Article num="ART. 1" title="RESPONSABLE DU TRAITEMENT">
              <p>ACADEM&apos;IA — équipe projet Hackathon Academ&apos;IA.</p>
              <p>Contact DPO : <span className="text-[var(--elec-blue)]">privacy@academIA.fr</span></p>
              <p>Hébergement : Vercel Inc., serveurs localisés dans l&apos;Union Européenne.</p>
            </Article>

            <div className="pix-div" />

            <Article num="ART. 2" title="DONNÉES COLLECTÉES">
              <p>Nous collectons uniquement les données strictement nécessaires au fonctionnement du service :</p>
              <ul className="space-y-1 mt-2">
                {[
                  "Compte : adresse e-mail, pseudonyme, mot de passe haché (bcrypt).",
                  "Progression pédagogique : scores, streaks, temps de session, réponses aux quêtes.",
                  "Technique : adresse IP (anonymisée après 24h), user-agent, journaux d'erreurs.",
                  "Paiement : référence de transaction uniquement (aucun numéro de carte stocké — géré par Stripe).",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="mt-[6px] w-3 h-3 border-2 border-black bg-[var(--neon-violet)] flex-none" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Article>

            <div className="pix-div" />

            <Article num="ART. 3" title="TRAITEMENT PAR L'IA — GOOGLE GEMINI">
              <p>
                Pour générer les quêtes adaptatives,{" "}
                <Highlight>seules les données de progression brutes (réponses, scores, temps de réponse) sont transmises à l&apos;API Google Gemini.</Highlight>
              </p>
              <p className="mt-2">
                <Highlight>Aucune information personnelle identifiable (nom, e-mail, adresse IP) n&apos;est incluse dans ces requêtes.</Highlight>{" "}
                Les données envoyées à Gemini sont pseudonymisées via un identifiant de session temporaire.
              </p>
              <p className="mt-2">
                Google LLC traite ces données en tant que sous-traitant au sens de l&apos;Art. 28 RGPD.
                Consultez la{" "}
                <span className="text-[var(--elec-blue)]">politique Google Cloud Privacy</span>{" "}
                pour les conditions d&apos;utilisation de l&apos;API Gemini.
              </p>
            </Article>

            <div className="pix-div" />

            <Article num="ART. 4" title="CONSERVATION DES DONNÉES">
              <ul className="space-y-1">
                {[
                  { label: "Données de compte :", value: "durée de l'abonnement actif." },
                  { label: "Après résiliation :", value: <Highlight>suppression automatique sous 30 jours.</Highlight> },
                  { label: "Progression pédagogique :", value: "conservée pendant la durée du compte, exportable à tout moment." },
                  { label: "Journaux techniques :", value: <><Highlight>30 jours glissants</Highlight>{" "}— purge automatique au-delà.</> },
                  { label: "Données de paiement :", value: "10 ans (obligation légale comptable)." },
                ].map((row, i) => (
                  <li key={i} className="flex flex-wrap gap-2 items-start">
                    <span className="text-white font-mono-pixel">{row.label}</span>
                    <span>{row.value}</span>
                  </li>
                ))}
              </ul>
            </Article>

            <div className="pix-div" />

            <Article num="ART. 5" title="VOS DROITS">
              <p>
                Conformément au RGPD, vous disposez des droits suivants : accès, rectification,
                effacement (« droit à l&apos;oubli »), portabilité, opposition, limitation du traitement.
              </p>
              <p className="mt-2">
                Pour exercer vos droits, contactez-nous à{" "}
                <span className="text-[var(--elec-blue)]">privacy@academIA.fr</span>.
                Délai de réponse : <span className="text-white">30 jours maximum</span>.
              </p>
              <p className="mt-2">
                En cas de litige non résolu, vous pouvez saisir la{" "}
                <span className="text-white">CNIL</span> (cnil.fr).
              </p>
            </Article>

            <div className="pix-div" />

            {/* Footer nav */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/" className="arcade arcade-ghost text-[9px]">◀ RETOUR AU JEU</Link>
              <Link href="/legal/cookies" className="arcade arcade-ghost text-[9px]">◆ COOKIES</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
