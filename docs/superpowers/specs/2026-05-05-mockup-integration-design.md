# Academ'IA — Full App Mockup Integration

**Date:** 2026-05-05  
**Status:** Approved

## Overview

Convert 3 standalone HTML prototypes (Landing, Login, Dashboard) into a production-quality Next.js 16 App Router application with Tailwind v4, TypeScript strict, and Better-Auth.

---

## File Map

| File | Type | Source |
|---|---|---|
| `src/app/globals.css` | CSS | Merge all 3 HTML `<style>` blocks |
| `src/app/layout.tsx` | RSC | Add Press Start 2P + VT323 via next/font/google |
| `src/components/ui/PixelIcons.tsx` | RSC | All pixel-grid SVG icons from all 3 pages |
| `src/app/page.tsx` | RSC | Academia Landing.html |
| `src/components/landing/NavBar.tsx` | Client | onClick → router.push('/login') |
| `src/components/landing/Hero.tsx` | RSC | Static hero + Tower composite |
| `src/components/landing/Tower.tsx` | RSC | CSS-only animations (scrollUp, climb) |
| `src/components/landing/ConceptSection.tsx` | RSC | LoopNode x3 + stats strip |
| `src/components/landing/TargetCards.tsx` | RSC | B2B + Solo cards |
| `src/app/login/page.tsx` | RSC | Star backgrounds + stage-glow layout |
| `src/components/login/LoginForm.tsx` | Client | Form + Better-Auth + redirect |
| `src/app/dashboard/page.tsx` | RSC | Session guard shell |
| `src/components/dashboard/DashboardClient.tsx` | Client | Full dashboard state (xp, hp, coins, QCM, logout) |

---

## CSS Architecture (globals.css)

```css
@import "tailwindcss";

@theme inline {
  /* Color tokens → generates bg-neon-violet, text-emerald, etc. */
  --color-neon-violet: #b14bff;
  --color-elec-blue: #22a7ff;
  --color-emerald: #1eea7c;
  --color-hot-pink: #ff3aa3;
  --color-gold: #ffd23a;
  --color-danger: #ff4d4d;
  --color-ink: #e8e6ff;
  --color-ink-dim: #a39fcf;
  --color-bg: #07060d;
  --color-bg-2: #0d0a1a;
  --color-grid: #1a1530;
  /* Font families */
  --font-pixel: var(--font-press-start);
  --font-vt323: var(--font-vt323-var);
}

:root {
  /* Raw CSS vars for use in complex inline/class CSS */
  --neon-violet: #b14bff; /* ... etc */
}

/* @keyframes at root level */
/* @layer components { .panel, .arcade, .rpg-box, .pix-input, ... } */
```

---

## Auth Flow

```
Landing  →  click CTA  →  /login
Login    →  authClient.signIn.email({ email, password, rememberMe })
         →  success: redirect /dashboard
         →  error: show red pixel error box
Dashboard →  authClient.signOut()  →  redirect /login
```

**Better-Auth call signature:**
```ts
const { error } = await authClient.signIn.email({
  email, password, rememberMe,
  callbackURL: '/dashboard'
});
```

---

## Dashboard AI Challenge

The Dashboard's `generateAIQuestion` uses `window.claude.complete()` (Claude iframe API). This is **not available in production Next.js**. Replaced with:
- Default: QUESTION_BANK static fallback (6 questions bundled)
- `useAI: false` by default (safe for demo)
- API route `/api/ai/question` could be wired later

---

## Auth Guard (Dashboard)

```tsx
// src/app/dashboard/page.tsx
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

const session = await auth.api.getSession({ headers: await headers() })
if (!session) redirect('/login')
```

---

## Constraints

- TypeScript strict — explicit `interface` props on every component
- No `tailwind.config.ts` — all design tokens in `globals.css`
- No `window.claude` — use QUESTION_BANK with AI route placeholder
- `next/font/google` only — no Google CDN `<link>` tags
- No `style={{fontFamily: ...}}` inline — use `className="font-pixel"` or `className="font-vt323"` via Tailwind token
- `style={{textShadow: ...}}` and `style={{boxShadow: ...}}` inline styles are acceptable — Tailwind v4 has no utilities for complex multi-layer shadows
