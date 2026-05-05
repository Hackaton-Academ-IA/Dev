import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import GameController from "@/components/game/GameController";

export const metadata: Metadata = {
  title: "ACADEM'IA — TOUR INFINIE",
  description: "Prouve ta valeur dans la Tour Infinie d'Academ'IA.",
};

export default async function QuizPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <div className="scanlines crt-flicker min-h-screen">
      <div className="max-w-[860px] mx-auto p-4 sm:p-6">
        <GameController />
      </div>
    </div>
  );
}
