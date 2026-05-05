"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { LeaderboardPlayer } from "./page";

/* ── Pixel SVG engine ─────────────────────────────────── */
function PixelGrid({
  rows,
  palette,
  size = 24,
}: {
  rows: string[];
  palette: Record<string, string>;
  size?: number;
}) {
  const w = rows[0].length,
    h = rows.length;
  return (
    <svg
      width={size}
      height={(size * h) / w}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
    >
      {rows.map((row, y) =>
        row.split("").map((ch, x) => {
          const fill = palette[ch];
          if (!fill) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
        })
      )}
    </svg>
  );
}

/* ── Themed pixel avatars (5 character classes) ───────── */
const AVATAR_KINDS: { palette: Record<string, string>; rows: string[] }[] = [
  {
    palette: { K: "#000", h: "#3a2585", s: "#ffd6a8", v: "#b14bff", w: "#fff", g: "#ffd23a" },
    rows: [
      "....KKKK....", "...KhhhhK...", "..KhKhhKhK..", "..KhhhhhhK..",
      "..KsKssKsK..", "...KsssK....", "..KvvvvvvK..", ".KvKvvvvKvK.",
      ".KvggvvggvK.", ".KvvvvvvvvK.", "..KKvvvvKK..", "..K..KK..K..",
    ],
  },
  {
    palette: { K: "#000", b: "#22a7ff", w: "#bfe5ff", s: "#ffd6a8", r: "#ff2d55" },
    rows: [
      ".KKKKKKKKKK.", "KbbbbbbbbbbK", "KbKKbbbbKKbK", "KbssbbbbssbK",
      "KbssbbbbssbK", "KbKKKKKKKKbK", "KbbbbrrbbbbK", "KbbKKKKKKbbK",
      ".KbbbbbbbbK.", "..KKKKKKKK..", "...KbbbbK...", "....KKKK....",
    ],
  },
  {
    palette: { K: "#000", g: "#0d8f4a", e: "#1eea7c", s: "#ffd6a8", w: "#fff" },
    rows: [
      "....KKKK....", "...KggggK...", "..KgKggKgK..", "..KssssssK..",
      "..KsKssKsK..", "...KsssK....", "..KeeggeeK..", ".KeKeggeKeK.",
      ".KeeeggeeeK.", ".KKKeggeKKK.", "...KggggK...", "....KKKK....",
    ],
  },
  {
    palette: { K: "#000", p: "#ff3aa3", w: "#ffd0e6", s: "#ffd6a8", g: "#ffd23a" },
    rows: [
      "....KKKK....", "...KppppK...", "..KpKppKpK..", "..KppppppK..",
      "..KsKssKsK..", "...KsssK....", "..KppgppgK..", ".KpKppppKpK.",
      ".KppppppppK.", ".KKKppppKKK.", "...KppppK...", "....KKKK....",
    ],
  },
  {
    palette: { K: "#000", g: "#ffd23a", w: "#fff3c2", s: "#ffd6a8", v: "#b14bff" },
    rows: [
      ".K.K.K.K.K..", ".KgKgKgKgKg.", "KggggggggggK", "KgKKggggKKgK",
      "KgssggggssgK", "KgssggggssgK", "KgKKKKKKKKgK", "KggvvvvvvggK",
      "KggKKKKKKggK", ".KggggggggK.", "..KKKKKKKK..", "....KKKK....",
    ],
  },
];

function PixelAvatar({ seed, size = 44 }: { seed: string; size?: number }) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  const kind = AVATAR_KINDS[h % AVATAR_KINDS.length];
  return <PixelGrid size={size} palette={kind.palette} rows={kind.rows} />;
}

/* ── Icons ────────────────────────────────────────────── */
const CrownIcon = ({ size = 28, c = "#ffd23a" }: { size?: number; c?: string }) => (
  <PixelGrid
    size={size}
    palette={{ K: "#000", g: c, w: "#fff3c2", r: "#ff3aa3" }}
    rows={[
      "K....K....K..", "Kg...Kg...Kg.", "Kgg.KKgg.KKgg",
      "KggKKKggKKKgg", "KggggggggggK.", "KggrgggrgggK.",
      "KggggggggggK.", "KKKKKKKKKKK..",
    ]}
  />
);

