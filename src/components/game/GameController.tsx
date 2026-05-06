"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import type { Question, AnswerResponse } from "@/lib/game/types";
import {
  timerForNiveau,
  getBossName,
  MATIERES,
  initialPalier,
  xpThreshold,
  niveauFromTotalXp,
} from "@/lib/game/engine";
import TimerBar from "./Visuals/TimerBar";
import BossBar from "./Visuals/BossBar";
import ComboFlame from "./Visuals/ComboFlame";
import BadgePopup from "./Overlays/BadgePopup";
import GameOver from "./Overlays/GameOver";
import QuestionCard from "./QuestionCard";
import ExperienceBar from "./ExperienceBar";

type Status = "idle" | "loading" | "playing" | "explaining" | "boss_intro" | "game_over" | "level_up";

interface GameData {
  status: Status;
  question: Question | null;
  answerToken: string | null;
  questionIndex: number;
  isBossFight: boolean;
  streak: number;
  errorStreak: number;
  combo: number;
  playerHp: number;
  bossHp: number | null;
  bossName: string;
  xp: number;
  niveau: number;
  palier: number;
  totalQuestions: number;
  correctAnswers: number;
  pendingBadges: string[];
  lastAnswerCorrect: boolean | null;
  leveledUp: boolean;
  xpGainedTotal: number;
  dailyQuestsDone: number;
}

interface StartResponse {
  question: Question;
  answerToken: string;
  playerState: { niveau: number; xp: number; hp: number; pieces: number; dailyQuestsDone: number };
  palier: number;
  timeLimit: number;
}

const INIT: GameData = {
  status: "idle",
  question: null,
  answerToken: null,
  questionIndex: 0,
  isBossFight: false,
  streak: 0,
  errorStreak: 0,
  combo: 0,
  playerHp: 3,
  bossHp: null,
  bossName: "",
  xp: 0,
  niveau: 1,
  palier: 1,
  totalQuestions: 0,
  correctAnswers: 0,
  pendingBadges: [],
  lastAnswerCorrect: null,
  leveledUp: false,
  xpGainedTotal: 0,
  dailyQuestsDone: 0,
};

const HP_MAX = 5;
const BOSS_HP_MAX = 3;

