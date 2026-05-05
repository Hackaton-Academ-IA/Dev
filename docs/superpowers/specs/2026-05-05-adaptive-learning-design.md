# Adaptive Learning — Design Spec
**Date:** 2026-05-05  
**Status:** Approved  
**Scope:** 6 sections, all files listed explicitly

---

## 1. Data Model Changes (Prisma)

### 1.1 `Question` model — add MCQ fields
```prisma
model Question {
  id               String    @id @default(uuid())
  contenu          String
  difficulte       String    // "apprenti" | "confirme" | "expert" | "maitre"
  matiere          String    // NEW
  choix            String[]  // NEW — exactly 4 choices
  correctIndex     Int       // NEW — 0..3
  reponse_attendue String    // kept for backward compat
  reponses         Reponse[]
}
```

### 1.2 `Utilisateur` model — no changes needed
`dailyQuestsDone Int @default(0)` and `lastDailyAt DateTime?` already exist.

### 1.3 `DonjonProgression` model — new
```prisma
model DonjonProgression {
  id          String      @id @default(uuid())
  userId      String
  donjonId    Int
  statut      String      // "LOCKED" | "UNLOCKED" | "COMPLETED"
  utilisateur Utilisateur @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, donjonId])
}
```

### 1.4 Seed script — `prisma/seed.ts`
70 questions, 10 per subject × 7 subjects:
`Mathématiques`, `Histoire`, `Sciences`, `Philosophie`, `Littérature`, `Géographie`, `Informatique`

Distribution per subject: ~3 apprenti, 3 confirme, 2 expert, 2 maitre.

---

## 2. QuestionService (`src/lib/game/question-service.ts`)

Single exported function:
```typescript
export async function getAdaptiveQuestion(userId: string): Promise<AdaptiveResult>
```

### Internal logic
1. Fetch user row: `{ niveau, xp, hp }` from Prisma
2. Compute `targetDifficulty`:
   - niveau 1–3 → `"apprenti"`
   - niveau 4–6 → `"confirme"`
   - niveau 7–9 → `"expert"`
   - niveau 10+  → `"maitre"`
3. Compute `adaptiveScore = niveau / 13` (clamped 0–1)
4. Pick random `matiere` from the 7 constants
5. **Path A (Gemini):** call `generateQuestion(matiere, targetDifficulty)` from `generator.ts`
6. **Path B (DB fallback):** on any error (quota 429, timeout, parse failure):
   - `prisma.question.findMany({ where: { matiere, difficulte: targetDifficulty } })`
   - If empty → relax to any difficulty for that matière
   - Pick random from results
   - Return with `isAiGenerated: false`

### Return type
```typescript
interface AdaptiveResult {
  question: Question         // lib/game/types.ts Question shape
  token: string              // HMAC signed via signQuestion()
  isAiGenerated: boolean
  adaptiveScore: number      // 0.0–1.0
}
```

---

## 3. Route `/api/quiz/daily` (new file)

**File:** `src/app/api/quiz/daily/route.ts`

### POST handler
1. Auth check → 401 if missing
2. Fetch user: `{ dailyQuestsDone, lastDailyAt, niveau, xp, hp }`
3. Daily reset: if `lastDailyAt` date < today midnight → effective count = 0
4. If effective count >= 5 → return `{ limitReached: true, dailyQuestsDone: 5 }`
5. Call `getAdaptiveQuestion(userId)`
6. Persist: `dailyQuestsDone = effectiveCount + 1`, `lastDailyAt = new Date()`
7. Return: `{ question, token, isAiGenerated, adaptiveScore, dailyQuestsDone }`

This route is the **only** place that reads/writes `dailyQuestsDone` for the Dashboard challenge.  
It does **not** touch `/api/game/answer` or dungeon progression.

---

## 4. Dashboard & XP Fixes

### 4.1 `src/lib/game/engine.ts`
```typescript
// BEFORE
export function xpThreshold(niveau: number): number {
  return 100 * niveau * niveau;
}
export const SPEED_BONUS = 10;

// AFTER
export function xpThreshold(niveau: number): number {
  return Math.round(100 * Math.pow(niveau, 1.5));
}
export const SPEED_BONUS = 15;
// BASE_XP_PER_ANSWER stays 25, COMBO_BONUS stays 50
```

Progression comparison:
| Level | Old (n²) | New (n^1.5) |
|-------|----------|-------------|
| 5     | 2 500 XP | 1 118 XP    |
| 10    | 10 000 XP| 3 162 XP    |
| 15    | 22 500 XP| 5 809 XP    |

