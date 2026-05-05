"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

/* ── Types ──────────────────────────────────────────────── */
type Utilisateur = {
  id: string;
  pseudo: string;
  email: string;
  niveau: number;
  xp: number;
  role: "user" | "admin";
};

type Props = {
  utilisateurs: Utilisateur[];
  adminId: string;
  adminEmail: string;
};

/* ── Pixel SVG engine ───────────────────────────────────── */
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
          return (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
          );
        })
      )}
    </svg>
  );
}

function PixelAvatar({ seed, size = 44 }: { seed: string; size?: number }) {
  const rng = (n: number) => {
    let h = 2166136261;
    const s = seed + ":" + n;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h;
  };
  const palettes = [
    { K: "#000", v: "#b14bff", w: "#fff3c2", a: "#ff3aa3" },
    { K: "#000", v: "#22a7ff", w: "#bfe5ff", a: "#1eea7c" },
    { K: "#000", v: "#1eea7c", w: "#dfffe9", a: "#ffd23a" },
    { K: "#000", v: "#ffd23a", w: "#fff3c2", a: "#ff3aa3" },
    { K: "#000", v: "#ff3aa3", w: "#ffd0e6", a: "#22a7ff" },
    { K: "#000", v: "#ff2d55", w: "#ffd0d6", a: "#ffd23a" },
  ];
  const palette = palettes[rng(0) % palettes.length];
  const W = 8,
    H = 8;
  const grid: string[][] = Array.from({ length: H }, () => Array(W).fill("."));
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x <= 3; x++) {
      const r = rng(y * 10 + x) % 7;
      const ch = r < 3 ? "v" : r < 5 ? "w" : r < 6 ? "a" : "K";
      grid[y][x] = ch;
      grid[y][W - 1 - x] = ch;
    }
  }
  grid[3][2] = "K";
  grid[3][5] = "K";
  grid[5][3] = "K";
  grid[5][4] = "K";
  const rows = grid.map((r) => r.join(""));
  return <PixelGrid size={size} palette={palette} rows={rows} />;
}

/* ── Icons ──────────────────────────────────────────────── */
const TrashIcon = ({ size = 18 }: { size?: number }) => (
  <PixelGrid
    size={size}
    palette={{ K: "#000", w: "#fff", r: "#ff2d55" }}
    rows={[
      "....KKKK....",
      "..KKwwwwKK..",
      "KKKKKKKKKKKK",
      "KwwwwwwwwwwK",
      ".KrwrwrwrwK.",
      ".KrwrwrwrwK.",
      ".KrwrwrwrwK.",
      ".KrwrwrwrwK.",
      ".KrwrwrwrwK.",
      ".KKKKKKKKKK.",
      "..KrrrrrrK..",
      "..KKKKKKKK..",
    ]}
  />
);

const SkullIcon = ({ size = 18 }: { size?: number }) => (
  <PixelGrid
    size={size}
    palette={{ K: "#000", w: "#fff", r: "#ff2d55" }}
    rows={[
      "..KKKKKKKK..",
      ".KwwwwwwwwK.",
      "KwwwwwwwwwwK",
      "KwKKwwKKwwwK",
      "KwKrwwKrwwwK",
      "KwKKwwKKwwwK",
      "KwwwwwwwwwwK",
      "KwwKwKwKwwwK",
      "KwwwKKwwwwwK",
      ".KwwwwwwwwK.",
      "..KKKKKKKK..",
      "............",
    ]}
  />
);

const MagnifierIcon = ({ size = 20 }: { size?: number }) => (
  <PixelGrid
    size={size}
    palette={{ K: "#000", b: "#22a7ff", w: "#cfe9ff" }}
    rows={[
      "...KKKK......",
      "..KbbbbK.....",
      ".KbwwwwbK....",
      ".KbwKKwwbK...",
      ".KbwKKwwbK...",
      ".KbwwwwbK....",
      "..KbbbbK.....",
      "...KKKKKK....",
      ".....KKKK....",
      "......KKKK...",
      ".......KKK...",
      "........KK...",
    ]}
  />
);

