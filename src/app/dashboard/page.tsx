import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const playerName = session.user.name ?? session.user.email ?? "SCHOLAR";

  return (
    <div className="scanlines crt-flicker min-h-screen">
      <DashboardClient playerName={playerName} />
    </div>
  );
}
