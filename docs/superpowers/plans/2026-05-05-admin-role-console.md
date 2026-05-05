# Admin Role & Management Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an admin role system with a pixel-art "Game Master Console" dashboard for managing users, protected by server-side session checks.

**Architecture:** Better-Auth is extended with a `role` additionalField (values: `"user"` / `"admin"`, default `"user"`). A SQL migration adds the column to Better-Auth's `user` table. The admin dashboard (`/admin/dashboard`) is a Next.js Server Component that checks the session role and redirects non-admins; it passes user data (queried via Prisma `Utilisateur` model) to a Client Component that handles search, filters, the ERASE modal, and the DELETE API call. The DELETE route verifies the session role server-side before executing a Prisma transaction.

**Tech Stack:** Next.js 16 App Router, Better-Auth v1.6.9 (PostgreSQL pool), Prisma v7.8.0, Tailwind CSS v4, TypeScript 5

---

### Task 1: Create Prisma singleton

**Files:**
- Create: `src/lib/prisma.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors related to `src/lib/prisma.ts`

- [ ] **Step 3: Commit**

```bash
git add src/lib/prisma.ts
git commit -m "feat: add Prisma singleton client"
```

---

### Task 2: Extend Better-Auth with role field + SQL migration

**Files:**
- Modify: `src/lib/auth.ts`

- [ ] **Step 1: Add `user.additionalFields` to auth config**

Replace the closing of the `betterAuth({...})` call in `src/lib/auth.ts`. Add the `user` block after `databaseHooks`:

```typescript
// src/lib/auth.ts  — full file after edit:
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { APIError } from "better-auth/api";
import { logger } from "@/lib/logger";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId:     process.env.GOOGLE_CLIENT_ID     as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId:     process.env.GITHUB_CLIENT_ID     as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const password = user.password;
          if (typeof password === "string") {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
              logger.warn("SIGNUP_BLOCKED", `Mot de passe trop faible pour ${user.email}`);
              throw new APIError("BAD_REQUEST", {
                message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
              });
            }
          }
          logger.info("SIGNUP_ATTEMPT", `Tentative de création pour ${user.email}`);
        },
        after: async (user) => {
          logger.info("SIGNUP_SUCCESS", "Compte créé avec succès", user.id);
        },
      },
    },
  },
});
```

- [ ] **Step 2: Add the `role` column to Better-Auth's `user` table via SQL**

Better-Auth manages its own `user` table via `pg.Pool` (separate from the Prisma `Utilisateur` model). Run this SQL against the database (replace `<DATABASE_URL>` with the value from `.env`):

```bash
# Using psql — adjust connection string from .env DATABASE_URL
psql "$DATABASE_URL" -c 'ALTER TABLE "user" ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT '"'"'user'"'"';'
```

Expected output: `ALTER TABLE`

If psql is unavailable, connect via pgAdmin or any SQL client and run:
```sql
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth.ts
git commit -m "feat: add role additionalField to Better-Auth user (default: user)"
```

---

### Task 3: Add admin-specific CSS classes to globals.css

**Files:**
- Modify: `src/app/globals.css`

The existing globals.css has `.panel`, `.arcade`, `.chip`, `.pix-input`, etc. but is missing the admin console variants and table layout classes.

- [ ] **Step 1: Append admin classes to `globals.css` inside the `@layer components` block (before the closing `}` at line 374)**

Add these classes just before the final `}` of `@layer components`:

```css
  /* ── Admin console additions ── */
  .panel-danger { box-shadow: inset 0 0 0 2px #4a0a1c, 0 0 0 2px var(--danger), 0 6px 0 0 #000, 0 0 0 6px #000; }
  .titlebar-danger { background: repeating-linear-gradient(90deg, #c91f3d 0 6px, #8a1129 6px 12px); }
  .arcade-danger { background: var(--danger); color: #fff; text-shadow: 2px 2px 0 #000; }
  .chip-ghost  { background: #0d0a1a; color: var(--ink-dim); }
  .chip-danger { background: var(--danger); color: #fff; text-shadow: 1px 1px 0 #000; }
  .glow-danger { color: #fff; text-shadow: 2px 2px 0 #000, 0 0 10px var(--danger); }

  .neon-red-violet {
    color: #fff;
    text-shadow: 2px 2px 0 #000, 0 0 6px #ff2d55, 0 0 14px #ff2d55, 0 0 24px #b14bff, 0 0 42px #b14bff;
  }

  /* Player inventory table */
  .inv-row {
    display: grid;
    grid-template-columns: 56px 1.3fr 1.6fr 0.8fr 0.8fr 1fr;
    align-items: center; gap: 12px; padding: 10px 12px;
    background: #0a0720;
    border-top: 3px solid #000; border-bottom: 3px solid #000;
    margin-bottom: -3px;
  }
  .inv-row:hover { background: #11093a; }
  .inv-row.banned { background: #1a070d; }
  .inv-row.banned .pseudo { color: var(--ink-dim); text-decoration: line-through; }
  .inv-head {
    display: grid;
    grid-template-columns: 56px 1.3fr 1.6fr 0.8fr 0.8fr 1fr;
    gap: 12px; padding: 10px 12px;
    background: #1a1233; border-bottom: 4px solid #000;
    box-shadow: inset 0 -3px 0 rgba(0,0,0,.3);
  }
  .avatar-frame {
    width: 48px; height: 48px;
    border: 3px solid #000; background: #0e0a22;
    box-shadow: inset 0 0 0 2px #2a1c5e;
  }

  /* Mini icon button */
  .icon-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 36px; height: 36px;
    border: 3px solid #000; background: #0d0a1a;
    box-shadow: 0 4px 0 #000, inset 0 0 0 2px #2a1c5e;
    cursor: pointer;
    transition: transform .04s linear, box-shadow .08s linear, background .08s linear;
  }
  .icon-btn:hover { background: #160d33; }
  .icon-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 #000, inset 0 0 0 2px #2a1c5e; }
  .icon-btn.danger { background: var(--danger); box-shadow: 0 4px 0 #000, inset 0 -3px 0 rgba(0,0,0,.4); }
  .icon-btn.danger:hover { filter: brightness(1.1); }

  /* Sidebar nav link */
  .nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border: 3px solid #000;
    background: #0d0a1a;
    box-shadow: inset 0 0 0 2px #1a1233, 0 4px 0 #000;
    color: var(--ink-dim); font-family: var(--font-pixel); font-size: 10px;
    cursor: pointer; transition: background .1s, color .1s, box-shadow .1s;
    width: 100%;
  }
  .nav-link:hover { background: #160d33; color: #fff; box-shadow: inset 0 0 0 2px var(--neon-violet), 0 4px 0 #000; }
  .nav-link.active {
    background: var(--neon-violet); color: #fff; text-shadow: 2px 2px 0 #000;
    box-shadow: inset 0 -4px 0 rgba(0,0,0,.35), 0 4px 0 #000, 0 0 18px rgba(177,75,255,.5);
  }

  /* RPG confirmation modal */
  .rpg-modal {
    background: #000; border: 4px solid #fff;
    box-shadow: inset 0 0 0 4px #000, inset 0 0 0 8px #fff, 0 8px 0 #000;
    position: relative;
  }
```

Also add these keyframes **outside** `@layer components` (after the existing `@keyframes` block, around line 89):

```css
@keyframes neonFlicker { 0%,18%,22%,25%,53%,57%,100%{opacity:1} 20%,24%,55%{opacity:.55} }
@keyframes modalIn     { from{transform:scale(0.85);opacity:0} to{transform:scale(1);opacity:1} }
@keyframes warnBlink   { 0%,100%{opacity:1} 50%{opacity:0.4} }
```

And add these utility classes inside `@layer components`:

```css
  .neon-flicker { animation: neonFlicker 5s infinite; }
  .modal-pop    { animation: modalIn .14s steps(3,end) both; }
  .warn-blink   { animation: warnBlink 0.8s steps(2,end) infinite; }
```

- [ ] **Step 2: Verify dev server shows no CSS errors**

```bash
npm run dev
```

Open http://localhost:3000 — existing pages should look unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add admin console CSS classes to global stylesheet"
```

---

### Task 4: Create DELETE API route

**Files:**
- Create: `src/app/api/admin/users/[id]/route.ts`

- [ ] **Step 1: Create directory and file**

```typescript
// src/app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Verify session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Verify admin role
  const userRole = (session.user as { role?: string }).role;
  if (userRole !== "admin") {
    logger.warn("ADMIN_FORBIDDEN", `Tentative d'accès admin refusée`, session.user.id);
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 3. Delete user and cascading relations in a transaction
  // Reponse and UtilisateurBadge lack cascade — delete manually before Utilisateur
  try {
    await prisma.$transaction([
      prisma.utilisateurBadge.deleteMany({ where: { utilisateurId: id } }),
      prisma.reponse.deleteMany({ where: { utilisateurId: id } }),
      prisma.utilisateur.delete({ where: { id } }),
    ]);
  } catch {
    logger.error("USER_DELETE_FAILED", `Impossible de supprimer l'utilisateur ${id}`, session.user.id);
    return NextResponse.json({ error: "User not found or delete failed" }, { status: 404 });
  }

  // 4. Audit log
  logger.warn(
    "USER_DELETED",
    `Admin ID ${session.user.id} a supprimé l'utilisateur ${id}`,
    session.user.id
  );

  return NextResponse.json({ success: true });
}
```

> **Note on Next.js 16:** `params` is a Promise in Next.js 15+. If running Next.js 16, `await params` is required. Check `node_modules/next/dist/docs/` if the above pattern causes a type error and adjust accordingly.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Manual smoke test (requires an admin session)**

```bash
# Non-admin call should return 403
curl -X DELETE http://localhost:3000/api/admin/users/test-id
# Expected: {"error":"Unauthorized"} with 401
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/users/[id]/route.ts
git commit -m "feat: add admin-only DELETE /api/admin/users/[id] route with audit logging"
```

---

### Task 5: Create Admin Dashboard (Server + Client Component)

**Files:**
- Create: `src/app/admin/dashboard/page.tsx`
- Create: `src/app/admin/dashboard/AdminDashboardClient.tsx`

- [ ] **Step 1: Create the Server Component page (auth guard + data fetch)**

```typescript
// src/app/admin/dashboard/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  // Server-side auth guard — pg.Pool can't run in Edge middleware
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if ((session.user as { role?: string }).role !== "admin") redirect("/dashboard");

  const utilisateurs = await prisma.utilisateur.findMany({
    orderBy: { niveau: "desc" },
    select: { id: true, pseudo: true, email: true, niveau: true, xp: true, role: true },
  });

  return (
    <AdminDashboardClient
      utilisateurs={utilisateurs}
      adminId={session.user.id}
      adminEmail={session.user.email}
    />
  );
}
```

- [ ] **Step 2: Create the Client Component (full Game Master Console UI)**

```typescript
// src/app/admin/dashboard/AdminDashboardClient.tsx
"use client";

import { useState, useMemo, useEffect } from "react";

/* ── Types ─────────────────────────────────────────────── */
type Utilisateur = {
  id: string;
  pseudo: string;
  email: string;
  niveau: number;
  xp: number;
  role: "USER" | "ADMIN";
};

type Props = {
  utilisateurs: Utilisateur[];
  adminId: string;
  adminEmail: string;
};

/* ── Pixel SVG helpers ──────────────────────────────────── */
function PixelGrid({ rows, palette, size = 24 }: {
  rows: string[];
  palette: Record<string, string>;
  size?: number;
}) {
  const w = rows[0].length, h = rows.length;
  return (
    <svg width={size} height={(size * h) / w} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges">
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

function PixelAvatar({ seed, size = 44 }: { seed: string; size?: number }) {
  const rng = (n: number) => {
    let h = 2166136261;
    const s = seed + ":" + n;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
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
  const W = 8, H = 8;
  const grid: string[][] = Array.from({ length: H }, () => Array(W).fill("."));
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x <= 3; x++) {
      const r = rng(y * 10 + x) % 7;
      const ch = r < 3 ? "v" : r < 5 ? "w" : r < 6 ? "a" : "K";
      grid[y][x] = ch;
      grid[y][W - 1 - x] = ch;
    }
  }
  grid[3][2] = "K"; grid[3][5] = "K";
  grid[5][3] = "K"; grid[5][4] = "K";
  const rows = grid.map(r => r.join(""));
  return <PixelGrid size={size} palette={palette} rows={rows} />;
}

const TrashIcon = ({ size = 18 }: { size?: number }) => (
  <PixelGrid size={size} palette={{ K: "#000", w: "#fff", r: "#ff2d55" }} rows={[
    "....KKKK....", "..KKwwwwKK..", "KKKKKKKKKKKK",
    "KwwwwwwwwwwK", ".KrwrwrwrwK.", ".KrwrwrwrwK.",
    ".KrwrwrwrwK.", ".KrwrwrwrwK.", ".KrwrwrwrwK.",
    ".KKKKKKKKKK.", "..KrrrrrrK..", "..KKKKKKKK..",
  ]} />
);

const SkullIcon = ({ size = 18 }: { size?: number }) => (
  <PixelGrid size={size} palette={{ K: "#000", w: "#fff", r: "#ff2d55" }} rows={[
    "..KKKKKKKK..", ".KwwwwwwwwK.", "KwwwwwwwwwwK",
    "KwKKwwKKwwwK", "KwKrwwKrwwwK", "KwKKwwKKwwwK",
    "KwwwwwwwwwwK", "KwwKwKwKwwwK", "KwwwKKwwwwwK",
    ".KwwwwwwwwK.", "..KKKKKKKK..", "............",
  ]} />
);

const MagnifierIcon = ({ size = 20 }: { size?: number }) => (
  <PixelGrid size={size} palette={{ K: "#000", b: "#22a7ff", w: "#cfe9ff" }} rows={[
    "...KKKK......", "..KbbbbK.....", ".KbwwwwbK....",
    ".KbwKKwwbK...", ".KbwKKwwbK...", ".KbwwwwbK....",
    "..KbbbbK.....", "...KKKKKK....", ".....KKKK....",
    "......KKKK...", ".......KKK...", "........KK...",
  ]} />
);

const WarnIcon = ({ size = 42 }: { size?: number }) => (
  <PixelGrid size={size} palette={{ K: "#000", g: "#ffd23a", w: "#fff" }} rows={[
    "......KK......", ".....KggK.....", "....KggggK....",
    "....KggggK....", "...KggwggK....", "...KggwggK....",
    "..KggggwggK...", "..KggggwggK...", ".KggggKKggggK.",
    ".KgggKwwKgggK.", "KggggwwggggggK", "KggKKKKKKggggK",
    "KKKKKKKKKKKKKK", "..............",
  ]} />
);

/* ── Sub-components ─────────────────────────────────────── */
function RoleChip({ role }: { role: "USER" | "ADMIN" }) {
  return (
    <span className={`chip ${role === "ADMIN" ? "chip-violet" : "chip-blue"}`}>
      {role}
    </span>
  );
}

function LevelBar({ niveau }: { niveau: number }) {
  const pct = Math.min(100, (niveau / 50) * 100);
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="font-pixel text-[10px] glow-emerald">LV {String(niveau).padStart(2, "0")}</div>
      <div className="hidden xl:flex flex-1 h-3 bg-[#07050f] border-2 border-black p-[2px] gap-[2px] min-w-[60px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex-1"
            style={{ background: i < Math.round(pct / 10) ? "linear-gradient(180deg,#43ff9a,#0d8f4a)" : "#1a1233" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── KPI Strip ──────────────────────────────────────────── */
function KPIStrip({ utilisateurs }: { utilisateurs: Utilisateur[] }) {
  const admins = utilisateurs.filter(u => u.role === "ADMIN").length;
  const users = utilisateurs.filter(u => u.role === "USER").length;
  const items = [
    { label: "TOTAL JOUEURS", value: utilisateurs.length, color: "glow-blue", chip: "chip-blue", chipText: "GLOBAL" },
    { label: "ADMINS", value: admins, color: "glow-violet", chip: "chip-violet", chipText: "CLEARANCE 9" },
    { label: "JOUEURS", value: users, color: "glow-emerald", chip: "chip-emerald", chipText: "ACTIFS" },
    { label: "TOP NIVEAU", value: utilisateurs[0]?.niveau ?? 0, color: "glow-gold", chip: "chip-gold", chipText: "RECORD" },
  ];
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((k, i) => (
        <div key={i} className="panel">
          <div className="p-4">
            <div className="font-pixel text-[9px] text-[var(--ink-dim)] mb-2">{k.label}</div>
            <div className={`font-pixel text-[26px] ${k.color}`}>{k.value}</div>
            <div className="mt-3"><span className={`chip ${k.chip}`}>{k.chipText}</span></div>
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
        <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
          ◆ PLAYER INVENTORY — {players.length} ENTRIES
        </div>
        <div className="font-mono-pixel text-[14px] text-white/80 hidden sm:block">
          SORT: NIVEAU ↓
        </div>
      </div>

      {/* Header */}
      <div className="inv-head">
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={allSelected} onChange={toggleSelectAll}
            className="w-4 h-4 accent-[var(--neon-violet)]" />
        </div>
        <div className="font-pixel text-[9px] text-[var(--ink-dim)]">PSEUDO</div>
        <div className="font-pixel text-[9px] text-[var(--ink-dim)] hidden md:block">EMAIL</div>
        <div className="font-pixel text-[9px] text-[var(--ink-dim)] hidden lg:block">NIVEAU</div>
        <div className="font-pixel text-[9px] text-[var(--ink-dim)] hidden lg:block">RÔLE</div>
        <div className="font-pixel text-[9px] text-[var(--ink-dim)] text-right">ACTIONS</div>
      </div>

      {/* Body */}
      <div>
        {players.length === 0 && (
          <div className="p-8 text-center font-mono-pixel text-[18px] text-[var(--ink-dim)]">
            <span className="text-[var(--gold)]">⚠</span> Aucun joueur ne correspond à la recherche.
          </div>
        )}
        {players.map((p) => (
          <div key={p.id} className="inv-row">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={!!selected[p.id]} onChange={() => toggleSelect(p.id)}
                className="w-4 h-4 accent-[var(--neon-violet)]" />
              <div className="avatar-frame" style={{ width: 44, height: 44 }}>
                <PixelAvatar seed={p.pseudo} size={38} />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="pseudo font-pixel text-[11px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
                  {p.pseudo}
                </span>
                <RoleChip role={p.role} />
              </div>
              <div className="font-mono-pixel text-[14px] text-[var(--ink-dim)] mt-1">
                XP: {p.xp}
              </div>
            </div>

            <div className="hidden md:block font-mono-pixel text-[16px] text-[var(--ink-dim)] truncate">
              {p.email}
            </div>

            <div className="hidden lg:block"><LevelBar niveau={p.niveau} /></div>
            <div className="hidden lg:block"><RoleChip role={p.role} /></div>

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
function SideBar() {
  const items = [
    { k: "DASHBOARD", active: false },
    { k: "JOUEURS", active: true, count: null },
    { k: "LOGS", active: false },
    { k: "SETTINGS", active: false },
  ];
  return (
    <aside className="panel panel-blue">
      <div className="titlebar titlebar-blue flex items-center justify-between">
        <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
          ▣ COMMAND MENU
        </div>
      </div>
      <div className="p-4 space-y-2">
        {items.map((it, i) => (
          <button key={i} className={`nav-link justify-between ${it.active ? "active" : ""}`}>
            <span>▶ {it.k}</span>
          </button>
        ))}
      </div>
      <div className="pix-div" />
      <div className="p-4">
        <div className="font-pixel text-[10px] text-[var(--gold)] mb-3">▣ INFOS SYSTÈME</div>
        <ul className="space-y-2 font-mono-pixel text-[16px]">
          <li className="flex gap-3">
            <span className="font-pixel text-[8px] text-[var(--emerald)]">DB</span>
            <span className="text-[var(--ink-dim)]">PostgreSQL · ONLINE</span>
          </li>
          <li className="flex gap-3">
            <span className="font-pixel text-[8px] text-[var(--neon-violet)]">AUTH</span>
            <span className="text-[var(--ink-dim)]">Better-Auth v1</span>
          </li>
          <li className="flex gap-3">
            <span className="font-pixel text-[8px] text-[var(--gold)]">ROLE</span>
            <span className="text-[var(--ink-dim)]">ADMIN · CLEARANCE 9</span>
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
    if (!player) return;
    setConfirmText("");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter" && ok && !loading) onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [player, ok, loading, onCancel, onConfirm]);

  if (!player) return null;

  return (
    <div className="fixed inset-0 z-[5500] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}>
      <div className="rpg-modal modal-pop max-w-[520px] w-full p-1">
        {/* RPG corners */}
        {[
          "absolute w-[14px] h-[14px] bg-white border-[3px] border-black -top-[7px] -left-[7px]",
          "absolute w-[14px] h-[14px] bg-white border-[3px] border-black -top-[7px] -right-[7px]",
          "absolute w-[14px] h-[14px] bg-white border-[3px] border-black -bottom-[7px] -left-[7px]",
          "absolute w-[14px] h-[14px] bg-white border-[3px] border-black -bottom-[7px] -right-[7px]",
        ].map((cls, i) => <span key={i} className={cls} />)}

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="warn-blink"><WarnIcon size={48} /></div>
            <div>
              <div className="font-pixel text-[14px] text-white" style={{ textShadow: "2px 2px 0 #000, 0 0 10px var(--danger)" }}>
                ⚠ WARNING
              </div>
              <div className="font-pixel text-[10px] text-[#ddd] mt-1">ACTION IRRÉVERSIBLE</div>
            </div>
          </div>

          <div className="font-mono-pixel text-[20px] leading-[1.45] text-white">
            <p>
              Supprimer le joueur{" "}
              <span className="text-[var(--danger)]">{player.pseudo}</span> ?
            </p>
            <p className="mt-2 text-[var(--ink-dim)] text-[17px]">
              {player.email} · LV {String(player.niveau).padStart(2, "0")} · XP {player.xp}
            </p>
            <p className="mt-2 text-[var(--ink-dim)] text-[17px]">
              Toutes les données seront{" "}
              <span className="text-white">purgées du donjon</span>.
            </p>
          </div>

          <div>
            <div className="font-pixel text-[9px] text-[var(--ink-dim)] mb-2">
              Tape <span className="text-[var(--danger)]">ERASE</span> pour confirmer.
            </div>
            <input
              autoFocus
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder="ERASE"
              className="w-full bg-black border-4 border-white p-3 font-mono-pixel text-[20px] text-white outline-none uppercase"
              style={{ boxShadow: "inset 0 0 0 2px #000, inset 0 0 0 4px #fff" }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button onClick={onCancel} className="arcade arcade-ghost text-[12px]"
              style={{ background: "#1a1233", color: "#fff", boxShadow: "0 6px 0 #000, inset 0 0 0 2px #444" }}>
              ANNULER
            </button>
            <button
              onClick={ok && !loading ? onConfirm : undefined}
              disabled={!ok || loading}
              className={`arcade arcade-danger text-[12px] ${ok && !loading ? "" : "disabled"}`}
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
        <div className="px-5 py-3 font-pixel text-[10px] text-white flex items-center gap-3"
          style={{ textShadow: "2px 2px 0 #000" }}>
          <SkullIcon size={16} />{msg}
        </div>
      </div>
    </div>
  );
}

/* ── Main export ────────────────────────────────────────── */
export default function AdminDashboardClient({ utilisateurs, adminId, adminEmail }: Props) {
  const [players, setPlayers] = useState<Utilisateur[]>(utilisateurs);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "USER" | "ADMIN">("all");
  const [askDelete, setAskDelete] = useState<Utilisateur | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return players.filter(p => {
      if (filter !== "all" && p.role !== filter) return false;
      if (!q) return true;
      return p.pseudo.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
    });
  }, [players, query, filter]);

  const toggleSelect = (id: string) =>
    setSelected(s => ({ ...s, [id]: !s[id] }));
  const allSelected =
    filtered.length > 0 && filtered.every(p => selected[p.id]);
  const toggleSelectAll = () => {
    if (allSelected) {
      const next = { ...selected };
      filtered.forEach(p => delete next[p.id]);
      setSelected(next);
    } else {
      const next = { ...selected };
      filtered.forEach(p => (next[p.id] = true));
      setSelected(next);
    }
  };

  const handleConfirmDelete = async () => {
    if (!askDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${askDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setPlayers(ps => ps.filter(p => p.id !== askDelete.id));
      setSelected(s => { const n = { ...s }; delete n[askDelete.id]; return n; });
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
      {/* Header */}
      <header className="panel panel-violet">
        <div className="titlebar titlebar-violet flex items-center justify-between">
          <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
            ▣ ADMIN.SAV — RESTRICTED ACCESS
          </div>
          <div className="font-mono-pixel text-[14px] text-white/80 hidden sm:flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-[var(--emerald)]" style={{ boxShadow: "0 0 6px var(--emerald)" }} />
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
              ACADEM&apos;IA · MOD PANEL · RESTRICTED <span className="caret">&nbsp;</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end font-mono-pixel text-[16px] leading-tight">
              <div className="text-white">{adminEmail}</div>
              <div className="text-[var(--ink-dim)] text-[14px]">SUPERUSER · CLEARANCE 9</div>
            </div>
          </div>
        </div>
        {/* Marquee */}
        <div className="border-t-4 border-black overflow-hidden bg-black">
          <div className="marquee-track py-2 font-mono-pixel text-[16px]">
            {[0, 1].map(i => (
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

      {/* KPI Strip */}
      <KPIStrip utilisateurs={players} />

      {/* Main grid */}
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
                  onChange={e => setQuery(e.target.value)}
                  type="text"
                  placeholder="Rechercher par pseudo ou email..."
                  className="pix-input"
                />
                {query && (
                  <button onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 font-pixel text-[10px] text-[var(--ink-dim)] hover:text-white px-2 py-1 border-2 border-black bg-[#0e0a22]">
                    [X]
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="font-pixel text-[9px] text-[var(--ink-dim)]">FILTER</span>
                {(["all", "USER", "ADMIN"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`chip cursor-pointer ${filter === f ? (f === "ADMIN" ? "chip-violet" : f === "USER" ? "chip-blue" : "chip-emerald") : "chip-ghost"}`}>
                    {f === "all" ? "TOUS" : f}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <PlayerTable
            players={filtered}
            onAskDelete={setAskDelete}
            selected={selected}
            toggleSelect={toggleSelect}
            toggleSelectAll={toggleSelectAll}
            allSelected={allSelected}
          />
        </div>
        <SideBar />
      </div>

      {/* Footer */}
      <footer className="panel">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 font-mono-pixel text-[14px] text-[var(--ink-dim)] gap-2">
          <div>© 2026 ACADEM&apos;IA · GM CONSOLE · v1.16-bit</div>
          <div className="flex gap-4">
            <span>DB: <span className="text-[var(--emerald)]">ONLINE</span></span>
            <span>AUTH: <span className="text-[var(--elec-blue)]">ACTIVE</span></span>
          </div>
        </div>
      </footer>

      <EraseModal
        player={askDelete}
        onCancel={() => setAskDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
      <Toast msg={toast} onClose={() => setToast(null)} />
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Start dev server and verify the page loads**

```bash
npm run dev
```

Navigate to http://localhost:3000/admin/dashboard.
- Without a session → should redirect to `/login`
- As a non-admin user → should redirect to `/dashboard`
- As an admin → should show the Game Master Console

To manually test as admin, run this SQL to set an existing user as admin in Better-Auth's table:
```sql
UPDATE "user" SET role = 'admin' WHERE email = 'your-email@example.com';
```

- [ ] **Step 5: Test delete flow**
  1. Log in as admin, go to `/admin/dashboard`
  2. Click the trash button on any user row
  3. The ERASE modal opens — type anything other than `ERASE` → button stays disabled
  4. Type `ERASE` → button activates
  5. Click `ERASE` — row disappears, toast appears, server logs show `[WARN] [USER_DELETED]`

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/dashboard/page.tsx src/app/admin/dashboard/AdminDashboardClient.tsx
git commit -m "feat: add admin dashboard with pixel-art Game Master Console UI and user deletion"
```

---

## Self-Review

**Spec coverage:**
- ✅ `role` field on Better-Auth user with default `"user"` — Task 2
- ✅ New users default to `"user"` — `defaultValue: "user"` in additionalFields
- ✅ DELETE route at `src/app/api/admin/users/[id]/route.ts` — Task 4
- ✅ Admin-only enforcement (403 for non-admins) — Task 4
- ✅ Audit log with `[WARN] [USER_DELETED]` — Task 4
- ✅ Dashboard at `src/app/admin/dashboard/page.tsx` — Task 5
- ✅ Pixel-art style matching HTML reference — Task 3 + 5
- ✅ User list from Prisma — Task 5 (Server Component)
- ✅ Delete button with confirmation modal — Task 5 (Client Component)
- ✅ Server-side protection (redirect if not admin) — Task 5

**Placeholders:** None.

**Type consistency:** `Utilisateur` type used consistently across all components in Task 5. `DELETE` route uses `params: Promise<{id: string}>` per Next.js 15/16 pattern.
