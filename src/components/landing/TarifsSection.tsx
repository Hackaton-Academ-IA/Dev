"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BrainIcon, TrophyIcon, SwordIcon, HeartIcon, StarIcon } from "@/components/ui/PixelIcons";

interface PriceCardProps {
  featured?: boolean; kicker: string; title: string; price: string;
  period: string; perks: string[]; cta: string; ctaTone: string;
  accent: string; accentTbar: string;
  onCtaClick?: () => void;
}

function PriceCard({ featured, kicker, title, price, period, perks, cta, ctaTone, accent, accentTbar, onCtaClick }: PriceCardProps) {
  return (
    <div className={`panel ${accent} relative ${featured ? "lg:scale-[1.04]" : ""}`}>
      {featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 chip chip-gold border-4">★ POPULAIRE</div>}
      <div className={`titlebar ${accentTbar} flex items-center justify-between`}>
        <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>{kicker}</div>
        <StarIcon size={18} />
      </div>
      <div className="p-5 sm:p-6 space-y-4">
        <div>
          <div className="font-pixel text-[14px] sm:text-[16px] glow-violet">{title}</div>
          <div className="flex items-end gap-2 mt-3">
            <div className="font-pixel text-[28px] sm:text-[32px] glow-emerald leading-none">{price}</div>
            <div className="font-mono-pixel text-[18px] text-[var(--ink-dim)] mb-1">{period}</div>
          </div>
        </div>
        <ul className="font-mono-pixel text-[18px] space-y-2">
          {perks.map((p, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="mt-[6px] w-3 h-3 border-2 border-black bg-[var(--emerald)]" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        {onCtaClick
          ? <button onClick={onCtaClick} className={`arcade w-full text-[10px] ${ctaTone}`}>{cta}</button>
          : <Link href="/login" className={`arcade w-full text-[10px] ${ctaTone}`}>{cta}</Link>
        }
      </div>
    </div>
  );
}

function ModuleRow({ icon, name, desc, price, tag, onAddClick }: {
  icon: React.ReactNode; name: string; desc: string; price: string; tag?: string; onAddClick: () => void;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] gap-3 sm:gap-5 items-center border-b-4 border-black last:border-b-0 p-4 hover:bg-[#0e0a22]">
      <div className="border-4 border-black p-1 bg-[#0a0720]" style={{ boxShadow: "inset 0 0 0 2px #2a1c5e" }}>{icon}</div>
      <div>
        <div className="font-pixel text-[12px] sm:text-[13px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>{name}</div>
        <div className="font-mono-pixel text-[16px] text-[var(--ink-dim)] mt-1">{desc}</div>
        {tag && <div className="mt-2"><span className="chip chip-violet">{tag}</span></div>}
      </div>
      <div className="text-right">
        <div className="font-pixel text-[14px] glow-gold">{price}</div>
        <button onClick={onAddClick} className="arcade arcade-ghost text-[8px] mt-2">+ AJOUTER</button>
      </div>
    </div>
  );
}

function RPGToast({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-[480px]">
      <div className="panel panel-gold">
        <div className="titlebar titlebar-gold flex items-center justify-between">
          <span className="font-pixel text-[10px] text-black">⚠ SYSTÈME — ACCÈS REFUSÉ</span>
          <button onClick={onClose} className="font-pixel text-[12px] text-black/60 hover:text-black leading-none">✕</button>
        </div>
        <div className="p-4 font-pixel text-[11px] text-[var(--ink)] text-center leading-relaxed" style={{ textShadow: "2px 2px 0 #000" }}>
          CE MODULE SERA DISPONIBLE DANS LA VERSION BÊTA.<br />
          <span className="text-[var(--danger)]">XP ACTUELLE INSUFFISANTE !</span>
        </div>
      </div>
    </div>
  );
}

export default function TarifsSection({ onGuildContact }: { onGuildContact: () => void }) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [showToast, setShowToast] = useState(false);
  const factor = billing === "yearly" ? 0.8 : 1;
  const fmt = (m: number) => Math.round(m * factor) + "€";

  const triggerBetaToast = () => setShowToast(true);

  return (
    <section id="tarifs" className="space-y-5">
      {showToast && <RPGToast onClose={() => setShowToast(false)} />}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="font-pixel text-[10px] text-[var(--gold)] mb-2">▶ STAGE 04</div>
          <h2 className="font-pixel text-[20px] sm:text-[26px] glow-gold">TARIFS · CHOISIS TON COFFRE</h2>
          <p className="font-mono-pixel text-[20px] text-[var(--ink-dim)] mt-2 max-w-[60ch] leading-snug">
            Abonnement mensuel sans engagement, ou modules à l&apos;unité comme un cartouche d&apos;arcade.
          </p>
        </div>
        <div className="flex items-center gap-2 panel panel-emerald p-2">
          <button onClick={() => setBilling("monthly")} className={`arcade text-[10px] ${billing === "monthly" ? "arcade-emerald" : "arcade-ghost"}`}>MENSUEL</button>
          <button onClick={() => setBilling("yearly")}  className={`arcade text-[10px] ${billing === "yearly"  ? "arcade-emerald" : "arcade-ghost"}`}>ANNUEL · -20%</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 lg:gap-6 pt-4">
        <PriceCard kicker="◇ FREE PLAY" title="STARTER" price="0€" period={`/ ${billing === "yearly" ? "an" : "mois"}`}
          perks={["1 quête IA par jour","Suivi XP & 3 badges","1 monde débloqué","Mode hors-ligne basique"]}
          cta="COMMENCER GRATUIT" ctaTone="arcade-ghost" accent="panel-violet" accentTbar="titlebar-violet" />
        <PriceCard featured kicker="◆ HÉROS" title="PASS HÉROS" price={fmt(9)} period={`/ ${billing === "yearly" ? "mois (facturé annuellement)" : "mois"}`}
          perks={["Quêtes IA illimitées","Tous les mondes & boss","Streaks, combos, drops rares","Statistiques avancées","Synchronisation multi-appareils"]}
          cta="PRENDRE LE PASS" ctaTone="arcade-emerald" accent="panel-emerald" accentTbar="titlebar-emerald"
          onCtaClick={triggerBetaToast} />
        <PriceCard kicker="◈ B2B GUILDE" title="GUILDE PRO" price={fmt(29)} period={`/ siège · ${billing === "yearly" ? "an" : "mois"}`}
          perks={["Tout du Pass Héros","Dashboard formateur temps réel","Imports référentiels & exports CSV","SSO Microsoft / Google","Support prioritaire 24/5"]}
          cta="DEMANDER UN DEVIS" ctaTone="arcade-blue" accent="panel-blue" accentTbar="titlebar-blue"
          onCtaClick={onGuildContact} />
      </div>

      <div className="panel panel-gold mt-4">
        <div className="titlebar titlebar-gold flex items-center justify-between">
          <div className="font-pixel text-[10px] text-black" style={{ textShadow: "1px 1px 0 #4d3a00" }}>▣ CARTOUCHES — MODULES À L&apos;UNITÉ</div>
          <span className="font-mono-pixel text-[14px] text-black/80">PAIEMENT UNIQUE · ACCÈS À VIE</span>
        </div>
        <div className="p-2 sm:p-3">
          <ModuleRow icon={<BrainIcon size={44} />}  name="MASTERY · MATHS DU LYCÉE"      desc="120+ quêtes adaptatives, 4 boss de chapitre, fiches de loot."            price="14,90€" tag="BUNDLE -30%" onAddClick={triggerBetaToast} />
          <ModuleRow icon={<TrophyIcon size={44} />} name="CONCOURS · PRÉPA SCIENCES PO"  desc="Méthodologie + actu + 6 essais notés par l'IA."                          price="29,90€" tag="EARLY ACCESS" onAddClick={triggerBetaToast} />
          <ModuleRow icon={<SwordIcon size={44} />}  name="LANGUES · ANGLAIS B2 → C1"     desc="Donjon de conversation, 30 boss de prononciation."                       price="19,90€" onAddClick={triggerBetaToast} />
          <ModuleRow icon={<HeartIcon size={44} />}  name="SOFT SKILLS · LEADERSHIP"       desc="Scénarios narratifs ramifiés, debrief IA personnalisé."                  price="24,90€" tag="POUR LA GUILDE" onAddClick={triggerBetaToast} />
        </div>
      </div>
      <div className="font-mono-pixel text-[16px] text-[var(--ink-dim)] text-center">
        Sans engagement. Annulable en 1 clic. TVA incluse pour la France.
      </div>
    </section>
  );
}
