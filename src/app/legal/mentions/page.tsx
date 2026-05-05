import Link from "next/link";

function Section({ color, title, children }: { color: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-t-4 border-black pt-5 space-y-2">
      <h2 className="font-pixel text-[16px]" style={{ color, textShadow: "2px 2px 0 #000" }}>
        {title}
      </h2>
      <div className="font-mono-pixel text-[18px] text-[var(--ink-dim)] leading-relaxed space-y-1">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="text-[var(--ink)]">{label} </span>
      {value}
    </p>
  );
}

export default function MentionsLegalesPage() {
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

          <div className="titlebar titlebar-violet flex items-center justify-between">
            <span className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
              ▣ ACADEM&apos;IA — MENTIONS.TXT
            </span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[var(--neon-violet)] border-2 border-black" />
              <span className="w-3 h-3 bg-[var(--gold)] border-2 border-black" />
              <span className="w-3 h-3 bg-[var(--danger)] border-2 border-black" />
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">

            {/* Header */}
            <div className="space-y-2">
              <p className="font-pixel text-[9px] text-[var(--neon-violet)]">▶ FICHIER LÉGAL</p>
              <h1 className="font-pixel text-[18px] sm:text-[22px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
                MENTIONS LÉGALES
              </h1>
              <p className="font-mono-pixel text-[18px] text-[var(--ink-dim)]">
                <span className="text-[var(--neon-violet)]">&gt; </span>
                Conformément à la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l&apos;Économie Numérique (LCEN).
              </p>
            </div>

            {/* Sections */}
            <Section color="var(--neon-violet)" title="§ 01 — ÉDITEUR DU SITE">
              <Row label="Nom de la structure :" value="Équipe ACADEM'IA — Hackathon Académique 2026" />
              <Row label="Nature juridique :" value="Projet prototype — équipe étudiante" />
              <Row label="Adresse :" value="France" />
              <Row label="Directeur de publication :" value="L'équipe ACADEM'IA" />
            </Section>

            <Section color="var(--elec-blue)" title="§ 02 — CONTACT">
              <p>Pour toute question relative au site ou à vos données personnelles :</p>
              <p>
                <span className="text-[var(--ink)]">Email : </span>
                <a
                  href="mailto:contact@academ-ia.tech"
                  className="text-[var(--elec-blue)] hover:text-white transition-colors"
                >
                  contact@academ-ia.tech
                </a>
              </p>
              <p className="text-[var(--ink-dim)] text-[16px]">
                Délai de réponse : 48h ouvrées (nous sommes une équipe de héros, pas des robots).
              </p>
            </Section>

            <Section color="var(--emerald)" title="§ 03 — HÉBERGEMENT">
              <Row label="Hébergeur :" value="Vercel Inc." />
              <Row label="Adresse :" value="340 Pine Street, Suite 1501, San Francisco, CA 94104, USA" />
              <Row label="Site :" value="vercel.com" />
              <p className="text-[16px]">
                L&apos;infrastructure de déploiement est assurée par Vercel via ses services d&apos;hébergement en edge computing.
              </p>
            </Section>

            <Section color="var(--gold)" title="§ 04 — PARTENARIAT TECHNIQUE">
              <Row label="Partenaire réseau :" value="Expernet" />
              <p className="text-[16px]">
                ACADEM&apos;IA bénéficie du soutien technique d&apos;Expernet dans le cadre du hackathon académique.
                Ce partenariat couvre l&apos;accès réseau et les ressources d&apos;infrastructure pendant la durée du prototype.
              </p>
            </Section>

            <Section color="var(--hot-pink)" title="§ 05 — PROPRIÉTÉ INTELLECTUELLE">
              <p>
                L&apos;ensemble du contenu de ce site (textes, graphismes pixel-art, icônes, code source)
                est la propriété exclusive de l&apos;équipe ACADEM&apos;IA. Toute reproduction sans autorisation est interdite.
              </p>
              <p className="text-[16px]">
                Les polices <span className="text-[var(--ink)]">Press Start 2P</span> et <span className="text-[var(--ink)]">VT323</span> sont
                distribuées sous licence SIL Open Font License.
              </p>
            </Section>

            <Section color="var(--ink-dim)" title="§ 06 — COOKIES & DONNÉES">
              <p>
                Ce site utilise des cookies de session nécessaires au fonctionnement de l&apos;authentification.
                Aucun cookie de traçage publicitaire n&apos;est déposé.
              </p>
              <p>
                Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression
                de vos données via <a href="mailto:contact@academ-ia.tech" className="text-[var(--elec-blue)] hover:text-white">contact@academ-ia.tech</a>.
              </p>
            </Section>

            {/* Footer note */}
            <div className="border-t-4 border-black pt-4">
              <p className="font-mono-pixel text-[16px] text-[var(--ink-dim)]">
                Dernière mise à jour : <span className="text-[var(--ink)]">Mai 2026</span>
                &nbsp;·&nbsp; Version : <span className="text-[var(--neon-violet)]">v1.16-bit</span>
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
