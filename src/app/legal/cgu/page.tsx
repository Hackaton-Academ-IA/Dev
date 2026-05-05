import Link from "next/link";

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
              <p className="font-pixel text-[9px] text-[var(--elec-blue)]">▶ CONDITIONS GÉNÉRALES</p>
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
                ACADEM&apos;IA est une plateforme d&apos;apprentissage gamifiée utilisant l&apos;intelligence
                artificielle pour générer des quêtes pédagogiques adaptatives. Elle s&apos;adresse aux
                apprenants individuels et aux organisations éducatives.
              </p>
              <p>
                L&apos;utilisation du service implique l&apos;acceptation pleine et entière des présentes CGU.
                Toute utilisation contraire aux présentes entraîne la résiliation immédiate du compte.
              </p>
            </Article>

            {/* Article 2 — Accès */}
            <Article num="ART. 02" color="var(--neon-violet)" title="ACCÈS AU SERVICE · FREEMIUM / PREMIUM">
              <p>Le service ACADEM&apos;IA est proposé selon deux modes d&apos;accès :</p>

              <div className="panel border-4 border-black p-4 space-y-2 mt-2">
                <p className="font-pixel text-[10px] text-[var(--emerald)]">▶ MODE STARTER (GRATUIT)</p>
                <Bullet color="var(--emerald)">Accès illimité aux quêtes de niveau Initié.</Bullet>
                <Bullet color="var(--emerald)">Tableau de bord personnel avec suivi de progression.</Bullet>
                <Bullet color="var(--emerald)">3 badges déblocables.</Bullet>
                <Bullet color="var(--emerald)">Pas de carte bancaire requise.</Bullet>
              </div>

              <div className="panel border-4 border-black p-4 space-y-2 mt-2">
                <p className="font-pixel text-[10px] text-[var(--gold)]">★ MODE HÉROS (PREMIUM)</p>
                <Bullet color="var(--gold)">Accès à toutes les difficultés (Initié → Légendaire).</Bullet>
                <Bullet color="var(--gold)">Génération IA illimitée de quêtes personnalisées.</Bullet>
                <Bullet color="var(--gold)">Classements de guilde et modes multijoueur.</Bullet>
                <Bullet color="var(--gold)">Résiliation possible à tout moment, sans frais.</Bullet>
              </div>

              <p>
                ACADEM&apos;IA se réserve le droit de modifier les fonctionnalités incluses dans chaque
                niveau avec un préavis de 30 jours par email.
              </p>
            </Article>

            {/* Article 3 — Fair-play */}
            <Article num="ART. 03" color="var(--hot-pink)" title="RÈGLES DE FAIR-PLAY">
              <p>
                ACADEM&apos;IA repose sur la confiance et l&apos;équité entre joueurs.
                Les comportements suivants sont <span className="text-[var(--danger)]">strictement interdits</span> :
              </p>

              <div className="border-4 border-[var(--danger)] p-4 space-y-2 bg-[#1a0408]">
                <p className="font-pixel text-[9px] text-[var(--danger)]">⚠ COMPORTEMENTS BANNIS</p>
                <Bullet color="var(--danger)">
                  <strong className="text-[var(--ink)]">Bots & automatisation :</strong> l&apos;utilisation de scripts,
                  programmes ou IA tierces pour répondre aux quêtes à votre place est prohibée.
                </Bullet>
                <Bullet color="var(--danger)">
                  <strong className="text-[var(--ink)]">Manipulation du high score :</strong> toute tentative de
                  falsifier, d&apos;injecter ou de modifier frauduleusement ses scores est interdite.
                </Bullet>
                <Bullet color="var(--danger)">
                  <strong className="text-[var(--ink)]">Partage de comptes :</strong> un compte = un joueur.
                  Le partage d&apos;identifiants entre plusieurs personnes est interdit.
                </Bullet>
                <Bullet color="var(--danger)">
                  <strong className="text-[var(--ink)]">Reverse engineering :</strong> toute tentative de décompilation
                  ou d&apos;accès non autorisé aux API est prohibée.
                </Bullet>
              </div>

              <p>
                Toute infraction constatée entraîne la <span className="text-[var(--danger)]">suspension immédiate</span> du
                compte, sans remboursement. Les scores frauduleux seront retirés des classements.
              </p>
              <p>
                Pour signaler une tricherie :{" "}
                <a href="mailto:contact@academ-ia.tech" className="text-[var(--elec-blue)] hover:text-white">
                  contact@academ-ia.tech
                </a>
              </p>
            </Article>

            {/* Article 4 — As-Is */}
            <Article num="ART. 04" color="var(--gold)" title='CLAUSE "AS-IS" · PROTOTYPE 48H'>
              <div className="border-4 border-[var(--gold)] p-4 bg-[#1a1200] space-y-2">
                <p className="font-pixel text-[9px] text-[var(--gold)]">★ AVERTISSEMENT PROTOTYPE</p>
                <p>
                  ACADEM&apos;IA est actuellement un <span className="text-[var(--gold)]">prototype développé en 48 heures</span> dans
                  le cadre d&apos;un hackathon académique. La plateforme est fournie <strong className="text-[var(--ink)]">« en l&apos;état »
                  (as-is)</strong> sans garantie de disponibilité continue, d&apos;exactitude des contenus IA,
                  ni de persistence des données.
                </p>
              </div>

              <p>
                L&apos;équipe ACADEM&apos;IA ne saurait être tenue responsable :
              </p>
              <Bullet color="var(--ink-dim)">Des interruptions de service liées à l&apos;infrastructure de prototype.</Bullet>
              <Bullet color="var(--ink-dim)">De la perte de données ou de progression dans le cadre de la phase de test.</Bullet>
              <Bullet color="var(--ink-dim)">Des inexactitudes dans les contenus générés par l&apos;IA (toujours vérifier avec vos sources officielles).</Bullet>
              <Bullet color="var(--ink-dim)">Des incompatibilités avec certains navigateurs ou appareils en phase beta.</Bullet>

              <p>
                L&apos;utilisation du service pendant la phase prototype est volontaire et gratuite.
                En continuant, vous acceptez les limitations inhérentes à un produit en cours de développement.
              </p>
              <p className="font-pixel text-[9px] text-[var(--ink-dim)]">
                VERSION CIBLE STABLE : Q3 2026
              </p>
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
