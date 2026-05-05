"use client";

interface Props {
  remaining: number;
  total: number;
}

export default function TimerBar({ remaining, total }: Props) {
  const pct = total > 0 ? Math.max(0, (remaining / total) * 100) : 0;
  const isRed = remaining <= total / 3;
  const isOrange = !isRed && remaining <= (total * 2) / 3;
  const color = isRed ? "var(--danger)" : isOrange ? "var(--gold)" : "var(--emerald)";

  return (
    <div className="flex items-center gap-3">
      <div
        className="font-pixel text-[10px] tabular-nums"
        style={{ color, minWidth: "32px", textShadow: "2px 2px 0 #000" }}
      >
        {remaining}s
      </div>
      <div
        className="flex-1 h-5 border-4 border-black bg-[#0e0a22] overflow-hidden"
        style={{ boxShadow: "inset 0 2px 0 rgba(0,0,0,.4)" }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            boxShadow: isRed ? `0 0 10px ${color}` : "none",
            transition: "width 1s linear, background 0.5s",
          }}
        />
      </div>
    </div>
  );
}
