"use client";
import { motion } from "framer-motion";
import { niveauFromTotalXp, xpThreshold } from "@/lib/game/engine";

interface Props {
  xp: number;
  lastXpGain?: number; // shown briefly after each correct answer
}

export default function ExperienceBar({ xp, lastXpGain = 0 }: Props) {
  const { niveau, xpInLevel } = niveauFromTotalXp(xp);
  const threshold = xpThreshold(niveau);
  const pct = threshold > 0 ? Math.min(100, (xpInLevel / threshold) * 100) : 0;

  return (
    <div className="panel panel-blue p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <div
          className="font-pixel text-[10px] text-[var(--emerald)]"
          style={{ textShadow: "0 0 6px var(--emerald)" }}
        >
          ★ NIVEAU {niveau}
        </div>

        <div className="flex items-center gap-2 font-mono-pixel text-[14px] text-[var(--ink-dim)]">
          <span>{xpInLevel.toLocaleString()}</span>
          <span className="text-[var(--ink-dim)]/50">/</span>
          <span>{threshold.toLocaleString()} XP</span>
          {lastXpGain > 0 && (
            <motion.span
              key={xp} // re-trigger animation on each XP gain
              className="text-[var(--gold)] font-pixel text-[10px]"
              style={{ textShadow: "0 0 4px var(--gold)" }}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: [0, 1, 1, 0], y: [-6, 0, 0, -4] }}
              transition={{ duration: 1.8, times: [0, 0.15, 0.7, 1] }}
            >
              +{lastXpGain} XP
            </motion.span>
          )}
        </div>

        <div className="font-pixel text-[10px] text-[var(--ink-dim)]">
          → LV {niveau + 1}
        </div>
      </div>

      <div
        className="h-5 border-4 border-black bg-[#0e0a22] overflow-hidden"
        style={{ boxShadow: "inset 0 2px 0 rgba(0,0,0,.4)" }}
      >
        <motion.div
          className="h-full"
          style={{
            background: `linear-gradient(90deg, var(--neon-violet), var(--elec-blue))`,
            boxShadow: "0 0 8px var(--neon-violet)",
          }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
