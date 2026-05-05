import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LeaderboardClient from "./LeaderboardClient";
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: "ACADEM'IA — HALL OF FAME",
  description: "Le classement des héros de la Tour Infinie d'Academ'IA.",
};

export type LeaderboardPlayer = {
  rank: number;
  pseudo: string;
  niveau: number;
  xp: number;
  xpMax: number;
  role: "user" | "admin";
};

export default async function LeaderboardPage() {
  const raw = await prisma.utilisateur.findMany({
    orderBy: [{ niveau: "desc" }, { xp: "desc" }],
    take: 50,
    select: { id: true, name: true, niveau: true, xp: true, role: true },
  });

  const players: LeaderboardPlayer[] = raw.map((u, i) => ({
    rank: i + 1,
    pseudo: u.name ?? "Aventurier Anonyme",
    niveau: u.niveau,
    xp: u.xp,
    xpMax: 10000,
    role: u.role as "user" | "admin",
  }));

  let currentPlayer: LeaderboardPlayer | null = null;

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.id) {
      const uid = session.user.id;
      const inList = raw.findIndex((u) => u.id === uid);

      if (inList >= 0) {
        currentPlayer = players[inList];
      } else {
        const me = await prisma.utilisateur.findUnique({
          where: { id: uid },
          select: { name: true, niveau: true, xp: true, role: true },
        });
        if (me) {
          const above = await prisma.utilisateur.count({
            where: {
              OR: [
                { niveau: { gt: me.niveau } },
                { AND: [{ niveau: me.niveau }, { xp: { gt: me.xp } }] },
              ],
            },
          });
          currentPlayer = {
            rank: above + 1,
            pseudo: me.name ?? "Aventurier Anonyme",
            niveau: me.niveau,
            xp: me.xp,
            xpMax: 10000,
            role: me.role as "user" | "admin",
          };
        }
      }
    }
  } catch {
    // Session absente ou erreur réseau — on affiche le leaderboard sans sticky footer
  }

  return (
    <div className="scanlines crt-flicker min-h-screen">
      <LeaderboardClient players={players} currentPlayer={currentPlayer} />
    </div>
  );
}
