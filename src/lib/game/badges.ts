import { prisma } from "@/lib/prisma";

export interface GameStats {
  correctAnswers: number;
  totalQuestions: number;
  streak: number;
  bossDefeated: boolean;
  niveau: number;
  combo: number;
}

// Keywords matched against badge.nom (lowercase) to determine the condition
const CONDITIONS: Array<{ keywords: string[]; check: (s: GameStats) => boolean }> = [
  { keywords: ["first", "premier", "début", "départ"],  check: (s) => s.totalQuestions >= 1 },
  { keywords: ["boss", "slayer", "vainqueur"],           check: (s) => s.bossDefeated },
  { keywords: ["combo", "flame", "feu", "enchaîne"],    check: (s) => s.combo >= 3 },
  { keywords: ["parfait", "perfect", "mistake", "faute"], check: (s) => s.totalQuestions >= 5 && s.correctAnswers === s.totalQuestions },
  { keywords: ["scholar", "savoir", "science", "atom"], check: (s) => s.correctAnswers >= 10 },
  { keywords: ["master", "maître", "crown", "champion"], check: (s) => s.niveau >= 5 },
  { keywords: ["streak", "série"],                       check: (s) => s.streak >= 5 },
  { keywords: ["alchimie", "alchemist", "potion"],       check: (s) => s.correctAnswers >= 3 },
];

export async function checkAndUnlockBadges(
  userId: string,
  stats: GameStats,
): Promise<string[]> {
  const [allBadges, owned] = await Promise.all([
    prisma.badge.findMany({ select: { id: true, nom: true } }),
    prisma.utilisateurBadge.findMany({
      where: { utilisateurId: userId },
      select: { badgeId: true },
    }),
  ]);

  const ownedIds = new Set(owned.map((r) => r.badgeId));
  const unlocked: string[] = [];

  for (const badge of allBadges) {
    if (ownedIds.has(badge.id)) continue;
    const nomLower = badge.nom.toLowerCase();
    const cond = CONDITIONS.find((c) => c.keywords.some((k) => nomLower.includes(k)));
    if (cond?.check(stats)) {
      await prisma.utilisateurBadge.create({
        data: { utilisateurId: userId, badgeId: badge.id },
      });
      unlocked.push(badge.nom);
    }
  }

  return unlocked;
}
