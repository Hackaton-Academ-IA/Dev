"use client";

import { useState } from "react";
import NavBar from "@/components/landing/NavBar";
import Hero from "@/components/landing/Hero";
import ConceptSection from "@/components/landing/ConceptSection";
import CiblesSection from "@/components/landing/CiblesSection";
import TarifsSection from "@/components/landing/TarifsSection";
import LandingFooter from "@/components/landing/LandingFooter";

type ModalKind = "demo" | "guild" | null;

function DemoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="panel panel-violet w-full max-w-[620px]"
        onClick={e => e.stopPropagation()}
      >
        <div className="titlebar titlebar-violet flex items-center justify-between">
          <span className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
            ▶ DÉMO · ACADEM&apos;IA — WORLD 1-1
          </span>
          <button onClick={onClose} className="font-pixel text-[14px] text-white/70 hover:text-white leading-none px-1">✕</button>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <video
            src="/Video_demo_quiz_v1.mp4"
            controls
            autoPlay
            muted
            loop
            playsInline
            className="w-full aspect-video border-4 border-black bg-black"
          />
          <div className="text-center">
            <button onClick={onClose} className="arcade arcade-ghost text-[10px]">✕ FERMER</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuildModal({ onClose }: { onClose: () => void }) {
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!org || !email) return;
    const subject = encodeURIComponent(`[ACADEM'IA] Demande de démo — ${org}`);
    const body = encodeURIComponent(`Organisation: ${org}\nEmail: ${email}\n\n${message}`);
    window.open(`mailto:contact@academ-ia.tech?subject=${subject}&body=${body}`);
    onClose();
  }

  const inputCls = "w-full bg-[#07050f] border-4 border-black p-3 font-mono-pixel text-[16px] text-white placeholder:text-[var(--ink-dim)] focus:outline-none focus:border-[var(--elec-blue)]";

  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="panel panel-blue w-full max-w-[540px]"
        onClick={e => e.stopPropagation()}
      >
        <div className="titlebar titlebar-blue flex items-center justify-between">
          <span className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
            ◆ CONTACTER LE MAÎTRE DE GUILDE
          </span>
          <button onClick={onClose} className="font-pixel text-[14px] text-white/70 hover:text-white leading-none px-1">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3">
          <p className="font-mono-pixel text-[18px] text-[var(--ink-dim)] leading-snug">
            <span className="text-[var(--elec-blue)]">&gt; </span>
            Votre missive sera transmise dans les 48h. Onboarding sans engagement.
          </p>
          <input
            value={org} onChange={e => setOrg(e.target.value)}
            placeholder="Votre organisation / guilde"
            className={inputCls}
          />
          <input
            type="email"
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email du Maître de Guilde"
            className={inputCls}
          />
          <textarea
            value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Décrivez votre quête (nombre d'apprenants, objectifs…)"
            className={`${inputCls} h-28 resize-none`}
          />
          <div className="flex gap-3 pt-1">
            <button type="submit" className="arcade arcade-blue text-[10px] flex-1">
              ⚔ ENVOYER LA MISSIVE
            </button>
            <button type="button" onClick={onClose} className="arcade arcade-ghost text-[10px]">
              ✕ ANNULER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [modal, setModal] = useState<ModalKind>(null);

  return (
    <div className="scanlines max-w-[1280px] mx-auto p-4 sm:p-6 space-y-5">
      <NavBar />
      <Hero onDemoClick={() => setModal("demo")} />
      <ConceptSection />
      <CiblesSection onGuildDemoClick={() => setModal("guild")} />
      <TarifsSection onGuildContact={() => setModal("guild")} />
      <LandingFooter />

      {modal === "demo"  && <DemoModal  onClose={() => setModal(null)} />}
      {modal === "guild" && <GuildModal onClose={() => setModal(null)} />}
    </div>
  );
}