const TrophyIcon = ({ size = 28 }: { size?: number }) => (
  <PixelGrid
    size={size}
    palette={{ K: "#000", g: "#ffd23a", o: "#a87a00", w: "#fff3c2" }}
    rows={[
      "..............", ".KKKKKKKKKKKK.", ".KggggggggggK.",
      "KKgggggggggggK", "KogggggggggggK", "KogggggggggggK",
      "KKgggggggggggK", ".KKgggggggggK.", "...KgggggK....",
      "....KgggK.....", "...KKKKKKK....", "..KooooooooK..",
      ".KKKKKKKKKKKK.", "..............",
    ]}
  />
);

const TowerIcon = ({ size = 28 }: { size?: number }) => (
  <PixelGrid
    size={size}
    palette={{ K: "#000", v: "#b14bff", w: "#fff", g: "#1eea7c" }}
    rows={[
      "...KK........", "..KvKKKKKKKK.", "..KvvvvvvvvK.",
      "..KKKKKKKKKK.", "..KvKvvKvKvK.", "..KvKvvKvKvK.",
      "..KKKKKKKKKK.", "..KvvvvvvvvK.", "..KvKvvKvKvK.",
      "..KKKKKKKKKK.", "..KvvvvvvvvK.", "..KKKKKKKKKK.",
      ".............", ".............",
    ]}
  />
);

const CoinIcon = ({ size = 18 }: { size?: number }) => (
  <PixelGrid
    size={size}
    palette={{ K: "#000", g: "#ffd23a", o: "#a87a00", w: "#fff3c2" }}
    rows={[
      "..KKKKKK..", ".KggggggK.", "KgwgggggKK",
      "KgwgggggKK", "KggggggggK", "KggggggggK",
      "KgwgggggKK", ".KKgggKK..", "..KKKKKK..", "..........",
    ]}
  />
);

/* ── XP bar ───────────────────────────────────────────── */
function XPBar({
  xp,
  xpMax,
  segs = 10,
  color = "emerald",
}: {
  xp: number;
  xpMax: number;
  segs?: number;
  color?: "gold" | "silver" | "bronze" | "emerald";
}) {
  const f = Math.min(segs, Math.round(Math.min(xp / xpMax, 1) * segs));
  const grad =
    color === "gold"
      ? "linear-gradient(180deg,#ffe87a,#ffd23a 60%,#a87a00)"
      : color === "silver"
      ? "linear-gradient(180deg,#fff,#c7d0e0 60%,#7a8194)"
      : color === "bronze"
      ? "linear-gradient(180deg,#ffb070,#cf7f3c 60%,#6c3a10)"
      : "linear-gradient(180deg,#43ff9a,#1eea7c 50%,#0d8f4a)";
  return (
    <div className="h-3 bg-[#07050f] border-2 border-black p-[2px] flex gap-[2px]">
      {Array.from({ length: segs }).map((_, i) => (
        <div key={i} className="flex-1" style={{ background: i < f ? grad : "#1a1233" }} />
      ))}
    </div>
  );
}

/* ── Role chip ────────────────────────────────────────── */
function RoleChip({ role }: { role: "user" | "admin" }) {
  return (
    <span className={`chip ${role === "admin" ? "chip-violet" : "chip-blue"}`}>
      {role === "admin" ? "ADMIN" : "JOUEUR"}
    </span>
  );
}

