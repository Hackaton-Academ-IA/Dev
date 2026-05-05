import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    logger.warn(
      "SECURITY_BREACH_ATTEMPT",
      `Accès direct /admin/dashboard refusé`,
      session.user.id
    );
    redirect("/dashboard");
  }

  // 1. On récupère les données brutes (avec "name")
  const rawUtilisateurs = await prisma.utilisateur.findMany({
    orderBy: { niveau: "desc" },
    select: { id: true, name: true, email: true, niveau: true, xp: true, role: true },
  });

 // 2. Le Mapping : On adapte les données pour satisfaire le composant Client
  const utilisateursFormates = rawUtilisateurs.map((u) => ({
    id: u.id,
    pseudo: String(u.name || "Aventurier Anonyme"), // On s'assure que c'est bien un String
    email: u.email,
    niveau: u.niveau,
    xp: u.xp,
    role: (u.role.toLowerCase() === "admin" ? "admin" : "user") as "admin" | "user",
  }));

  // 3. On envoie les données formatées en toute sécurité
  return (
    <AdminDashboardClient
      utilisateurs={utilisateursFormates}
      adminId={session.user.id}
      adminEmail={session.user.email}
    />
  );
}