import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";
import type { Question, Difficulte } from "./types";

// Internal pool with correct answers — not exposed to client (35 questions, 5 per matière)
const FALLBACK_POOL: Array<{ q: Omit<Question, "id">; ci: number }> = [
  // ── MATHÉMATIQUES ──
  { q: { contenu: "Qui a démontré l'infinité des nombres premiers ?", choix: ["Pythagore", "Euclide", "Archimède", "Thalès"], difficulte: "apprenti", matiere: "Mathématiques", explication: "Euclide le démontre dans les Éléments, livre IX." }, ci: 1 },
  { q: { contenu: "Combien de degrés y a-t-il dans un triangle ?", choix: ["90°", "180°", "270°", "360°"], difficulte: "apprenti", matiere: "Mathématiques", explication: "La somme des angles intérieurs d'un triangle est toujours 180°." }, ci: 1 },
  { q: { contenu: "Quelle est la racine carrée de 144 ?", choix: ["10", "11", "12", "13"], difficulte: "apprenti", matiere: "Mathématiques", explication: "12 × 12 = 144." }, ci: 2 },
  { q: { contenu: "Qu'est-ce que le nombre π (pi) représente ?", choix: ["Rapport périmètre/diamètre d'un cercle", "Rapport surface/rayon d'un cercle", "La constante d'Euler", "Le nombre d'or"], difficulte: "confirme", matiere: "Mathématiques", explication: "π = périmètre ÷ diamètre ≈ 3,14159…" }, ci: 0 },
  { q: { contenu: "Quelle est la dérivée de f(x) = x³ ?", choix: ["x²", "2x²", "3x²", "3x"], difficulte: "expert", matiere: "Mathématiques", explication: "Règle de dérivation : (xⁿ)' = n·xⁿ⁻¹, donc (x³)' = 3x²." }, ci: 2 },

  // ── HISTOIRE ──
  { q: { contenu: "En quelle année a débuté la Révolution française ?", choix: ["1689", "1715", "1789", "1804"], difficulte: "apprenti", matiere: "Histoire", explication: "La prise de la Bastille eut lieu le 14 juillet 1789." }, ci: 2 },
  { q: { contenu: "Qui était le premier président des États-Unis ?", choix: ["Thomas Jefferson", "Benjamin Franklin", "George Washington", "John Adams"], difficulte: "apprenti", matiere: "Histoire", explication: "George Washington, premier président de 1789 à 1797." }, ci: 2 },
  { q: { contenu: "En quelle année est tombé le Mur de Berlin ?", choix: ["1985", "1987", "1989", "1991"], difficulte: "confirme", matiere: "Histoire", explication: "La chute du Mur eut lieu le 9 novembre 1989." }, ci: 2 },
  { q: { contenu: "Quelle ville était la capitale de l'Empire byzantin ?", choix: ["Rome", "Athènes", "Constantinople", "Alexandrie"], difficulte: "confirme", matiere: "Histoire", explication: "Constantinople (Istanbul de nos jours) fut la capitale byzantine." }, ci: 2 },
  { q: { contenu: "Quel traité a mis fin à la Première Guerre mondiale ?", choix: ["Traité de Versailles", "Traité de Paris", "Traité de Vienne", "Traité de Berlin"], difficulte: "expert", matiere: "Histoire", explication: "Le Traité de Versailles (1919) mit officiellement fin à la WWI." }, ci: 0 },

  // ── SCIENCES ──
  { q: { contenu: "Quelle planète possède la plus grande tempête du système solaire ?", choix: ["Mars", "Saturne", "Neptune", "Jupiter"], difficulte: "apprenti", matiere: "Sciences", explication: "La Grande Tache Rouge de Jupiter est un anticyclone géant." }, ci: 3 },
  { q: { contenu: "Quelle est la formule chimique de l'eau ?", choix: ["H2O", "CO2", "NaCl", "O2"], difficulte: "apprenti", matiere: "Sciences", explication: "H2O : deux atomes d'hydrogène liés à un atome d'oxygène." }, ci: 0 },
  { q: { contenu: "Quel est l'élément chimique le plus abondant dans l'univers ?", choix: ["Hélium", "Oxygène", "Hydrogène", "Carbone"], difficulte: "confirme", matiere: "Sciences", explication: "L'hydrogène représente ~75 % de la masse baryonique de l'univers." }, ci: 2 },
  { q: { contenu: "Quelle est la vitesse de la lumière dans le vide ?", choix: ["150 000 km/s", "300 000 km/s", "450 000 km/s", "600 000 km/s"], difficulte: "confirme", matiere: "Sciences", explication: "c ≈ 299 792 km/s." }, ci: 1 },
  { q: { contenu: "Combien d'éléments compte la table périodique actuelle ?", choix: ["108", "112", "118", "126"], difficulte: "expert", matiere: "Sciences", explication: "118 éléments reconnus par l'IUPAC depuis 2016." }, ci: 2 },

  // ── PHILOSOPHIE ──
  { q: { contenu: "Quel philosophe a énoncé 'cogito ergo sum' ?", choix: ["Kant", "Descartes", "Nietzsche", "Platon"], difficulte: "apprenti", matiere: "Philosophie", explication: "Descartes, dans le Discours de la méthode (1637)." }, ci: 1 },
  { q: { contenu: "Qui est l'auteur de La République ?", choix: ["Aristote", "Socrate", "Platon", "Épicure"], difficulte: "apprenti", matiere: "Philosophie", explication: "Platon expose sa vision de la cité idéale dans La République." }, ci: 2 },
  { q: { contenu: "Quel philosophe a fondé le stoïcisme ?", choix: ["Zénon de Citium", "Épicure", "Diogène de Sinope", "Thalès"], difficulte: "confirme", matiere: "Philosophie", explication: "Zénon de Citium fonda l'école stoïcienne vers 300 av. J.-C." }, ci: 0 },
  { q: { contenu: "Qu'appelle-t-on la maïeutique chez Socrate ?", choix: ["L'art de la guerre rhétorique", "L'art d'accoucher les esprits", "L'art de la persuasion politique", "L'art de la mémoire"], difficulte: "confirme", matiere: "Philosophie", explication: "Socrate comparait sa méthode à l'accouchement des idées." }, ci: 1 },
  { q: { contenu: "Quel philosophe a écrit 'Par-delà le bien et le mal' ?", choix: ["Hegel", "Marx", "Nietzsche", "Schopenhauer"], difficulte: "expert", matiere: "Philosophie", explication: "Nietzsche publie cette œuvre en 1886, critiquant la morale traditionnelle." }, ci: 2 },

  // ── LITTÉRATURE ──
  { q: { contenu: "Qui a écrit 'Les Misérables' ?", choix: ["Honoré de Balzac", "Victor Hugo", "Alexandre Dumas", "Gustave Flaubert"], difficulte: "apprenti", matiere: "Littérature", explication: "Victor Hugo publie Les Misérables en 1862." }, ci: 1 },
  { q: { contenu: "Quel était le vrai prénom de Molière ?", choix: ["François", "Jean-Baptiste", "Pierre", "Louis"], difficulte: "apprenti", matiere: "Littérature", explication: "Jean-Baptiste Poquelin, dit Molière (1622–1673)." }, ci: 1 },
  { q: { contenu: "Qui a écrit 'Le Petit Prince' ?", choix: ["Jules Verne", "Guy de Maupassant", "Antoine de Saint-Exupéry", "Albert Camus"], difficulte: "confirme", matiere: "Littérature", explication: "Saint-Exupéry publie Le Petit Prince en 1943." }, ci: 2 },
  { q: { contenu: "Qui est l'auteur de 'L'Étranger' ?", choix: ["Jean-Paul Sartre", "André Gide", "Albert Camus", "Simone de Beauvoir"], difficulte: "confirme", matiere: "Littérature", explication: "Albert Camus publie L'Étranger en 1942." }, ci: 2 },
  { q: { contenu: "Dans quelle œuvre apparaît le personnage de Don Quichotte ?", choix: ["Gargantua", "Don Quichotte de la Manche", "L'Odyssée", "Les Aventures de Pinocchio"], difficulte: "expert", matiere: "Littérature", explication: "Cervantes publie Don Quichotte en deux parties : 1605 et 1615." }, ci: 1 },

  // ── GÉOGRAPHIE ──
  { q: { contenu: "Quelle est la capitale de l'Australie ?", choix: ["Sydney", "Melbourne", "Canberra", "Perth"], difficulte: "apprenti", matiere: "Géographie", explication: "Canberra est la capitale fédérale depuis 1927." }, ci: 2 },
  { q: { contenu: "Sur quel continent se trouve le Sahara ?", choix: ["Asie", "Amérique du Sud", "Afrique", "Océanie"], difficulte: "apprenti", matiere: "Géographie", explication: "Le Sahara couvre une grande partie de l'Afrique du Nord." }, ci: 2 },
  { q: { contenu: "Quel est le plus grand océan du monde ?", choix: ["Atlantique", "Indien", "Pacifique", "Arctique"], difficulte: "apprenti", matiere: "Géographie", explication: "L'océan Pacifique couvre plus de 165 millions de km²." }, ci: 2 },
  { q: { contenu: "Quelle est la plus haute montagne du monde ?", choix: ["K2", "Mont Blanc", "Everest", "Aconcagua"], difficulte: "confirme", matiere: "Géographie", explication: "L'Everest culmine à 8 849 m d'altitude." }, ci: 2 },
  { q: { contenu: "Combien de pays composent l'Union européenne (2024) ?", choix: ["25", "27", "30", "33"], difficulte: "expert", matiere: "Géographie", explication: "Depuis le Brexit (2020), l'UE compte 27 États membres." }, ci: 1 },

  // ── INFORMATIQUE ──
  { q: { contenu: "Que signifie l'acronyme HTML ?", choix: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Module Link", "Home Tool Markup Language"], difficulte: "apprenti", matiere: "Informatique", explication: "HTML est le langage standard de création des pages web." }, ci: 0 },
  { q: { contenu: "Qui a créé le langage Python ?", choix: ["Linus Torvalds", "Guido van Rossum", "James Gosling", "Bjarne Stroustrup"], difficulte: "apprenti", matiere: "Informatique", explication: "Guido van Rossum crée Python en 1989, publié en 1991." }, ci: 1 },
  { q: { contenu: "Quelle est la base du système binaire ?", choix: ["Base 8", "Base 10", "Base 2", "Base 16"], difficulte: "confirme", matiere: "Informatique", explication: "Le binaire n'utilise que deux chiffres : 0 et 1." }, ci: 2 },
  { q: { contenu: "Que signifie l'acronyme CPU ?", choix: ["Central Processing Unit", "Computer Power Usage", "Core Program Utility", "Central Program Unit"], difficulte: "confirme", matiere: "Informatique", explication: "Le CPU est le processeur central d'un ordinateur." }, ci: 0 },
  { q: { contenu: "Quelle structure de données respecte le principe LIFO ?", choix: ["File (Queue)", "Tableau", "Pile (Stack)", "Liste chaînée"], difficulte: "expert", matiere: "Informatique", explication: "LIFO = Last In, First Out. La Pile retire le dernier élément ajouté en premier." }, ci: 2 },
];

let fallbackCursor = 0;

function pickFallback(): { question: Question; correctIndex: number } {
  const entry = FALLBACK_POOL[fallbackCursor % FALLBACK_POOL.length];
  fallbackCursor++;
  const question: Question = { ...entry.q, id: crypto.randomUUID() };
  return { question, correctIndex: entry.ci };
}

const getSecret = () => process.env.GAME_SECRET ?? "academIA-secret-2026";

export function signQuestion(correctIndex: number, questionId: string): string {
  const payload = `${questionId}:${correctIndex}`;
  const encoded = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${encoded}.${sig}`;
}

export function verifyToken(token: string): number | null {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  try {
    const encoded = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const payload = Buffer.from(encoded, "base64url").toString("utf-8");
    const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
    // Pad to equal length for timingSafeEqual
    const a = Buffer.from(sig.padEnd(64, "0").slice(0, 64));
    const b = Buffer.from(expected.padEnd(64, "0").slice(0, 64));
    if (!crypto.timingSafeEqual(a, b)) return null;
    const ci = parseInt(payload.split(":")[1], 10);
    return Number.isFinite(ci) && ci >= 0 && ci <= 3 ? ci : null;
  } catch {
    return null;
  }
}

const DIFF_LABEL: Record<Difficulte, string> = {
  apprenti: "facile (lycée)",
  confirme: "intermédiaire (bac / licence 1)",
  expert: "difficile (master / concours)",
  maitre: "très difficile (expert confirmé du domaine)",
};

export async function generateQuestion(
  matiere: string,
  difficulte: Difficulte,
): Promise<{ question: Question; token: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return toTokenized(pickFallback());

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

    // Strip markdown fences and any leading/trailing non-JSON text
    const cleaned = raw.replace(/```(?:json)?\s*/gi, "").replace(/```\s*/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("no JSON object");

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
      throw new Error("invalid shape");
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
    return toTokenized(pickFallback());
  }
}

function toTokenized({ question, correctIndex }: { question: Question; correctIndex: number }) {
  return { question, token: signQuestion(correctIndex, question.id) };
}
