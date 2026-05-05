import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — returns the user's dunjon progression statuses
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const rows = await prisma.donjonProgression.findMany({
      where: { userId: session.user.id },
      select: { donjonId: true, status: true },
    });

    const statuses: Record<number, string> = {};
    for (const row of rows) {
      statuses[row.donjonId] = row.status;
    }

    // Dunjon 1 is always accessible for new users
    if (!statuses[1]) statuses[1] = "UNLOCKED";

    return NextResponse.json({ statuses });
  } catch (err) {
    console.error("[game/progression GET]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
