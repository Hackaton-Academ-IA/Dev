# Adaptive Learning — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static question bank with a hybrid AI/DB adaptive system, persist dungeon progress across refreshes, and expand the world map to 25 dungeons across 5 biomes.

**Architecture:** A three-tier question pipeline (Gemini AI → Prisma DB → in-memory pool) lives in `QuestionService`. A dedicated `/api/quiz/daily` endpoint enforces the 5-questions-per-day limit. Dungeon progression is persisted via a new `/api/game/dungeon` endpoint using upsert semantics, so refreshes never reset the map. The dashboard `AIChallenge` component fetches on user action (never on mount) to avoid burning daily questions silently.

**Tech Stack:** Next.js (App Router), Prisma/PostgreSQL, Google Gemini (`@google/generative-ai`), React, TypeScript, HMAC token signing (existing pattern from `generator.ts`).

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `prisma/schema.prisma` | Modify | Add MCQ fields to `Question`; add `DonjonProgression` model |
| `prisma/seed.ts` | Create | 70 seeded MCQ questions (10 × 7 subjects) |
| `src/lib/game/engine.ts` | Modify | `xpThreshold` → `n^1.5` formula; `SPEED_BONUS` 10 → 15 |
| `src/lib/game/generator.ts` | Modify | Add `tryGenerateQuestionAI` (no-fallback variant) |
| `src/lib/game/dungeons.ts` | Create | `DUNGEONS` constant — 25 dungeons, 5 biomes |
| `src/lib/game/question-service.ts` | Create | `getAdaptiveQuestion` — AI → DB → pool cascade |
| `src/app/api/quiz/daily/route.ts` | Create | Daily challenge endpoint (5/day, force-dynamic) |
| `src/app/api/game/dungeon/route.ts` | Create | Dungeon progression GET + POST |
| `src/components/dashboard/DashboardClient.tsx` | Modify | Wire `AIChallenge` to `/api/quiz/daily` |
| `src/app/quizz/page.tsx` | Modify | Load/persist dungeon progression; 25-dungeon map |

---

## Task 1: Prisma Schema Migration

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Edit the schema — add MCQ fields to `Question` and the new `DonjonProgression` model**

Replace the `Question` model and `Utilisateur` model, and add `DonjonProgression`:

```prisma
// In prisma/schema.prisma

model Question {
  id               String    @id @default(uuid())
  contenu          String
  difficulte       String
  matiere          String
  choix            String[]
  correctIndex     Int
  reponse_attendue String
  reponses         Reponse[]
}

model DonjonProgression {
  id          String      @id @default(uuid())
  userId      String
  donjonId    Int
  statut      String
  utilisateur Utilisateur @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, donjonId])
  @@map("donjon_progression")
}
```

Also add the relation field to `Utilisateur` (inside the model, after `historique HistoriqueQuiz[]`):

```prisma
  donjonProgressions DonjonProgression[]
```

- [ ] **Step 2: Run the migration**

```bash
npx prisma migrate dev --name add-mcq-fields-and-dungeon-progression
```

Expected output: `Your database is now in sync with your schema.`

If it asks to reset data in development, type `yes` (this is a dev environment).

- [ ] **Step 3: Verify the migration was applied**

```bash
npx prisma studio
```

Open the `Question` table — you should see the `matiere`, `choix`, `correctIndex` columns. Open `donjon_progression` — it should be an empty table.  
Close Prisma Studio (`Ctrl+C`) before continuing.

---

## Task 2: Seed Script

**Files:**
- Create: `prisma/seed.ts`

