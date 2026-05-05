import Link from "next/link";

export default function Hero({ onDemoClick }: { onDemoClick: () => void }) {
  return (
    <section className="w-full">
      <div className="panel panel-violet">
        <div className="titlebar titlebar-violet flex items-center justify-between">
          <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>★ ACADEM&apos;IA — WORLD 1-1 ★</div>
          <div className="font-mono-pixel text-[14px] text-white/80 hidden sm:block">PRESS ▶ TO PLAY</div>
        </div>

        <div className="p-8 sm:p-12 space-y-6">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="chip chip-emerald">◆ NEW QUEST</span>
            <span className="chip chip-violet">IA POWERED</span>
            <span className="chip chip-blue">+ ADAPTIF</span>
          </div>

          {/* Panoramic layout: headline+desc left, actions+stats right */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

            {/* Left block: title + description — min-w-0 allows proper flex shrinking */}
            <div className="space-y-5 min-w-0">
              <h1 className="font-pixel leading-[1.5] text-[22px] sm:text-[30px] lg:text-[34px] xl:text-[38px]">
                <span className="glow-violet">L&apos;APPRENTISSAGE</span><br />
                <span className="text-white" style={{ textShadow: "3px 3px 0 #000" }}>DONT VOUS ÊTES</span><br />
                <span className="glow-emerald">LE HÉROS.</span>
              </h1>

              <p className="font-mono-pixel text-[20px] sm:text-[22px] text-[var(--ink-dim)] max-w-[52ch] leading-[1.4]">
                <span className="text-[var(--emerald)]">&gt; </span>
                Grimpez la <span className="text-white">Tour Infinie du savoir</span>.
                Une IA conçoit chaque quête sur mesure. Plus vous progressez,
                plus le donjon adapte ses défis. Loot, badges, boss : tout y passe.
              </p>
            </div>

            {/* Right block: CTA buttons + stats — no shrink-0, flex-wrap handles tight spaces */}
            <div className="flex flex-col gap-5 lg:items-end">
              <div className="flex flex-wrap gap-3">
                <Link href="/login" className="arcade arcade-emerald arcade-glow text-[12px] sm:text-[14px]">
                  ▶ INSERT COIN / COMMENCER
                </Link>
                <button onClick={onDemoClick} className="arcade arcade-ghost text-[10px]">▷ VOIR LA DÉMO 90s</button>
              </div>

              <div className="flex flex-wrap gap-5 font-mono-pixel text-[16px] text-[var(--ink-dim)]">
                <span>★ <span className="text-white">12 480</span> joueurs</span>
                <span>◎ <span className="text-[var(--gold)]">4.9/5</span> note moyenne</span>
                <span>⚔ <span className="text-[var(--emerald)]">6 mondes</span></span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
