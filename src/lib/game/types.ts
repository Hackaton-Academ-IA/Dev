import { z } from "zod";

export type GameStatus =
  | "idle"
  | "loading"
  | "playing"
  | "explaining"
  | "boss_intro"
  | "game_over"
  | "level_up";

export type Difficulte = "apprenti" | "confirme" | "expert" | "maitre";

/** Question sent to client — correctIndex is never included */
export interface Question {
  id: string;
  contenu: string;
  choix: string[]; // exactly 4
  difficulte: Difficulte;
  matiere: string;
  explication: string;
}

export const AnswerRequestSchema = z.object({
  chosenIndex: z.number().int().min(0).max(3),
  timeRemaining: z.number().min(0).max(30),
  answerToken: z.string().min(1),
  matiere: z.string().min(1),
  palier: z.number().int().min(1).max(4),
  questionIndex: z.number().int().min(0),
  isBossFight: z.boolean(),
  streak: z.number().int().min(0),
  errorStreak: z.number().int().min(0),
  combo: z.number().int().min(0),
  bossHp: z.number().int().nullable(),
  totalQuestions: z.number().int().min(0),
  correctAnswers: z.number().int().min(0),
});

export type AnswerRequest = z.infer<typeof AnswerRequestSchema>;

export interface AnswerResponse {
  correct: boolean;
  correctIndex: number; // revealed after answer for UX highlighting
  xpGain: number;
  newXp: number;
  newNiveau: number;
  leveledUp: boolean;
  newHp: number;
  newBossHp: number | null;
  bossDefeated: boolean;
  nextIsBossFight: boolean;
  gameOver: boolean;
  unlockedBadges: string[];
  nextQuestion: Question | null;
  nextAnswerToken: string | null;
  newPalier: number;
  dailyQuestsDone: number;
  dailyCompleted: boolean;
}
