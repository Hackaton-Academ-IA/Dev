# Robustesse & Résilience — Jalon 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Blinder Academ'IA — logger structuré, error handling failsafe, nettoyage du code mort — pour valider le Jalon 3.

**Architecture:** Logger serveur centralisé dans `src/lib/logger.ts` utilisé par les hooks Better-Auth (server-side) et le composant dashboard (server component). Les erreurs client sont normalisées en messages RPG lisibles. Le code mort est supprimé sans changer les comportements.

**Tech Stack:** Next.js 16 App Router, Better-Auth 1.6, TypeScript strict, React 19

---

## File Map

| Action | Fichier | Responsabilité |
|---|---|---|
| **Create** | `src/lib/logger.ts` | Logger structuré ISO timestamp + niveau |
| **Modify** | `src/lib/auth.ts` | Hooks serveur : log signup + sign-in attempt |
| **Modify** | `src/app/dashboard/page.tsx` | try/catch getSession + log accès |
| **Modify** | `src/components/dashboard/DashboardClient.tsx` | Error handling logout + log |
| **Modify** | `src/components/signup/SignupForm.tsx` | Fix `<a>` → `<Link>`, messages d'erreur normalisés |
| **Modify** | `src/app/page.tsx` | Supprimer blocs TODO commentés |

---

## Task 1 : Logger Utility

**Files:**
- Create: `src/lib/logger.ts`

- [ ] **Step 1 : Créer le logger**

```typescript
// src/lib/logger.ts
type Level = "INFO" | "WARN" | "ERROR";

function log(level: Level, action: string, detail: string, userId?: string): void {
  const ts = new Date().toISOString();
  const user = userId ? ` [user:${userId}]` : "";
  console.log(`[${ts}] [${level}] [${action}]${user} - ${detail}`);
}

export const logger = {
  info:  (action: string, detail: string, userId?: string) => log("INFO",  action, detail, userId),
  warn:  (action: string, detail: string, userId?: string) => log("WARN",  action, detail, userId),
  error: (action: string, detail: string, userId?: string) => log("ERROR", action, detail, userId),
};
```

- [ ] **Step 2 : Vérifier le typage**

```bash
npx tsc --noEmit
```
Attendu : aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add src/lib/logger.ts
git commit -m "feat: add structured server logger (ISO timestamp + level)"
```

---

## Task 2 : Hooks Better-Auth — Logging Serveur

**Files:**
- Modify: `src/lib/auth.ts`

Contexte : `auth.ts` utilise `databaseHooks` pour valider le mot de passe avant création. On y ajoute le logging car ces hooks s'exécutent **côté serveur**, ce qui apparaît dans le terminal `npm run dev`.

- [ ] **Step 1 : Mettre à jour `auth.ts`**

Remplacer le contenu complet par :

```typescript
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
          logger.info("SIGNUP_ATTEMPT", `Création de compte pour ${user.email}`);
        },
      },
      create: {
        after: async (user) => {
          logger.info("SIGNUP_SUCCESS", `Compte créé`, user.id);
        },
      },
    },
  },
});
```

**Note :** Better-Auth 1.x ne supporte qu'un seul hook `create` par modèle. Combiner `before` et `after` dans un seul objet :

```typescript
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

- [ ] **Step 2 : Vérifier le typage**

```bash
npx tsc --noEmit
```
Attendu : aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add src/lib/auth.ts
git commit -m "feat: log signup attempts and success via Better-Auth server hooks"
```

---

## Task 3 : Dashboard Server Component — Failsafe + Log

**Files:**
- Modify: `src/app/dashboard/page.tsx`

Contexte : `auth.api.getSession` appelle la base de données. Sans try/catch, une DB inaccessible produit un écran blanc Next.js 500. On ajoute un guard + log.

- [ ] **Step 1 : Mettre à jour `dashboard/page.tsx`**

```typescript
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  let session;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (err) {
    logger.error("SESSION_FETCH_FAILED", err instanceof Error ? err.message : String(err));
    redirect("/login");
  }

  if (!session) {
    logger.warn("SESSION_MISSING", "Accès dashboard sans session — redirection login");
    redirect("/login");
  }

  logger.info("DASHBOARD_ACCESS", "Accès dashboard autorisé", session.user.id);

  const playerName = session.user.name ?? session.user.email ?? "SCHOLAR";

  return (
    <div className="scanlines crt-flicker min-h-screen">
      <DashboardClient playerName={playerName} />
    </div>
  );
}
```

- [ ] **Step 2 : Vérifier le typage**

```bash
npx tsc --noEmit
```
Attendu : aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: guard dashboard session fetch with try/catch and server logging"
```

---

## Task 4 : DashboardClient — Logout Error Handling

**Files:**
- Modify: `src/components/dashboard/DashboardClient.tsx`

Contexte : `handleLogout` appelle `authClient.signOut()` sans error handling. Si le réseau coupe pendant la déconnexion, l'utilisateur reste bloqué silencieusement.

- [ ] **Step 1 : Modifier `handleLogout` dans `DashboardClient.tsx`**

Localiser la fonction `handleLogout` (actuellement lignes 522-525) et la remplacer :

```typescript
const handleLogout = async () => {
  try {
    await authClient.signOut();
    router.push("/login");
  } catch {
    // Déconnexion réseau échouée — on redirige quand même côté client
    router.push("/login");
  }
};
```

- [ ] **Step 2 : Vérifier le typage**

