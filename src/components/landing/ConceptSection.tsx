import { ChipIcon, DialIcon, TrophyIcon, PixelGrid } from "@/components/ui/PixelIcons";

function LoopNode({ icon, num, title, body, color, accent }: {
  icon: React.ReactNode; num: string; title: string; body: string;
  color: string; accent: string;
}) {
  return (
    <div className={`panel ${color} relative`}>
      <div className={`titlebar ${accent} flex items-center justify-between`}>
        <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>STEP {num}</div>
        <span className="font-mono-pixel text-[14px] text-white/80">⚙ ACTIVE</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="border-4 border-black p-2 bg-[#0a0720]" style={{ boxShadow: "inset 0 0 0 2px #2a1c5e" }}>
            {icon}
          </div>
          <div className="font-pixel text-[14px] sm:text-[16px] glow-violet leading-tight">{title}</div>
        </div>
        <p className="font-mono-pixel text-[18px] text-[var(--ink-dim)] leading-[1.45]">{body}</p>
      </div>
    </div>
  );
}

function LoopArrow({ dir = "right" }: { dir?: "right" | "down" }) {
  if (dir === "down") {
    return (
      <div className="flex justify-center items-center py-2 lg:hidden">
        <PixelGrid size={32} palette={{ K: "#000", g: "#1eea7c" }} rows={[
          "....KK....","....Kg....","....Kg....","....Kg....","..KKKgKKK.","..KggggggK","...KggggK.","....KggK..","  ...KK.....","...........",
        ]} />
      </div>
    );
  }
  return (
    <div className="hidden lg:flex justify-center items-center">
      <PixelGrid size={48} palette={{ K: "#000", g: "#1eea7c" }} rows={[
        "..........","  ...K....","  ...KK...","  .KKKKKgK..","KggggggggK","KggggggggK","  .KKKKKgK..","  ...KK...","  ...K....","...........",
      ]} />
    </div>
  );
}

export default function ConceptSection() {
  return (
    <section id="concept" className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="font-pixel text-[10px] text-[var(--emerald)] mb-2">▶ STAGE 02</div>
          <h2 className="font-pixel text-[20px] sm:text-[26px] glow-emerald">LA BOUCLE D&apos;APPRENTISSAGE</h2>
          <p className="font-mono-pixel text-[20px] text-[var(--ink-dim)] mt-2 max-w-[60ch] leading-snug">
            Un cycle infini de 3 étapes : votre IA forge le défi, jauge votre niveau, puis vous récompense. Game on.
          </p>
        </div>
        <span className="chip chip-violet">∞ INFINITE LOOP</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-stretch">
        <LoopNode num="01" color="panel-violet" accent="titlebar-violet" icon={<ChipIcon size={48} />}
          title="GÉNÉRATION PAR IA"
          body="Chaque quête est forgée à la volée par notre IA: question, indices, leviers de progression. Aucun deux runs identiques." />
        <LoopArrow />
        <LoopNode num="02" color="panel-blue" accent="titlebar-blue" icon={<DialIcon size={48} />}
          title="ADAPTATION DE LA DIFFICULTÉ"
          body="L'IA observe votre rythme et précision. Elle ajuste le tier (Easy → Boss) en direct, sans grind ni chute brutale." />
        <LoopArrow />
        <LoopNode num="03" color="panel-emerald" accent="titlebar-emerald" icon={<TrophyIcon size={48} />}
          title="RÉCOMPENSES"
          body="XP, coins, badges pixelisés et clés du donjon suivant. Streaks et combos déclenchent des drops rares." />
      </div>

      <div className="panel panel-gold">
        <div className="grid sm:grid-cols-3 divide-x-4 divide-black">
          {[
            { k: "+38%", v: "de rétention vs cours classiques", c: "glow-gold" },
            { k: "x2.4", v: "de temps d'étude hebdo", c: "glow-violet" },
            { k: "4.9/5", v: "note de satisfaction", c: "glow-emerald" },
          ].map((s, i) => (
            <div key={i} className="p-5 text-center">
              <div className={`font-pixel text-[22px] ${s.c}`}>{s.k}</div>
              <div className="font-mono-pixel text-[18px] text-[#241a00] mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
