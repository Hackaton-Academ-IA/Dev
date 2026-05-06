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

---

## Tests
Pour garantir la stabilité des fonctionnalités critiques :
```bash
npm run test