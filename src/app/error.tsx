"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div
      className="scanlines crt-flicker min-h-screen flex items-center justify-center p-6"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 40%, #3a0a0a 0%, #1a0505 50%, #09090b 100%)",
      }}
    >
      {/* Neon red grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,77,77,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,77,77,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative panel panel-danger max-w-lg w-full text-center">
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

        <div className="titlebar titlebar-danger">
          <span
            className="font-pixel text-[10px] text-white"
            style={{ textShadow: "2px 2px 0 #000" }}
          >
            ▣ ERREUR CRITIQUE — SYSTÈME K.O.
          </span>
        </div>

        <div className="p-8 space-y-5">
          {/* Flickering skull */}
          <motion.div
            animate={{ opacity: [1, 0.4, 1, 0.7, 1], scale: [1, 0.98, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="font-pixel text-[72px] select-none leading-none"
            style={{ textShadow: "4px 4px 0 #000, 0 0 24px #ff4d4d" }}
          >
            💀
          </motion.div>

          <div
            className="font-pixel text-[14px] sm:text-[18px] text-white"
            style={{ textShadow: "3px 3px 0 #000, 0 0 14px var(--danger)" }}
          >
            LE SERVEUR EST K.O.
          </div>

          <p className="font-mono-pixel text-[16px] text-[var(--ink-dim)] leading-[1.6]">
            <span className="text-[var(--danger)]">&gt; </span>
            Tentative de réanimation en cours
            <span
              className="caret ml-1"
              style={{ color: "var(--danger)" }}
            />
          </p>

          {error.digest && (
            <p className="font-mono-pixel text-[12px] text-[var(--ink-dim)] opacity-50">
              Code erreur : {error.digest}
            </p>
          )}

          <div className="pix-div my-2" />

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="arcade arcade-red font-pixel text-[9px] py-2 px-4"
            >
              ↺ RÉANIMER LE SERVEUR
            </button>
            <a
              href="/dashboard"
              className="arcade arcade-ghost font-pixel text-[9px] py-2 px-4"
            >
              ← RETOUR AU CAMP DE BASE
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
