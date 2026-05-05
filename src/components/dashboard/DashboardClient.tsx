"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { PixelBadge } from "@/components/ui/PixelIcons";

/* ── Question bank (fallback when no AI available) ── */
const QUESTION_BANK = [
  {
    q: "Quel mathématicien grec a démontré l'infinité des nombres premiers ?",
    choices: ["Pythagore", "Euclide", "Archimède", "Thalès"],
    correct: 1,
    expl: "Euclide, dans les Éléments (livre IX), prouve qu'il existe une infinité de nombres premiers.",
  },
  {
    q: "En quelle année la Révolution française a-t-elle débuté ?",
    choices: ["1689", "1715", "1789", "1804"],
    correct: 2,
    expl: "La prise de la Bastille a eu lieu le 14 juillet 1789, marquant le début de la Révolution.",
  },
  {
    q: "Quelle planète possède la plus grande tempête du système solaire ?",
    choices: ["Mars", "Saturne", "Neptune", "Jupiter"],
    correct: 3,
    expl: "La Grande Tache Rouge de Jupiter est un anticyclone géant observé depuis le XVIIe siècle.",
  },
  {
    q: "Qui a peint la voûte de la chapelle Sixtine ?",
    choices: ["Raphaël", "Michel-Ange", "Léonard de Vinci", "Le Caravage"],
    correct: 1,
    expl: "Michel-Ange a peint la voûte entre 1508 et 1512 à la demande du pape Jules II.",
  },
  {
    q: "Quel est l'élément le plus abondant dans l'univers ?",
    choices: ["Hélium", "Oxygène", "Hydrogène", "Carbone"],
    correct: 2,
    expl: "L'hydrogène représente environ 75% de la masse baryonique de l'univers.",
  },
  {
    q: "Dans la mythologie grecque, qui a coupé la tête de Méduse ?",
    choices: ["Thésée", "Persée", "Héraclès", "Achille"],
    correct: 1,
    expl: "Persée tue Méduse à l'aide d'un bouclier-miroir offert par Athéna.",
  },
];

interface Question {
  q: string;
  choices: string[];
  correct: number;
  expl: string;
}

/* ── Sparkles burst on correct answer ── */
interface SparkBurst {
  id: string;
  left: number;
  top: number;
  dx: string;
  color: string;
}

function Sparkles({ trigger }: { trigger: number }) {
  const [bursts, setBursts] = useState<SparkBurst[]>([]);

  useEffect(() => {
    if (!trigger) return;
    
    const colors = ["#ffd23a", "#1eea7c", "#22a7ff", "#b14bff", "#fff"];
    const items: SparkBurst[] = Array.from({ length: 14 }).map((_, i) => ({
      id: `${trigger}-${i}`,
      left: 30 + Math.random() * 40,
      top: 40 + Math.random() * 30,
      dx: (Math.random() * 120 - 60) + "px",
      color: colors[i % 5],
    }));

    let t2: NodeJS.Timeout;

    const t1 = setTimeout(() => {
      setBursts(items);
      // Disparition après 1 seconde
      t2 = setTimeout(() => setBursts([]), 1000);
    }, 0);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2); 
    };
  }, [trigger]);

  return (
    <>
      {bursts.map((b) => (
        <span
          key={b.id}
          className="sparkle"
          style={{ left: b.left + "%", top: b.top + "%", "--dx": b.dx, background: b.color } as React.CSSProperties}
        />
      ))}
    </>
  );
}

