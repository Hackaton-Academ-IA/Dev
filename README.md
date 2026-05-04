# Academ’IA - Hackathon 2026

## La Vision
**Academ’IA** est une plateforme d’apprentissage gamifiée pilotée par une IA adaptative. 
Notre promesse ? **Une expérience personnalisée en temps réel qui s’adapte au niveau, au rythme et à la motivation de l’utilisateur.**

### Le Moteur IA
Notre IA n'est pas qu'un simple chatbot, c'est le maître du jeu qui :
- Crée les questions sur mesure.
- Adapte la difficulté en live (maintien de la "Zone de Flow").
- Détecte les faiblesses de l'apprenant.
- Propose des défis personnalisés pour surmonter les blocages.

### La Gamification (L'Engagement)

Pour transformer l'apprentissage en aventure, nous intégrons :
- Un système de **Niveaux** (XP).
- Des **Récompenses** (Badges, déblocages).
- Une **Progression** visuelle et valorisante.

## Stack Technique
- **Frontend :** NextJS / TailwindCSS
- **Backend :** NextJS API / Better-Auth
- **Base de données :** PostgreSQL (via Docker)
- **Tests :** Vitest

## Architecture du projet
Retrouvez tous nos schémas de conception dans le dossier `/architecture` :
- **Flux de données :** [Voir le schéma](./architecture/architecture-flux-AcademIA.png)
- **Modèle de données (BDD) :** [Voir le schéma](./architecture/bdd-schema-AcademIA.png)
- **Cas d'utilisation :** [Voir le schéma](./architecture/use-case-AcademIA.png)

---

## Installation en local

Voici les étapes pour faire tourner le projet sur votre machine :

1. **Cloner le dépôt** :    
   git clone [https://github.com/Hackaton-Academ-IA/Dev.git](https://github.com/Hackaton-Academ-IA/Dev.git)


Configurer les variables d'environnement :
Copiez le fichier d'exemple pour créer votre fichier local, puis remplissez les variables manquantes (comme l'URL de la base de données ou la clé API Gemini).

    cp .env.example .env

Installer les dépendances :

    npm install

Lancer la base de données (PostgreSQL) :
Assurez-vous que Docker Desktop est bien démarré sur votre machine, puis exécutez :

    docker-compose up -d

Démarrer le serveur de développement :

npm run dev
Le projet sera alors accessible sur http://localhost:3000.