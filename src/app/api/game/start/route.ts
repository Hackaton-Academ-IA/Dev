import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateQuestion } from "@/lib/game/generator";
import {
  initialPalier,
  difficulteFromPalier,
  MATIERES,
  timerForNiveau,
} from "@/lib/game/engine";

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const user = await prisma.utilisateur.findUnique({
    where: { id: session.user.id },
    select: { niveau: true, xp: true, hp: true, pieces: true, lastDailyAt: true, dailyQuestsDone: true },
  });

  const niveau = user?.niveau ?? 1;
  const palier = initialPalier(niveau);

  // Restore HP when player comes back after a Game Over (HP ≤ 0 in DB)
  let startHp = user?.hp ?? 5;
  if (startHp <= 0) {
    startHp = 3;
    await prisma.utilisateur.update({ where: { id: session.user.id }, data: { hp: startHp } });
  }

  const { question, token } = await generateQuestion(MATIERES[0], difficulteFromPalier(palier));

  // Effective daily count — reset at calendar midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDailyDate = user?.lastDailyAt ? new Date(user.lastDailyAt) : null;
  if (lastDailyDate) lastDailyDate.setHours(0, 0, 0, 0);
  const isNewDay = !lastDailyDate || lastDailyDate.getTime() < today.getTime();
  const dailyQuestsDone = isNewDay ? 0 : (user?.dailyQuestsDone ?? 0);

  return NextResponse.json({
    question,
    answerToken: token,
    playerState: {
      niveau,
      xp: user?.xp ?? 0,
      hp: startHp,
      pieces: user?.pieces ?? 0,
      dailyQuestsDone,
    },
    palier,
    timeLimit: timerForNiveau(niveau),
  });
}
