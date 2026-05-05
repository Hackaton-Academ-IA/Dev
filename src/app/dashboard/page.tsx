import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  let session;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (err) {
    logger.error("SESSION_FETCH_FAILED", err instanceof Error ? err.message : String(err));
    redirect("/login");
  }

  if (!session) {
    logger.warn("SESSION_MISSING", "Accès dashboard sans session — redirection login");
    redirect("/login");
  }

  logger.info("DASHBOARD_ACCESS", "Accès dashboard autorisé", session.user.id);

  const [utilisateur, allBadges] = await Promise.all([
    prisma.utilisateur.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        niveau: true,
        xp: true,
        hp: true,
        pieces: true,
        lastDailyAt: true,
        dailyQuestsDone: true,
        role: true,
        badges: {
          select: {
            badge: { select: { id: true } },
          },
        },
      },
    }),
    prisma.badge.findMany({
      select: { id: true, nom: true, icone: true, xp_requis: true },
      orderBy: { xp_requis: "asc" },
    }),
  ]);

  const ownedIds = new Set((utilisateur?.badges ?? []).map((ub) => ub.badge.id));

  const badges = allBadges.map((b) => ({
    id: b.id,
    nom: b.nom,
    icone: b.icone,
    xp_requis: b.xp_requis,
    obtained: ownedIds.has(b.id),
  }));

  // Effective daily count — reset at calendar midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDailyDate = utilisateur?.lastDailyAt ? new Date(utilisateur.lastDailyAt) : null;
  if (lastDailyDate) lastDailyDate.setHours(0, 0, 0, 0);
  const isNewDay = !lastDailyDate || lastDailyDate.getTime() < today.getTime();
  const dailyQuestsDone = isNewDay ? 0 : (utilisateur?.dailyQuestsDone ?? 0);

  const playerName = utilisateur?.name ?? session.user.name ?? session.user.email ?? "SCHOLAR";
  const role = (session.user as { role?: string }).role;

  return (
    <div className="scanlines crt-flicker min-h-screen">
      <DashboardClient
        playerName={playerName}
        isAdmin={role === "admin"}
        niveau={utilisateur?.niveau ?? 1}
        xp={utilisateur?.xp ?? 0}
        hp={utilisateur?.hp ?? 5}
        pieces={utilisateur?.pieces ?? 0}
        lastDailyAt={utilisateur?.lastDailyAt?.toISOString() ?? null}
        dailyQuestsDone={dailyQuestsDone}
        badges={badges}
      />
    </div>
  );
}
