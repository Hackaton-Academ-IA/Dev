import Link from "next/link";
import { ShieldIcon, FlagIcon, PixelGrid } from "@/components/ui/PixelIcons";

interface TargetCardProps {
  tone: "b2b" | "b2c";
  kicker: string;
  title: string;
  icon: React.ReactNode;
  bullets: string[];
  cta: string;
  ctaTone: string;
  footnote: string;
  onCtaClick?: () => void;
}

function TargetCard({ tone, kicker, title, icon, bullets, cta, ctaTone, footnote, onCtaClick }: TargetCardProps) {
  const panel = tone === "b2b" ? "panel-blue" : "panel-pink";
  const tbar  = tone === "b2b" ? "titlebar-blue" : "titlebar-pink";
  return (
    <article className={`panel ${panel} flex flex-col`}>
      <div className={`titlebar ${tbar} flex items-center justify-between`}>
        <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>{kicker}</div>
        <span className="font-mono-pixel text-[14px] text-white/80">{tone === "b2b" ? "GUILD MODE" : "SOLO MODE"}</span>
      </div>
      <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col">
        <div className="flex items-center gap-4">
          <div className="border-4 border-black p-2 bg-[#0a0720]" style={{ boxShadow: "inset 0 0 0 2px #2a1c5e" }}>
            {icon}
          </div>
          <div>
            <h3 className={`font-pixel text-[16px] sm:text-[18px] ${tone === "b2b" ? "glow-blue" : "glow-pink"}`}>{title}</h3>
            <div className="font-mono-pixel text-[16px] text-[var(--ink-dim)]">
              {tone === "b2b" ? "Centres de formation, écoles, équipes" : "Étudiants, autodidactes, curieux"}
            </div>
          </div>
        </div>

        <ul className="font-mono-pixel text-[18px] space-y-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className={`mt-[6px] w-3 h-3 border-2 border-black ${tone === "b2b" ? "bg-[var(--elec-blue)]" : "bg-[var(--hot-pink)]"}`} />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {tone === "b2b" && (
          <div className="border-4 border-black p-3 mt-2" style={{ background: "#0a0720", boxShadow: "inset 0 0 0 2px #08305c" }}>
            <div className="font-pixel text-[10px] text-[var(--elec-blue)] mb-2">▣ DASHBOARD FORMATEUR — APERÇU</div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[{ l: "Apprenants", v: "128" }, { l: "Streak moy.", v: "12 j" }, { l: "Réussite", v: "82%" }].map((m, i) => (
                <div key={i} className="border-2 border-black p-2 bg-[#0e0a22] text-center">
                  <div className="font-pixel text-[14px] text-white">{m.v}</div>
                  <div className="font-mono-pixel text-[14px] text-[var(--ink-dim)]">{m.l}</div>
                </div>
              ))}
            </div>
            <div className="flex items-end gap-1 h-[44px]">
              {[40,55,30,68,72,58,85,76,92,64,80,95].map((h, i) => (
                <div key={i} className="flex-1 border-2 border-black" style={{ height: h + "%", background: "linear-gradient(180deg, #22a7ff 0%, #0a5ec9 100%)" }} />
              ))}
            </div>
          </div>
        )}

        {tone === "b2c" && (
          <div className="border-4 border-black p-3 mt-2" style={{ background: "#0a0720", boxShadow: "inset 0 0 0 2px #5a0d3a" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-pixel text-[10px] text-[var(--hot-pink)]">▣ CARTE DE JOUEUR</div>
              <div className="font-mono-pixel text-[14px] text-[var(--ink-dim)]">LV 14</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-[56px] h-[56px] border-4 border-black bg-[#0e0a22]" style={{ boxShadow: "inset 0 0 0 2px #2a1c5e" }}>
                <PixelGrid size={48} palette={{ K: "#000", v: "#b14bff", w: "#fff3c2" }} rows={[
                  "....KKKKKK....","...KvvvvvvK...","..KvwwwvwwwK..","..KvwKwvwKwvK.",
                  "..KvwwwvwwwvK.","..KvvvKKvvvvK.","..KvKKKKKKvvK.","...KvvvvvvK...",
                  "....KKKKKK....","  ..............",
                ]} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between font-mono-pixel text-[14px] mb-1">
                  <span>XP</span><span className="text-[var(--emerald)]">7320 / 10000</span>
                </div>
                <div className="h-3 bg-[#07050f] border-2 border-black p-[2px] flex gap-[2px]">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className="flex-1" style={{ background: i < 10 ? "linear-gradient(180deg, #43ff9a, #0d8f4a)" : "#0e0a22" }} />
                  ))}
                </div>
                <div className="flex gap-3 mt-2 font-mono-pixel text-[14px] text-[var(--ink-dim)]">
                  <span>HP <span className="text-[var(--hot-pink)]">♥♥♥♥♡</span></span>
                  <span>STREAK <span className="text-[var(--gold)]">🔥 7d</span></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
          {onCtaClick
            ? <button onClick={onCtaClick} className={`arcade text-[10px] ${ctaTone}`}>{cta}</button>
            : <Link href="/login" className={`arcade text-[10px] ${ctaTone}`}>{cta}</Link>
          }
          <span className="font-mono-pixel text-[16px] text-[var(--ink-dim)]">{footnote}</span>
        </div>
      </div>
    </article>
  );
}

export default function CiblesSection({ onGuildDemoClick }: { onGuildDemoClick: () => void }) {
  return (
    <section id="cibles" className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="font-pixel text-[10px] text-[var(--elec-blue)] mb-2">▶ STAGE 03</div>
          <h2 className="font-pixel text-[20px] sm:text-[26px] glow-blue">CHOISIS TA CLASSE</h2>
          <p className="font-mono-pixel text-[20px] text-[var(--ink-dim)] mt-2 max-w-[60ch] leading-snug">
            Deux modes de jeu, un même donjon. Que vous soyez Guilde ou Aventurier solo, l&apos;IA s&apos;adapte à votre quête.
          </p>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <TargetCard
          tone="b2b" kicker="◆ B2B · CENTRES DE FORMATION" title="LA GUILDE"
          icon={<ShieldIcon size={56} />}
          bullets={["Tableau de bord formateur : suivi temps réel des apprenants, streaks, échecs récurrents.","Parcours sur mesure : importez votre référentiel, l'IA génère les quêtes alignées.","Rapports d'assiduité & exports CSV pour audits Qualiopi / OPCO.","Comptes équipe, droits par groupe, SSO Microsoft / Google.","Coût maîtrisé : tarification par siège dégressive."]}
          cta="DEMANDER UNE DÉMO" ctaTone="arcade-blue" footnote="Onboarding sous 48h · Sans CB"
          onCtaClick={onGuildDemoClick} />
        <TargetCard
          tone="b2c" kicker="◆ B2C · APPRENANTS SOLO" title="L'AVENTURIER"
          icon={<FlagIcon size={56} />}
          bullets={["Quêtes quotidiennes adaptatives en 5 min/jour pour entretenir la flamme.","Boucle XP / Badges / Coins pour transformer la procrastination en addiction saine.","Mode Boss du Dimanche : un défi long format chaque semaine.","Objectifs personnels (BAC, concours, hobby) : l'IA cale le donjon dessus.","Mode hors-ligne pour réviser sans connexion."]}
          cta="JOUER GRATUITEMENT" ctaTone="arcade-pink" footnote="14 jours d'essai · 0€ d'inscription" />
      </div>
    </section>
  );
}
