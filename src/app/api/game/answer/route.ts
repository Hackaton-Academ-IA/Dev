import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AnswerRequestSchema, type AnswerResponse } from "@/lib/game/types";
import { verifyToken, generateQuestion } from "@/lib/game/generator";
import {
  computeXpGain,
  adaptPalier,
  difficulteFromPalier,
  getBossName,
  MATIERES,
  niveauFromTotalXp,
  xpThreshold,
} from "@/lib/game/engine";
import { DUNGEON_COUNT } from "@/lib/game/constants";
import { checkAndUnlockBadges } from "@/lib/game/badges";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

function computeDailyStreak(currentStreak: number, lastPlayedAt: Date | null): number {
  if (!lastPlayedAt) return 1;
  const now = new Date();
  const msSince = now.getTime() - lastPlayedAt.getTime();
  const hoursSince = msSince / (1000 * 60 * 60);
  if (hoursSince < 24) return currentStreak; // already played today
  if (hoursSince < 48) return currentStreak + 1; // yesterday — extend streak
  return 1; // gap too large — reset
}

// GET — current XP state for the HUD progress bar
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const user = await prisma.utilisateur.findUnique({
      where: { id: session.user.id },
      select: { xp: true, niveau: true },
    });
    if (!user) return NextResponse.json({ error: "user_not_found" }, { status: 404 });

    const { xpInLevel } = niveauFromTotalXp(user.xp);
    return NextResponse.json({
      xp: xpInLevel,
      niveau: user.niveau,
      xpSeuil: xpThreshold(user.niveau),
    });
  } catch (err) {
    logger.error("GAME_ANSWER_ERROR", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const rl = checkRateLimit(session.user.id, 10, 10_000);
  if (!rl.allowed) {
    logger.warn("RATE_LIMIT_HIT", `userId=${session.user.id} route=game/answer`);
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);

  // ── Simple path: quizz/page.tsx sends { xpGained, donjonId? } ───────────
  if (body && typeof body.xpGained === "number" && !("answerToken" in body)) {
    const xpGain = Math.max(0, Math.min(body.xpGained, 2500)); // cap against abuse
    const userId = session.user.id;

    const user = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: { xp: true, niveau: true, streak: true, lastPlayedAt: true },
    });
    if (!user) return NextResponse.json({ error: "user_not_found" }, { status: 404 });

    const newTotalXp = user.xp + xpGain;
    const { niveau: newNiveau, xpInLevel } = niveauFromTotalXp(newTotalXp);
    const leveledUp = newNiveau > user.niveau;

    const newStreak = computeDailyStreak(user.streak, user.lastPlayedAt);

    await prisma.utilisateur.update({
      where: { id: userId },
      data: { xp: newTotalXp, niveau: newNiveau, streak: newStreak, lastPlayedAt: new Date() },
    });

    // Optional dunjon progression — mark COMPLETED and unlock next
    const donjonId = typeof body.donjonId === "number" ? body.donjonId : null;
    if (donjonId !== null && donjonId >= 1 && donjonId <= DUNGEON_COUNT) {
      await prisma.donjonProgression.upsert({
        where: { userId_donjonId: { userId, donjonId } },
        create: { userId, donjonId, status: "COMPLETED" },
        update: { status: "COMPLETED" },
      });
      logger.info("DONJON_COMPLETED", `userId=${userId} donjonId=${donjonId}`);
      // Unlock next dunjon without downgrading if already COMPLETED
      if (donjonId < DUNGEON_COUNT) {
        await prisma.donjonProgression.upsert({
          where: { userId_donjonId: { userId, donjonId: donjonId + 1 } },
          create: { userId, donjonId: donjonId + 1, status: "UNLOCKED" },
          update: {}, // no-op: never downgrade COMPLETED → UNLOCKED
        });
      }
    }

    return NextResponse.json({
      xp: xpInLevel,
      niveau: newNiveau,
      xpSeuil: xpThreshold(newNiveau),
      leveledUp,
      streak: newStreak,
    });
  }
  // ─────────────────────────────────────────────────────────────────────────

  // Full game-engine path — body was already parsed above
  const parsed = AnswerRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const data = parsed.data;
  const userId = session.user.id;

  // 1. Verify answer via HMAC token — server is the only source of truth
  const correctIndex = verifyToken(data.answerToken);
  if (correctIndex === null) return NextResponse.json({ error: "invalid_token" }, { status: 400 });
  const correct = data.chosenIndex === correctIndex;

  // 2. Fetch authoritative player state from DB
  const user = await prisma.utilisateur.findUnique({
    where: { id: userId },
    select: { xp: true, niveau: true, hp: true, lastDailyAt: true, dailyQuestsDone: true, streak: true, lastPlayedAt: true },
  });
  if (!user) return NextResponse.json({ error: "user_not_found" }, { status: 404 });

  // 3. Boss damage
  let newBossHp: number | null = data.bossHp;
  let bossDefeated = false;

  if (data.isBossFight && newBossHp !== null) {
    const damage = correct ? (data.combo >= 3 ? 2 : 1) : 0;
    newBossHp = Math.max(0, newBossHp - damage);
    bossDefeated = newBossHp === 0;
    if (bossDefeated) logger.info("BOSS_DEFEATED", `userId=${userId} bossHp was ${data.bossHp}`);
  }

  // 4. Streaks & combo
  const newStreak = correct ? data.streak + 1 : 0;
  const newErrorStreak = correct ? 0 : data.errorStreak + 1;
  const newCombo = correct ? data.combo + 1 : 0;

  // 5. XP & niveau (server-authoritative from DB)
  const xpGain = computeXpGain({
    correct,
    timeRemaining: data.timeRemaining,
    combo: newCombo,
    bossDefeated,
  });

  // 5b. Daily quest tracking — reset at calendar midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDailyDate = user.lastDailyAt ? new Date(user.lastDailyAt) : null;
  if (lastDailyDate) lastDailyDate.setHours(0, 0, 0, 0);
  const isNewDay = !lastDailyDate || lastDailyDate.getTime() < today.getTime();
  const prevDailyDone = isNewDay ? 0 : user.dailyQuestsDone;
  const newDailyQuestsDone = Math.min(5, prevDailyDone + 1);
  const dailyCompleted = newDailyQuestsDone === 5 && prevDailyDone < 5;
  if (dailyCompleted) logger.info("DAILY_QUEST_COMPLETED", `userId=${userId} +200 XP`);
  const dailyBonusXp = dailyCompleted ? 200 : 0;

  const newXp = user.xp + xpGain + dailyBonusXp;
  const { niveau: newNiveau } = niveauFromTotalXp(newXp);
  const leveledUp = newNiveau > user.niveau;

  // 6. Player HP
  const newHp = Math.max(0, correct ? user.hp : user.hp - 1);
  const gameOver = newHp === 0;

  // 7. Adaptive difficulty
  const newPalier = adaptPalier(data.palier, newStreak, newErrorStreak);

  // 8. Persist (transactional — XP + HP + pièces always saved together)
  const newTotalQ = data.totalQuestions + 1;
  const newCorrect = data.correctAnswers + (correct ? 1 : 0);
  // Reward: 5 pièces per correct answer, +25 bonus on boss defeat
  const piecesGain = correct ? (bossDefeated ? 30 : 5) : 0;
  const newDailyStreak = computeDailyStreak(user.streak, user.lastPlayedAt);

  await prisma.$transaction(async (tx) => {
    await tx.utilisateur.update({
      where: { id: userId },
      data: {
        xp: newXp,
        niveau: newNiveau,
        hp: newHp,
        dailyQuestsDone: newDailyQuestsDone,
        lastDailyAt: new Date(),
        streak: newDailyStreak,
        lastPlayedAt: new Date(),
        ...(piecesGain > 0 && { pieces: { increment: piecesGain } }),
      },
    });

    if (gameOver) {
      await tx.historiqueQuiz.create({
        data: {
          utilisateurId: userId,
          score: newCorrect,
          nbQuestions: newTotalQ,
          difficulte: difficulteFromPalier(data.palier),
        },
      });
    }
  });

  // 9. Badge check (non-critical — failure does not block response)
  const unlockedBadges: string[] = [];
  if (!gameOver) {
    try {
      const badges = await checkAndUnlockBadges(userId, {
        correctAnswers: newCorrect,
        totalQuestions: newTotalQ,
        streak: newStreak,
        bossDefeated,
        niveau: newNiveau,
        combo: newCombo,
      });
      unlockedBadges.push(...badges);
    } catch { /* non-blocking */ }
  }

  // 10. Determine next question context
  let nextIsBossFight = false;
  let nextQIndex = data.questionIndex;

  if (data.isBossFight) {
    if (bossDefeated) {
      nextQIndex = 0;
      nextIsBossFight = false;
    } else {
      nextIsBossFight = true; // still fighting
    }
  } else {
    nextQIndex = data.questionIndex + 1;
    if (nextQIndex >= 5) {
      nextIsBossFight = true;
    }
  }

  // 11. Generate next question
  let nextQuestion = null;
  let nextAnswerToken = null;

  if (!gameOver) {
    const nextMatiere = MATIERES[nextQIndex % MATIERES.length];
    const nextDifficulte = nextIsBossFight
      ? difficulteFromPalier(Math.max(2, newPalier)) // boss fights are always at least "confirme"
      : difficulteFromPalier(newPalier);

    const generated = await generateQuestion(nextMatiere, nextDifficulte);
    nextQuestion = generated.question;
    nextAnswerToken = generated.token;
  }

  const response: AnswerResponse = {
    correct,
    correctIndex,
    xpGain: xpGain + dailyBonusXp,
    newXp,
    newNiveau,
    leveledUp,
    newHp,
    newBossHp: data.isBossFight ? newBossHp : null,
    bossDefeated,
    nextIsBossFight,
    gameOver,
    unlockedBadges,
    nextQuestion,
    nextAnswerToken,
    newPalier,
    dailyQuestsDone: newDailyQuestsDone,
    dailyCompleted,
  };

  return NextResponse.json(response);
}
