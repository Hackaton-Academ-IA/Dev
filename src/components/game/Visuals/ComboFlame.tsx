"use client";

interface Props {
  combo: number;
}

const FLAMES = ["🔥", "🔥🔥", "🔥🔥🔥", "⚡🔥⚡", "💥🔥💥"];

export default function ComboFlame({ combo }: Props) {
  if (combo < 2) return null;

  const flameIdx = Math.min(combo - 2, FLAMES.length - 1);

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 border-4 border-black bg-[#1a0505]"
      style={{
        boxShadow: "0 0 14px var(--danger), inset 0 0 0 2px #4a0000",
        animation: "neonPulse 1s ease-in-out infinite",
      }}
    >
      <span
        className="font-pixel text-[10px] text-[var(--danger)]"
        style={{ textShadow: "2px 2px 0 #000" }}
      >
        COMBO
      </span>
      <span
        className="font-pixel text-[16px] text-[var(--gold)]"
        style={{ textShadow: "0 0 8px var(--gold)" }}
      >
        x{combo}
      </span>
      <span className="text-[16px] leading-none">{FLAMES[flameIdx]}</span>
    </div>
  );
}
