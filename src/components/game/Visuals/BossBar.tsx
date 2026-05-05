"use client";

interface Props {
  name: string;
  hp: number;
  maxHp: number;
}

export default function BossBar({ name, hp, maxHp }: Props) {
  return (
    <div
      className="panel panel-danger p-3 space-y-2"
      style={{ boxShadow: "0 0 16px var(--danger)" }}
    >
      <div className="flex items-center justify-between">
        <div
          className="font-pixel text-[10px] text-white"
          style={{ textShadow: "2px 2px 0 #000" }}
        >
          ☠ {name}
        </div>
        <div className="font-mono-pixel text-[14px] text-[var(--danger)]">
          {hp}/{maxHp} PV
        </div>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: maxHp }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-6 border-4 border-black"
            style={{
              background: i < hp ? "var(--danger)" : "#0e0a22",
              boxShadow:
                i < hp
                  ? "0 0 8px var(--danger), inset 0 -4px 0 rgba(0,0,0,.4)"
                  : "inset 0 2px 0 rgba(0,0,0,.4)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
