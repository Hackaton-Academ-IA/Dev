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

  const utilisateurs = await prisma.utilisateur.findMany({
    orderBy: { niveau: "desc" },
    select: { id: true, pseudo: true, email: true, niveau: true, xp: true, role: true },
  });

  return (
    <AdminDashboardClient
      utilisateurs={utilisateurs}
      adminId={session.user.id}
      adminEmail={session.user.email}
    />
  );
}