```bash
npx tsc --noEmit
```
Attendu : aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add src/components/dashboard/DashboardClient.tsx
git commit -m "fix: handle signOut network failure gracefully in DashboardClient"
```

---

## Task 5 : SignupForm — Fix Link + Normaliser les Erreurs

**Files:**
- Modify: `src/components/signup/SignupForm.tsx`

Deux problèmes :
1. `<a href="/login">` (ligne 184) — doit être `<Link>` pour la navigation SPA sans rechargement
2. Le message d'erreur générique `ctx.error.message` peut exposer des messages techniques Better-Auth

- [ ] **Step 1 : Ajouter l'import `Link` et normaliser l'erreur serveur**

Remplacer l'en-tête des imports :

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { UserIcon, LockIcon, HeroLogo } from "@/components/ui/PixelIcons";
```

- [ ] **Step 2 : Normaliser le message d'erreur `onError`**

Remplacer le callback `onError` :

```typescript
onError: (ctx) => {
  const code = ctx.error.status;
  if (code === 422 || ctx.error.message?.toLowerCase().includes("already exists")) {
    setServerError("Cet email est déjà utilisé. Connecte-toi ou choisis un autre email.");
  } else if (code === 400) {
    setServerError(ctx.error.message || "Données invalides. Vérifie les champs.");
  } else {
    setServerError("Erreur de connexion — réessaie dans quelques instants.");
  }
},
```

- [ ] **Step 3 : Remplacer `<a href="/login">` par `<Link href="/login">`**

Localiser (ligne ~184) :
```typescript
<a href="/login" className="text-[var(--elec-blue)] hover:text-white font-pixel text-[10px] ml-1">
  ▶ SE CONNECTER
</a>
```

Remplacer par :
```typescript
<Link href="/login" className="text-[var(--elec-blue)] hover:text-white font-pixel text-[10px] ml-1">
  ▶ SE CONNECTER
</Link>
```

- [ ] **Step 4 : Vérifier le typage**

```bash
npx tsc --noEmit
```
Attendu : aucune erreur.

- [ ] **Step 5 : Commit**

```bash
git add src/components/signup/SignupForm.tsx
git commit -m "fix: normalize signup error messages and replace <a> with Next Link"
```

---

## Task 6 : Nettoyage du Code Mort

**Files:**
- Modify: `src/app/page.tsx`

Contexte : `GuildModal` dans `page.tsx` contient un bloc de 5 lignes de commentaires TODO qui décrivent ce qu'il faut implémenter mais ne font rien. Ces blocs commentés sont du bruit pour un jury.

- [ ] **Step 1 : Supprimer le bloc de commentaires TODO dans `GuildModal`**

Localiser dans `page.tsx` le bloc suivant (environ lignes 58-65) :

```typescript
  // TODO: implémente la logique d'envoi ici (5-10 lignes)
  // Reçoit : org, email, message
  // Options : fetch vers une API route, mailto:, ou console.log pour le hackathon
  // Pense à : validation basique, feedback visuel après envoi, fermer la modale
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // ta logique ici
  }
```

Remplacer par une implémentation minimale propre (mailto fallback) :

```typescript
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!org || !email) return;
    const subject = encodeURIComponent(`[ACADEM'IA] Demande de démo — ${org}`);
    const body = encodeURIComponent(`Organisation: ${org}\nEmail: ${email}\n\n${message}`);
    window.open(`mailto:contact@academ-ia.tech?subject=${subject}&body=${body}`);
    onClose();
  }
```

- [ ] **Step 2 : Vérifier le typage**

```bash
npx tsc --noEmit
```
Attendu : aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add src/app/page.tsx
git commit -m "chore: replace TODO placeholder in GuildModal with mailto fallback"
```

---

## Vérification Finale

- [ ] **Lancer le build de production** pour s'assurer qu'aucune régression n'a été introduite :

```bash
npx next build 2>&1
```
Attendu : `✓ Compiled successfully` sans erreurs TypeScript ni warnings critiques.

- [ ] **Test manuel séquence inscription** :
  1. Aller sur `/signup`
  2. Soumettre avec email existant → message "Cet email est déjà utilisé." visible
  3. Soumettre avec données valides → redirection vers `/`
  4. Vérifier le terminal : ligne `[INFO] [SIGNUP_ATTEMPT]` et `[INFO] [SIGNUP_SUCCESS]`

- [ ] **Test manuel dashboard** :
  1. Aller sur `/dashboard` sans session → redirection `/login`
  2. Vérifier terminal : `[WARN] [SESSION_MISSING]`
  3. Se connecter → accéder `/dashboard` → terminal : `[INFO] [DASHBOARD_ACCESS]`

---

## Self-Review

**Spec coverage :**
- ✅ Logger structuré `[TIMESTAMP] [NIVEAU] [ACTION]` avec userId → Task 1
- ✅ Log signup succès/échecs → Task 2 (hooks serveur)
- ✅ Log accès dashboard + session manquante → Task 3
- ✅ Pas d'écran blanc sur erreur DB → Task 3 (try/catch + redirect)
- ✅ Messages d'erreur clairs côté client → Task 5
- ✅ Logout failsafe → Task 4
- ✅ Code mort nettoyé → Task 6

**Note sur le logging login :** `LoginForm` est un composant client (`"use client"`). Les logs y sont dans la console navigateur, pas le terminal serveur. Better-Auth gère les tentatives de connexion côté serveur via son propre handler (`toNextJsHandler`) — aucun hook exposé pour sign-in dans la v1.6.x sans plugin additionnel. Le logging serveur réel est donc dans les Tasks 2 et 3.
