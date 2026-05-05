import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function DELETE(
  _req: NextRequest,
  segmentData: { params: Promise<{ id: string }> }
) {
  const { id } = await segmentData.params;

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    logger.warn(
      "ADMIN_FORBIDDEN",
      `Tentative d'accès admin refusée pour la suppression de ${id}`,
      session.user.id
    );
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.$transaction([
      prisma.utilisateurBadge.deleteMany({ where: { utilisateurId: id } }),
      prisma.reponse.deleteMany({ where: { utilisateurId: id } }),
      prisma.utilisateur.delete({ where: { id } }),
    ]);
  } catch {
    logger.error(
      "USER_DELETE_FAILED",
      `Impossible de supprimer l'utilisateur ${id}`,
      session.user.id
    );
    return NextResponse.json(
      { error: "User not found or delete failed" },
      { status: 404 }
    );
  }

  logger.warn(
    "AUDIT_TRAIL",
    `[USER_DELETED] - Admin ID: ${session.user.id} | User Deleted: ${id} | Reason: Manual Moderation`,
    session.user.id
  );

  return NextResponse.json({ success: true });
}
