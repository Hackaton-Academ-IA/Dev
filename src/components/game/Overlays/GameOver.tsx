"use client";
import Link from "next/link";

interface Props {
  correct: number;
  total: number;
  xpGained: number;
  niveau: number;
  onRestart: () => void;
}

export default function GameOver({ correct, total, xpGained, niveau, onRestart }: Props) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const stats = [
    { label: "BONNES RÉP.", value: `${correct}/${total}` },
    { label: "PRÉCISION",   value: `${accuracy}%` },
    { label: "XP GAGNÉ",    value: `+${xpGained}` },
  ];

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 p-4">
      <div className="panel panel-danger max-w-md w-full" style={{ boxShadow: "0 0 32px var(--danger)" }}>
        <div
          className="titlebar titlebar-danger font-pixel text-[10px] text-white"
          style={{ textShadow: "2px 2px 0 #000" }}
        >
          ☠ GAME OVER
        </div>
        <div className="p-6 space-y-5 text-center">
          <div
            className="font-pixel text-[20px] sm:text-[24px] text-[var(--danger)]"
            style={{ textShadow: "4px 4px 0 #000" }}
          >
            TU ES TOMBÉ AU COMBAT
          </div>

          <div className="grid grid-cols-3 gap-3">
            {stats.map(({ label, value }) => (
              <div key={label} className="border-4 border-black bg-[#0e0a22] p-3">
                <div className="font-mono-pixel text-[12px] text-[var(--ink-dim)]">{label}</div>
                <div className="font-pixel text-[12px] sm:text-[14px] text-white mt-1">{value}</div>
              </div>
            ))}
          </div>

          <div className="font-mono-pixel text-[16px] text-[var(--ink-dim)]">
            Niveau final :{" "}
            <span className="text-[var(--neon-violet)]" style={{ textShadow: "0 0 6px var(--neon-violet)" }}>
              LV {niveau}
            </span>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button className="arcade arcade-ghost text-[10px]" onClick={onRestart}>
              ↺ RÉESSAYER
            </button>
            <Link href="/dashboard" className="arcade arcade-emerald text-[10px]">
              ⬅ DASHBOARD
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
