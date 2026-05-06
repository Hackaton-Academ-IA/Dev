import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

const MATIERES = [
  "Mathématiques",
  "Français",
  "Histoire-Géographie",
  "Sciences",
  "Anglais",
  "Culture Générale",
  "Informatique",
] as const;

function getPalier(difficulty: string): string {
  const num = parseFloat(difficulty);
  if (num <= 3) return "Facile";
  if (num <= 6) return "Moyen";
  return "Difficile";
}

interface QuizData {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  matiere?: string;
  source?: "gemini" | "fallback";
  isAiOnline: boolean;
}

const FALLBACK_QUIZZES: Record<string, Omit<QuizData, "isAiOnline">> = {
  "Le Commencement": {
    question: "Quelle est la première étape typique d'une aventure épique ?",
    options: ["Trouver une épée légendaire", "Quitter son village natal", "Vaincre le dragon final", "Devenir roi"],
    correctAnswer: 1,
    explanation: "Presque toutes les grandes aventures commencent par le héros quittant son environnement familier.",
    source: "fallback",
  },
  "Forêt des Murmures": {
    question: "Quel arbre est souvent considéré comme sacré dans les légendes forestières ?",
    options: ["Le Sapin", "Le Chêne", "Le Palmier", "Le Cactus"],
    correctAnswer: 1,
    explanation: "Le chêne est un symbole de force et de sagesse dans de nombreuses cultures.",
    source: "fallback",
  },
  "Grottes de Cristal": {
    question: "Comment se nomme la formation rocheuse qui 'descend' du plafond d'une grotte ?",
    options: ["Une stalagmite", "Une stalactite", "Un cristal", "Un monolithe"],
    correctAnswer: 1,
    explanation: "Les stalactites 'tombent' du plafond (avec un 'T' comme Tomber).",
    source: "fallback",
  },
  "Marais Toxique": {
    question: "Quel gaz est responsable de l'odeur d'œuf pourri dans les zones marécageuses ?",
    options: ["L'Oxygène", "Le Diazote", "Le Sulfure d'hydrogène", "Le Dioxyde de carbone"],
    correctAnswer: 2,
    explanation: "Le sulfure d'hydrogène (H2S) est produit par la décomposition bactérienne en anaérobie.",
    source: "fallback",
  },
  "Temple du Soleil": {
    question: "Quelle civilisation est célèbre pour ses temples dédiés au Soleil, comme le Coricancha ?",
    options: ["Les Vikings", "Les Incas", "Les Grecs", "Les Romains"],
    correctAnswer: 1,
    explanation: "Les Incas considéraient le Soleil (Inti) comme leur ancêtre divin.",
    source: "fallback",
  },
  "Forteresse de Fer": {
    question: "Quel alliage de fer et de carbone est le plus utilisé pour construire des structures solides ?",
    options: ["Le Bronze", "L'Acier", "Le Laiton", "L'Aluminium"],
    correctAnswer: 1,
    explanation: "L'acier est un alliage de fer et de carbone à haute résistance.",
    source: "fallback",
  },
  "Pics Glacés": {
    question: "Comment appelle-t-on le manque d'oxygène ressenti en haute montagne ?",
    options: ["L'hypothermie", "L'hypoxie", "L'hypertension", "L'hydrophobie"],
    correctAnswer: 1,
    explanation: "L'hypoxie est une diminution de l'oxygène distribué aux tissus, fréquente en altitude.",
    source: "fallback",
  },
  "Ruines du Désert": {
    question: "Quel animal est surnommé le 'vaisseau du désert' ?",
    options: ["Le Lion", "Le Chameau", "Le Scorpion", "Le Serpent"],
    correctAnswer: 1,
    explanation: "Le chameau peut voyager de longues distances sans eau grâce à ses adaptations biologiques.",
    source: "fallback",
  },
  "Abîme Oubliée": {
    question: "Quelle zone de l'océan se situe au-delà de 4000 mètres de profondeur ?",
    options: ["La zone pélagique", "La zone abyssale", "Le plateau continental", "Le récif corallien"],
    correctAnswer: 1,
    explanation: "La zone abyssale se caractérise par une absence de lumière et des pressions extrêmes.",
    source: "fallback",
  },
  "default": {
    question: "Quel est l'élément principal nécessaire pour réussir un quiz ?",
    options: ["La chance", "La connaissance", "La rapidité", "Le silence"],
    correctAnswer: 1,
    explanation: "La connaissance reste la clé pour répondre correctement.",
    source: "fallback",
  },
};

async function dbFallback(matiere: string): Promise<QuizData | null> {
  try {
    const questions = await prisma.question.findMany({
      where: { matiere },
      select: { contenu: true, choix: true, reponse_attendue: true, explication: true, matiere: true },
    });

    if (questions.length === 0) return null;

    const q = questions[Math.floor(Math.random() * questions.length)];
    const correctAnswer = q.choix.indexOf(q.reponse_attendue);

    return {
      question: q.contenu,
      options: q.choix,
      correctAnswer: correctAnswer >= 0 ? correctAnswer : 0,
      explanation: q.explication,
      matiere: q.matiere,
      source: "fallback",
      isAiOnline: false,
    };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const rlKey = session.user.id ?? getClientKey(req);
  const rl = checkRateLimit(rlKey, 10, 10_000);
  if (!rl.allowed) {
    logger.warn("RATE_LIMIT_HIT", `userId=${session.user.id} route=quiz/generate`);
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  const { theme, difficulty } = await req.json().catch(() => ({ theme: "default", difficulty: "5/10" }));

  const matiere = MATIERES[Math.floor(Math.random() * MATIERES.length)];
  const palier = getPalier(String(difficulty ?? "5/10"));

  const apiKey = process.env.GEMINI_API_KEY ?? "";

  if (!apiKey) {
    logger.warn("GEMINI_API_KEY_MISSING", "Passage direct au fallback — vérifie .env");
  } else {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Génère une question de ${matiere} de niveau ${palier} sur un thème lié ou non à "${theme ?? "aventure"}".
Génère une question TOTALEMENT INÉDITE. Varie les sujets.
Réponds UNIQUEMENT avec du JSON valide, sans texte autour ni bloc markdown.
{"question":"...","options":["...","...","...","..."],"correctAnswer":0,"explanation":"..."}
correctAnswer est l'index (0-3) de la bonne réponse.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        const quizData = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
        return NextResponse.json({ ...quizData, matiere, source: "gemini", isAiOnline: true });
      }

      logger.error("GEMINI_INVALID_JSON", `JSON introuvable dans la réponse: ${text.slice(0, 100)}`);
    } catch (err) {
      logger.error("GEMINI_ERROR", err instanceof Error ? err.message : String(err));
    }
  }

  // Fallback 1 — Prisma DB
  const dbResult = await dbFallback(matiere);
  if (dbResult) return NextResponse.json(dbResult);

  // Fallback 2 — static pool
  const fallback = FALLBACK_QUIZZES[String(theme)] ?? FALLBACK_QUIZZES["default"];
  return NextResponse.json({ ...fallback, matiere, isAiOnline: false });
}