/* ── Header with marquee ticker ── */
function Header({ name, level, coins, onLogout, isAdmin }: { name: string; level: number; coins: number; onLogout: () => void; isAdmin?: boolean }) {
  const colorMap: Record<string, string> = { v: "#1a1233", K: "#fff", b: "#b14bff", e: "#1eea7c" };
  return (
    <header className="panel panel-violet">
      <div className="titlebar titlebar-violet flex items-center justify-between">
        <div className="font-pixel text-[10px] sm:text-[11px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
          ★ ACADEM&apos;IA ARCADE ★
        </div>
        <div className="font-mono-pixel text-[14px] text-white/90 hidden sm:block">
          SAVE FILE 01 — ONLINE <span className="caret">&nbsp;</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="w-[64px] h-[64px] grid grid-cols-8 grid-rows-8 border-4 border-black"
               style={{ boxShadow: "0 6px 0 #000, inset 0 0 0 2px #2c0f4d" }}>
            {["vvvvvvvv","vKKKvKKv","vKbKvKvv","vKKKvKvv","vKbKvKvv","vKbKvKvv","vvvvvvvv","eeeeeeee"].map((row, y) =>
              row.split("").map((ch, x) => (
                <div key={`${x}-${y}`} style={{ background: colorMap[ch] }} />
              ))
            )}
          </div>
          <div>
            <div className="font-pixel text-[18px] sm:text-[22px] glow-violet leading-none">
              ACADEM<span style={{ color: "#1eea7c" }}>&apos;</span>IA
            </div>
            <div className="font-mono-pixel text-[16px] text-[var(--ink-dim)] mt-1">
              &gt; LEARN. LEVEL UP. REPEAT.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="hidden md:flex items-center gap-2 font-mono-pixel text-[16px] text-[var(--ink-dim)]">
            <span className="coin" />
            <span>{coins.toLocaleString()}</span>
            <span className="mx-2">|</span>
            <span className="font-pixel text-[10px] text-[var(--emerald)]">LV {level}</span>
          </div>
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="arcade arcade-gold text-[10px] flex items-center gap-1"
              style={{ boxShadow: "0 6px 0 #000, inset 0 -4px 0 rgba(0,0,0,.35), 0 0 12px var(--gold)" }}
            >
              👑 CONSOLE GM
            </Link>
          )}
          <Link
            href="/leaderboard"
            className="arcade arcade-ghost text-[10px] flex items-center gap-1"
          >
            🏆 CLASSEMENT
          </Link>
          <button className="arcade arcade-red text-[10px]" onClick={onLogout}>
            ⏻ LOG OUT
          </button>
        </div>
      </div>

      <div className="border-t-4 border-black overflow-hidden bg-black">
        <div className="marquee-track py-2 font-mono-pixel text-[16px]">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span className="text-[var(--emerald)]">◆ NEW QUEST UNLOCKED:</span>
              <span>&quot;Les Lumières&quot; — +250 XP</span>
              <span className="text-[var(--neon-violet)]">◆ DAILY STREAK:</span>
              <span>7 DAYS</span>
              <span className="text-[var(--elec-blue)]">◆ GUILD EVENT:</span>
              <span>BOSS RAID @ 20:00</span>
              <span className="text-[var(--gold)]">◆ HERO:</span>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ── Player profile card ── */