export default function GameController() {
  const [game, setGame] = useState<GameData>(INIT);
  const [timeLimit, setTimeLimit] = useState(30);
  const [displayTimer, setDisplayTimer] = useState(30);
  const [lastChosenIndex, setLastChosenIndex] = useState<number | null>(null);
  const [revealedCorrect, setRevealedCorrect] = useState<number | null>(null);
  const [lastXpGain, setLastXpGain] = useState(0);

  // Refs to avoid stale closures in async callbacks & intervals
  const gameRef = useRef(game);
  gameRef.current = game;
  const timerRef = useRef(30);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answerInFlight = useRef(false);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback((limit: number, onExpire: () => void) => {
    stopTimer();
    timerRef.current = limit;
    setDisplayTimer(limit);
    timerIntervalRef.current = setInterval(() => {
      timerRef.current -= 1;
      setDisplayTimer(timerRef.current);
      if (timerRef.current <= 0) {
        stopTimer();
        onExpire();
      }
    }, 1000);
  }, [stopTimer]);

  // Cleanup on unmount
  useEffect(() => () => stopTimer(), [stopTimer]);

  const submitAnswer = useCallback(async (chosenIndex: number) => {
    if (answerInFlight.current) return;
    answerInFlight.current = true;
    stopTimer();

    const g = gameRef.current;
    if (!g.answerToken || g.status !== "playing") {
      answerInFlight.current = false;
      return;
    }

    setLastChosenIndex(chosenIndex);
    setGame((prev) => ({ ...prev, status: "explaining" }));

    const body = {
      chosenIndex,
      timeRemaining: timerRef.current,
      answerToken: g.answerToken,
      matiere: MATIERES[g.questionIndex % MATIERES.length],
      palier: g.palier,
      questionIndex: g.questionIndex,
      isBossFight: g.isBossFight,
      streak: g.streak,
      errorStreak: g.errorStreak,
      combo: g.combo,
      bossHp: g.bossHp,
      totalQuestions: g.totalQuestions,
      correctAnswers: g.correctAnswers,
    };

    try {
      const res = await fetch("/api/game/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as AnswerResponse & { correctIndex: number };

      setRevealedCorrect(data.correctIndex);
      setLastXpGain(data.xpGain);

      const newBossHp = g.isBossFight
        ? (data.newBossHp ?? g.bossHp)
        : null;

      setGame((prev) => ({
        ...prev,
        status: data.gameOver ? "game_over" : data.leveledUp ? "level_up" : "explaining",
        xp: data.newXp,
        niveau: data.newNiveau,
        playerHp: data.newHp,
        bossHp: newBossHp,
        streak: data.correct ? prev.streak + 1 : 0,
        errorStreak: data.correct ? 0 : prev.errorStreak + 1,
        combo: data.correct ? prev.combo + 1 : 0,
        totalQuestions: prev.totalQuestions + 1,
        correctAnswers: prev.correctAnswers + (data.correct ? 1 : 0),
        palier: data.newPalier,
        lastAnswerCorrect: data.correct,
        pendingBadges: [
          ...prev.pendingBadges,
          ...data.unlockedBadges,
          ...(data.dailyCompleted ? ["★ DÉFI QUOTIDIEN ACCOMPLI ! +200 XP"] : []),
        ],
        leveledUp: data.leveledUp,
        xpGainedTotal: prev.xpGainedTotal + data.xpGain,
        dailyQuestsDone: data.dailyQuestsDone,
      }));

      if (!data.gameOver) {
        // After explaining delay, advance to next state
        const EXPLAIN_DELAY = data.leveledUp ? 4000 : 2500;
        setTimeout(() => {
          answerInFlight.current = false;

          if (!data.nextQuestion || !data.nextAnswerToken) return;

          if (data.nextIsBossFight && !g.isBossFight) {
            // Show boss intro before boss fight
            const cycle = Math.floor((gameRef.current.questionIndex + 1) / 5);
            const bossName = getBossName(cycle);
            setGame((prev) => ({
              ...prev,
              status: "boss_intro",
              bossHp: BOSS_HP_MAX,
              bossName,
              questionIndex: 5,
              isBossFight: true,
            }));

            setTimeout(() => {
              setGame((prev) => ({
                ...prev,
                status: "playing",
                question: data.nextQuestion,
                answerToken: data.nextAnswerToken,
              }));
              setLastChosenIndex(null);
              setRevealedCorrect(null);
              const limit = timerForNiveau(gameRef.current.niveau);
              setTimeLimit(limit);
              startTimer(limit, () => submitAnswer(-1));
            }, 3000);
          } else {
            // Regular next question
            const nextIndex = data.bossDefeated ? 0 : g.isBossFight ? g.questionIndex : g.questionIndex + 1;
            setGame((prev) => ({
              ...prev,
              status: "playing",
              question: data.nextQuestion,
              answerToken: data.nextAnswerToken,
              questionIndex: nextIndex,
              isBossFight: data.nextIsBossFight,
              bossHp: data.bossDefeated ? null : prev.bossHp,
              bossName: data.bossDefeated ? "" : prev.bossName,
              leveledUp: false,
            }));
            setLastChosenIndex(null);
            setRevealedCorrect(null);
            const limit = timerForNiveau(gameRef.current.niveau);
            setTimeLimit(limit);
            startTimer(limit, () => submitAnswer(-1));
          }
        }, EXPLAIN_DELAY);
      } else {
        answerInFlight.current = false;
      }
    } catch {
      answerInFlight.current = false;
      setGame((prev) => ({ ...prev, status: "playing" }));
      const limit = timerForNiveau(gameRef.current.niveau);
      startTimer(limit, () => submitAnswer(-1));
    }
  }, [stopTimer, startTimer]); // eslint-disable-line react-hooks/exhaustive-deps

  const startGame = useCallback(async () => {
    setGame((prev) => ({ ...prev, status: "loading" }));
    stopTimer();
    answerInFlight.current = false;

    try {
      const res = await fetch("/api/game/start", { method: "POST" });
      if (!res.ok) { setGame((prev) => ({ ...prev, status: "idle" })); return; }

      const data: StartResponse = await res.json();
      const palier = initialPalier(data.playerState.niveau);

      setGame({
        ...INIT,
        status: "playing",
        question: data.question,
        answerToken: data.answerToken,
        xp: data.playerState.xp,
        niveau: data.playerState.niveau,
        playerHp: Math.max(1, data.playerState.hp), // at least 1 HP to start
        palier,
        dailyQuestsDone: data.playerState.dailyQuestsDone ?? 0,
      });
      setLastChosenIndex(null);
      setRevealedCorrect(null);
      setTimeLimit(data.timeLimit);
      startTimer(data.timeLimit, () => submitAnswer(-1));
    } catch {
      setGame((prev) => ({ ...prev, status: "idle" }));
    }
  }, [stopTimer, startTimer, submitAnswer]);

  const handleAnswer = useCallback((i: number) => {
    // -1 = timer expired → forced wrong answer (use index 4 = out of range, guaranteed wrong)
    submitAnswer(i >= 0 ? i : 99);
  }, [submitAnswer]);

  const dismissBadge = useCallback((name: string) => {
    setGame((prev) => ({
      ...prev,
      pendingBadges: prev.pendingBadges.filter((b) => b !== name),
    }));
  }, []);

  const { status, question, playerHp, bossHp, bossName, niveau, xp, combo, streak, isBossFight, xpGainedTotal, totalQuestions, correctAnswers, pendingBadges, lastAnswerCorrect, leveledUp, dailyQuestsDone } = game;
  const { xpInLevel } = niveauFromTotalXp(xp);
  const xpMax = xpThreshold(niveau);

  /* ── Idle screen ── */
  if (status === "idle") {
    return (
      <div className="panel panel-violet space-y-0">
        <div className="titlebar titlebar-violet flex items-center justify-between">
          <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
            ▶ ACADEM&apos;IA QUIZ
          </div>
          <Link href="/dashboard" className="font-mono-pixel text-[14px] text-white/60 hover:text-white">
            ← RETOUR
          </Link>
        </div>
        <div className="p-8 sm:p-12 flex flex-col items-center gap-6 text-center">
          <div className="font-pixel text-[20px] sm:text-[28px] glow-violet" style={{ textShadow: "4px 4px 0 #000, 0 0 12px var(--neon-violet)" }}>
            TOUR INFINIE
          </div>
          <div className="font-mono-pixel text-[16px] text-[var(--ink-dim)] max-w-xs leading-snug">
            Réponds aux questions, bats les Boss, gagne de l&apos;XP et des badges.
          </div>
          <div className="flex flex-col gap-2 font-mono-pixel text-[14px] text-[var(--ink-dim)]">
            {[
              "⚔  Boss toutes les 5 questions",
              "🔥  Combo x3 → +20 XP bonus",
              "⚡  Rapidité → +5 XP bonus",
              "💀  5 HP — Game Over si 0",
            ].map((line) => <div key={line}>{line}</div>)}
          </div>
          <button className="arcade arcade-emerald text-[11px] mt-2" onClick={startGame}>
            ▶ COMMENCER LA PARTIE
          </button>
        </div>
      </div>
    );
  }

  /* ── Boss intro ── */
  if (status === "boss_intro") {
    return (
      <div className="panel panel-danger" style={{ boxShadow: "0 0 32px var(--danger)" }}>
        <div className="titlebar titlebar-danger font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
          ⚠ ALERTE — COMBAT DE BOSS
        </div>
        <div className="p-10 flex flex-col items-center gap-6 text-center">
          <div className="font-pixel text-[28px] sm:text-[36px] text-[var(--danger)]"
               style={{ textShadow: "4px 4px 0 #000, 0 0 16px var(--danger)", animation: "neonPulse 0.8s ease-in-out infinite" }}>
            ☠
          </div>
          <div className="font-pixel text-[14px] sm:text-[18px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
            {bossName}
          </div>
          <div className="font-mono-pixel text-[16px] text-[var(--ink-dim)]">
            Un Boss surgit ! Inflige-lui 3 dégâts pour le vaincre.
          </div>
          <div className="font-pixel text-[10px] text-[var(--gold)]">PRÉPARATION EN COURS…</div>
        </div>
      </div>
    );
  }

  /* ── Game Over ── */
  if (status === "game_over") {
    return (
      <>
        <GameOver
          correct={correctAnswers}
          total={totalQuestions}
          xpGained={xpGainedTotal}
          niveau={niveau}
          onRestart={startGame}
        />
        {/* Keep page visible behind overlay */}
        <div className="panel panel-violet p-8 opacity-20 pointer-events-none">
          <div className="font-pixel text-[24px] text-center glow-violet">GAME OVER</div>
        </div>
      </>
    );
  }

  /* ── Active game ── */
  const cardStatus = status === "explaining" ? "explaining" : status === "loading" ? "loading" : "playing";

  return (
    <div className="space-y-4">
      {/* XP bar — always visible during active game */}
      <ExperienceBar xp={xp} lastXpGain={lastXpGain} />
      {/* Header bar */}
      <div className="panel panel-violet">
        <div className="titlebar titlebar-violet flex items-center justify-between">
          <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
            {isBossFight ? "☠ BOSS FIGHT" : `◆ QUESTION ${(game.questionIndex % 5) + 1}/5`}
          </div>
          <Link href="/dashboard" className="font-mono-pixel text-[14px] text-white/60 hover:text-white">
            ← QUITTER
          </Link>
        </div>
        <div className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* HP */}
          <div>
            <div className="font-pixel text-[10px] text-[var(--danger)] mb-1">HP</div>
            <div className="hp-row">
              {Array.from({ length: HP_MAX }).map((_, i) => (
                <div key={i} className={`hp ${i < playerHp ? "" : "empty"}`} />
              ))}
            </div>
          </div>
          {/* XP */}
          <div>
            <div className="font-pixel text-[10px] text-[var(--emerald)] mb-1">XP — LV {niveau}</div>
            <div className="lifebar">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={`seg ${i < Math.round((xpInLevel / xpMax) * 10) ? "" : "empty"}`} />
              ))}
            </div>
          </div>
          {/* Streak */}
          <div className="flex items-end gap-2">
            <ComboFlame combo={combo} />
            {combo < 2 && (
              <div className="font-mono-pixel text-[14px] text-[var(--ink-dim)]">
                STREAK <span className="text-[var(--emerald)]">×{streak}</span>
              </div>
            )}
          </div>
          {/* Score + Daily Quest */}
          <div className="text-right">
            <div className="font-mono-pixel text-[14px] text-[var(--ink-dim)]">
              {correctAnswers}/{totalQuestions} ✔
            </div>
            <div className="font-pixel text-[8px] mt-1"
                 style={{ color: dailyQuestsDone >= 5 ? "var(--emerald)" : "var(--gold)" }}>
              {dailyQuestsDone >= 5 ? "✔ DÉFI ACCOMPLI" : `DÉFI QUOTIDIEN ${dailyQuestsDone}/5`}
            </div>
          </div>
        </div>
      </div>

      {/* Boss bar */}
      {isBossFight && bossHp !== null && (
        <BossBar name={bossName} hp={bossHp} maxHp={BOSS_HP_MAX} />
      )}

      {/* Timer */}
      {(status === "playing") && (
        <TimerBar remaining={displayTimer} total={timeLimit} />
      )}

      {/* Level up banner */}
      {leveledUp && status === "level_up" && (
        <div
          className="panel panel-gold p-4 text-center"
          style={{ boxShadow: "0 0 24px var(--gold), 0 8px 0 #000" }}
        >
          <div className="font-pixel text-[14px] sm:text-[18px] text-[#241a00]"
               style={{ textShadow: "2px 2px 0 #6e5300" }}>
            ⬆ LEVEL UP ! LV {niveau}
          </div>
        </div>
      )}

      {/* Question card */}
      <section className="panel panel-violet">
        <div className="titlebar titlebar-violet flex items-center justify-between">
          <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
            ▶ DÉFI DE L&apos;IA
          </div>
          <div className="font-mono-pixel text-[14px] text-white/80 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-[var(--emerald)]" style={{ boxShadow: "0 0 6px var(--emerald)" }} />
            IA · ONLINE
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <QuestionCard
            status={cardStatus}
            question={question}
            onAnswer={handleAnswer}
            lastAnswerCorrect={lastAnswerCorrect}
            lastChosenIndex={lastChosenIndex}
            correctIndex={revealedCorrect}
            disabled={answerInFlight.current}
          />
        </div>
      </section>

      {/* Badge popup queue */}
      <BadgePopup queue={pendingBadges} onDismiss={dismissBadge} />
    </div>
  );
}
