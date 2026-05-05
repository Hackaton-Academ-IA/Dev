import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

const FALLBACK_QUIZZES: Record<string, any> = {
  "Le Commencement": {
    question: "Quelle est la première étape typique d'une aventure épique ?",
    options: ["Trouver une épée légendaire", "Quitter son village natal", "Vaincre le dragon final", "Devenir roi"],
    correctAnswer: 1,
    explanation: "Presque toutes les grandes aventures commencent par le héros quittant son environnement familier pour l'inconnu."
  },
  "Forêt des Murmures": {
    question: "Quel arbre est souvent considéré comme sacré ou magique dans les légendes forestières ?",
    options: ["Le Sapin", "Le Chêne", "Le Palmier", "Le Cactus"],
    correctAnswer: 1,
    explanation: "Le chêne est un symbole de force et de sagesse dans de nombreuses cultures européennes et mythologies."
  },
  "Grottes de Cristal": {
    question: "Comment se nomme la formation rocheuse qui 'descend' du plafond d'une grotte ?",
    options: ["Une stalagmite", "Une stalactite", "Un cristal", "Un monolithe"],
    correctAnswer: 1,
    explanation: "Les stalactites 'tombent' (avec un 'T' comme Tomber) du plafond, tandis que les stalagmites 'montent' (avec un 'M' comme Monter) du sol."
  },
  "Marais Toxique": {
    question: "Quel gaz est souvent responsable de l'odeur d'oeuf pourri dans les zones marécageuses ?",
    options: ["L'Oxygène", "Le Diazote", "Le Sulfure d'hydrogène", "Le Dioxyde de carbone"],
    correctAnswer: 2,
    explanation: "Le sulfure d'hydrogène (H2S) est produit par la décomposition bactérienne de la matière organique en l'absence d'oxygène."
  },
  "Temple du Soleil": {
    question: "Quelle civilisation ancienne est célèbre pour ses temples dédiés au culte du Soleil, comme le Coricancha ?",
    options: ["Les Vikings", "Les Incas", "Les Grecs", "Les Romains"],
    correctAnswer: 1,
    explanation: "Les Incas considéraient le Soleil (Inti) comme leur ancêtre divin et lui ont dédié de magnifiques temples en or."
  },
  "Forteresse de Fer": {
    question: "Quel alliage de fer et de carbone est le plus utilisé pour construire des structures solides ?",
    options: ["Le Bronze", "L'Acier", "Le Laiton", "L'Aluminium"],
    correctAnswer: 1,
    explanation: "L'acier est un alliage de fer et de carbone qui offre une résistance exceptionnelle, idéale pour les forteresses et l'industrie."
  },
  "Pics Glacés": {
    question: "Comment appelle-t-on le phénomène de manque d'oxygène ressenti en haute montagne ?",
    options: ["L'hypothermie", "L'hypoxie", "L'hypertension", "L'hydrophobie"],
    correctAnswer: 1,
    explanation: "L'hypoxie est une diminution de la quantité d'oxygène distribuée par le sang aux tissus, fréquente en haute altitude."
  },
  "Ruines du Désert": {
    question: "Quel animal est surnommé le 'vaisseau du désert' pour sa capacité à voyager sur de longues distances sans eau ?",
    options: ["Le Lion", "Le Chameau", "Le Scorpion", "Le Serpent"],
    correctAnswer: 1,
    explanation: "Le chameau (et le dromadaire) possède des adaptations biologiques uniques pour survivre et transporter des charges dans des conditions arides."
  },
  "Abîme Oubliée": {
    question: "Quelle zone de l'océan se situe au-delà de 4000 mètres de profondeur ?",
    options: ["La zone pélagique", "La zone abyssale", "Le plateau continental", "Le récif corallien"],
    correctAnswer: 1,
    explanation: "La zone abyssale est caractérisée par une absence totale de lumière, des pressions extrêmes et des températures très basses."
  },
  "default": {
    question: "Quel est l'élément principal nécessaire pour réussir un quiz ?",
    options: ["La chance", "La connaissance", "La rapidité", "Le silence"],
    correctAnswer: 1,
    explanation: "Bien que la rapidité compte, la connaissance reste la clé pour répondre correctement."
  }
};

export async function POST(req: Request) {
  try {
    const { theme, difficulty } = await req.json();

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Génère une question de quiz sur le thème "${theme}" avec une difficulté de "${difficulty}/10".
      La réponse doit être au format JSON strict avec la structure suivante :
      {
        "question": "Le texte de la question",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": 0, // l'index de la réponse correcte dans le tableau options (0-3)
        "explanation": "Une brève explication de la réponse"
      }
      Réponds uniquement avec le JSON, sans texte avant ou après.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonString = text.replace(/```json|```/gi, "").trim();
      const quizData = JSON.parse(jsonString);

      return NextResponse.json({ ...quizData, source: "gemini" });
    } catch (apiError: any) {
      console.error("Gemini API Error (Fallback triggered):", apiError);
      
      // Check if it's a quota error (429)
      if (apiError.status === 429 || apiError.message?.includes("429")) {
        const fallback = FALLBACK_QUIZZES[theme] || FALLBACK_QUIZZES["default"];
        return NextResponse.json({ ...fallback, source: "fallback" });
      }
      throw apiError;
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Erreur lors de la génération du quiz" }, { status: 500 });
  }
}