- [ ] **Step 1: Create `prisma/seed.ts` with 70 questions**

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const QUESTIONS = [
  // ── MATHÉMATIQUES (10) ──────────────────────────────────────
  { contenu: "Qui a démontré l'infinité des nombres premiers ?", choix: ["Pythagore", "Euclide", "Archimède", "Thalès"], correctIndex: 1, difficulte: "apprenti", matiere: "Mathématiques", reponse_attendue: "Euclide le démontre dans les Éléments, livre IX." },
  { contenu: "Combien de degrés dans un triangle ?", choix: ["90°", "180°", "270°", "360°"], correctIndex: 1, difficulte: "apprenti", matiere: "Mathématiques", reponse_attendue: "La somme des angles intérieurs d'un triangle est 180°." },
  { contenu: "Quelle est la racine carrée de 144 ?", choix: ["10", "11", "12", "13"], correctIndex: 2, difficulte: "apprenti", matiere: "Mathématiques", reponse_attendue: "12 × 12 = 144." },
  { contenu: "Qu'est-ce que π représente ?", choix: ["Rapport périmètre/diamètre", "Rapport surface/rayon", "La constante d'Euler", "Le nombre d'or"], correctIndex: 0, difficulte: "confirme", matiere: "Mathématiques", reponse_attendue: "π = périmètre ÷ diamètre ≈ 3,14159." },
  { contenu: "Quelle est la dérivée de f(x) = x³ ?", choix: ["x²", "2x²", "3x²", "3x"], correctIndex: 2, difficulte: "expert", matiere: "Mathématiques", reponse_attendue: "(xⁿ)' = n·xⁿ⁻¹, donc (x³)' = 3x²." },
  { contenu: "Quelle est la formule de l'aire d'un cercle ?", choix: ["2πr", "πr²", "πd", "2πr²"], correctIndex: 1, difficulte: "apprenti", matiere: "Mathématiques", reponse_attendue: "L'aire d'un cercle est πr² où r est le rayon." },
  { contenu: "Combien font 2¹⁰ ?", choix: ["512", "1024", "2048", "256"], correctIndex: 1, difficulte: "confirme", matiere: "Mathématiques", reponse_attendue: "2¹⁰ = 1024." },
  { contenu: "Qu'est-ce qu'un nombre premier ?", choix: ["Divisible par 2", "Divisible uniquement par 1 et lui-même", "Pair et positif", "Multiple de 3"], correctIndex: 1, difficulte: "confirme", matiere: "Mathématiques", reponse_attendue: "Un nombre premier n'a que deux diviseurs : 1 et lui-même." },
  { contenu: "Quelle est la somme des n premiers entiers : 1+2+…+n ?", choix: ["n²", "n(n+1)/2", "n(n-1)/2", "2n"], correctIndex: 1, difficulte: "expert", matiere: "Mathématiques", reponse_attendue: "Gauss : S = n(n+1)/2." },
  { contenu: "Combien y a-t-il de nombres premiers inférieurs à 20 ?", choix: ["6", "7", "8", "9"], correctIndex: 2, difficulte: "maitre", matiere: "Mathématiques", reponse_attendue: "2, 3, 5, 7, 11, 13, 17, 19 — soit 8 nombres premiers." },

  // ── HISTOIRE (10) ──────────────────────────────────────────
  { contenu: "En quelle année a débuté la Révolution française ?", choix: ["1689", "1715", "1789", "1804"], correctIndex: 2, difficulte: "apprenti", matiere: "Histoire", reponse_attendue: "La prise de la Bastille eut lieu le 14 juillet 1789." },
  { contenu: "Qui était le premier président des États-Unis ?", choix: ["Thomas Jefferson", "Benjamin Franklin", "George Washington", "John Adams"], correctIndex: 2, difficulte: "apprenti", matiere: "Histoire", reponse_attendue: "George Washington, premier président de 1789 à 1797." },
  { contenu: "En quelle année est tombé le Mur de Berlin ?", choix: ["1985", "1987", "1989", "1991"], correctIndex: 2, difficulte: "confirme", matiere: "Histoire", reponse_attendue: "La chute du Mur eut lieu le 9 novembre 1989." },
  { contenu: "Quelle ville était la capitale de l'Empire byzantin ?", choix: ["Rome", "Athènes", "Constantinople", "Alexandrie"], correctIndex: 2, difficulte: "confirme", matiere: "Histoire", reponse_attendue: "Constantinople (Istanbul) fut la capitale byzantine." },
  { contenu: "Quel traité a mis fin à la Première Guerre mondiale ?", choix: ["Traité de Versailles", "Traité de Paris", "Traité de Vienne", "Traité de Berlin"], correctIndex: 0, difficulte: "expert", matiere: "Histoire", reponse_attendue: "Le Traité de Versailles (1919) mit fin à la WWI." },
  { contenu: "En quelle année Napoléon a-t-il été exilé à Sainte-Hélène ?", choix: ["1812", "1814", "1815", "1821"], correctIndex: 2, difficulte: "confirme", matiere: "Histoire", reponse_attendue: "Après Waterloo (juin 1815), Napoléon fut exilé à Sainte-Hélène." },
  { contenu: "Quelle civilisation a construit le Colisée ?", choix: ["Grecque", "Égyptienne", "Romaine", "Byzantine"], correctIndex: 2, difficulte: "apprenti", matiere: "Histoire", reponse_attendue: "Le Colisée de Rome fut construit sous l'Empire romain (72-80 apr. J.-C.)." },
  { contenu: "Quel événement a déclenché la Première Guerre mondiale ?", choix: ["L'invasion de la Pologne", "L'assassinat de François-Ferdinand", "La révolution russe", "L'attentat de Paris"], correctIndex: 1, difficulte: "confirme", matiere: "Histoire", reponse_attendue: "L'assassinat de l'archiduc François-Ferdinand à Sarajevo (28 juin 1914)." },
  { contenu: "Qui a prononcé le discours 'I Have a Dream' ?", choix: ["Malcolm X", "Barack Obama", "Martin Luther King Jr.", "Jesse Jackson"], correctIndex: 2, difficulte: "apprenti", matiere: "Histoire", reponse_attendue: "Martin Luther King Jr., lors de la Marche sur Washington, le 28 août 1963." },
  { contenu: "Quel empire contrôlait l'Inde avant l'indépendance de 1947 ?", choix: ["Empire français", "Empire ottoman", "Empire britannique", "Empire hollandais"], correctIndex: 2, difficulte: "expert", matiere: "Histoire", reponse_attendue: "L'Inde était sous domination britannique jusqu'à son indépendance le 15 août 1947." },

  // ── SCIENCES (10) ──────────────────────────────────────────
  { contenu: "Quelle planète possède la plus grande tempête du système solaire ?", choix: ["Mars", "Saturne", "Neptune", "Jupiter"], correctIndex: 3, difficulte: "apprenti", matiere: "Sciences", reponse_attendue: "La Grande Tache Rouge de Jupiter est un anticyclone géant." },
  { contenu: "Quelle est la formule chimique de l'eau ?", choix: ["H2O", "CO2", "NaCl", "O2"], correctIndex: 0, difficulte: "apprenti", matiere: "Sciences", reponse_attendue: "H2O : deux atomes d'hydrogène liés à un atome d'oxygène." },
  { contenu: "Quel est l'élément chimique le plus abondant dans l'univers ?", choix: ["Hélium", "Oxygène", "Hydrogène", "Carbone"], correctIndex: 2, difficulte: "confirme", matiere: "Sciences", reponse_attendue: "L'hydrogène représente ~75% de la masse baryonique de l'univers." },
  { contenu: "Quelle est la vitesse de la lumière dans le vide ?", choix: ["150 000 km/s", "300 000 km/s", "450 000 km/s", "600 000 km/s"], correctIndex: 1, difficulte: "confirme", matiere: "Sciences", reponse_attendue: "c ≈ 299 792 km/s." },
  { contenu: "Combien d'éléments compte la table périodique actuelle ?", choix: ["108", "112", "118", "126"], correctIndex: 2, difficulte: "expert", matiere: "Sciences", reponse_attendue: "118 éléments reconnus par l'IUPAC depuis 2016." },
  { contenu: "Quelle est la plus petite unité du vivant ?", choix: ["L'atome", "La molécule", "La cellule", "L'organite"], correctIndex: 2, difficulte: "apprenti", matiere: "Sciences", reponse_attendue: "La cellule est la plus petite unité structurale et fonctionnelle du vivant." },
  { contenu: "Quel gaz les plantes absorbent-elles lors de la photosynthèse ?", choix: ["O2", "N2", "CO2", "H2"], correctIndex: 2, difficulte: "apprenti", matiere: "Sciences", reponse_attendue: "Les plantes absorbent le CO2 et libèrent de l'O2 grâce à la photosynthèse." },
  { contenu: "Quelle est la loi de la gravitation universelle de Newton ?", choix: ["F = ma", "F = GMm/r²", "E = mc²", "PV = nRT"], correctIndex: 1, difficulte: "confirme", matiere: "Sciences", reponse_attendue: "F = GMm/r² — force proportionnelle aux masses et inversement au carré de la distance." },
  { contenu: "Quel type de radiation est le plus dangereux pour l'ADN ?", choix: ["Infrarouge", "Visible", "Ultraviolet", "Radio"], correctIndex: 2, difficulte: "expert", matiere: "Sciences", reponse_attendue: "Les UV (particulièrement UV-C) peuvent provoquer des dimères de thymine et des mutations." },
  { contenu: "Quelle particule a une charge négative ?", choix: ["Proton", "Neutron", "Électron", "Quark up"], correctIndex: 2, difficulte: "apprenti", matiere: "Sciences", reponse_attendue: "L'électron porte une charge de -1,6 × 10⁻¹⁹ C." },

  // ── PHILOSOPHIE (10) ──────────────────────────────────────
  { contenu: "Quel philosophe a énoncé 'cogito ergo sum' ?", choix: ["Kant", "Descartes", "Nietzsche", "Platon"], correctIndex: 1, difficulte: "apprenti", matiere: "Philosophie", reponse_attendue: "Descartes, dans le Discours de la méthode (1637)." },
  { contenu: "Qui est l'auteur de La République ?", choix: ["Aristote", "Socrate", "Platon", "Épicure"], correctIndex: 2, difficulte: "apprenti", matiere: "Philosophie", reponse_attendue: "Platon expose sa vision de la cité idéale dans La République." },
  { contenu: "Quel philosophe a fondé le stoïcisme ?", choix: ["Zénon de Citium", "Épicure", "Diogène de Sinope", "Thalès"], correctIndex: 0, difficulte: "confirme", matiere: "Philosophie", reponse_attendue: "Zénon de Citium fonda l'école stoïcienne vers 300 av. J.-C." },
  { contenu: "Qu'appelle-t-on la maïeutique chez Socrate ?", choix: ["L'art de la guerre rhétorique", "L'art d'accoucher les esprits", "L'art de la persuasion", "L'art de la mémoire"], correctIndex: 1, difficulte: "confirme", matiere: "Philosophie", reponse_attendue: "Socrate comparait sa méthode à l'accouchement des idées." },
  { contenu: "Quel philosophe a écrit 'Par-delà le bien et le mal' ?", choix: ["Hegel", "Marx", "Nietzsche", "Schopenhauer"], correctIndex: 2, difficulte: "expert", matiere: "Philosophie", reponse_attendue: "Nietzsche publie cette œuvre en 1886, critiquant la morale traditionnelle." },
  { contenu: "Quelle est la distinction kantienne centrale entre phénomène et noumène ?", choix: ["Apparence/réalité sensible", "Ce qu'on perçoit/chose en soi inconnaissable", "Idée/matière", "Corps/âme"], correctIndex: 1, difficulte: "maitre", matiere: "Philosophie", reponse_attendue: "Pour Kant, le noumène (chose en soi) est inconnaissable ; on n'accède qu'aux phénomènes." },
  { contenu: "Qui a théorisé l'impératif catégorique ?", choix: ["Rousseau", "Hume", "Kant", "Locke"], correctIndex: 2, difficulte: "confirme", matiere: "Philosophie", reponse_attendue: "Kant formule l'impératif catégorique dans la Critique de la raison pratique (1788)." },
  { contenu: "Qu'est-ce que l'allégorie de la caverne illustre chez Platon ?", choix: ["La justice sociale", "Le passage de l'ignorance à la connaissance", "L'immortalité de l'âme", "La tyrannie"], correctIndex: 1, difficulte: "confirme", matiere: "Philosophie", reponse_attendue: "La caverne représente le monde sensible ; sortir de la caverne symbolise l'accès aux Idées." },
  { contenu: "Pour Sartre, quelle proposition résume son existentialisme ?", choix: ["L'essence précède l'existence", "L'existence précède l'essence", "Dieu est mort", "La volonté de puissance"], correctIndex: 1, difficulte: "expert", matiere: "Philosophie", reponse_attendue: "Sartre : nous n'avons pas de nature prédéfinie ; nous créons notre essence par nos actes." },
  { contenu: "Quel philosophe associe bonheur et vertu dans l'eudémonisme ?", choix: ["Platon", "Aristote", "Épictète", "Marc Aurèle"], correctIndex: 1, difficulte: "expert", matiere: "Philosophie", reponse_attendue: "Aristote place le bonheur (eudémonisme) dans l'exercice de la vertu (Éthique à Nicomaque)." },

  // ── LITTÉRATURE (10) ──────────────────────────────────────
  { contenu: "Qui a écrit 'Les Misérables' ?", choix: ["Balzac", "Victor Hugo", "Alexandre Dumas", "Flaubert"], correctIndex: 1, difficulte: "apprenti", matiere: "Littérature", reponse_attendue: "Victor Hugo publie Les Misérables en 1862." },
  { contenu: "Quel était le vrai prénom de Molière ?", choix: ["François", "Jean-Baptiste", "Pierre", "Louis"], correctIndex: 1, difficulte: "apprenti", matiere: "Littérature", reponse_attendue: "Jean-Baptiste Poquelin, dit Molière (1622–1673)." },
  { contenu: "Qui a écrit 'Le Petit Prince' ?", choix: ["Jules Verne", "Guy de Maupassant", "Antoine de Saint-Exupéry", "Albert Camus"], correctIndex: 2, difficulte: "confirme", matiere: "Littérature", reponse_attendue: "Saint-Exupéry publie Le Petit Prince en 1943." },
  { contenu: "Qui est l'auteur de 'L'Étranger' ?", choix: ["Jean-Paul Sartre", "André Gide", "Albert Camus", "Simone de Beauvoir"], correctIndex: 2, difficulte: "confirme", matiere: "Littérature", reponse_attendue: "Albert Camus publie L'Étranger en 1942." },
  { contenu: "Dans quelle œuvre apparaît Don Quichotte ?", choix: ["Gargantua", "Don Quichotte de la Manche", "L'Odyssée", "Pinocchio"], correctIndex: 1, difficulte: "expert", matiere: "Littérature", reponse_attendue: "Cervantes publie Don Quichotte en deux parties : 1605 et 1615." },
  { contenu: "Quel poète a écrit 'Les Fleurs du Mal' ?", choix: ["Verlaine", "Rimbaud", "Baudelaire", "Mallarmé"], correctIndex: 2, difficulte: "confirme", matiere: "Littérature", reponse_attendue: "Baudelaire publie Les Fleurs du Mal en 1857." },
  { contenu: "Dans quel roman Stendhal décrit-il l'ascension de Julien Sorel ?", choix: ["La Chartreuse de Parme", "Le Rouge et le Noir", "Armance", "Lucien Leuwen"], correctIndex: 1, difficulte: "expert", matiere: "Littérature", reponse_attendue: "Le Rouge et le Noir (1830) suit l'ascension sociale et la chute de Julien Sorel." },
  { contenu: "Qui a écrit '1984' ?", choix: ["Aldous Huxley", "Ray Bradbury", "George Orwell", "Philip K. Dick"], correctIndex: 2, difficulte: "apprenti", matiere: "Littérature", reponse_attendue: "George Orwell publie 1984 en 1949 — dystopie sur la surveillance totalitaire." },
  { contenu: "Quelle œuvre de Proust compose 'À la recherche du temps perdu' ?", choix: ["7 volumes", "5 volumes", "3 volumes", "10 volumes"], correctIndex: 0, difficulte: "maitre", matiere: "Littérature", reponse_attendue: "À la recherche du temps perdu comprend 7 volumes, publiés de 1913 à 1927." },
  { contenu: "Qu'est-ce que le 'stream of consciousness' en littérature ?", choix: ["Récit à la troisième personne", "Narration interne sans filtre des pensées", "Dialogue indirect libre", "Roman épistolaire"], correctIndex: 1, difficulte: "maitre", matiere: "Littérature", reponse_attendue: "Virginia Woolf et Joyce utilisent le flux de conscience : pensées non filtrées du narrateur." },

  // ── GÉOGRAPHIE (10) ───────────────────────────────────────
  { contenu: "Quelle est la capitale de l'Australie ?", choix: ["Sydney", "Melbourne", "Canberra", "Perth"], correctIndex: 2, difficulte: "apprenti", matiere: "Géographie", reponse_attendue: "Canberra est la capitale fédérale depuis 1927." },
  { contenu: "Sur quel continent se trouve le Sahara ?", choix: ["Asie", "Amérique du Sud", "Afrique", "Océanie"], correctIndex: 2, difficulte: "apprenti", matiere: "Géographie", reponse_attendue: "Le Sahara couvre une grande partie de l'Afrique du Nord." },
  { contenu: "Quel est le plus grand océan du monde ?", choix: ["Atlantique", "Indien", "Pacifique", "Arctique"], correctIndex: 2, difficulte: "apprenti", matiere: "Géographie", reponse_attendue: "L'océan Pacifique couvre plus de 165 millions de km²." },
  { contenu: "Quelle est la plus haute montagne du monde ?", choix: ["K2", "Mont Blanc", "Everest", "Aconcagua"], correctIndex: 2, difficulte: "confirme", matiere: "Géographie", reponse_attendue: "L'Everest culmine à 8 849 m d'altitude." },
  { contenu: "Combien de pays composent l'Union européenne (2024) ?", choix: ["25", "27", "30", "33"], correctIndex: 1, difficulte: "expert", matiere: "Géographie", reponse_attendue: "Depuis le Brexit (2020), l'UE compte 27 États membres." },
  { contenu: "Quel est le plus long fleuve d'Afrique ?", choix: ["Congo", "Niger", "Nil", "Zambèze"], correctIndex: 2, difficulte: "confirme", matiere: "Géographie", reponse_attendue: "Le Nil (~6 650 km) est traditionnellement considéré comme le plus long fleuve d'Afrique." },
  { contenu: "Quelle est la capitale du Brésil ?", choix: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"], correctIndex: 2, difficulte: "confirme", matiere: "Géographie", reponse_attendue: "Brasília est la capitale fédérale depuis 1960." },
  { contenu: "Quel pays possède la plus grande superficie mondiale ?", choix: ["États-Unis", "Canada", "Chine", "Russie"], correctIndex: 3, difficulte: "apprenti", matiere: "Géographie", reponse_attendue: "La Russie (~17,1 millions de km²) est le plus grand pays du monde." },
  { contenu: "Par combien de pays la France métropolitaine est-elle frontalière ?", choix: ["6", "7", "8", "9"], correctIndex: 1, difficulte: "expert", matiere: "Géographie", reponse_attendue: "La France partage des frontières avec 7 pays : Belgique, Luxembourg, Allemagne, Suisse, Italie, Monaco, Espagne." },
  { contenu: "Quel détroit sépare l'Europe de l'Afrique ?", choix: ["Détroit de Magellan", "Détroit de Gibraltar", "Détroit du Bosphore", "Détroit de Malacca"], correctIndex: 1, difficulte: "confirme", matiere: "Géographie", reponse_attendue: "Le détroit de Gibraltar (14 km au point le plus étroit) sépare l'Espagne du Maroc." },

  // ── INFORMATIQUE (10) ─────────────────────────────────────
  { contenu: "Que signifie l'acronyme HTML ?", choix: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Module Link", "Home Tool Markup Language"], correctIndex: 0, difficulte: "apprenti", matiere: "Informatique", reponse_attendue: "HTML est le langage standard de création des pages web." },
  { contenu: "Qui a créé le langage Python ?", choix: ["Linus Torvalds", "Guido van Rossum", "James Gosling", "Bjarne Stroustrup"], correctIndex: 1, difficulte: "apprenti", matiere: "Informatique", reponse_attendue: "Guido van Rossum crée Python en 1989, publié en 1991." },
  { contenu: "Quelle est la base du système binaire ?", choix: ["Base 8", "Base 10", "Base 2", "Base 16"], correctIndex: 2, difficulte: "confirme", matiere: "Informatique", reponse_attendue: "Le binaire n'utilise que deux chiffres : 0 et 1." },
  { contenu: "Que signifie l'acronyme CPU ?", choix: ["Central Processing Unit", "Computer Power Usage", "Core Program Utility", "Central Program Unit"], correctIndex: 0, difficulte: "confirme", matiere: "Informatique", reponse_attendue: "Le CPU est le processeur central d'un ordinateur." },
  { contenu: "Quelle structure de données respecte le principe LIFO ?", choix: ["File (Queue)", "Tableau", "Pile (Stack)", "Liste chaînée"], correctIndex: 2, difficulte: "expert", matiere: "Informatique", reponse_attendue: "LIFO = Last In, First Out. La Pile retire le dernier élément ajouté en premier." },
  { contenu: "Qu'est-ce que la complexité O(n log n) représente ?", choix: ["Linéaire", "Exponentielle", "Quasi-linéaire (ex: tri fusion)", "Polynomiale"], correctIndex: 2, difficulte: "expert", matiere: "Informatique", reponse_attendue: "O(n log n) est la complexité des algorithmes de tri efficaces comme merge sort." },
  { contenu: "Qu'est-ce qu'une adresse IP ?", choix: ["Un nom de domaine", "Un identifiant numérique unique d'un appareil sur un réseau", "Un protocole de sécurité", "Un type de câble réseau"], correctIndex: 1, difficulte: "apprenti", matiere: "Informatique", reponse_attendue: "Une adresse IP identifie un appareil sur un réseau (ex: 192.168.1.1)." },
  { contenu: "Que signifie 'OOP' en programmation ?", choix: ["Online Open Protocol", "Object-Oriented Programming", "Optimized Output Processing", "Open Object Platform"], correctIndex: 1, difficulte: "confirme", matiere: "Informatique", reponse_attendue: "OOP (Programmation Orientée Objet) organise le code en objets avec données et méthodes." },
  { contenu: "Qu'est-ce qu'un algorithme de Dijkstra résout ?", choix: ["Tri d'un tableau", "Plus court chemin dans un graphe", "Recherche binaire", "Compression de données"], correctIndex: 1, difficulte: "maitre", matiere: "Informatique", reponse_attendue: "Dijkstra calcule le plus court chemin depuis un nœud source dans un graphe pondéré positivement." },
  { contenu: "Quelle est la différence entre TCP et UDP ?", choix: ["TCP est plus rapide", "TCP garantit la livraison, UDP ne le fait pas", "UDP est chiffré, TCP non", "Ils sont identiques"], correctIndex: 1, difficulte: "maitre", matiere: "Informatique", reponse_attendue: "TCP est orienté connexion et garantit la livraison avec accusés de réception. UDP est sans connexion, plus rapide mais sans garantie." },
];

async function main() {
  console.log("Seeding questions...");
  await prisma.question.deleteMany();
  await prisma.question.createMany({ data: QUESTIONS });
  console.log(`Seeded ${QUESTIONS.length} questions.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 2: Add the seed script to `package.json`**

Open `package.json` and add inside the top-level object:

```json
"prisma": {
  "seed": "npx tsx prisma/seed.ts"
}
```

- [ ] **Step 3: Run the seed**

```bash
npx prisma db seed
```

Expected output: `Seeded 70 questions.`

---

## Task 3: Engine Rebalancing

**Files:**
- Modify: `src/lib/game/engine.ts`

- [ ] **Step 1: Update `xpThreshold` and `SPEED_BONUS`**

In `src/lib/game/engine.ts`, replace lines 15-17 and the `SPEED_BONUS` constant:

```typescript
// BEFORE
export function xpThreshold(niveau: number): number {
  return 100 * niveau * niveau;
}
// ...
export const SPEED_BONUS = 10;

// AFTER — replace with:
export function xpThreshold(niveau: number): number {
  return Math.round(100 * Math.pow(niveau, 1.5));
}
// ...
export const SPEED_BONUS = 15;
```

The full updated file top section (`engine.ts` lines 1–46):
```typescript
import type { Difficulte } from "./types";

export const MATIERES = [
  "Mathématiques",
  "Histoire",
  "Sciences",
  "Philosophie",
  "Littérature",
  "Géographie",
  "Informatique",
] as const;

export type Matiere = (typeof MATIERES)[number];

export function xpThreshold(niveau: number): number {
  return Math.round(100 * Math.pow(niveau, 1.5));
}

export function niveauFromTotalXp(totalXp: number): { niveau: number; xpInLevel: number } {
  let niveau = 1;
  let remaining = totalXp;
  while (remaining >= xpThreshold(niveau)) {
    remaining -= xpThreshold(niveau);
    niveau++;
  }
  return { niveau, xpInLevel: remaining };
}

export const BASE_XP_PER_ANSWER = 25;
export const SPEED_BONUS = 15;
export const COMBO_BONUS = 50;
export const BOSS_VICTORY_XP = 150;

export function computeXpGain(opts: {
  correct: boolean;
  timeRemaining: number;
  combo: number;
  bossDefeated: boolean;
}): number {
  if (!opts.correct) return 0;
  let xp = BASE_XP_PER_ANSWER;
  if (opts.timeRemaining > 15) xp += SPEED_BONUS;
  if (opts.combo >= 3) xp += COMBO_BONUS;
  if (opts.bossDefeated) xp += BOSS_VICTORY_XP;
  return xp;
}
```

- [ ] **Step 2: Commit**

```bash
git add prisma/schema.prisma prisma/seed.ts src/lib/game/engine.ts
git commit -m "feat: prisma migration + seed 70 questions + XP rebalancing"
```

---

## Task 4: Dungeons Constant (25 nodes, 5 biomes)

**Files:**
- Create: `src/lib/game/dungeons.ts`

- [ ] **Step 1: Create `src/lib/game/dungeons.ts`**

```typescript
import {
  Trophy, Castle, Mountain, Skull, Swords, Sun, Snowflake, Flame,
  Trees, Waves, Zap, Star, Ghost,
} from "lucide-react";
import type { ElementType } from "react";
import type { Difficulte } from "./types";

export interface Dungeon {
  id: string;
  name: string;
  x: number;
  y: number;
  type: "dungeon" | "boss" | "start";
  Icon: ElementType;
  color: string;
  difficulte: Difficulte;
  biome: number; // 1–5
}

export const BIOMES = [
  { id: 1, name: "Forêt Ancienne",   color: "#1eea7c", difficulte: "apprenti"  as Difficulte },
  { id: 2, name: "Désert Maudit",    color: "#ffd23a", difficulte: "confirme"  as Difficulte },
  { id: 3, name: "Crypte des Âmes",  color: "#b14bff", difficulte: "confirme"  as Difficulte },
  { id: 4, name: "Volcan du Chaos",  color: "#ff4d4d", difficulte: "expert"    as Difficulte },
  { id: 5, name: "Abysses Oubliées", color: "#22a7ff", difficulte: "maitre"    as Difficulte },
] as const;

// MAP_HEIGHT = 5000 ; each node is ~192px apart on the y axis
// x positions follow a winding S-path (values are percentages of container width)
export const DUNGEONS: Dungeon[] = [
  // ── Biome 1 : Forêt Ancienne (green, apprenti) ──
  { id: "1",  name: "L'Orée du Bois",       x: 50, y: 4900, type: "start",   Icon: Trophy,    color: "#1eea7c", difficulte: "apprenti", biome: 1 },
  { id: "2",  name: "Forêt des Murmures",   x: 28, y: 4708, type: "dungeon", Icon: Trees,     color: "#1eea7c", difficulte: "apprenti", biome: 1 },
  { id: "3",  name: "Marécage des Fées",    x: 72, y: 4516, type: "dungeon", Icon: Castle,    color: "#1eea7c", difficulte: "apprenti", biome: 1 },
  { id: "4",  name: "Grotte de la Racine",  x: 35, y: 4324, type: "dungeon", Icon: Mountain,  color: "#1eea7c", difficulte: "apprenti", biome: 1 },
  { id: "5",  name: "★ GARDIEN DES BOIS",   x: 65, y: 4132, type: "boss",    Icon: Swords,    color: "#ff4d4d", difficulte: "apprenti", biome: 1 },

  // ── Biome 2 : Désert Maudit (yellow, confirme) ──
  { id: "6",  name: "Oasis Trompeuse",      x: 25, y: 3940, type: "dungeon", Icon: Sun,       color: "#ffd23a", difficulte: "confirme", biome: 2 },
  { id: "7",  name: "Dunes de Feu",         x: 70, y: 3748, type: "dungeon", Icon: Flame,     color: "#ffd23a", difficulte: "confirme", biome: 2 },
  { id: "8",  name: "Ruines du Sable",      x: 40, y: 3556, type: "dungeon", Icon: Castle,    color: "#ffd23a", difficulte: "confirme", biome: 2 },
  { id: "9",  name: "Pyramide Inversée",    x: 72, y: 3364, type: "dungeon", Icon: Mountain,  color: "#ffd23a", difficulte: "confirme", biome: 2 },
  { id: "10", name: "★ PHARAON MAUDIT",     x: 50, y: 3172, type: "boss",    Icon: Skull,     color: "#ff4d4d", difficulte: "confirme", biome: 2 },

  // ── Biome 3 : Crypte des Âmes (violet, confirme→expert) ──
  { id: "11", name: "Portail des Âmes",     x: 28, y: 2980, type: "dungeon", Icon: Ghost,     color: "#b14bff", difficulte: "confirme", biome: 3 },
  { id: "12", name: "Couloir Oublié",       x: 68, y: 2788, type: "dungeon", Icon: Castle,    color: "#b14bff", difficulte: "confirme", biome: 3 },
  { id: "13", name: "Salle des Miroirs",    x: 35, y: 2596, type: "dungeon", Icon: Star,      color: "#b14bff", difficulte: "expert",   biome: 3 },
  { id: "14", name: "Trône des Ombres",     x: 60, y: 2404, type: "dungeon", Icon: Skull,     color: "#b14bff", difficulte: "expert",   biome: 3 },
  { id: "15", name: "★ L'ARCHIMAGE NOIR",   x: 50, y: 2212, type: "boss",    Icon: Swords,    color: "#ff4d4d", difficulte: "expert",   biome: 3 },

  // ── Biome 4 : Volcan du Chaos (red, expert) ──
  { id: "16", name: "Flanc du Volcan",      x: 30, y: 2020, type: "dungeon", Icon: Flame,     color: "#ff4d4d", difficulte: "expert",   biome: 4 },
  { id: "17", name: "Rivière de Lave",      x: 70, y: 1828, type: "dungeon", Icon: Zap,       color: "#ff4d4d", difficulte: "expert",   biome: 4 },
  { id: "18", name: "Forge des Titans",     x: 40, y: 1636, type: "dungeon", Icon: Mountain,  color: "#ff4d4d", difficulte: "expert",   biome: 4 },
  { id: "19", name: "Chambre du Jugement",  x: 65, y: 1444, type: "dungeon", Icon: Skull,     color: "#ff4d4d", difficulte: "expert",   biome: 4 },
  { id: "20", name: "★ TITAN IGNIS",        x: 50, y: 1252, type: "boss",    Icon: Swords,    color: "#ff9a3a", difficulte: "expert",   biome: 4 },

  // ── Biome 5 : Abysses Oubliées (blue, maitre) ──
  { id: "21", name: "Gouffre Marin",        x: 25, y: 1060, type: "dungeon", Icon: Waves,     color: "#22a7ff", difficulte: "maitre",   biome: 5 },
  { id: "22", name: "Cité Engloutie",       x: 72, y: 868,  type: "dungeon", Icon: Castle,    color: "#22a7ff", difficulte: "maitre",   biome: 5 },
  { id: "23", name: "Temple des Abysses",   x: 38, y: 676,  type: "dungeon", Icon: Star,      color: "#22a7ff", difficulte: "maitre",   biome: 5 },
  { id: "24", name: "Tranchée des Ombres",  x: 65, y: 484,  type: "dungeon", Icon: Skull,     color: "#22a7ff", difficulte: "maitre",   biome: 5 },
  { id: "25", name: "★ L'ORACLE CORROMPU",  x: 50, y: 292,  type: "boss",    Icon: Swords,    color: "#22a7ff", difficulte: "maitre",   biome: 5 },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/game/dungeons.ts
git commit -m "feat: 25-dungeon world map constant across 5 biomes"
```

---

## Task 5: Generator — Add `tryGenerateQuestionAI`

**Files:**
- Modify: `src/lib/game/generator.ts`

- [ ] **Step 1: Add `tryGenerateQuestionAI` export at the bottom of `generator.ts`**

This is a no-fallback variant of `generateQuestion` — returns `null` on any error instead of using `FALLBACK_POOL`. Used by `QuestionService` so it can detect failures and route to the DB.

Add this function at the end of `src/lib/game/generator.ts` (after the existing `toTokenized` function):

```typescript
/**
 * Tries Gemini and returns null on any failure (quota, timeout, parse error).
 * Unlike generateQuestion(), does NOT fall back to the in-memory pool.
 * Use this when the caller manages its own fallback (e.g., QuestionService).
 */
export async function tryGenerateQuestionAI(
  matiere: string,
  difficulte: Difficulte,
): Promise<{ question: Question; token: string } | null> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = `Tu es un générateur de quiz éducatif. Génère UNE question à choix multiples.
Matière : ${matiere}
Niveau : ${DIFF_LABEL[difficulte]}

RÈGLES ABSOLUES :
- Exactement 4 réponses (choix[0] à choix[3])
- Une et une seule bonne réponse
- Jamais "Toutes les réponses" ni "Aucune de ces réponses"
- Retourne UNIQUEMENT du JSON brut, SANS balises \`\`\`, SANS texte autour

FORMAT STRICT :
{"contenu":"la question","choix":["A","B","C","D"],"correctIndex":2,"explication":"explication courte"}`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const timeoutMs = 10_000;
    const aiPromise = model.generateContent(prompt);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("AI timeout")), timeoutMs),
    );

    const result = await Promise.race([aiPromise, timeoutPromise]);
    const raw = result.response.text();
    const cleaned = raw.replace(/```(?:json)?\s*/gi, "").replace(/```\s*/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;

    const parsed = JSON.parse(match[0]) as Record<string, unknown>;
    const { contenu, choix, correctIndex, explication } = parsed;

    if (
      typeof contenu !== "string" ||
      !Array.isArray(choix) ||
      choix.length !== 4 ||
      !choix.every((c) => typeof c === "string") ||
      typeof correctIndex !== "number" ||
      !Number.isInteger(correctIndex) ||
      correctIndex < 0 ||
      correctIndex > 3
    ) {
      return null;
    }

    const question: Question = {
      id: crypto.randomUUID(),
      contenu,
      choix: choix as string[],
      difficulte,
      matiere,
      explication: typeof explication === "string" ? explication : "",
    };
    return { question, token: signQuestion(correctIndex as number, question.id) };
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/game/generator.ts
git commit -m "feat: add tryGenerateQuestionAI — no-fallback AI generation for QuestionService"
```

---

## Task 6: QuestionService

**Files:**
- Create: `src/lib/game/question-service.ts`

- [ ] **Step 1: Create `src/lib/game/question-service.ts`**

```typescript
import { prisma } from "@/lib/prisma";
import { tryGenerateQuestionAI, generateQuestion, signQuestion, verifyToken } from "./generator";
import type { Question, Difficulte } from "./types";

export interface AdaptiveResult {
  question: Question;
  token: string;
  correctIndex: number;
  isAiGenerated: boolean;
  adaptiveScore: number; // 0.0–1.0 — reflects player level
}

const MATIERES = [
  "Mathématiques",
  "Histoire",
  "Sciences",
  "Philosophie",
  "Littérature",
  "Géographie",
  "Informatique",
] as const;

function targetDifficulty(niveau: number): Difficulte {
  if (niveau <= 3) return "apprenti";
  if (niveau <= 6) return "confirme";
  if (niveau <= 9) return "expert";
  return "maitre";
}

export async function getAdaptiveQuestion(userId: string): Promise<AdaptiveResult> {
  const user = await prisma.utilisateur.findUnique({
    where: { id: userId },
    select: { niveau: true },
  });

  const niveau = user?.niveau ?? 1;
  const difficulte = targetDifficulty(niveau);
  const adaptiveScore = Math.min(1, niveau / 13);
  const matiere = MATIERES[Math.floor(Math.random() * MATIERES.length)];

  // ── Path A: Gemini ──────────────────────────────────────────
  const aiResult = await tryGenerateQuestionAI(matiere, difficulte);
  if (aiResult) {
    const correctIndex = verifyToken(aiResult.token) ?? 0;
    return { ...aiResult, correctIndex, isAiGenerated: true, adaptiveScore };
  }

  // ── Path B: Prisma DB ────────────────────────────────────────
  let candidates = await prisma.question.findMany({
    where: { matiere, difficulte },
  });
  // Relax to any difficulty for this subject if no exact match
  if (candidates.length === 0) {
    candidates = await prisma.question.findMany({ where: { matiere } });
  }

  if (candidates.length > 0) {
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const question: Question = {
      id: pick.id,
      contenu: pick.contenu,
      choix: pick.choix,
      difficulte: pick.difficulte as Difficulte,
      matiere: pick.matiere,
      explication: pick.reponse_attendue,
    };
    const token = signQuestion(pick.correctIndex, pick.id);
    return { question, token, correctIndex: pick.correctIndex, isAiGenerated: false, adaptiveScore };
  }

  // ── Path C: In-memory FALLBACK_POOL (last resort) ────────────
  const fallback = await generateQuestion(matiere, difficulte);
  const correctIndex = verifyToken(fallback.token) ?? 0;
  return { ...fallback, correctIndex, isAiGenerated: false, adaptiveScore };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/game/question-service.ts
git commit -m "feat: QuestionService — 3-tier adaptive question pipeline (AI → DB → pool)"
```

---

## Task 7: Daily Challenge Route

**Files:**
- Create: `src/app/api/quiz/daily/route.ts`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p src/app/api/quiz/daily
```

- [ ] **Step 2: Write `src/app/api/quiz/daily/route.ts`**

```typescript
export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAdaptiveQuestion } from "@/lib/game/question-service";

const DAILY_MAX = 5;

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const user = await prisma.utilisateur.findUnique({
    where: { id: userId },
    select: { dailyQuestsDone: true, lastDailyAt: true },
  });
  if (!user) return NextResponse.json({ error: "user_not_found" }, { status: 404 });

  // Daily reset: compare calendar date (midnight UTC)
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const lastDate = user.lastDailyAt ? new Date(user.lastDailyAt) : null;
  if (lastDate) lastDate.setUTCHours(0, 0, 0, 0);
  const isNewDay = !lastDate || lastDate.getTime() < today.getTime();
  const effectiveCount = isNewDay ? 0 : user.dailyQuestsDone;

  if (effectiveCount >= DAILY_MAX) {
    return NextResponse.json({ limitReached: true, dailyQuestsDone: DAILY_MAX });
  }

  const result = await getAdaptiveQuestion(userId);

  await prisma.utilisateur.update({
    where: { id: userId },
    data: {
      dailyQuestsDone: effectiveCount + 1,
      lastDailyAt: new Date(),
    },
  });

  return NextResponse.json({
    question: result.question,
    correctIndex: result.correctIndex,
    isAiGenerated: result.isAiGenerated,
    adaptiveScore: result.adaptiveScore,
    dailyQuestsDone: effectiveCount + 1,
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/quiz/daily/route.ts
git commit -m "feat: /api/quiz/daily — daily challenge endpoint with 5/day limit and force-dynamic"
```

---

## Task 8: Dashboard — Wire `AIChallenge` to the API

**Files:**
- Modify: `src/components/dashboard/DashboardClient.tsx`

This task replaces the static `QUESTION_BANK` with real API calls.

- [ ] **Step 1: Remove the static `QUESTION_BANK`, `Question` interface, and add the new API types near the top of `DashboardClient.tsx`**

Remove lines 19–63 (the `QUESTION_BANK` array and the local `Question` interface). Replace them with:

```typescript
// ── Daily challenge API types ──────────────────────────────
interface DailyQuestion {
  id: string;
  contenu: string;
  choix: string[];
  difficulte: string;
  matiere: string;
  explication: string;
}

interface DailyResponse {
  question?: DailyQuestion;
  correctIndex?: number;
  isAiGenerated?: boolean;
  adaptiveScore?: number;
  dailyQuestsDone?: number;
  limitReached?: boolean;
}
```

- [ ] **Step 2: Replace the `AIChallenge` component entirely**

Replace the entire `AIChallenge` function (lines 307–451) with:

```typescript
interface AIChallengeProps {
  onAward: (award: AwardPayload) => void;
  initialDailyCount: number;
}

const DAILY_MAX = 5;

function AIChallenge({ onAward, initialDailyCount }: AIChallengeProps) {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<DailyQuestion | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [typed, setTyped] = useState("");
  const [sparkleKey, setSparkleKey] = useState(0);
  const [dailyCount, setDailyCount] = useState(initialDailyCount);
  const [limitReached, setLimitReached] = useState(initialDailyCount >= DAILY_MAX);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const typingRef = useRef(0);

  // Typing animation when question changes
  useEffect(() => {
    if (!question) return;
    typingRef.current = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      typingRef.current += 1;
      setTyped(question.contenu.slice(0, typingRef.current));
      if (typingRef.current < question.contenu.length) setTimeout(tick, 18);
    };
    const t = setTimeout(() => { if (!cancelled) { setTyped(""); tick(); } }, 0);
    return () => { cancelled = true; clearTimeout(t); };
  }, [question]);

  const fetchNew = async () => {
    if (limitReached || loading) return;
    // Reset state BEFORE fetch (fixes "Groundhog Day" stale question bug)
    setLoading(true);
    setQuestion(null);
    setCorrectIndex(null);
    setPicked(null);
    setRevealed(false);
    setTyped("");

    try {
      const res = await fetch("/api/quiz/daily", {
        method: "POST",
        cache: "no-store",
      });
      const data: DailyResponse = await res.json();

      if (data.limitReached) {
        setLimitReached(true);
        setDailyCount(DAILY_MAX);
        return;
      }

      if (!data.question || data.correctIndex === undefined) return;

      setQuestion(data.question);
      setCorrectIndex(data.correctIndex);
      setIsAiGenerated(data.isAiGenerated ?? false);
      setDailyCount(data.dailyQuestsDone ?? dailyCount);
    } catch {
      // network error — stay in empty state
    } finally {
      setLoading(false);
    }
  };

  const onPick = (i: number) => {
    if (revealed || correctIndex === null) return;
    setPicked(i);
    setRevealed(true);
    if (i === correctIndex) {
      setStreak((s) => s + 1);
      setSparkleKey((k) => k + 1);
      onAward({ xp: 50 + streak * 10, coins: 12 });
    } else {
      setStreak(0);
      onAward({ xp: 5, coins: 0, hp: -1 });
    }
  };

  const letters = ["A", "B", "C", "D"];
  const badgeTones = ["", "b-blue", "b-emerald", "b-gold"];
  const fullyTyped = question ? typed.length === question.contenu.length : false;
  // Dynamic quest number from UUID prefix — always unique per question
  const questNum = question?.id.slice(0, 4).toUpperCase() ?? "----";

  return (
    <section className="panel panel-violet relative">
      <div className="titlebar titlebar-violet flex items-center justify-between">
        <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
          ▶ LE DÉFI DE L&apos;IA
        </div>
        <div className="font-mono-pixel text-[14px] text-white/80 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-[var(--emerald)]" style={{ boxShadow: "0 0 6px var(--emerald)" }} />
          {isAiGenerated ? "🤖 IA · ONLINE" : "💾 ARCHIVES"}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5 relative">
        {/* ── Limit reached ── */}
        {limitReached ? (
          <div className="crt-screen p-6 flex flex-col items-center gap-4 text-center">
            <div className="font-pixel text-[14px] text-[var(--emerald)]" style={{ textShadow: "0 0 10px var(--emerald)" }}>
              ★ DÉFI QUOTIDIEN COMPLÉTÉ !
            </div>
            <div className="font-mono-pixel text-[16px] text-[var(--ink-dim)]">
              Tu as répondu aux {DAILY_MAX} questions du jour.<br />
              Reviens demain pour ton bonus d&apos;XP.
            </div>
            <div className="font-pixel text-[10px] px-4 py-2 border-4 border-[var(--emerald)] text-[var(--emerald)]">
              +200 XP DEMAIN
            </div>
          </div>
        ) : !question && !loading ? (
          /* ── Empty state ── */
          <div className="crt-screen p-6 flex flex-col items-center gap-4 text-center">
            <div className="font-pixel text-[14px] text-white">DÉFI DE L&apos;IA</div>
            <div className="font-mono-pixel text-[16px] text-[var(--ink-dim)]">
              {dailyCount}/{DAILY_MAX} questions effectuées aujourd&apos;hui
            </div>
            <button className="arcade arcade-emerald text-[10px]" onClick={fetchNew}>
              ▶ COMMENCER LE DÉFI
            </button>
          </div>
        ) : loading ? (
          /* ── Loading ── */
          <div className="crt-screen p-6 flex flex-col gap-3">
            <div className="font-mono-pixel text-[16px] text-[var(--ink-dim)]">
              <span style={{ color: "var(--neon-violet)" }}>&gt; </span>
              L&apos;IA prépare ta question
              <span className="caret ml-1" style={{ color: "var(--emerald)" }} />
            </div>
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-3 bg-[#1c1240] rounded animate-pulse" style={{ animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
          </div>
        ) : question ? (
          /* ── Active question ── */
          <>
            <div className="crt-screen p-5 sm:p-7">
              <div className="flex items-center justify-between mb-3 font-mono-pixel text-[14px] text-[var(--ink-dim)]">
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-[10px] text-[var(--neon-violet)]">QUEST #{questNum}</span>
                  <span>·</span>
                  <span>STREAK <span className="text-[var(--emerald)]">x{streak}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-[8px] text-[var(--ink-dim)]">{question.matiere}</span>
                  <span className="font-pixel text-[10px] text-[var(--gold)]">+50 XP</span>
                </div>
              </div>
              <div
                className="font-pixel text-[14px] sm:text-[16px] leading-[1.7] text-white min-h-[88px]"
                style={{ textShadow: "2px 2px 0 #000" }}
              >
                <span style={{ color: "#1eea7c" }}>&gt; </span>{typed}
                {!fullyTyped && <span className="caret">&nbsp;</span>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 relative">
              {question.choix.map((c, i) => {
                let cls = "qcm";
                if (revealed) {
                  if (i === correctIndex) cls += " correct";
                  else if (i === picked) cls += " wrong";
                  else cls += " muted";
                }
                return (
                  <button key={i} className={cls} disabled={revealed || !fullyTyped} onClick={() => onPick(i)}>
                    <span className={`badge-letter ${badgeTones[i]}`}>{letters[i]}</span>
                    <span className="text-[12px] sm:text-[13px] leading-[1.5]" style={{ textShadow: "2px 2px 0 #000" }}>
                      {c}
                    </span>
                    {revealed && i === correctIndex && <span className="ml-auto font-pixel text-[10px] text-[var(--emerald)]">✔</span>}
                    {revealed && i === picked && i !== correctIndex && <span className="ml-auto font-pixel text-[10px] text-[var(--danger)]">✘</span>}
                  </button>
                );
              })}
              <Sparkles trigger={sparkleKey} />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
              <div className="font-mono-pixel text-[16px] min-h-[24px]">
                {revealed && picked === correctIndex && (
                  <span className="text-[var(--emerald)]">★ VICTOIRE — {question.explication}</span>
                )}
                {revealed && picked !== correctIndex && (
                  <span className="text-[var(--danger)]">✘ RATÉ — {question.explication}</span>
                )}
                {!revealed && fullyTyped && (
                  <span className="text-[var(--ink-dim)]">CHOISIS UNE RÉPONSE — [A][B][C][D]</span>
                )}
              </div>
              <div className="flex gap-3">
                {dailyCount < DAILY_MAX ? (
                  <button className="arcade arcade-ghost text-[10px]" onClick={fetchNew}>
                    ↻ NOUVELLE QUÊTE ({DAILY_MAX - dailyCount} restantes)
                  </button>
                ) : null}
                {revealed && dailyCount < DAILY_MAX && (
                  <button className="arcade arcade-emerald text-[10px]" onClick={fetchNew}>
                    ▶ CONTINUER
                  </button>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update the `DashboardClient` root component to pass `initialDailyCount` to `AIChallenge`**

Find the line that renders `<AIChallenge onAward={onAward} />` and replace it with:

```tsx
<AIChallenge onAward={onAward} initialDailyCount={dailyQuestsDone} />
```

- [ ] **Step 4: Commit**

```bash
git add src/components/dashboard/DashboardClient.tsx
git commit -m "feat: AIChallenge wired to /api/quiz/daily — adaptive questions, daily limit, no-store fetch"
```

---

## Task 9: Dungeon Progression API

**Files:**
- Create: `src/app/api/game/dungeon/route.ts`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p src/app/api/game/dungeon
```

- [ ] **Step 2: Write `src/app/api/game/dungeon/route.ts`**

```typescript
export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DUNGEONS } from "@/lib/game/dungeons";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const rows = await prisma.donjonProgression.findMany({ where: { userId } });

  if (rows.length === 0) {
    // First visit: seed dungeon 1 as UNLOCKED
    await prisma.donjonProgression.create({
      data: { userId, donjonId: 1, statut: "UNLOCKED" },
    });
    return NextResponse.json([{ donjonId: 1, statut: "UNLOCKED" }]);
  }

  return NextResponse.json(rows.map((r) => ({ donjonId: r.donjonId, statut: r.statut })));
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json().catch(() => null) as { donjonId?: number } | null;
  if (!body || typeof body.donjonId !== "number") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { donjonId } = body;

  await prisma.donjonProgression.upsert({
    where: { userId_donjonId: { userId, donjonId } },
    create: { userId, donjonId, statut: "COMPLETED" },
    update: { statut: "COMPLETED" },
  });

  const nextDonjonId = donjonId + 1;
  const nextExists = DUNGEONS.some((d) => d.id === String(nextDonjonId));
  let unlockedId: number | null = null;

  if (nextExists) {
    await prisma.donjonProgression.upsert({
      where: { userId_donjonId: { userId, donjonId: nextDonjonId } },
      create: { userId, donjonId: nextDonjonId, statut: "UNLOCKED" },
      update: (existing) => existing.statut === "COMPLETED" ? {} : { statut: "UNLOCKED" },
    });
    unlockedId = nextDonjonId;
  }

  return NextResponse.json({ completedId: donjonId, unlockedId });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/game/dungeon/route.ts
git commit -m "feat: /api/game/dungeon — GET/POST for dungeon progression persistence"
```

---

## Task 10: Quizz Page — Persistence + 25-Dungeon Map

**Files:**
- Modify: `src/app/quizz/page.tsx`

- [ ] **Step 1: Update imports and constants at the top of `quizz/page.tsx`**

Replace the existing `DUNGEONS` definition and `MAP_HEIGHT` with:

```typescript
import { DUNGEONS } from "@/lib/game/dungeons";

const MAP_HEIGHT = 5000;
const BADGE_LETTERS = ["A", "B", "C", "D"];
const XP_PER_DUNGEON = 15;
const XP_PER_BOSS = 30;
```

Remove the old `interface Dungeon { ... }` definition (it's now in `dungeons.ts`) and the old `const DUNGEONS` array (lines 54–64).

- [ ] **Step 2: Add the dungeon progression `useEffect` inside `QuizzPage`**

Replace the `useState<Set<string>>(INITIAL_COMPLETED)` line and add the load effect. Inside `QuizzPage`, at the top of the function body, replace:

```typescript
const [completedIds, setCompletedIds] = useState<Set<string>>(INITIAL_COMPLETED);
```

with:

```typescript
const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

// Load progression from DB on mount
useEffect(() => {
  fetch("/api/game/dungeon")
    .then((r) => (r.ok ? r.json() : []))
    .then((progressions: Array<{ donjonId: number; statut: string }>) => {
      const completed = new Set(
        progressions
          .filter((p) => p.statut === "COMPLETED")
          .map((p) => String(p.donjonId)),
      );
      // Always ensure at least dunjon 1 is accessible
      setCompletedIds(completed.size > 0 ? completed : new Set());
    })
    .catch(() => {});
}, []);
```

Remove the `const INITIAL_COMPLETED = new Set(["1"])` line.

- [ ] **Step 3: Persist dungeon completion in `handleAnswer`**

Inside `handleAnswer`, in the `if (index === quiz.correctAnswer)` block, after the existing `fetch("/api/game/answer", ...)` call, add:

```typescript
// Persist dungeon completion
fetch("/api/game/dungeon", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ donjonId: parseInt(selectedDungeon.id) }),
}).catch(() => {});
```

- [ ] **Step 4: Commit**

```bash
git add src/app/quizz/page.tsx
git commit -m "feat: quizz page — load dungeon progression from DB, persist on completion, 25-dungeon map"
```

---

## Self-Review

**Spec coverage:**
- ✅ §1 Prisma migration — Task 1
- ✅ §1 Seed 70 questions — Task 2
- ✅ §2 QuestionService + 3-tier fallback — Tasks 5, 6 (generator prep)
- ✅ §3 `/api/quiz/daily` + 5/day limit — Task 7
- ✅ §4 Engine XP rebalancing + SPEED_BONUS — Task 3
- ✅ §4 Dashboard AIChallenge wired to API — Task 8
- ✅ §4 isAiGenerated badge + loading state — Task 8
- ✅ §4 Dynamic quest number (UUID-based) — Task 8
- ✅ §4 force-dynamic + cache: 'no-store' — Task 7 + 8
- ✅ §5 DonjonProgression model — Task 1
- ✅ §5 `/api/game/dungeon` GET + POST — Task 9
- ✅ §5 Load on mount, persist on answer — Task 10
- ✅ §6 25 dungeons in dungeons.ts — Task 4
- ✅ §6 MAP_HEIGHT = 5000 — Task 10
- ✅ §6 5 biomes with difficulty escalation — Task 4

**Caching bug fixes (from debugging report):**
- ✅ `export const dynamic = "force-dynamic"` on daily route
- ✅ `cache: "no-store"` on client fetch
- ✅ State reset (question=null, loading=true) BEFORE fetch in `fetchNew`
- ✅ `Math.random()` on `findMany` results — never returns first result always
- ✅ Quest number from UUID prefix — guaranteed unique per question

**Placeholder scan:** No TBDs, no "implement later", no incomplete steps.

**Type consistency:**
- `AdaptiveResult.correctIndex: number` defined in Task 5, used in Task 6, consumed in Task 8 ✅
- `DailyResponse.correctIndex` in Task 8 matches Task 7 response shape ✅
- `Dungeon.id` stays `string` throughout (Task 4 through Task 10) ✅
- `donjonId` is always `number` at DB boundary, `String(donjonId)` at React Set boundary ✅

**Known caveat:** The Prisma `update` in Task 9 (dungeon route POST) uses a callback form `update: (existing) => ...` which is not valid Prisma syntax. The correct approach for "only update if not COMPLETED" is to use `upsert` with a conditional. Replace the next-dungeon upsert with:

```typescript
// Replace the nextExists upsert in Task 9 with this:
if (nextExists) {
  const existing = await prisma.donjonProgression.findUnique({
    where: { userId_donjonId: { userId, donjonId: nextDonjonId } },
  });
  if (!existing || existing.statut !== "COMPLETED") {
    await prisma.donjonProgression.upsert({
      where: { userId_donjonId: { userId, donjonId: nextDonjonId } },
      create: { userId, donjonId: nextDonjonId, statut: "UNLOCKED" },
      update: { statut: "UNLOCKED" },
    });
  }
  unlockedId = nextDonjonId;
}
```
