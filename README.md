# ACADEM'IA — The AI Learning RPG

> **"Learn. Level Up. Repeat."**  
> Une plateforme d'apprentissage adaptative pilotée par l'IA, conçue en 48h pour le **Hackathon 2026**.

---

## La Vision
**Academ’IA** n'est pas un simple outil de quiz, c'est une aventure pédagogique. Notre moteur de jeu s'adapte en temps réel à l'apprenant pour garantir une progression constante sans frustration.

> **Notre promesse :** Une expérience personnalisée qui s’adapte au niveau, au rythme et à la motivation de l’utilisateur pour le maintenir dans sa **"Zone de Flow"**.

### Le Maître du Jeu (IA Engine)
Notre IA (Gemini 2.0 Flash) agit comme un véritable *Game Master* :
*   **Génération dynamique :** Création de questions sur mesure selon le contexte.
*   **Difficulté Adaptative :** Ajustement du challenge en live selon les performances.
*   **Analyse de données :** Détection des faiblesses et proposition de défis correctifs.

### Gamification & Engagement
*   **Progression RPG :** Gain d'XP et montée de niveaux.
*   **Système de Loot :** Déblocage de badges et de récompenses exclusives.
*   **Feedback Visuel :** Une interface valorisante pour transformer l'effort en plaisir.

---

## Stack Technique

| Secteur | Technologie |
| :--- | :--- |
| **Frontend** | Next.js 15/16 + TailwindCSS |
| **Backend** | Next.js API Routes + Better-Auth |
| **Base de données** | PostgreSQL (Prisma ORM) |
| **Infrastructure** | Docker + Railway |
| **IA** | Google Gemini API |
| **Tests** | Vitest + GitHub Actions |

---

## Conformité, Éthique & Juridique

> Academ'IA est conçu pour être prêt pour la production, pas seulement pour la démo.

### Pages Légales (production-ready)
*   **CGU / CGV** — Conditions générales rédigées pour un produit réel, incluant les droits et obligations de l'utilisateur.
*   **Politique de Confidentialité** — Conforme au cadre européen, rédigée en langage clair.
*   **Disclaimer IA** — Clause de non-responsabilité explicite pour les contenus générés par Gemini 2.0 (hallucinations, inexactitudes pédagogiques).

### RGPD & Gestion des Données
| Principe | Implémentation |
| :--- | :--- |
| **Droit à l'oubli** | Suppression en cascade (`onDelete: Cascade`) sur tous les modèles liés à l'utilisateur |
| **Minimisation** | Seules les données nécessaires sont collectées (email, pseudo, progression) |
| **Conservation limitée** | Historique de quiz et logs d'audit horodatés, politique de rétention définie |
| **Chiffrement** | Mots de passe hashés par Better-Auth (bcrypt), tokens HMAC pour l'anti-triche |

### Usage Éthique de l'IA
*   Gemini est utilisé **uniquement pour la génération de questions éducatives**, avec un système de fallback DB si l'API est indisponible.
*   Aucune donnée personnelle n'est transmise au modèle IA — seuls le thème et le niveau de difficulté sont envoyés.
*   Le disclaimer visible dans l'interface informe l'apprenant de la nature générée des questions.

---

## Architecture du Projet
Retrouvez nos schémas de conception détaillés dans le dossier `/architecture` :
*   [**Flux de données**](./architecture/architecture-flux-AcademIA.png) : Cycle de vie d'une requête.
*   [**Modèle de données (BDD)**](./architecture/bdd-schema-AcademIA.png) : Structure PostgreSQL/Prisma.
*   [**Cas d'utilisation**](./architecture/use-case-AcademIA.png) : Parcours utilisateur et GM.

---

## Installation en Local

1.  **Cloner le dépôt** :
    ```bash
    git clone [https://github.com/Hackaton-Academ-IA/Dev.git](https://github.com/Hackaton-Academ-IA/Dev.git)
    cd Dev
    ```

2.  **Configuration** :
    ```bash
    cp .env.example .env
    # Remplissez les clés GEMINI_API_KEY et DATABASE_URL
    ```

3.  **Installation & Lancement** :
    ```bash
    npm install
    docker-compose up -d  # Lance la BDD PostgreSQL
    npx prisma db push    # Synchronise le schéma
    npm run dev
    ```
    Accès : `http://localhost:3000`

---

## Coulisses Techniques (Jalons de Dev)

### 📍 Jalon 2 : Structure & Discipline
*   **Modularité :** Architecture Next.js 16 avec séparation stricte (API, Components, Lib).
*   **Documentation :** Intégration de **Scalar** pour une documentation API interactive.
*   **Workflow :** Discipline Git avec commits atomiques et déploiement continu.

### 📍 Jalon 3 : Robustesse & Résilience
*   **Failsafe :** Gestion d'erreurs globale (`try/catch`) et messages UX normalisés.
*   **Traçabilité :** Logger centralisé (`src/lib/logger.ts`) capturant les actions critiques (Auth, XP, Quiz).
*   **Qualité :** Automatisation des tests via **Vitest** et GitHub Actions.

### 📍 Jalon 4 : Sécurité, UX & Finitions
*   **Sécurité :** 
    *   *Rate Limiting* (Anti-spam API).
    *   *Validation HMAC* pour empêcher la triche sur les réponses en inspectant le réseau.
*   **Performance :** Correction des *cascading renders* pour un Dashboard fluide.
*   **Identité :** Intégration du Favicon, polissage des animations (Game Over Overlay) et design Pixel Art.
*   **Conformité :** Pages légales (CGU/RGPD) intégrées, prêtes pour la production.


#### SEO & Discoverability
*   **Metadata API Next.js** — Titres, descriptions et mots-clés dynamiques sur chaque page via `export const metadata`.
*   **`sitemap.ts`** — Sitemap XML généré automatiquement et servi à `/sitemap.xml` pour les crawlers.
*   **`robots.ts`** — Directive robots personnalisée (`/robots.txt`) pour contrôler l'indexation.
*   **OpenGraph & Twitter Cards** — Balises `og:title`, `og:description`, `og:image`, `twitter:card` configurées pour un aperçu riche lors du partage sur Discord, Twitter/X, LinkedIn.
*   **Favicon & Web Manifest** — Icônes multi-résolutions (`favicon.ico`, `apple-touch-icon`) pour un rendu natif sur mobile et onglets.



---

## Tests
Pour garantir la stabilité des fonctionnalités critiques :
```bash
npm run test
```

La suite couvre **37 tests** répartis sur 3 fichiers :

| Fichier | Portée |
| :--- | :--- |
| `engine.test.ts` | Formules XP, niveaux, adaptPalier, timer — 26 tests |
| `auth.test.ts` | Validation des schémas login/signup (Zod) — 8 tests |
| `route.test.ts` | Route API `/quiz/generate` (Gemini mock, fallback) — 3 tests |

---

## Contributeurs
Projet réalisé en équipe dans le cadre du **Hackathon Academ'IA 2026** en moins de 48h.

---

*© 2026 Academ'IA — All rights reserved.*