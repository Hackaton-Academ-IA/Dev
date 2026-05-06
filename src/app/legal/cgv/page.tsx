import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CGV · ACADEM'IA",
  description: "Conditions Générales de Vente — La Boutique ACADEM'IA.",
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

export default function CGVPage() {
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

          <div className="titlebar titlebar-gold flex items-center justify-between">
            <span className="font-pixel text-[10px] text-black" style={{ textShadow: "1px 1px 0 #4d3a00" }}>
              ▣ ACADEM&apos;IA — CGV.TXT
            </span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[var(--gold)] border-2 border-black" />
              <span className="w-3 h-3 bg-[var(--emerald)] border-2 border-black" />
              <span className="w-3 h-3 bg-[var(--danger)] border-2 border-black" />
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">

            {/* Header */}
            <div className="space-y-2">
              <p className="font-pixel text-[9px] text-[var(--gold)]">▶ CONDITIONS GÉNÉRALES DE VENTE</p>
              <h1 className="font-pixel text-[18px] sm:text-[22px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
                CGV · LA BOUTIQUE
              </h1>
              <p className="font-mono-pixel text-[18px] text-[var(--ink-dim)]">
                <span className="text-[var(--gold)]">&gt; </span>
                Les présentes conditions s&apos;appliquent à tout achat de biens numériques
                ou d&apos;abonnements sur ACADEM&apos;IA.
              </p>
            </div>

            {/* Article 1 — Monnaie virtuelle */}
            <Article num="ART. 01" color="var(--gold)" title='MONNAIE VIRTUELLE ("COINS")'>
              <p>
                Le jeu intègre un système de récompenses utilisant une monnaie virtuelle
                appelée <span className="text-[var(--gold)]">Coins</span>.
              </p>

              <div className="panel border-4 border-black p-4 space-y-2 mt-2">
                <p className="font-pixel text-[9px] text-[var(--ink-dim)]">◆ STATUT JURIDIQUE</p>
                <p>
                  Les Coins n&apos;ont <span className="text-[var(--danger)]">aucune valeur monétaire réelle</span> en
                  dehors de l&apos;écosystème ACADEM&apos;IA. Ils ne constituent pas un moyen de paiement légal.
                </p>
              </div>

              <div className="border-4 border-[var(--danger)] p-4 space-y-2 bg-[#1a0408] mt-2">
                <p className="font-pixel text-[9px] text-[var(--danger)]">⚠ NON-REMBOURSABILITÉ</p>
                <p>
                  Si des Coins sont acquis via des microtransactions en argent réel, cet achat
                  est <strong className="text-[var(--ink)]">définitif</strong>. Les Coins ne peuvent en aucun cas
                  être échangés contre de la monnaie fiduciaire, revendus, ou remboursés.
                </p>
              </div>
            </Article>

            {/* Article 2 — Abonnements */}
            <Article num="ART. 02" color="var(--neon-violet)" title="ABONNEMENTS PREMIUM ET DROIT DE RÉTRACTATION">
              <p>L&apos;accès aux offres B2B et Premium s&apos;effectue via un système d&apos;abonnement.</p>

              <div className="panel border-4 border-black p-4 space-y-2 mt-2">
                <p className="font-pixel text-[9px] text-[var(--neon-violet)]">◆ DROIT DE RÉTRACTATION</p>
                <p>
                  Conformément à l&apos;article L221-18 du Code de la consommation, vous disposez en principe
                  d&apos;un délai de <span className="text-white">14 jours</span> pour exercer votre droit de
                  rétractation.
                </p>
                <p>
                  Toutefois, la fourniture de l&apos;abonnement Premium et des Coins constituant un contenu
                  numérique non fourni sur un support matériel, vous acceptez expressément, lors de la
                  validation de votre commande, que l&apos;exécution du service commence immédiatement.
                  En cochant la case dédiée lors du paiement, vous renoncez à votre droit de rétractation
                  afin de profiter de vos avantages sans délai.
                </p>
              </div>

              <Bullet color="var(--neon-violet)">Résiliation possible à tout moment depuis vos paramètres.</Bullet>
              <Bullet color="var(--neon-violet)">Aucun frais de résiliation anticipée.</Bullet>
            </Article>

            {/* Article 3 — Paiement */}
            <Article num="ART. 03" color="var(--emerald)" title="PAIEMENT SÉCURISÉ ET PRESTATAIRES">
              <p>
                L&apos;ensemble des transactions financières est géré de manière sécurisée par nos
                prestataires de paiement agréés (ex : Stripe, PayPal).
              </p>

              <div className="border-4 border-[var(--emerald)] p-4 space-y-2 bg-[#021a09] mt-2">
                <p className="font-pixel text-[9px] text-[var(--emerald)]">◆ SÉCURITÉ DES DONNÉES BANCAIRES</p>
                <p>
                  ACADEM&apos;IA <strong className="text-[var(--ink)]">ne stocke, ne traite et n&apos;a accès à aucune
                  donnée bancaire</strong> (numéro de carte, cryptogramme) sur ses propres serveurs.
                </p>
                <p>
                  En cas de litige de facturation, les conditions générales de notre prestataire s&apos;appliquent.
                </p>
              </div>
            </Article>

            {/* Footer note */}
            <div className="border-t-4 border-black pt-4">
              <p className="font-mono-pixel text-[16px] text-[var(--ink-dim)]">
                Dernière mise à jour : <span className="text-[var(--ink)]">Mai 2026</span>
                &nbsp;·&nbsp; Version : <span className="text-[var(--gold)]">v1.16-bit</span>
                &nbsp;·&nbsp;{" "}
                <Link href="/legal/cgu" className="text-[var(--elec-blue)] hover:text-white">
                  CGU
                </Link>
                &nbsp;·&nbsp;{" "}
                <Link href="/legal/confidentialite" className="text-[var(--neon-violet)] hover:text-white">
                  Confidentialité
                </Link>
                &nbsp;·&nbsp;{" "}
                <Link href="/legal/mentions" className="text-[var(--ink-dim)] hover:text-white">
                  Mentions légales
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