function PlayerProfile({ name, level, xp, xpMax, hp, hpMax, coins, streak }: {
  name: string; level: number;
  xp: number; xpMax: number;
  hp: number; hpMax: number;
  coins: number; streak: number;
}) {
  const segs = 20;
  const filled = Math.round((xp / xpMax) * segs);
  return (
    <section className="panel panel-blue">
      <div className="titlebar titlebar-blue flex items-center justify-between">
        <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>▣ PLAYER PROFILE</div>
        <div className="font-mono-pixel text-[14px] text-white/80">SLOT 01</div>
      </div>
      <div className="p-5 sm:p-6 grid md:grid-cols-[120px_1fr] gap-5 items-center">
        <div className="mx-auto md:mx-0">
          <div className="w-[112px] h-[112px] border-4 border-black bg-[#0a0720]"
               style={{ boxShadow: "0 6px 0 #000, inset 0 0 0 2px #08305c" }}>
            <svg width="112" height="112" viewBox="0 0 16 16" shapeRendering="crispEdges">
              {[
                "................","....KKKKKKKK....","...KvvvvvvvvK...","..KvvvvvvvvvvK..",
                "..KvWWWvWWWvvK..","..KvWKWvWKWvvK..","..KvWWWvWWWvvK..","..KvvvvKvvvvvK..",
                "..KvKKKKKKKvvK..","..KvvKKKKKvvvK..","..KvvvvvvvvvvK...","...KvvvvvvvvK...",
                "....KKKKKKKK....","....K......K....","...KK......KK...","..KK........KK..",
              ].map((row, y) =>
                row.split("").map((ch, x) => {
                  const fill: Record<string, string> = { K: "#000", v: "#b14bff", W: "#fff3c2" };
                  if (!fill[ch]) return null;
                  return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill[ch]} />;
                })
              )}
            </svg>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="font-mono-pixel text-[14px] text-[var(--ink-dim)]">PSEUDO</div>
              <div className="font-pixel text-[18px] sm:text-[20px] glow-blue">{name}</div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="font-pixel text-[10px] px-3 py-2 border-4 border-black bg-[var(--neon-violet)]"
                   style={{ boxShadow: "inset 0 -4px 0 rgba(0,0,0,.35), 0 4px 0 #000", color: "#fff", textShadow: "2px 2px 0 #000" }}>
                LV {level}
              </div>
              <div className="font-pixel text-[10px] px-3 py-2 border-4 border-black bg-[var(--gold)]"
                   style={{ boxShadow: "inset 0 -4px 0 rgba(0,0,0,.35), 0 4px 0 #000", color: "#241a00", textShadow: "1px 1px 0 #6e5300" }}>
                CLASS · SCHOLAR
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between font-mono-pixel text-[14px] text-[var(--ink-dim)] mb-1">
              <span className="font-pixel text-[10px] text-[var(--emerald)]">XP</span>
              <span>{xp.toLocaleString()} / {xpMax.toLocaleString()}</span>
            </div>
            <div className="lifebar">
              {Array.from({ length: segs }).map((_, i) => (
                <div key={i} className={`seg ${i < filled ? "" : "empty"}`} />
              ))}
            </div>
            <div className="flex justify-between font-mono-pixel text-[14px] text-[var(--ink-dim)] mt-1">
              <span>NEXT LV: <span className="text-[var(--emerald)]">{(xpMax - xp).toLocaleString()} XP</span></span>
              <span>STREAK: <span className="text-[var(--hot-pink)]">🔥 {streak}d</span></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <div>
              <div className="font-pixel text-[10px] text-[var(--danger)] mb-1">HP</div>
              <div className="hp-row">
                {Array.from({ length: hpMax }).map((_, i) => (
                  <div key={i} className={`hp ${i < hp ? "" : "empty"}`} />
                ))}
              </div>
            </div>
            <div>
              <div className="font-pixel text-[10px] text-[var(--gold)] mb-1">COINS</div>
              <div className="font-mono-pixel text-[20px] flex items-center gap-2">
                <span className="coin" />{coins.toLocaleString()}
              </div>
            </div>
            <div className="ml-auto hidden sm:block">
              <div className="font-pixel text-[10px] text-[var(--ink-dim)] mb-1">WORLD MAP</div>
              <div className="flex gap-1">
                {(["on","on","on","on","warn","off","boss","off"] as const).map((s, i) => (
                  <div key={i} className={`tile ${s === "on" ? "on" : s === "boss" ? "boss" : s === "warn" ? "warn" : ""}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── AI Challenge panel ── */
interface AwardPayload { xp?: number; coins?: number; hp?: number }

function AIChallenge({ onAward }: { onAward: (award: AwardPayload) => void }) {
  const [question, setQuestion] = useState<Question>(QUESTION_BANK[0]);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [typed, setTyped] = useState("");
  const [sparkleKey, setSparkleKey] = useState(0);
  const typingRef = useRef(0);

useEffect(() => {
  typingRef.current = 0;
  let cancelled = false;
  
  const tick = () => {
    if (cancelled) return;
    typingRef.current += 1;
    setTyped(question.q.slice(0, typingRef.current));
    if (typingRef.current < question.q.length) {
      setTimeout(tick, 18);
    }
  };

  // On décale l'initialisation pour éviter le rendu en cascade
  setTimeout(() => {
    if (!cancelled) {
      setTyped("");
      tick();
    }
  }, 0);

  return () => { cancelled = true; };
}, [question]);

  const fetchNew = () => {
    setPicked(null);
    setRevealed(false);
    let next: Question;
    do { next = QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)]; }
    while (next.q === question.q && QUESTION_BANK.length > 1);
    setQuestion(next);
  };

  const onPick = (i: number) => {
    if (revealed) return;
    setPicked(i);
    setRevealed(true);
    if (i === question.correct) {
      setStreak((s) => s + 1);
      setSparkleKey((k) => k + 1);
      onAward({ xp: 50 + streak * 10, coins: 12 });
    } else {
      setStreak(0);
      onAward({ xp: 5, coins: 0, hp: -1 });
    }
  };

  const letters = ["A", "B", "C", "D"];
  const badgeTones = ["", "b-blue", "b-emerald", "b-gold"];
  const fullyTyped = typed.length === question.q.length;

  return (
    <section className="panel panel-violet relative">
      <div className="titlebar titlebar-violet flex items-center justify-between">
        <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
          ▶ LE DÉFI DE L&apos;IA
        </div>
        <div className="font-mono-pixel text-[14px] text-white/80 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-[var(--emerald)]" style={{ boxShadow: "0 0 6px var(--emerald)" }} />
          IA · ONLINE
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5 relative">
        <div className="crt-screen p-5 sm:p-7">
          <div className="flex items-center justify-between mb-3 font-mono-pixel text-[14px] text-[var(--ink-dim)]">
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[10px] text-[var(--neon-violet)]">
                QUEST #{(question.q.length * 7) % 9999}
              </span>
              <span>·</span>
              <span>STREAK <span className="text-[var(--emerald)]">x{streak}</span></span>
            </div>
            <span className="font-pixel text-[10px] text-[var(--gold)]">+50 XP</span>
          </div>

          <div className="font-pixel text-[14px] sm:text-[16px] leading-[1.7] text-white min-h-[88px]"
               style={{ textShadow: "2px 2px 0 #000" }}>
            <span style={{ color: "#1eea7c" }}>&gt; </span>{typed}
            {!fullyTyped && <span className="caret">&nbsp;</span>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 relative">
          {question.choices.map((c, i) => {
            let cls = "qcm";
            if (revealed) {
              if (i === question.correct) cls += " correct";
              else if (i === picked) cls += " wrong";
              else cls += " muted";
            }
            return (
              <button key={i} className={cls} disabled={revealed || !fullyTyped} onClick={() => onPick(i)}>
                <span className={`badge-letter ${badgeTones[i]}`}>{letters[i]}</span>
                <span className="text-[12px] sm:text-[13px] leading-[1.5]" style={{ textShadow: "2px 2px 0 #000" }}>
                  {c}
                </span>
                {revealed && i === question.correct && (
                  <span className="ml-auto font-pixel text-[10px] text-[var(--emerald)]">✔</span>
                )}
                {revealed && i === picked && i !== question.correct && (
                  <span className="ml-auto font-pixel text-[10px] text-[var(--danger)]">✘</span>
                )}
              </button>
            );
          })}
          <Sparkles trigger={sparkleKey} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <div className="font-mono-pixel text-[16px] min-h-[24px]">
            {revealed && picked === question.correct && (
              <span className="text-[var(--emerald)]">★ VICTOIRE — {question.expl}</span>
            )}
            {revealed && picked !== question.correct && (
              <span className="text-[var(--danger)]">✘ RATÉ — {question.expl}</span>
            )}
            {!revealed && fullyTyped && (
              <span className="text-[var(--ink-dim)]">CHOISIS UNE RÉPONSE — [A][B][C][D]</span>
            )}
          </div>
          <div className="flex gap-3">
            <button className="arcade arcade-ghost text-[10px]" onClick={fetchNew}>
              ↻ NOUVELLE QUÊTE
            </button>
            {revealed && (
              <button className="arcade arcade-emerald text-[10px]" onClick={fetchNew}>
                ▶ CONTINUER
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Badge inventory ── */
const BADGES = [
  { kind: "book"  as const, name: "FIRST QUEST",  locked: false, isNew: false },
  { kind: "sword" as const, name: "BOSS SLAYER",  locked: false, isNew: true  },
  { kind: "potion"as const, name: "ALCHEMIST",    locked: false, isNew: false },
  { kind: "crown" as const, name: "TOP 1%",       locked: false, isNew: false },
  { kind: "atom"  as const, name: "SCIENCE PRO",  locked: false, isNew: false },
  { kind: "heart" as const, name: "NO MISTAKES",  locked: true,  isNew: false },
  { kind: "skull" as const, name: "NIGHT OWL",    locked: true,  isNew: false },
  { kind: "lock"  as const, name: "???",          locked: true,  isNew: false },
  { kind: "lock"  as const, name: "???",          locked: true,  isNew: false },
];

function Inventory() {
  const unlocked = BADGES.filter((b) => !b.locked).length;
  return (
    <aside className="panel panel-emerald">
      <div className="titlebar titlebar-emerald flex items-center justify-between">
        <div className="font-pixel text-[10px] text-black" style={{ textShadow: "1px 1px 0 #052b16" }}>
          ♦ INVENTAIRE DE BADGES
        </div>
        <div className="font-mono-pixel text-[14px] text-black/80">{unlocked}/{BADGES.length}</div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map((b, i) => (
            <div key={i}
                 className={`relative flex flex-col items-center gap-2 p-3 border-4 border-black ${b.locked ? "bg-[#0e0a22]" : "bg-[#0b1a13]"}`}
                 style={{ boxShadow: b.locked ? "inset 0 0 0 2px #1a1233, 0 4px 0 #000" : "inset 0 0 0 2px #0d8f4a, 0 4px 0 #000" }}>
              <div style={{ filter: b.locked ? "grayscale(1) brightness(0.5)" : "none" }}>
                <PixelBadge kind={b.kind} size={44} />
              </div>
              <div className="font-pixel text-[8px] text-center leading-[1.6]"
                   style={{ color: b.locked ? "var(--ink-dim)" : "#dfffe9", textShadow: "1px 1px 0 #000" }}>
                {b.locked ? "?????" : b.name}
              </div>
              {b.isNew && !b.locked && (
                <div className="absolute -top-2 -right-2 font-pixel text-[8px] px-2 py-1 bg-[var(--hot-pink)] border-2 border-black"
                     style={{ color: "#fff", textShadow: "1px 1px 0 #000" }}>
                  NEW!
                </div>
              )}
              {b.locked && (
                <div className="absolute top-1 right-1">
                  <PixelBadge kind="lock" size={22} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pix-div mt-5 mb-4" />

        <div className="font-pixel text-[10px] text-[var(--emerald)] mb-2">⚔ DAILY QUESTS</div>
        <ul className="space-y-2 font-mono-pixel text-[16px]">
          {[
            { label: "Réussir 3 quêtes d'affilée", done: true,  reward: "+30 XP"    },
            { label: "Battre le boss «Algèbre»",   done: false, reward: "+1 BADGE"  },
            { label: "Étudier 15 min",             done: false, reward: "+15 ◎"     },
          ].map((q, i) => (
            <li key={i} className="flex items-center justify-between gap-3 px-3 py-2 border-2 border-black bg-[#0a0720]">
              <div className="flex items-center gap-3">
                <span className={`w-4 h-4 border-2 border-black ${q.done ? "bg-[var(--emerald)]" : "bg-[#1a1233]"}`} />
                <span className={q.done ? "line-through text-[var(--ink-dim)]" : ""}>{q.label}</span>
              </div>
              <span className="font-pixel text-[8px] text-[var(--gold)]">{q.reward}</span>
            </li>
          ))}
        </ul>

        <button className="arcade arcade-gold text-[10px] w-full mt-5">
          ◆ OUVRIR LE COFFRE
        </button>
      </div>
    </aside>
  );
}

/* ── Logout confirmation overlay ── */
function LogoutOverlay({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4">
      <div className="panel panel-violet max-w-md w-full">
        <div className="titlebar titlebar-violet font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
          ⚠ SAVE &amp; QUIT?
        </div>
        <div className="p-5 space-y-4">
          <div className="font-mono-pixel text-[18px] leading-snug">
            <span className="text-[var(--emerald)]">&gt; </span>
            Veux-tu vraiment quitter la partie ?
          </div>
          <div className="flex gap-3 justify-end flex-wrap">
            <button className="arcade arcade-ghost text-[10px]" onClick={onCancel}>CANCEL</button>
            <button className="arcade arcade-red text-[10px]" onClick={onConfirm}>YES — LOG OUT</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Root dashboard client ── */
export default function DashboardClient({ playerName, isAdmin }: { playerName: string; isAdmin?: boolean }) {
  const router = useRouter();
  const [xp, setXp] = useState(7320);
  const xpMax = 10000;
  const [hp, setHp] = useState(4);
  const hpMax = 5;
  const [coins, setCoins] = useState(1240);
  const streak = 7;
  const level = 14;
  const [confirmLogout, setConfirmLogout] = useState(false);

  const onAward = ({ xp: dx = 0, coins: dc = 0, hp: dh = 0 }: AwardPayload) => {  
    if (dx) setXp((v) => Math.min(xpMax, v + dx));
    if (dc) setCoins((v) => v + dc);
    if (dh) setHp((v) => Math.max(0, Math.min(hpMax, v + dh)));
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } catch {
      // réseau coupé pendant la déconnexion — on redirige quand même
    }
    router.push("/login");
  };

  return (
    <div className="max-w-[1280px] mx-auto p-4 sm:p-6 space-y-5">
      <Header
        name={playerName}
        level={level}
        coins={coins}
        onLogout={() => setConfirmLogout(true)}
        isAdmin={isAdmin}
      />

      <PlayerProfile
        name={playerName}
        level={level}
        xp={xp} xpMax={xpMax}
        hp={hp} hpMax={hpMax}
        coins={coins}
        streak={streak}
      />

      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        <AIChallenge onAward={onAward} />
        <Inventory />
      </div>

      <footer className="panel mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 font-mono-pixel text-[14px] text-[var(--ink-dim)]">
          <div>© 2026 ACADEM&apos;IA · ARCADE EDITION · CART v1.16-bit</div>
          <div className="flex flex-wrap gap-4">
            <span>FPS: 60 · LATENCY: 4ms</span>
            <button className="underline hover:text-[var(--neon-violet)]" onClick={() => setConfirmLogout(true)}>
              EXIT GAME
            </button>
          </div>
        </div>
      </footer>

      {confirmLogout && (
        <LogoutOverlay
          onCancel={() => setConfirmLogout(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}
