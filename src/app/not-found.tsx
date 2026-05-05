"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div
      className="scanlines crt-flicker min-h-screen flex items-center justify-center p-6"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 40%, #1a0838 0%, #0d0520 50%, #09090b 100%)",
      }}
    >
      {/* Neon grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(122,48,208,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(122,48,208,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative panel panel-violet max-w-lg w-full text-center">
        {/* Corner pixels */}
        {[
          "-top-[7px] -left-[7px]",
          "-top-[7px] -right-[7px]",
          "-bottom-[7px] -left-[7px]",
          "-bottom-[7px] -right-[7px]",
        ].map((pos, i) => (
          <span
            key={i}
            className={`absolute w-[14px] h-[14px] bg-white border-[3px] border-black ${pos}`}
          />
        ))}

        <div className="titlebar titlebar-violet">
          <span
            className="font-pixel text-[10px] text-white"
            style={{ textShadow: "2px 2px 0 #000" }}
          >
            ▣ ERREUR SYSTÈME — CODE 404
          </span>
        </div>

        <div className="p-8 space-y-5">
          {/* Floating ghost */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="font-pixel text-[72px] select-none leading-none"
            style={{ textShadow: "4px 4px 0 #000, 0 0 24px #b14bff" }}
          >
            👻
          </motion.div>

          <div
            className="font-pixel text-[16px] sm:text-[22px] text-white"
            style={{
              textShadow: "3px 3px 0 #000, 0 0 14px var(--neon-violet)",
            }}
          >
            ERREUR 404
          </div>

          <p className="font-mono-pixel text-[16px] text-[var(--ink-dim)] leading-[1.5]">
            <span className="text-white">Vous avez glitché hors de la map.</span>
            <br />
            <span className="text-[var(--neon-violet)]">&gt;</span>{" "}
            Cette zone n&apos;existe pas dans notre univers.
          </p>

          <div className="pix-div my-2" />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "XP PERDU", val: "???", chip: "chip-danger" },
              { label: "HP RESTANTS", val: "0", chip: "chip-blue" },
              { label: "ZONE", val: "VIDE", chip: "chip-ghost" },
            ].map((s) => (
              <div key={s.label} className="panel p-3">
                <div className="font-pixel text-[8px] text-[var(--ink-dim)] mb-1">{s.label}</div>
                <span className={`chip ${s.chip} text-[10px]`}>{s.val}</span>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard"
            className="arcade arcade-emerald arcade-glow inline-flex items-center gap-2 font-pixel text-[10px] mt-2"
          >
            ▲ RETOUR AU DASHBOARD
          </Link>
        </div>
      </div>
    </div>
  );
}