/* ── Page header ──────────────────────────────────────── */
function PageHeader({ total }: { total: number }) {
  return (
    <header className="panel panel-violet">
      <div className="titlebar titlebar-violet flex items-center justify-between">
        <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
          ▣ HALL.SAV — LEADERBOARD
        </div>
        <Link
          href="/dashboard"
          className="font-mono-pixel text-[14px] text-white/70 hover:text-white hidden sm:block"
        >
          ← RETOUR AU JEU
        </Link>
      </div>

      <div className="p-6 sm:p-8 text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <CrownIcon size={28} />
          <h1 className="font-pixel text-[22px] sm:text-[34px] neon-title neon-flicker leading-none">
            HALL OF FAME
          </h1>
          <CrownIcon size={28} />
        </div>
        <div className="font-mono-pixel text-[20px] text-[var(--ink-dim)]">
          <span className="text-[var(--emerald)]">&gt; </span>
          Les héros qui dominent la Tour Infinie d&apos;Academ&apos;IA
          <span className="caret">&nbsp;</span>
        </div>
        <div className="flex justify-center flex-wrap gap-2 pt-2">
          <span className="chip chip-gold">★ TOP {total} JOUEURS</span>
          <span className="chip chip-violet">∞ INFINITE TOWER</span>
          <span className="chip chip-emerald">+250 XP / FLOOR</span>
        </div>
      </div>

      <div className="border-t-4 border-black overflow-hidden bg-black">
        <div className="marquee-track py-2 font-mono-pixel text-[16px]">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span className="text-[var(--gold)]">★ CLASSEMENT LIVE</span>
              <span>{total} héros dans la base</span>
              <span className="text-[var(--neon-violet)]">◆ SEASON 04</span>
              <span>Tour Infinie · Academ&apos;IA</span>
              <span className="text-[var(--emerald)]">◆ EVENT:</span>
              <span>Double XP ce week-end</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ── Tabs + sort ──────────────────────────────────────── */
function TabsSection({
  sortBy,
  setSortBy,
}: {
  sortBy: "niveau" | "xp";
  setSortBy: (s: "niveau" | "xp") => void;
}) {
  return (
    <section className="panel">
      <div className="p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "global", label: "GLOBAL", icon: "◆" },
            { id: "guild", label: "MA GUILDE", icon: "♦" },
            { id: "week", label: "HEBDOMADAIRE", icon: "★" },
          ].map((t) => (
            <button
              key={t.id}
              className={`tab ${t.id === "global" ? "active" : "opacity-50 cursor-not-allowed"}`}
              disabled={t.id !== "global"}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 lg:ml-auto">
          <span className="font-pixel text-[9px] text-[var(--ink-dim)]">SORT BY</span>
          {(
            [
              { id: "niveau" as const, label: "NIVEAU" },
              { id: "xp" as const, label: "XP" },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id)}
              className={`chip cursor-pointer ${sortBy === s.id ? "chip-gold" : "chip-ghost"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Podium card (null = emplacement vide) ────────────── */
function PodiumCard({ p, place }: { p: LeaderboardPlayer | null; place: 1 | 2 | 3 }) {
  const cfgMap = {
    1: { panel: "panel-gold",   tbar: "titlebar-gold",   glow: "glow-gold",   crown: "#ffd23a", height: "h-[160px]", ped: "ped-gold",   label: "OR",     floatd: "",        avatarSize: 72 },
    2: { panel: "panel-silver", tbar: "titlebar-silver", glow: "glow-silver", crown: "#c7d0e0", height: "h-[120px]", ped: "ped-silver", label: "ARGENT", floatd: "delay-1", avatarSize: 60 },
    3: { panel: "panel-bronze", tbar: "titlebar-bronze", glow: "glow-bronze", crown: "#cf7f3c", height: "h-[100px]", ped: "ped-bronze", label: "BRONZE", floatd: "delay-2", avatarSize: 60 },
  } as const;
  const cfg = cfgMap[place];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Card */}
      <div className={`panel ${p ? cfg.panel : ""} w-full max-w-[260px] ${p && place === 1 ? "shimmer" : ""} ${!p ? "opacity-40" : ""}`}>
        <div className={`titlebar ${p ? cfg.tbar : "titlebar"} flex items-center justify-between`}>
          <span className="font-pixel text-[9px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
            #{place} · {cfg.label}
          </span>
          <CrownIcon size={18} c={p ? cfg.crown : "#2a1c5e"} />
        </div>

        {p ? (
          /* Slot occupé */
          <div className="p-4 sm:p-5 text-center space-y-3">
            <div className={`floaty ${cfg.floatd} inline-block`}>
              <div style={{ padding: 6, border: "4px solid #000", background: "#0e0a22",
                boxShadow: `inset 0 0 0 2px ${cfg.crown}, 0 4px 0 #000, 0 0 24px ${cfg.crown}66` }}>
                <PixelAvatar seed={p.pseudo} size={cfg.avatarSize} />
              </div>
            </div>
            <div>
              <div className={`font-pixel text-[12px] sm:text-[14px] ${cfg.glow}`}>{p.pseudo}</div>
              <div className="mt-1"><RoleChip role={p.role} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="border-2 border-black bg-[#0a0720] p-2">
                <div className="font-pixel text-[8px] text-[var(--ink-dim)]">NIVEAU</div>
                <div className="font-pixel text-[14px] glow-emerald mt-1">LV {String(p.niveau).padStart(2, "0")}</div>
              </div>
              <div className="border-2 border-black bg-[#0a0720] p-2">
                <div className="font-pixel text-[8px] text-[var(--ink-dim)]">RANG</div>
                <div className="font-pixel text-[14px] glow-violet mt-1">#{p.rank}</div>
              </div>
            </div>
            <div>
              <div className="flex justify-between font-mono-pixel text-[14px] text-[var(--ink-dim)] mb-1">
                <span>XP</span>
                <span>{p.xp.toLocaleString("fr-FR")} / {p.xpMax.toLocaleString("fr-FR")}</span>
              </div>
              <XPBar xp={p.xp} xpMax={p.xpMax} segs={place === 1 ? 12 : 10}
                color={place === 1 ? "gold" : place === 2 ? "silver" : "bronze"} />
            </div>
          </div>
        ) : (
          /* Slot vide */
          <div className="p-4 sm:p-5 text-center space-y-3">
            <div className="inline-flex items-center justify-center"
              style={{ padding: 6, border: "4px solid #000", background: "#0e0a22",
                boxShadow: "inset 0 0 0 2px #2a1c5e, 0 4px 0 #000",
                width: cfg.avatarSize + 12, height: cfg.avatarSize + 12 }}>
              <span className="font-pixel text-[22px] text-[var(--ink-dim)]">?</span>
            </div>
            <div>
              <div className="font-pixel text-[9px] text-[var(--ink-dim)] leading-relaxed">
                EMPLACEMENT<br />VIDE
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="border-2 border-black bg-[#0a0720] p-2">
                <div className="font-pixel text-[8px] text-[var(--ink-dim)]">NIVEAU</div>
                <div className="font-pixel text-[14px] text-[var(--ink-dim)] mt-1">——</div>
              </div>
              <div className="border-2 border-black bg-[#0a0720] p-2">
                <div className="font-pixel text-[8px] text-[var(--ink-dim)]">RANG</div>
                <div className="font-pixel text-[14px] text-[var(--ink-dim)] mt-1">#{place}</div>
              </div>
            </div>
            <div>
              <div className="flex justify-between font-mono-pixel text-[14px] text-[var(--ink-dim)] mb-1">
                <span>XP</span><span>——</span>
              </div>
              <XPBar xp={0} xpMax={100} segs={place === 1 ? 12 : 10}
                color={place === 1 ? "gold" : place === 2 ? "silver" : "bronze"} />
            </div>
          </div>
        )}
      </div>

      {/* Piédestal */}
      <div className={`pedestal ${cfg.ped} ${cfg.height} w-full max-w-[260px] flex items-center justify-center ${!p ? "opacity-40" : ""}`}>
        <div className="font-pixel text-[28px] sm:text-[34px]"
          style={{ color: "#1a1233", textShadow: "2px 2px 0 rgba(255,255,255,0.5)" }}>
          {place}
        </div>
      </div>
    </div>
  );
}

type PodiumSlots = [LeaderboardPlayer | null, LeaderboardPlayer | null, LeaderboardPlayer | null];

function Podium({ slots }: { slots: PodiumSlots }) {
  const [first, second, third] = slots;
  return (
    <section className="panel panel-gold">
      <div className="titlebar titlebar-gold flex items-center justify-between">
        <span className="font-pixel text-[10px] text-black" style={{ textShadow: "1px 1px 0 #4d3a00" }}>
          ★ PODIUM — TOP 3
        </span>
        <span className="font-mono-pixel text-[14px] text-black/80">SEASON 04</span>
      </div>
      <div className="p-5 sm:p-7">
        <div className="grid sm:grid-cols-3 gap-5 items-end">
          <div className="order-2 sm:order-1"><PodiumCard p={second} place={2} /></div>
          <div className="order-1 sm:order-2"><PodiumCard p={first}  place={1} /></div>
          <div className="order-3 sm:order-3"><PodiumCard p={third}  place={3} /></div>
        </div>
      </div>
    </section>
  );
}

/* ── List row (rank 4+) ───────────────────────────────── */
function ListRow({ p }: { p: LeaderboardPlayer }) {
  return (
    <div className="lb-row">
      <div className="flex items-center justify-center font-pixel text-[14px] glow-violet">
        #{p.rank}
      </div>

      <div className="avatar-frame flex items-center justify-center">
        <PixelAvatar seed={p.pseudo} size={40} />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-pixel text-[12px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
            {p.pseudo}
          </span>
          <RoleChip role={p.role} />
        </div>
        <div className="font-mono-pixel text-[14px] text-[var(--ink-dim)] mt-1">
          LV {String(p.niveau).padStart(2, "0")} · {p.xp.toLocaleString("fr-FR")} XP
        </div>
      </div>

      <div className="lb-col-floor">
        <div className="flex items-center gap-2">
          <TowerIcon size={20} />
          <span className="font-pixel text-[11px] glow-violet">LV {String(p.niveau).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="lb-col-guild">
        <div className="space-y-1">
          <div className="flex justify-between font-mono-pixel text-[14px] text-[var(--ink-dim)]">
            <span className="font-pixel text-[8px] text-[var(--emerald)]">XP</span>
            <span>{p.xp.toLocaleString("fr-FR")}</span>
          </div>
          <XPBar xp={p.xp} xpMax={p.xpMax} segs={8} />
        </div>
      </div>

      <div className="text-right">
        <div className="font-pixel text-[12px] glow-emerald">LV {String(p.niveau).padStart(2, "0")}</div>
        <div className="font-mono-pixel text-[14px] text-[var(--ink-dim)] mt-1 hidden sm:block">
          {p.xp.toLocaleString("fr-FR")} XP
        </div>
      </div>
    </div>
  );
}

function PlayerList({ rows }: { rows: LeaderboardPlayer[] }) {
  const lastRank = rows.length > 0 ? rows[rows.length - 1].rank : 0;
  const title = rows.length === 0 ? "◆ RANGS 4 ET +" : `◆ TOP 4 — ${lastRank}`;
  const footer = rows.length === 0
    ? "Aucun joueur au-delà du Top 3"
    : `Affichage du Top ${lastRank}`;

  return (
    <section className="panel panel-violet">
      <div className="titlebar titlebar-violet flex items-center justify-between">
        <span className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
          {title}
        </span>
        <span className="font-mono-pixel text-[14px] text-white/80">{rows.length} HÉROS</span>
      </div>

      <div className="lb-head">
        <div>RANG</div>
        <div>HERO</div>
        <div>PSEUDO</div>
        <div className="lb-col-floor">NIVEAU</div>
        <div className="lb-col-guild">XP</div>
        <div className="text-right">LEVEL</div>
      </div>

      <div>
        {rows.length === 0 ? (
          <div className="p-8 text-center font-mono-pixel text-[20px] text-[var(--ink-dim)]">
            <span className="text-[var(--gold)]">⚠</span> Aucun joueur au-delà du top 3.
          </div>
        ) : (
          rows.map((p) => <ListRow key={p.rank} p={p} />) 
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t-4 border-black bg-black/60">
        <div className="font-mono-pixel text-[16px] text-[var(--ink-dim)]">
          {footer}
        </div>
      </div>
    </section>
  );
}

/* ── Stats sidebar ────────────────────────────────────── */
function StatsSide({ players }: { players: LeaderboardPlayer[] }) {
  const topXP = players[0]?.xp ?? 0;
  const topNiveau = players[0]?.niveau ?? 0;
  const avgNiveau = players.length
    ? Math.round(players.reduce((s, p) => s + p.niveau, 0) / players.length)
    : 0;
  const admins = players.filter((p) => p.role === "admin").length;

  const stats = [
    { label: "XP record", value: topXP.toLocaleString("fr-FR"), chip: "chip-gold" },
    { label: "Niveau max", value: `LV ${topNiveau}`, chip: "chip-emerald" },
    { label: "Niveau moyen", value: `LV ${avgNiveau}`, chip: "chip-blue" },
    { label: "Admins", value: String(admins), chip: "chip-violet" },
  ];

  return (
    <aside className="panel panel-emerald">
      <div className="titlebar titlebar-emerald flex items-center justify-between">
        <span className="font-pixel text-[10px] text-black" style={{ textShadow: "1px 1px 0 #052b16" }}>
          ♦ STATISTIQUES
        </span>
        <TrophyIcon size={18} />
      </div>

      <div className="p-4 space-y-2">
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 border-2 border-black bg-[#0a0720]"
            style={{ boxShadow: "inset 0 0 0 2px #074326" }}
          >
            <div className="font-pixel text-[9px] text-[var(--ink-dim)]">{s.label}</div>
            <span className={`chip ${s.chip}`}>{s.value}</span>
          </div>
        ))}
      </div>

      <div style={{ height: 6, background: "repeating-linear-gradient(90deg, #000 0 4px, transparent 4px 8px)" }} />

      <div className="p-4">
        <div className="font-pixel text-[10px] text-[var(--gold)] mb-2">★ DAILY REWARDS</div>
        <ul className="space-y-2 font-mono-pixel text-[16px]">
          <li className="flex items-center justify-between">
            <span>Top 10</span>
            <span className="chip chip-gold">+1 BADGE</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Top 50</span>
            <span className="chip chip-violet">+500 XP</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Top 100</span>
            <span className="chip chip-emerald">+50 ◎</span>
          </li>
        </ul>
        <Link
          href="/dashboard"
          className="arcade arcade-gold text-[10px] w-full mt-4 flex items-center justify-center gap-2"
        >
          <CoinIcon size={14} /> JOUER MAINTENANT
        </Link>
      </div>
    </aside>
  );
}

/* ── Sticky current-user footer ───────────────────────── */
function StickyMe({ me }: { me: LeaderboardPlayer }) {
  return (
    <div className="sticky-me">
      <div className="max-w-[1280px] mx-auto">
        <div className="panel panel-emerald">
          <div
            className="grid items-center gap-3 p-3 sm:p-4"
            style={{ gridTemplateColumns: "auto auto 1fr auto" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="font-pixel text-[10px] text-[var(--emerald)]"
                style={{ textShadow: "2px 2px 0 #000, 0 0 8px var(--emerald)" }}
              >
                YOU
              </div>
              <div className="hidden sm:block font-pixel text-[14px] glow-emerald">
                #{me.rank.toLocaleString("fr-FR")}
              </div>
            </div>

            <div
              className="avatar-frame flex items-center justify-center"
              style={{ boxShadow: "inset 0 0 0 2px var(--emerald), 0 4px 0 #000" }}
            >
              <PixelAvatar seed={me.pseudo} size={40} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-pixel text-[11px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
                  {me.pseudo}
                </span>
                <RoleChip role={me.role} />
                <span className="chip chip-violet hidden sm:inline-flex">LV {me.niveau}</span>
              </div>
              <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-3">
                <XPBar xp={me.xp} xpMax={me.xpMax} segs={20} />
                <span className="font-mono-pixel text-[14px] text-[var(--ink-dim)] whitespace-nowrap">
                  {me.xp.toLocaleString("fr-FR")} / {me.xpMax.toLocaleString("fr-FR")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="arcade arcade-emerald text-[10px]">
                ▶ JOUER
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main client component ────────────────────────────── */
export default function LeaderboardClient({
  players,
  currentPlayer,
}: {
  players: LeaderboardPlayer[];
  currentPlayer: LeaderboardPlayer | null;
}) {
  const [sortBy, setSortBy] = useState<"niveau" | "xp">("niveau");

  const sorted = useMemo(() => {
    if (sortBy === "xp") {
      return [...players]
        .sort((a, b) => b.xp - a.xp || b.niveau - a.niveau)
        .map((p, i) => ({ ...p, rank: i + 1 }));
    }
    return players;
  }, [players, sortBy]);

  const podiumSlots: PodiumSlots = [
    sorted[0] ?? null,
    sorted[1] ?? null,
    sorted[2] ?? null,
  ];
  const rest = sorted.slice(3);

  return (
    <div className={`max-w-[1280px] mx-auto p-4 sm:p-6 space-y-5 ${currentPlayer ? "pb-[90px]" : ""}`}>
      <PageHeader total={players.length} />
      <TabsSection sortBy={sortBy} setSortBy={setSortBy} />
      <Podium slots={podiumSlots} />

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <PlayerList rows={rest} />
        <StatsSide players={players} />
      </div>

      <footer className="panel">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 font-mono-pixel text-[14px] text-[var(--ink-dim)] gap-2">
          <div>© 2026 ACADEM&apos;IA · HALL OF FAME · CART v1.16-bit</div>
          <Link href="/dashboard" className="underline hover:text-[var(--neon-violet)]">
            ← Retour au jeu
          </Link>
        </div>
      </footer>

      {currentPlayer && <StickyMe me={currentPlayer} />}
    </div>
  );
}
