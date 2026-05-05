import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
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

  const playerName = session.user.name ?? session.user.email ?? "SCHOLAR";
  const role = (session.user as { role?: string }).role;

  return (
    <div className="scanlines crt-flicker min-h-screen">
      <DashboardClient playerName={playerName} isAdmin={role === "admin"} />
    </div>
  );
}
