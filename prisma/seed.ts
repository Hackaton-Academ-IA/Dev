/**
 * Seed: 70 questions, Badges et Utilisateur Admin
 * Usage: npx tsx prisma/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL manquante dans le fichier .env");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as never);

type Difficulty = "Facile" | "Moyen" | "Difficile";

interface QuestionSeed {
  contenu: string;
  choix: string[];
  reponse_attendue: string;
  explication: string;
  difficulte: Difficulty;
  matiere: string;
}

const QUESTIONS: QuestionSeed[] = [
  // ── Mathématiques (10) ──────────────────────────────────────
  { matiere: "Mathématiques", difficulte: "Facile",    contenu: "Combien de côtés a un hexagone ?",                                   choix: ["4","5","6","8"],                                                                       reponse_attendue: "6",           explication: "Un hexagone possède 6 côtés égaux." },
  { matiere: "Mathématiques", difficulte: "Facile",    contenu: "Quelle est la valeur de 7 × 8 ?",                                    choix: ["48","54","56","64"],                                                                    reponse_attendue: "56",          explication: "7 × 8 = 56." },
  { matiere: "Mathématiques", difficulte: "Facile",    contenu: "Quel est le résultat de 15² ?",                                      choix: ["175","200","225","250"],                                                                reponse_attendue: "225",         explication: "15 × 15 = 225." },
  { matiere: "Mathématiques", difficulte: "Moyen",     contenu: "Combien y a-t-il de nombres premiers entre 1 et 20 ?",              choix: ["6","7","8","9"],                                                                        reponse_attendue: "8",           explication: "2,3,5,7,11,13,17,19 — 8 nombres premiers." },
  { matiere: "Mathématiques", difficulte: "Moyen",     contenu: "Quelle est la somme des angles d'un quadrilatère ?",                 choix: ["270°","360°","450°","540°"],                                                           reponse_attendue: "360°",        explication: "La somme des angles intérieurs de tout quadrilatère est 360°." },
  { matiere: "Mathématiques", difficulte: "Moyen",     contenu: "Que vaut log₁₀(1000) ?",                                             choix: ["2","3","4","10"],                                                                       reponse_attendue: "3",           explication: "log₁₀(10³) = 3." },
  { matiere: "Mathématiques", difficulte: "Moyen",     contenu: "Quel est le PGCD de 48 et 36 ?",                                     choix: ["6","9","12","18"],                                                                      reponse_attendue: "12",          explication: "48 = 4×12, 36 = 3×12, donc PGCD = 12." },
  { matiere: "Mathématiques", difficulte: "Difficile", contenu: "Quelle est l'intégrale de f(x) = 2x sur [0,3] ?",                   choix: ["3","6","9","18"],                                                                       reponse_attendue: "9",           explication: "∫₀³ 2x dx = [x²]₀³ = 9 - 0 = 9." },
  { matiere: "Mathématiques", difficulte: "Difficile", contenu: "Quelle est la limite de (sin x)/x quand x → 0 ?",                   choix: ["0","1","∞","Indéfinie"],                                                               reponse_attendue: "1",           explication: "C'est une limite fondamentale : lim(sin x / x) = 1 quand x→0." },
  { matiere: "Mathématiques", difficulte: "Difficile", contenu: "Dans un triangle rectangle, si les cathètes mesurent 3 et 4, quelle est l'hypoténuse ?", choix: ["5","6","7","8"],                                          reponse_attendue: "5",           explication: "Théorème de Pythagore : √(3²+4²) = √25 = 5." },

  // ── Français (10) ───────────────────────────────────────────
  { matiere: "Français", difficulte: "Facile",    contenu: "Quel est le pluriel de 'cheval' ?",                                       choix: ["chevals","chevaux","chevales","chevals"],                                               reponse_attendue: "chevaux",     explication: "Les noms en -al font leur pluriel en -aux : cheval → chevaux." },
  { matiere: "Français", difficulte: "Facile",    contenu: "Quel est l'antonyme de 'rapide' ?",                                       choix: ["vif","lent","agile","fort"],                                                           reponse_attendue: "lent",        explication: "L'antonyme (contraire) de rapide est lent." },
  { matiere: "Français", difficulte: "Facile",    contenu: "Quelle figure de style consiste à comparer sans 'comme' ni 'tel' ?",      choix: ["Métaphore","Comparaison","Allitération","Oxymore"],                                    reponse_attendue: "Métaphore",   explication: "La métaphore assimile directement un élément à un autre sans outil de comparaison." },
  { matiere: "Français", difficulte: "Moyen",     contenu: "Quel auteur a écrit 'Germinal' ?",                                        choix: ["Victor Hugo","Gustave Flaubert","Émile Zola","Guy de Maupassant"],                     reponse_attendue: "Émile Zola",  explication: "Germinal (1885) est le 13ᵉ roman du cycle des Rougon-Macquart d'Émile Zola." },
  { matiere: "Français", difficulte: "Moyen",     contenu: "Qu'est-ce qu'un alexandrin ?",                                            choix: ["Un vers de 10 syllabes","Un vers de 12 syllabes","Un poème de 14 vers","Un sonnet"],   reponse_attendue: "Un vers de 12 syllabes", explication: "L'alexandrin est le vers français de 12 syllabes, roi de la tragédie classique." },
  { matiere: "Français", difficulte: "Moyen",     contenu: "Quel est le COD dans : 'Marie mange une pomme' ?",                        choix: ["Marie","mange","une","une pomme"],                                                    reponse_attendue: "une pomme",   explication: "'une pomme' répond à 'mange quoi ?' — c'est le complément d'objet direct." },
  { matiere: "Français", difficulte: "Moyen",     contenu: "Dans quel siècle vivait Molière ?",                                       choix: ["XVe","XVIe","XVIIe","XVIIIe"],                                                        reponse_attendue: "XVIIe",       explication: "Molière (1622–1673) vécut au Grand Siècle, le XVIIe siècle." },
  { matiere: "Français", difficulte: "Difficile", contenu: "Qu'est-ce que le zeugme ?",                                               choix: ["Une répétition sonore","Un terme reliant deux éléments de nature différente","Un retour en arrière narratif","Une antithèse"], reponse_attendue: "Un terme reliant deux éléments de nature différente", explication: "Exemple : 'Il prit son manteau et la porte' — 'prit' relie deux compléments incompatibles." },
  { matiere: "Français", difficulte: "Difficile", contenu: "Quel mouvement littéraire Baudelaire représente-t-il ?",                  choix: ["Romantisme","Réalisme","Symbolisme","Naturalisme"],                                   reponse_attendue: "Symbolisme",  explication: "Baudelaire est le précurseur du symbolisme avec Les Fleurs du Mal (1857)." },
  { matiere: "Français", difficulte: "Difficile", contenu: "Qu'est-ce que l'anacoluthe ?",                                            choix: ["Une rupture syntaxique","Un jeu de mots","Un retour au présent","Une métonymie"],      reponse_attendue: "Une rupture syntaxique", explication: "L'anacoluthe est une rupture dans la construction grammaticale d'une phrase." },

  // ── Histoire-Géographie (10) ─────────────────────────────────
  { matiere: "Histoire-Géographie", difficulte: "Facile",    contenu: "Quelle est la capitale de l'Espagne ?",                        choix: ["Barcelone","Séville","Madrid","Valence"],                                              reponse_attendue: "Madrid",      explication: "Madrid est la capitale et la plus grande ville d'Espagne." },
  { matiere: "Histoire-Géographie", difficulte: "Facile",    contenu: "En quelle année a commencé la Seconde Guerre mondiale ?",       choix: ["1935","1937","1939","1941"],                                                           reponse_attendue: "1939",        explication: "La WWII débuta le 1ᵉʳ septembre 1939 avec l'invasion de la Pologne par l'Allemagne." },
  { matiere: "Histoire-Géographie", difficulte: "Facile",    contenu: "Quel fleuve traverse Paris ?",                                  choix: ["Loire","Rhône","Seine","Garonne"],                                                     reponse_attendue: "Seine",       explication: "La Seine traverse Paris sur environ 13 km." },
  { matiere: "Histoire-Géographie", difficulte: "Moyen",     contenu: "Quel pays possède le plus grand territoire du monde ?",         choix: ["Canada","Chine","États-Unis","Russie"],                                                reponse_attendue: "Russie",      explication: "La Russie couvre 17 millions de km², soit 11% des terres émergées." },
  { matiere: "Histoire-Géographie", difficulte: "Moyen",     contenu: "Quel empire fut fondé par Gengis Khan au XIIIe siècle ?",       choix: ["Empire ottoman","Empire mongol","Empire byzantin","Empire perse"],                    reponse_attendue: "Empire mongol", explication: "Gengis Khan unifia les tribus mongoles en 1206 et créa le plus grand empire continu." },
  { matiere: "Histoire-Géographie", difficulte: "Moyen",     contenu: "Quel détroit sépare l'Europe de l'Afrique ?",                   choix: ["Détroit de Bab el-Mandeb","Détroit de Malacca","Détroit de Gibraltar","Détroit de Hormuz"], reponse_attendue: "Détroit de Gibraltar", explication: "Le détroit de Gibraltar relie la Méditerranée à l'Atlantique." },
  { matiere: "Histoire-Géographie", difficulte: "Moyen",     contenu: "Quelle civilisation a construit le Machu Picchu ?",             choix: ["Maya","Aztèque","Inca","Olmèque"],                                                    reponse_attendue: "Inca",        explication: "Le Machu Picchu fut construit par les Incas au XVe siècle au Pérou." },
  { matiere: "Histoire-Géographie", difficulte: "Difficile", contenu: "Quel traité de 1648 mit fin à la Guerre de Trente Ans ?",       choix: ["Traité d'Utrecht","Traité de Westphalie","Traité de Vienne","Traité de Prague"],      reponse_attendue: "Traité de Westphalie", explication: "Les traités de Westphalie (1648) redéfinirent l'équilibre européen et posèrent les bases des États-nations." },
  { matiere: "Histoire-Géographie", difficulte: "Difficile", contenu: "Quel continent contient le Kalahari ?",                         choix: ["Australie","Asie","Amérique du Sud","Afrique"],                                       reponse_attendue: "Afrique",     explication: "Le désert du Kalahari s'étend sur le Botswana, la Namibie et l'Afrique du Sud." },
  { matiere: "Histoire-Géographie", difficulte: "Difficile", contenu: "Qui était le chef de la Résistance française symbolisé par l'appel du 18 juin 1940 ?", choix: ["Philippe Pétain","Jean Moulin","Charles de Gaulle","Henri Giraud"], reponse_attendue: "Charles de Gaulle", explication: "Le 18 juin 1940, depuis Londres, de Gaulle appela les Français à continuer la résistance." },

  // ── Sciences (10) ────────────────────────────────────────────
  { matiere: "Sciences", difficulte: "Facile",    contenu: "Quel organe pompent le sang dans le corps humain ?",                      choix: ["Poumon","Foie","Cœur","Rein"],                                                         reponse_attendue: "Cœur",        explication: "Le cœur est la pompe musculaire qui propulse le sang dans tout l'organisme." },
  { matiere: "Sciences", difficulte: "Facile",    contenu: "Quelle est la formule chimique du dioxyde de carbone ?",                   choix: ["CO","CO2","C2O","O2C"],                                                                reponse_attendue: "CO2",         explication: "CO2 = 1 atome de carbone lié à 2 atomes d'oxygène." },
  { matiere: "Sciences", difficulte: "Facile",    contenu: "Quel type de lumière est invisible à l'œil nu mais ressenti comme chaleur ?", choix: ["UV","Infrarouge","Gamma","Visible"],                                               reponse_attendue: "Infrarouge",  explication: "Le rayonnement infrarouge transporte de la chaleur et est émis par tous les corps chauds." },
  { matiere: "Sciences", difficulte: "Moyen",     contenu: "Quelle est la loi de Newton qui énonce F = ma ?",                          choix: ["1ère loi","2ème loi","3ème loi","Loi de gravitation"],                               reponse_attendue: "2ème loi",    explication: "La 2ᵉ loi de Newton : la force est égale à la masse multipliée par l'accélération." },
  { matiere: "Sciences", difficulte: "Moyen",     contenu: "Quel gaz représente environ 78% de l'atmosphère terrestre ?",              choix: ["Oxygène","Argon","Azote","CO2"],                                                       reponse_attendue: "Azote",       explication: "L'atmosphère est composée d'environ 78% d'azote (N2) et 21% d'oxygène." },
  { matiere: "Sciences", difficulte: "Moyen",     contenu: "Combien de paires de chromosomes possède l'être humain ?",                 choix: ["20","23","24","46"],                                                                   reponse_attendue: "23",          explication: "Les cellules humaines contiennent 23 paires de chromosomes, soit 46 au total." },
  { matiere: "Sciences", difficulte: "Moyen",     contenu: "Qu'est-ce que la photosynthèse produit comme gaz ?",                        choix: ["CO2","H2","O2","N2"],                                                                  reponse_attendue: "O2",          explication: "Les plantes absorbent le CO2 et libèrent de l'O2 lors de la photosynthèse." },
  { matiere: "Sciences", difficulte: "Difficile", contenu: "Quel est le numéro atomique du carbone ?",                                 choix: ["4","6","8","12"],                                                                      reponse_attendue: "6",           explication: "Le carbone (C) a 6 protons dans son noyau, d'où son numéro atomique 6." },
  { matiere: "Sciences", difficulte: "Difficile", contenu: "Quelle particule élémentaire est associée à la force faible ?",            choix: ["Photon","Gluon","Boson W/Z","Graviton"],                                              reponse_attendue: "Boson W/Z",   explication: "Les bosons W et Z sont les médiateurs de l'interaction faible, responsable de la désintégration radioactive." },
  { matiere: "Sciences", difficulte: "Difficile", contenu: "Quel scientifique a développé la théorie de la relativité restreinte ?",   choix: ["Max Planck","Niels Bohr","Albert Einstein","Werner Heisenberg"],                     reponse_attendue: "Albert Einstein", explication: "Einstein publia la théorie de la relativité restreinte en 1905 dans son annus mirabilis." },

  // ── Anglais (10) ─────────────────────────────────────────────
  { matiere: "Anglais", difficulte: "Facile",    contenu: "What is the past tense of 'go' ?",                                         choix: ["goed","gone","went","goes"],                                                           reponse_attendue: "went",        explication: "'Go' is irregular: go → went → gone." },
  { matiere: "Anglais", difficulte: "Facile",    contenu: "Which word means 'happy' ?",                                               choix: ["sad","angry","joyful","tired"],                                                        reponse_attendue: "joyful",      explication: "'Joyful' is a synonym for happy, meaning full of joy." },
  { matiere: "Anglais", difficulte: "Facile",    contenu: "How do you say 'merci beaucoup' in English ?",                             choix: ["Thank you very much","Please","You're welcome","Good morning"],                        reponse_attendue: "Thank you very much", explication: "'Thank you very much' is the direct translation of 'merci beaucoup'." },
  { matiere: "Anglais", difficulte: "Moyen",     contenu: "Which tense is used in: 'She has been working for 3 hours' ?",             choix: ["Present simple","Past simple","Present perfect continuous","Future perfect"],          reponse_attendue: "Present perfect continuous", explication: "The present perfect continuous (has/have + been + V-ing) expresses an action started in the past and still ongoing." },
  { matiere: "Anglais", difficulte: "Moyen",     contenu: "What does 'ubiquitous' mean ?",                                            choix: ["Rare","Outdated","Omnipresent","Confusing"],                                          reponse_attendue: "Omnipresent", explication: "'Ubiquitous' means present everywhere at the same time (omnipresent)." },
  { matiere: "Anglais", difficulte: "Moyen",     contenu: "Who wrote '1984' ?",                                                        choix: ["Aldous Huxley","Ray Bradbury","George Orwell","H.G. Wells"],                          reponse_attendue: "George Orwell", explication: "George Orwell (Eric Arthur Blair) wrote '1984' in 1949, a dystopian novel about totalitarianism." },
  { matiere: "Anglais", difficulte: "Moyen",     contenu: "What is the passive form of 'The chef cooked the meal' ?",                  choix: ["The meal is cooked by the chef","The meal was cooking","The meal has cooked","The meal is cooking"], reponse_attendue: "The meal was cooked by the chef", explication: "Passive: subject + was/were + past participle + by + agent." },
  { matiere: "Anglais", difficulte: "Difficile", contenu: "What is an 'oxymoron' ?",                                                   choix: ["A word with opposite meanings","A contradiction in terms used deliberately","A very long word","A Greek epic poem"], reponse_attendue: "A contradiction in terms used deliberately", explication: "An oxymoron combines contradictory terms (e.g. 'deafening silence', 'living dead')." },
  { matiere: "Anglais", difficulte: "Difficile", contenu: "Which literary device involves giving human qualities to non-human things ?", choix: ["Simile","Metaphor","Personification","Alliteration"],                              reponse_attendue: "Personification", explication: "Personification attributes human characteristics to animals, objects, or abstract ideas." },
  { matiere: "Anglais", difficulte: "Difficile", contenu: "What is the subjunctive mood of 'to be' in formal English ?",              choix: ["is","was","be","been"],                                                               reponse_attendue: "be",          explication: "The subjunctive uses 'be' regardless of person: 'I suggest that he be present'." },

  // ── Culture Générale (10) ────────────────────────────────────
  { matiere: "Culture Générale", difficulte: "Facile",    contenu: "Quel est le plus grand pays du monde par superficie ?",           choix: ["Canada","Russie","Chine","USA"],                                                       reponse_attendue: "Russie",      explication: "La Russie s'étend sur 17,1 millions de km²." },
  { matiere: "Culture Générale", difficulte: "Facile",    contenu: "Combien y a-t-il d'étoiles sur le drapeau américain ?",           choix: ["48","50","51","52"],                                                                   reponse_attendue: "50",          explication: "Les 50 étoiles représentent les 50 États des États-Unis." },
  { matiere: "Culture Générale", difficulte: "Facile",    contenu: "Quel instrument de musique a 88 touches ?",                        choix: ["Orgue","Accordéon","Piano","Clavecin"],                                                reponse_attendue: "Piano",       explication: "Le piano standard possède 88 touches (52 blanches et 36 noires)." },
  { matiere: "Culture Générale", difficulte: "Moyen",     contenu: "Quel peintre est célèbre pour 'La Nuit étoilée' ?",               choix: ["Pablo Picasso","Claude Monet","Vincent van Gogh","Salvador Dalí"],                    reponse_attendue: "Vincent van Gogh", explication: "Van Gogh peignit La Nuit étoilée en juin 1889, depuis l'asile de Saint-Rémy." },
  { matiere: "Culture Générale", difficulte: "Moyen",     contenu: "Quel sport se joue au Wimbledon Championships ?",                  choix: ["Golf","Cricket","Tennis","Polo"],                                                     reponse_attendue: "Tennis",      explication: "Wimbledon est le plus ancien tournoi de tennis du monde, fondé en 1877." },
  { matiere: "Culture Générale", difficulte: "Moyen",     contenu: "Quel est le symbole chimique de l'or ?",                           choix: ["Or","Go","Au","Ag"],                                                                   reponse_attendue: "Au",          explication: "Au vient du latin 'aurum'. L'argent est Ag ('argentum')." },
  { matiere: "Culture Générale", difficulte: "Moyen",     contenu: "En quelle année l'homme a-t-il marché sur la Lune pour la première fois ?", choix: ["1965","1967","1969","1971"],                                           reponse_attendue: "1969",        explication: "Neil Armstrong fit ses premiers pas sur la Lune le 21 juillet 1969 (mission Apollo 11)." },
  { matiere: "Culture Générale", difficulte: "Difficile", contenu: "Qui a composé la 'Symphonie du Nouveau Monde' ?",                  choix: ["Beethoven","Dvořák","Brahms","Schubert"],                                             reponse_attendue: "Dvořák",      explication: "Antonín Dvořák composa la Symphonie n°9 'Du Nouveau Monde' en 1893, inspirée par l'Amérique." },
  { matiere: "Culture Générale", difficulte: "Difficile", contenu: "Quelle organisation internationale est symbolisée par un laurier et un globe bleu ?", choix: ["OTAN","Union Européenne","ONU","UNESCO"],                         reponse_attendue: "ONU",         explication: "L'emblème de l'ONU montre le globe terrestre entouré d'une couronne de feuilles d'olivier symbolisant la paix." },
  { matiere: "Culture Générale", difficulte: "Difficile", contenu: "Dans quelle ville se trouve le musée du Prado ?",                  choix: ["Barcelone","Lisbonne","Rome","Madrid"],                                               reponse_attendue: "Madrid",      explication: "Le Museo del Prado, fondé en 1819 à Madrid, abrite l'une des plus grandes collections d'art européen." },

  // ── Informatique (10) ────────────────────────────────────────
  { matiere: "Informatique", difficulte: "Facile",    contenu: "Que signifie l'acronyme RAM ?",                                        choix: ["Read Access Memory","Random Access Memory","Rapid Application Memory","Read And Modify"], reponse_attendue: "Random Access Memory", explication: "La RAM est la mémoire vive, accessible en lecture/écriture rapide." },
  { matiere: "Informatique", difficulte: "Facile",    contenu: "Quel langage est utilisé pour styliser les pages web ?",               choix: ["HTML","JavaScript","CSS","PHP"],                                                       reponse_attendue: "CSS",         explication: "CSS (Cascading Style Sheets) gère la présentation visuelle des pages HTML." },
  { matiere: "Informatique", difficulte: "Facile",    contenu: "Qu'est-ce qu'un bug informatique ?",                                   choix: ["Un virus","Une erreur dans un programme","Un accès non autorisé","Un manque de mémoire"], reponse_attendue: "Une erreur dans un programme", explication: "Un bug est une erreur dans le code causant un comportement inattendu." },
  { matiere: "Informatique", difficulte: "Moyen",     contenu: "Quelle est la complexité temporelle d'un tri rapide (quicksort) en moyenne ?", choix: ["O(n)","O(n log n)","O(n²)","O(log n)"],                               reponse_attendue: "O(n log n)",   explication: "Le quicksort a une complexité moyenne de O(n log n), mais O(n²) dans le pire cas." },
  { matiere: "Informatique", difficulte: "Moyen",     contenu: "Quel protocole garantit un transfert sécurisé sur le web ?",           choix: ["HTTP","FTP","HTTPS","SMTP"],                                                           reponse_attendue: "HTTPS",       explication: "HTTPS = HTTP + TLS/SSL. Le chiffrement protège les données en transit." },
  { matiere: "Informatique", difficulte: "Moyen",     contenu: "Que fait l'opérateur bitwise OR ( | ) entre 0101 et 0011 ?",           choix: ["0001","0111","0100","1010"],                                                           reponse_attendue: "0111",        explication: "OR bit à bit : 0|0=0, 1|0=1, 0|1=1, 1|1=1. Donc 0101|0011 = 0111." },
  { matiere: "Informatique", difficulte: "Moyen",     contenu: "Quel est le rôle d'un ORM ?",                                          choix: ["Optimiser la RAM","Faire la liaison entre objets et base de données","Gérer les requêtes HTTP","Compiler du code"], reponse_attendue: "Faire la liaison entre objets et base de données", explication: "Un ORM (Object-Relational Mapping) traduit les appels objets en requêtes SQL." },
  { matiere: "Informatique", difficulte: "Difficile", contenu: "Qu'est-ce que le problème du voyageur de commerce (TSP) illustre ?",   choix: ["Un problème de graphe NP-complet","Un problème de tri","Un algorithme glouton optimal","Un problème de réseau neuronal"], reponse_attendue: "Un problème de graphe NP-complet", explication: "Le TSP cherche le plus court chemin passant par toutes les villes — il est NP-complet, sans solution polynomiale connue." },
  { matiere: "Informatique", difficulte: "Difficile", contenu: "Que garantit le théorème CAP (Brewer) ?",                             choix: ["Cohérence + Disponibilité + Partition tolerance (2 sur 3 max)","3 propriétés toujours satisfaites","La sécurité des API REST","L'ACID des transactions SQL"], reponse_attendue: "Cohérence + Disponibilité + Partition tolerance (2 sur 3 max)", explication: "Le théorème CAP stipule qu'un système distribué ne peut garantir que 2 des 3 propriétés simultanément." },
  { matiere: "Informatique", difficulte: "Difficile", contenu: "Qu'est-ce qu'une race condition ?",                                    choix: ["Une boucle infinie","Un bug survenant quand l'ordre d'exécution de threads est imprévisible","Une fuite mémoire","Une erreur de parsing"], reponse_attendue: "Un bug survenant quand l'ordre d'exécution de threads est imprévisible", explication: "Une race condition se produit lorsque deux threads accèdent à une ressource partagée sans synchronisation." },
];

async function main() {
  console.log(`🌱 Démarrage du seeding...`);

  // 1. Création des Badges
  const badgesData = [
    { nom: 'Novice', icone: '🥚', xp_requis: 0 },
    { nom: 'Apprenti', icone: '🐣', xp_requis: 100 },
    { nom: 'Éclaireur', icone: '🐥', xp_requis: 500 },
    { nom: 'Expert', icone: '🐔', xp_requis: 1500 },
    { nom: 'Maître de l\'IA', icone: '👑', xp_requis: 5000 },
  ];

  console.log('Création des badges...');
  for (const badge of badgesData) {
    const existing = await prisma.badge.findFirst({ where: { nom: badge.nom } });
    if (!existing) {
      await prisma.badge.create({ data: badge });
      console.log(`Badge créé : ${badge.nom}`);
    } else {
      console.log(`Badge déjà existant : ${badge.nom}`);
    }
  }

  // 2. Création de l'utilisateur admin
  console.log('Création de l\'utilisateur admin...');
  const adminEmail = 'admin@academia.fr';
  const existingAdmin = await prisma.utilisateur.findUnique({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    await prisma.utilisateur.create({ 
      data: {
      email: adminEmail,
      pseudo: 'Administrateur AcademIA',
      role: 'admin',
      niveau: 10,
      xp: 10000,
      emailVerified: true, // Vérifie aussi que ce n'est pas "emailVerifie" au passage !
    }
    });
    console.log(`Admin créé : ${adminEmail}`);
  } else {
    console.log(`Admin déjà existant : ${adminEmail}`);
  }

  // 3. Insertion des 70 questions
  console.log(`\nInsertion de ${QUESTIONS.length} questions MCQ...`);
  // Supprimer les anciennes questions pour éviter les doublons ou conflits de schéma
  await prisma.question.deleteMany({});

  const created = await prisma.question.createMany({
    data: QUESTIONS,
    skipDuplicates: true,
  });

  console.log(`✅ ${created.count} questions insérées avec succès.`);
  console.log('✅ Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });