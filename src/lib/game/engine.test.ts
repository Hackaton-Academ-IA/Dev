import { describe, it, expect } from "vitest";
import {
  xpThreshold,
  niveauFromTotalXp,
  computeXpGain,
  adaptPalier,
  timerForNiveau,
  initialPalier,
  BASE_XP_PER_ANSWER,
  SPEED_BONUS,
  COMBO_BONUS,
  BOSS_VICTORY_XP,
} from "@/lib/game/engine";

describe("xpThreshold", () => {
  it("niveau 1 exige 100 XP", () => {
    expect(xpThreshold(1)).toBe(100);
  });

  it("niveau 10 exige 10 000 XP (formule 100 × n²)", () => {
    expect(xpThreshold(10)).toBe(10_000);
  });

  it("niveau 5 exige 2 500 XP", () => {
    expect(xpThreshold(5)).toBe(2_500);
  });

  it("croît de manière quadratique", () => {
    expect(xpThreshold(20)).toBe(100 * 20 * 20);
  });
});

describe("niveauFromTotalXp", () => {
  it("0 XP → niveau 1, xpInLevel 0", () => {
    expect(niveauFromTotalXp(0)).toEqual({ niveau: 1, xpInLevel: 0 });
  });

  it("exactement le seuil de niveau 1 (100 XP) → niveau 2, xpInLevel 0", () => {
    const { niveau, xpInLevel } = niveauFromTotalXp(100);
    expect(niveau).toBe(2);
    expect(xpInLevel).toBe(0);
  });

  it("300 XP → niveau 2 avec 200 XP dans le niveau courant", () => {
    // 100 pour passer niveau 1, 200 restants sur seuil niveau 2 (400)
    const { niveau, xpInLevel } = niveauFromTotalXp(300);
    expect(niveau).toBe(2);
    expect(xpInLevel).toBe(200);
  });

  it("100 + 400 = 500 XP → niveau 3, xpInLevel 0", () => {
    const { niveau, xpInLevel } = niveauFromTotalXp(500);
    expect(niveau).toBe(3);
    expect(xpInLevel).toBe(0);
  });
});

describe("computeXpGain", () => {
  it("mauvaise réponse → 0 XP", () => {
    expect(
      computeXpGain({ correct: false, timeRemaining: 20, combo: 5, bossDefeated: false })
    ).toBe(0);
  });

  it("réponse correcte de base → BASE_XP (25)", () => {
    expect(
      computeXpGain({ correct: true, timeRemaining: 5, combo: 0, bossDefeated: false })
    ).toBe(BASE_XP_PER_ANSWER);
  });

  it("réponse correcte rapide (>15s) → BASE_XP + SPEED_BONUS (35)", () => {
    expect(
      computeXpGain({ correct: true, timeRemaining: 16, combo: 0, bossDefeated: false })
    ).toBe(BASE_XP_PER_ANSWER + SPEED_BONUS);
  });

  it("réponse correcte avec combo ≥ 3 → BASE_XP + COMBO_BONUS (75)", () => {
    expect(
      computeXpGain({ correct: true, timeRemaining: 5, combo: 3, bossDefeated: false })
    ).toBe(BASE_XP_PER_ANSWER + COMBO_BONUS);
  });

  it("tous les bonus actifs → 235 XP", () => {
    // 25 (base) + 10 (speed) + 50 (combo) + 150 (boss) = 235
    expect(
      computeXpGain({ correct: true, timeRemaining: 20, combo: 3, bossDefeated: true })
    ).toBe(BASE_XP_PER_ANSWER + SPEED_BONUS + COMBO_BONUS + BOSS_VICTORY_XP);
  });

  it("seuil de vitesse exact : 15s restantes → pas de bonus speed", () => {
    expect(
      computeXpGain({ correct: true, timeRemaining: 15, combo: 0, bossDefeated: false })
    ).toBe(BASE_XP_PER_ANSWER);
  });
});

describe("adaptPalier", () => {
  it("streak ≥ 3 augmente le palier de 1", () => {
    expect(adaptPalier(2, 3, 0)).toBe(3);
    expect(adaptPalier(1, 5, 0)).toBe(2);
  });

  it("le palier ne dépasse pas 4", () => {
    expect(adaptPalier(4, 3, 0)).toBe(4);
  });

  it("errorStreak ≥ 2 diminue le palier de 1", () => {
    expect(adaptPalier(3, 0, 2)).toBe(2);
    expect(adaptPalier(4, 0, 3)).toBe(3);
  });

  it("le palier ne descend pas sous 1", () => {
    expect(adaptPalier(1, 0, 2)).toBe(1);
  });

  it("ni streak ni errorStreak → palier inchangé", () => {
    expect(adaptPalier(2, 1, 1)).toBe(2);
  });
});

describe("timerForNiveau", () => {
  it("niveau ≤ 3 → 30 secondes", () => {
    expect(timerForNiveau(1)).toBe(30);
    expect(timerForNiveau(3)).toBe(30);
  });

  it("niveau ≤ 6 → 20 secondes", () => {
    expect(timerForNiveau(4)).toBe(20);
    expect(timerForNiveau(6)).toBe(20);
  });

  it("niveau ≤ 9 → 15 secondes", () => {
    expect(timerForNiveau(7)).toBe(15);
    expect(timerForNiveau(9)).toBe(15);
  });

  it("niveau > 9 → 10 secondes", () => {
    expect(timerForNiveau(10)).toBe(10);
    expect(timerForNiveau(25)).toBe(10);
  });
});

describe("initialPalier", () => {
  it("niveau ≤ 3 → palier 1", () => expect(initialPalier(1)).toBe(1));
  it("niveau ≤ 6 → palier 2", () => expect(initialPalier(5)).toBe(2));
  it("niveau ≤ 9 → palier 3", () => expect(initialPalier(8)).toBe(3));
  it("niveau > 9 → palier 4", () => expect(initialPalier(10)).toBe(4));
});