const WarnIcon = ({ size = 42 }: { size?: number }) => (
  <PixelGrid
    size={size}
    palette={{ K: "#000", g: "#ffd23a", w: "#fff" }}
    rows={[
      "......KK......",
      ".....KggK.....",
      "....KggggK....",
      "....KggggK....",
      "...KggwggK....",
      "...KggwggK....",
      "..KggggwggK...",
      "..KggggwggK...",
      ".KggggKKggggK.",
      ".KgggKwwKgggK.",
      "KggggwwggggggK",
      "KggKKKKKKggggK",
      "KKKKKKKKKKKKKK",
      "..............",
    ]}
  />
);

/* ── UI helpers ─────────────────────────────────────────── */
function RoleChip({ role }: { role: "user" | "admin" }) {
  return (
    <span className={`chip ${role === "admin" ? "chip-violet" : "chip-blue"}`}>
      {role.toUpperCase()}
    </span>
  );
}

function LevelBar({ niveau }: { niveau: number }) {
  const pct = Math.min(100, (niveau / 50) * 100);
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="font-pixel text-[10px] glow-emerald">
        LV {String(niveau).padStart(2, "0")}
      </div>
      <div className="hidden xl:flex flex-1 h-3 bg-[#07050f] border-2 border-black p-[2px] gap-[2px] min-w-[60px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex-1"
            style={{
              background:
                i < Math.round(pct / 10)
                  ? "linear-gradient(180deg,#43ff9a,#0d8f4a)"
                  : "#1a1233",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── KPI Strip ──────────────────────────────────────────── */
function KPIStrip({ players, adminId }: { players: Utilisateur[]; adminId: string }) {
  const admins = players.filter(
    (u) => u.role === "admin" || u.id === adminId
  ).length;
  const topLevel = players[0]?.niveau ?? 0;
  const items = [
    {
      label: "TOTAL JOUEURS",
      value: players.length,
      color: "glow-blue",
      chip: "chip-blue",
      chipText: "GLOBAL",
    },
    {
      label: "ADMINS",
      value: admins,
      color: "glow-violet",
      chip: "chip-violet",
      chipText: "CLEARANCE 9",
    },
    {
      label: "JOUEURS",
      value: players.length - admins,
      color: "glow-emerald",
      chip: "chip-emerald",
      chipText: "ACTIFS",
    },
    {
      label: "TOP NIVEAU",
      value: topLevel,
      color: "glow-gold",
      chip: "chip-gold",
      chipText: "RECORD",
    },
  ];
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((k, i) => (
        <div key={i} className="panel">
          <div className="p-4">
            <div className="font-pixel text-[9px] text-[var(--ink-dim)] mb-2">
              {k.label}
            </div>
            <div className={`font-pixel text-[26px] ${k.color}`}>{k.value}</div>
            <div className="mt-3">
              <span className={`chip ${k.chip}`}>{k.chipText}</span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ── Player Table ───────────────────────────────────────── */
function PlayerTable({
  players,
  onAskDelete,
  selected,
  toggleSelect,
  toggleSelectAll,
  allSelected,
}: {
  players: Utilisateur[];
  onAskDelete: (u: Utilisateur) => void;
  selected: Record<string, boolean>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  allSelected: boolean;
}) {
  return (
    <section className="panel panel-violet">
      <div className="titlebar titlebar-violet flex items-center justify-between">
        <div
          className="font-pixel text-[10px] text-white"
          style={{ textShadow: "2px 2px 0 #000" }}
        >
          ◆ PLAYER INVENTORY — {players.length} ENTRIES
        </div>
        <div className="font-mono-pixel text-[14px] text-white/80 hidden sm:block">
          SORT: NIVEAU ↓
        </div>
      </div>

      {/* Header */}
      <div className="inv-head">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="w-4 h-4 accent-[var(--neon-violet)]"
          />
        </div>
        <div className="font-pixel text-[9px] text-[var(--ink-dim)]">PSEUDO</div>
        <div className="font-pixel text-[9px] text-[var(--ink-dim)] hidden md:block">
          EMAIL
        </div>
        <div className="font-pixel text-[9px] text-[var(--ink-dim)] hidden lg:block">
          NIVEAU
        </div>
        <div className="font-pixel text-[9px] text-[var(--ink-dim)] hidden lg:block">
          RÔLE
        </div>
        <div className="font-pixel text-[9px] text-[var(--ink-dim)] text-right">
          ACTIONS
        </div>
      </div>

      {/* Body */}
      <div>
        {players.length === 0 && (
          <div className="p-8 text-center font-mono-pixel text-[18px] text-[var(--ink-dim)]">
            <span className="text-[var(--gold)]">⚠</span> Aucun joueur trouvé.
          </div>
        )}
        {players.map((p) => (
          <div key={p.id} className="inv-row">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!selected[p.id]}
                onChange={() => toggleSelect(p.id)}
                className="w-4 h-4 accent-[var(--neon-violet)]"
              />
              <div className="avatar-frame" style={{ width: 44, height: 44 }}>
                <PixelAvatar seed={p.pseudo} size={38} />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-pixel text-[11px] text-white"
                  style={{ textShadow: "2px 2px 0 #000" }}
                >
                  {p.pseudo}
                </span>
                <RoleChip role={p.role} />
              </div>
              <div className="font-mono-pixel text-[14px] text-[var(--ink-dim)] mt-1">
                XP: {p.xp}
              </div>
              {/* Mobile: email + level */}
              <div className="md:hidden mt-1 font-mono-pixel text-[13px] text-[var(--ink-dim)] truncate">
                {p.email}
              </div>
            </div>

            <div className="hidden md:block font-mono-pixel text-[16px] text-[var(--ink-dim)] truncate">
              {p.email}
            </div>

            <div className="hidden lg:block">
              <LevelBar niveau={p.niveau} />
            </div>
            <div className="hidden lg:block">
              <RoleChip role={p.role} />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                className="icon-btn danger"
                title="Supprimer le joueur"
                onClick={() => onAskDelete(p)}
              >
                <TrashIcon size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 border-t-4 border-black bg-black/60">
        <div className="font-mono-pixel text-[16px] text-[var(--ink-dim)]">
          Affichage de <span className="text-white">{players.length}</span> joueurs
        </div>
      </div>
    </section>
  );
}

/* ── Sidebar ────────────────────────────────────────────── */
function SideBar({ adminEmail }: { adminEmail: string }) {
  const navItems = [
    { label: "DASHBOARD", active: false, disabled: false },
    { label: "JOUEURS",   active: true,  disabled: false },
    { label: "LOGS",      active: false, disabled: true  },
    { label: "SETTINGS",  active: false, disabled: true  },
  ];

  return (
    <aside className="panel panel-blue">
      <div className="titlebar titlebar-blue flex items-center justify-between">
        <div
          className="font-pixel text-[10px] text-white"
          style={{ textShadow: "2px 2px 0 #000" }}
        >
          ▣ COMMAND MENU
        </div>
      </div>
      <div className="p-4 space-y-2">
        {navItems.map((item, i) => (
          <button
            key={i}
            disabled={item.disabled}
            className={`nav-link justify-between ${item.active ? "active" : ""} ${item.disabled ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <span>▶ {item.label}</span>
            {item.disabled && (
              <span className="font-pixel text-[8px] text-[var(--ink-dim)]">
                SOON
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="pix-div" />
      <div className="p-4">
        <div className="font-pixel text-[10px] text-[var(--gold)] mb-3">
          ▣ INFOS SYSTÈME
        </div>
        <ul className="space-y-2 font-mono-pixel text-[16px]">
          <li className="flex gap-3">
            <span className="font-pixel text-[8px] text-[var(--emerald)]">GM</span>
            <span className="text-[var(--ink-dim)] truncate">{adminEmail}</span>
          </li>
          <li className="flex gap-3">
            <span className="font-pixel text-[8px] text-[var(--neon-violet)]">AUTH</span>
            <span className="text-[var(--ink-dim)]">Better-Auth v1</span>
          </li>
          <li className="flex gap-3">
            <span className="font-pixel text-[8px] text-[var(--danger)]">ROLE</span>
            <span className="text-[var(--ink-dim)]">ADMIN · CLEARANCE 9</span>
          </li>
          <li className="flex gap-3">
            <span className="font-pixel text-[8px] text-[var(--gold)]">DB</span>
            <span className="text-[var(--emerald)]">PostgreSQL · ONLINE</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}

/* ── Erase Modal ────────────────────────────────────────── */
function EraseModal({
  player,
  onCancel,
  onConfirm,
  loading,
}: {
  player: Utilisateur | null;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  const [confirmText, setConfirmText] = useState("");
  const ok = confirmText.trim().toUpperCase() === "ERASE";

  useEffect(() => {
    if (!player) {
      // On décale la réinitialisation pour éviter le rendu en cascade (règle React)
      const timer = setTimeout(() => setConfirmText(""), 0);
      return () => clearTimeout(timer);
    }
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter" && ok && !loading) onConfirm();
    };
    
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [player, ok, loading, onCancel, onConfirm]);
  if (!player) return null;

  return (
    <div
      className="fixed inset-0 z-[5500] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
    >
      <div className="rpg-modal modal-pop max-w-[520px] w-full p-1">
        {/* RPG corner pixels */}
        {[
          "absolute w-[14px] h-[14px] bg-white border-[3px] border-black -top-[7px] -left-[7px]",
          "absolute w-[14px] h-[14px] bg-white border-[3px] border-black -top-[7px] -right-[7px]",
          "absolute w-[14px] h-[14px] bg-white border-[3px] border-black -bottom-[7px] -left-[7px]",
          "absolute w-[14px] h-[14px] bg-white border-[3px] border-black -bottom-[7px] -right-[7px]",
        ].map((cls, i) => (
          <span key={i} className={cls} />
        ))}

        <div className="p-6 space-y-5">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="warn-blink">
              <WarnIcon size={48} />
            </div>
            <div>
              <div
                className="font-pixel text-[14px] text-white"
                style={{ textShadow: "2px 2px 0 #000, 0 0 10px var(--danger)" }}
              >
                ⚠ WARNING
              </div>
              <div className="font-pixel text-[10px] text-[#ddd] mt-1">
                ACTION IRRÉVERSIBLE · SYSTEM PROMPT
              </div>
            </div>
          </div>

          {/* RPG dialog */}
          <div className="font-mono-pixel text-[20px] leading-[1.45] text-white">
            <div className="text-[var(--emerald)]">
              &gt; <span className="caret">&nbsp;</span>
            </div>
            <p className="mt-1">
              Erase Player Data?{" "}
              <span className="text-[var(--danger)]">Cannot be undone.</span>
            </p>
            <p className="mt-3 text-[var(--ink-dim)] text-[17px]">
              Cible :{" "}
              <span className="text-white">{player.pseudo}</span>{" "}
              <span className="text-[var(--ink-dim)]">({player.email})</span>
              {" — "}
              <span className="glow-emerald">
                LV {String(player.niveau).padStart(2, "0")}
              </span>
              {" · XP "}
              <span className="text-[var(--gold)]">{player.xp}</span>
            </p>
            <p className="mt-3 text-[var(--ink-dim)] text-[17px]">
              Badges, réponses et progression seront{" "}
              <span className="text-white">purgés du donjon.</span>
            </p>
          </div>

          {/* Confirmation input */}
          <div>
            <div className="font-pixel text-[9px] text-[var(--ink-dim)] mb-2">
              Tape{" "}
              <span className="text-[var(--danger)]">ERASE</span>{" "}
              pour confirmer.
            </div>
            <input
              autoFocus
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="ERASE"
              className="w-full bg-black border-4 border-white p-3 font-mono-pixel text-[20px] text-white outline-none uppercase"
              style={{ boxShadow: "inset 0 0 0 2px #000, inset 0 0 0 4px #fff" }}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={onCancel}
              className="arcade arcade-ghost text-[12px]"
              style={{
                background: "#1a1233",
                color: "#fff",
                boxShadow: "0 6px 0 #000, inset 0 0 0 2px #444",
              }}
            >
              ANNULER
            </button>
            <button
              onClick={ok && !loading ? onConfirm : undefined}
              disabled={!ok || loading}
              className={`arcade arcade-danger text-[12px] ${
                ok && !loading ? "" : "disabled"
              }`}
            >
              <SkullIcon size={16} /> {loading ? "..." : "ERASE"}
            </button>
          </div>

          <div className="text-center font-mono-pixel text-[14px] text-[var(--ink-dim)]">
            [ESC] Annuler · [ENTER] Confirmer
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Bulk Erase Modal ───────────────────────────────────── */
function BulkEraseModal({
  count,
  open,
  onCancel,
  onConfirm,
  loading,
}: {
  count: number;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[5500] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
    >
      <div className="rpg-modal modal-pop max-w-[520px] w-full p-1">
        {[
          "absolute w-[14px] h-[14px] bg-white border-[3px] border-black -top-[7px] -left-[7px]",
          "absolute w-[14px] h-[14px] bg-white border-[3px] border-black -top-[7px] -right-[7px]",
          "absolute w-[14px] h-[14px] bg-white border-[3px] border-black -bottom-[7px] -left-[7px]",
          "absolute w-[14px] h-[14px] bg-white border-[3px] border-black -bottom-[7px] -right-[7px]",
        ].map((cls, i) => (
          <span key={i} className={cls} />
        ))}

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="warn-blink">
              <WarnIcon size={48} />
            </div>
            <div>
              <div
                className="font-pixel text-[14px] text-white"
                style={{ textShadow: "2px 2px 0 #000, 0 0 10px var(--danger)" }}
              >
                ⚠ SUPPRESSION GROUPÉE
              </div>
              <div className="font-pixel text-[10px] text-[#ddd] mt-1">
                {count} JOUEUR(S) · ACTION IRRÉVERSIBLE
              </div>
            </div>
          </div>

          <div className="font-mono-pixel text-[20px] leading-[1.45] text-white">
            <div className="text-[var(--emerald)]">
              &gt; <span className="caret">&nbsp;</span>
            </div>
            <p className="mt-1">
              Supprimer{" "}
              <span className="text-[var(--danger)]">{count} joueur(s)</span>{" "}
              sélectionné(s) ?{" "}
              <span className="text-[var(--danger)]">Cannot be undone.</span>
            </p>
            <p className="mt-3 text-[var(--ink-dim)] text-[17px]">
              Badges, réponses et progression de ces joueurs seront{" "}
              <span className="text-white">purgés du donjon.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={onCancel}
              className="arcade arcade-ghost text-[12px]"
              style={{
                background: "#1a1233",
                color: "#fff",
                boxShadow: "0 6px 0 #000, inset 0 0 0 2px #444",
              }}
            >
              ANNULER
            </button>
            <button
              onClick={!loading ? onConfirm : undefined}
              disabled={loading}
              className={`arcade arcade-danger text-[12px] ${loading ? "disabled" : ""}`}
            >
              <SkullIcon size={16} />{" "}
              {loading ? "..." : `PURGER ${count} JOUEUR(S)`}
            </button>
          </div>

          <div className="text-center font-mono-pixel text-[14px] text-[var(--ink-dim)]">
            [ESC] Annuler
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Toast ──────────────────────────────────────────────── */
function Toast({ msg, onClose }: { msg: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [msg, onClose]);

  if (!msg) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[6000]">
      <div className="panel panel-danger">
        <div
          className="px-5 py-3 font-pixel text-[10px] text-white flex items-center gap-3"
          style={{ textShadow: "2px 2px 0 #000" }}
        >
          <SkullIcon size={16} /> {msg}
        </div>
      </div>
    </div>
  );
}

/* ── App shell ──────────────────────────────────────────── */
export default function AdminDashboardClient({
  utilisateurs,
  adminId,
  adminEmail,
}: Props) {
  const router = useRouter();
  const [players, setPlayers] = useState<Utilisateur[]>(utilisateurs);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "user" | "admin">("all");
  const [askDelete, setAskDelete] = useState<Utilisateur | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [askBulkDelete, setAskBulkDelete] = useState(false);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    await authClient.signOut();
    router.push("/login");
  }, [router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return players.filter((p) => {
      if (filter !== "all" && p.role !== filter) return false;
      if (!q) return true;
      return (
        p.pseudo.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
      );
    });
  }, [players, query, filter]);

  const toggleSelect = (id: string) =>
    setSelected((s) => ({ ...s, [id]: !s[id] }));

  const allSelected =
    filtered.length > 0 && filtered.every((p) => selected[p.id]);

  const selectedCount = useMemo(
    () => players.filter((p) => selected[p.id]).length,
    [players, selected]
  );

  const toggleSelectAll = () => {
    if (allSelected) {
      const next = { ...selected };
      filtered.forEach((p) => delete next[p.id]);
      setSelected(next);
    } else {
      const next = { ...selected };
      filtered.forEach((p) => (next[p.id] = true));
      setSelected(next);
    }
  };

  const handleBulkDelete = async () => {
    const toDelete = players.filter((p) => selected[p.id]);
    if (toDelete.length === 0) return;
    setBulkDeleteLoading(true);
    try {
      await Promise.all(
        toDelete.map((p) =>
          fetch(`/api/admin/users/${p.id}`, { method: "DELETE" }).then((r) => {
            if (!r.ok) throw new Error(`Delete failed for ${p.id}`);
          })
        )
      );
      const deletedIds = new Set(toDelete.map((p) => p.id));
      setPlayers((ps) => ps.filter((p) => !deletedIds.has(p.id)));
      setSelected((s) => {
        const n = { ...s };
        toDelete.forEach((p) => delete n[p.id]);
        return n;
      });
      setToast(`${toDelete.length} JOUEUR(S) SUPPRIMÉ(S)`);
      setAskBulkDelete(false);
    } catch {
      setToast("ERREUR : SUPPRESSION PARTIELLE OU IMPOSSIBLE");
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!askDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${askDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setPlayers((ps) => ps.filter((p) => p.id !== askDelete.id));
      setSelected((s) => {
        const n = { ...s };
        delete n[askDelete.id];
        return n;
      });
      setToast(`JOUEUR ${askDelete.pseudo} SUPPRIMÉ`);
      setAskDelete(null);
    } catch {
      setToast("ERREUR : SUPPRESSION IMPOSSIBLE");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto p-4 sm:p-6 space-y-5">
      {/* ── Header ── */}
      <header className="panel panel-violet">
        <div className="titlebar titlebar-violet flex items-center justify-between">
          <div
            className="font-pixel text-[10px] text-white"
            style={{ textShadow: "2px 2px 0 #000" }}
          >
            ▣ ADMIN.SAV — RESTRICTED ACCESS
          </div>
          <div className="font-mono-pixel text-[14px] text-white/80 hidden sm:flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 bg-[var(--emerald)]"
              style={{ boxShadow: "0 0 6px var(--emerald)" }}
            />
            GM CONNECTÉ · CLEARANCE 9
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5">
          <div>
            <div className="font-pixel text-[18px] sm:text-[22px] neon-red-violet neon-flicker leading-none">
              GAME MASTER CONSOLE
            </div>
            <div className="font-mono-pixel text-[16px] text-[var(--ink-dim)] mt-2 flex items-center gap-2">
              <span className="text-[var(--danger)]">&gt;</span>
              ACADEM&apos;IA · MOD PANEL · RESTRICTED{" "}
              <span className="caret">&nbsp;</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
            <div className="hidden md:flex flex-col items-end font-mono-pixel text-[16px] leading-tight mr-2">
              <div className="text-white truncate max-w-[220px]">{adminEmail}</div>
              <div className="text-[var(--ink-dim)] text-[14px]">
                SUPERUSER · CLEARANCE 9
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="arcade text-[10px] flex items-center gap-2"
              style={{ background: "#0d1b2a", boxShadow: "0 4px 0 #000, inset 0 0 0 2px var(--neon-blue)", color: "var(--neon-blue)" }}
            >
              ▲ ACCUEIL
            </button>
            <button
              onClick={handleLogout}
              className="arcade arcade-danger text-[10px] flex items-center gap-2"
            >
              ⏻ DÉCONNEXION
            </button>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-t-4 border-black overflow-hidden bg-black">
          <div className="marquee-track py-2 font-mono-pixel text-[16px]">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-12 px-6">
                <span className="text-[var(--danger)]">⚠ MOD ALERT:</span>
                <span>{players.length} joueurs dans la base</span>
                <span className="text-[var(--emerald)]">◆ UPTIME:</span>
                <span>99.98% (30j)</span>
                <span className="text-[var(--gold)]">◆ TIP:</span>
                <span>Cliquez sur la corbeille pour supprimer un joueur.</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── KPI Strip ── */}
      <KPIStrip players={players} adminId={adminId} />

      {/* ── Main grid ── */}
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div className="space-y-5 min-w-0">
          {/* Control bar */}
          <section className="panel">
            <div className="p-4 flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="relative flex-1 min-w-0">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <MagnifierIcon size={22} />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="Rechercher pseudo ou email..."
                  className="pix-input"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 font-pixel text-[10px] text-[var(--ink-dim)] hover:text-white px-2 py-1 border-2 border-black bg-[#0e0a22]"
                  >
                    [X]
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="font-pixel text-[9px] text-[var(--ink-dim)]">
                  FILTER
                </span>
                {(["all", "user", "admin"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`chip cursor-pointer ${
                      filter === f
                        ? f === "admin"
                          ? "chip-violet"
                          : f === "user"
                          ? "chip-blue"
                          : "chip-emerald"
                        : "chip-ghost"
                    }`}
                  >
                    {f === "all" ? "TOUS" : f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {selectedCount > 0 && (
              <div className="px-4 pb-4 flex items-center gap-3 border-t-2 border-[#1a1233] pt-3">
                <span className="font-pixel text-[9px] text-[var(--danger)]">
                  ▶ {selectedCount} JOUEUR(S) SÉLECTIONNÉ(S)
                </span>
                <button
                  onClick={() => setAskBulkDelete(true)}
                  className="arcade arcade-danger text-[10px] flex items-center gap-2"
                >
                  <TrashIcon size={14} /> SUPPRIMER LA SÉLECTION
                </button>
              </div>
            )}
          </section>

          {/* Player table */}
          <PlayerTable
            players={filtered}
            onAskDelete={setAskDelete}
            selected={selected}
            toggleSelect={toggleSelect}
            toggleSelectAll={toggleSelectAll}
            allSelected={allSelected}
          />
        </div>

        <SideBar adminEmail={adminEmail} />
      </div>

      {/* ── Footer ── */}
      <footer className="panel">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 font-mono-pixel text-[14px] text-[var(--ink-dim)] gap-2">
          <div>© 2026 ACADEM&apos;IA · GM CONSOLE · v1.16-bit</div>
          <div className="flex gap-4">
            <span>
              DB: <span className="text-[var(--emerald)]">ONLINE</span>
            </span>
            <span>
              AUTH: <span className="text-[var(--elec-blue)]">ACTIVE</span>
            </span>
          </div>
        </div>
      </footer>

      {/* ── Overlays ── */}
      <EraseModal
        player={askDelete}
        onCancel={() => setAskDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
      <BulkEraseModal
        count={selectedCount}
        open={askBulkDelete}
        onCancel={() => setAskBulkDelete(false)}
        onConfirm={handleBulkDelete}
        loading={bulkDeleteLoading}
      />
      <Toast msg={toast} onClose={() => setToast(null)} />
    </div>
  );
}