### 4.2 `src/components/dashboard/DashboardClient.tsx`
- `AIChallenge` receives `dailyQuestsDone: number` and `dailyMax: 5` as props
- On mount / "NOUVELLE QUÊTE" click → `fetch('/api/quiz/daily', { method: 'POST' })`
- Display `isAiGenerated` badge: `🤖 IA` or `💾 ARCHIVES`
- If `limitReached` or `dailyQuestsDone >= 5`: show completion banner, disable "Nouvelle Quête" button
- Remove static `QUESTION_BANK` — no longer needed
- No `Date.now()` in render — any time-dependent display goes in `useEffect`
- Defensive null check: `niveau ?? 1` and `xp ?? 0` before passing to engine functions

---

## 5. Dungeon Progression Persistence

### 5.1 New endpoint `src/app/api/game/dungeon/route.ts`

**GET** — called on `/quizz` mount:
- Auth check
- `prisma.donjonProgression.findMany({ where: { userId } })`
- Return array `[{ donjonId, statut }]`
- If no rows: seed donjon 1 as `UNLOCKED`, rest as `LOCKED`

**POST** — called by `/quizz/page.tsx` on correct answer:
```typescript
body: { donjonId: number }
```
- Auth check
- Upsert current donjon → `COMPLETED`
- Upsert next donjon (`donjonId + 1`) → `UNLOCKED` (if it exists in the 25-dungeon list)
- Return `{ completedId: number, unlockedId: number | null }`

### 5.2 `/quizz/page.tsx` changes
- On mount: `fetch('/api/game/dungeon')` → initialise `completedIds` from DB statuses
- In `handleAnswer` on correct: call `POST /api/game/dungeon` with `{ donjonId }`
- Remove `INITIAL_COMPLETED = new Set(["1"])` — state comes from DB
- Dungeon list imported from `src/lib/game/dungeons.ts`

---

## 6. World Map — 25 Dungeons in 5 Biomes

### 6.1 New file `src/lib/game/dungeons.ts`
Exports `DUNGEONS` (25 items) and `BIOMES` (5 items).

### 6.2 Biome structure
| Biome | Donjons | Boss | Question difficulty |
|-------|---------|------|---------------------|
| 1 · Forêt Ancienne  | 1–5   | #5  | `apprenti`  |
| 2 · Désert Maudit   | 6–10  | #10 | `confirme`  |
| 3 · Crypte des Âmes | 11–15 | #15 | `confirme` → `expert` |
| 4 · Volcan du Chaos | 16–20 | #20 | `expert`    |
| 5 · Abysses Oubliées| 21–25 | #25 | `maitre`    |

### 6.3 Map geometry
- `MAP_HEIGHT = 5000` (200px per dungeon node)
- Nodes follow a winding S-path pattern across x: 20%–80%
- Each biome has a distinct accent color
- The dungeon map (`/quizz`) keeps its current `"5/10"` / `"8/10"` difficulty strings for `/api/quiz/generate` — unchanged
- Each `Dungeon` object in `dungeons.ts` carries a `difficulte: Difficulte` field used only by the QuestionService when generating a question for a specific biome context in future iterations

---

## Files Created / Modified

| File | Action |
|------|--------|
| `prisma/schema.prisma` | Modify — add `Question` fields + `DonjonProgression` model |
| `prisma/seed.ts` | Create — 70 MCQ questions |
| `src/lib/game/engine.ts` | Modify — `xpThreshold`, `SPEED_BONUS` |
| `src/lib/game/question-service.ts` | Create — `getAdaptiveQuestion()` |
| `src/lib/game/dungeons.ts` | Create — `DUNGEONS` 25-item constant |
| `src/app/api/quiz/daily/route.ts` | Create — daily challenge endpoint |
| `src/app/api/game/dungeon/route.ts` | Create — dungeon progression CRUD |
| `src/components/dashboard/DashboardClient.tsx` | Modify — wire `AIChallenge` to `/api/quiz/daily` |
| `src/app/quizz/page.tsx` | Modify — load/persist dungeon progression |

**`/api/game/answer/route.ts` is NOT modified** — it handles the full game engine only.

---

## Invariants & Constraints

- `dailyQuestsDone` is the single source of truth in Prisma — never derived client-side
- `DonjonProgression` uses `@@unique([userId, donjonId])` — upserts are always safe
- The `Question` fallback only triggers on Gemini errors — no silent degradation
- `SPEED_BONUS` change (10→15) is the only XP constant that changes; others stay the same
- Dungeon ids 1–25 are integers matching `DUNGEONS[i].id` cast to Int
