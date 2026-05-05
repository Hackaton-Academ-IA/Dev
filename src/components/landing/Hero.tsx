import Link from "next/link";

export default function Hero({ onDemoClick }: { onDemoClick: () => void }) {
  return (
    <section className="grid lg:grid-cols-[1.1fr_1fr] gap-5">
      <div className="panel panel-violet">
        <div className="titlebar titlebar-violet flex items-center justify-between">
          <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>★ ACADEM&apos;IA — WORLD 1-1 ★</div>
          <div className="font-mono-pixel text-[14px] text-white/80 hidden sm:block">PRESS ▶ TO PLAY</div>
        </div>
        <div className="p-5 sm:p-8 space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="chip chip-emerald">◆ NEW QUEST</span>
            <span className="chip chip-violet">IA POWERED</span>
            <span className="chip chip-blue">+ ADAPTIF</span>
          </div>

          <h1 className="font-pixel leading-[1.5] text-[22px] sm:text-[30px] lg:text-[34px]">
            <span className="glow-violet">L&apos;APPRENTISSAGE</span><br />
            <span className="text-white" style={{ textShadow: "3px 3px 0 #000" }}>DONT VOUS ÊTES</span><br />
            <span className="glow-emerald">LE HÉROS.</span>
          </h1>

          <p className="font-mono-pixel text-[20px] sm:text-[22px] text-[var(--ink-dim)] max-w-[58ch] leading-[1.4]">
            <span className="text-[var(--emerald)]">&gt; </span>
            Grimpez la <span className="text-white">Tour Infinie du savoir</span>.
            Une IA conçoit chaque quête sur mesure. Plus vous progressez,
            plus le donjon adapte ses défis. Loot, badges, boss : tout y passe.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
            <Link href="/login" className="arcade arcade-emerald arcade-glow text-[12px] sm:text-[14px]">
              ▶ INSERT COIN / COMMENCER
            </Link>
            <button onClick={onDemoClick} className="arcade arcade-ghost text-[10px]">▷ VOIR LA DÉMO 90s</button>
          </div>

          <div className="flex flex-wrap gap-5 pt-4 font-mono-pixel text-[16px] text-[var(--ink-dim)]">
            <span>★ <span className="text-white">12 480</span> joueurs</span>
            <span>◎ <span className="text-[var(--gold)]">4.9/5</span> note moyenne</span>
            <span>⚔ <span className="text-[var(--emerald)]">6 mondes</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}
