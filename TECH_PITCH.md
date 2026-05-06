# ACADEM'IA — Pitch Technique Jury

> Plateforme d'apprentissage gamifiée, générée par IA, construite en 48h.

---

## Architecture Fullstack — Next.js 15 App Router

**Choix :** Monorepo fullstack avec App Router (React Server Components + API Routes dans le même projet).

**Pourquoi :** Zéro latence entre le rendu serveur et les appels DB. Les pages protégées (`/dashboard`, `/quizz`) font leur vérification d'authentification côté serveur avant tout rendu — pas de flash de contenu non-authentifié, pas de round-trip client. Le pattern `page.tsx` → fetch DB → props vers `Client.tsx` est explicitement recommandé par Next.js pour les données d'initialisation.

---

## Base de données & ORM — PostgreSQL + Prisma

**Choix :** PostgreSQL via Prisma v6, hébergé sur Railway en production.

**Pourquoi :** Prisma génère un client TypeScript strict à partir du schéma — toute incohérence entre le code et la DB est détectée à la compilation, pas en production. Les relations Prisma (`Utilisateur → Badge`, `Utilisateur → DonjonProgression`) garantissent l'intégrité référentielle avec cascade. Les transactions Prisma (`prisma.$transaction`) assurent que XP + HP + pièces sont toujours sauvegardés ensemble, jamais dans un état partiel.

---

## Moteur Hybride — Gemini API + Fallback local

**Architecture à 3 niveaux de résilience :**

```
Requête question
    │
    ▼
[1] Gemini 2.0 Flash (timeout 10s)
    │ Succès → question fraîche + HMAC token
    │ Échec (timeout / quota / réseau)
    ▼
[2] Fallback DB Prisma (questions pré-seedées par matière)
    │ Succès → question DB
    │ Vide
    ▼
[3] Pool statique hardcodé (35 questions, 5 par matière)
    → toujours disponible, jamais de crash
```

**Anti-triche serveur-autoritaire :** La bonne réponse n'est jamais envoyée au client. Le serveur signe chaque question avec un token HMAC-SHA256 (`correctIndex:questionId`). La vérification se fait avec `crypto.timingSafeEqual` pour prévenir les timing attacks.

---

## Gamification & UI — Tailwind CSS + Framer Motion

**Palette technique :**
- **Tailwind CSS v4** : design system cohérent en CSS tokens (`--neon-violet`, `--emerald`, `--danger`), responsive mobile-first
- **Framer Motion** : transitions d'état fluides (Game Over overlay, Badge popup, Level Up banner) avec `AnimatePresence` pour les démontages animés
- **Game feel :** TimerBar dégressive, BossBar avec HP, ComboFlame animée, police pixel-art (`Press Start 2P`), effet CRT scanlines

**Difficulté adaptive :** Le `palier` (1→4) s'adapte en temps réel — 3 bonnes réponses consécutives monte le tier, 2 erreurs le descend. Le moteur `adaptPalier()` tourne **côté serveur** après chaque réponse, évitant toute manipulation client.

---

## Risques Anticipés & Mitigés

| Risque | Mitigation |
|---|---|
| Crash de l'IA Gemini (quota, réseau) | Fallback DB + pool statique — jamais de page blanche |
| Triche (injection de la bonne réponse) | HMAC serveur-autoritaire — le client ne connaît jamais `correctIndex` |
| Injection XP (manipulation du payload) | Cap côté serveur `Math.min(xpGained, 2500)` + recalcul serveur en mode full game engine |
| Quota Gemini exposé | Route `/api/quiz/generate` protégée par session Better-Auth |
| Game Over permanent (HP bloqué à 0) | Restauration automatique à 3 HP au démarrage d'une nouvelle partie |
| Race condition réponses multiples | `answerInFlight` ref mutex côté client + validation HMAC côté serveur |
| Fragilité déploiement | Docker multi-stage + `prisma generate` intégré, `DATABASE_URL` via env |

---

## Stack Résumée

```
Frontend  : Next.js 15 · React 19 · Tailwind v4 · Framer Motion
Backend   : Next.js API Routes · Better-Auth · Prisma v6
DB        : PostgreSQL (Railway)
IA        : Google Gemini 2.0 Flash (via @google/generative-ai)
Infra     : Docker · Railway · GitHub Actions CI
Sécurité  : HMAC-SHA256 · timingSafeEqual · Session cookie HttpOnly
```

---

*Construit en 48h pour le Hackathon 2026 — chaque feature est en production.*
