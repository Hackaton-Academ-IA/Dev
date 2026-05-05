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
  return 100 * niveau * niveau;
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
export const SPEED_BONUS = 10;
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

export function timerForNiveau(niveau: number): number {
  if (niveau <= 3) return 30;
  if (niveau <= 6) return 20;
  if (niveau <= 9) return 15;
  return 10;
}

export function difficulteFromPalier(palier: number): Difficulte {
  if (palier <= 1) return "apprenti";
  if (palier === 2) return "confirme";
  if (palier === 3) return "expert";
  return "maitre";
}

export function initialPalier(niveau: number): number {
  if (niveau <= 3) return 1;
  if (niveau <= 6) return 2;
  if (niveau <= 9) return 3;
  return 4;
}

/** Adaptive palier: 3 correct in a row → +1, 2 errors in a row → -1 */
export function adaptPalier(palier: number, streak: number, errorStreak: number): number {
  if (streak >= 3) return Math.min(4, palier + 1);
  if (errorStreak >= 2) return Math.max(1, palier - 1);
  return palier;
}

export const BOSS_NAMES = [
  "LE SPHINX DE THÈBES",
  "L'HYDRE ALGÉBRIQUE",
  "LE GOLEM DE BABEL",
  "L'ORACLE CORROMPU",
  "LE TITAN DES ARCHIVES",
] as const;

export function getBossName(cycle: number): string {
  return BOSS_NAMES[cycle % BOSS_NAMES.length];
}
