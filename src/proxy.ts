import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";

const PROTECTED_PREFIXES = ["/dashboard", "/quizz", "/leaderboard", "/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin")) {
    const role = (session.user as { role?: string }).role;
    if (role !== "admin") {
      logger.warn(
        "SECURITY_BREACH_ATTEMPT",
        `Accès /admin refusé — rôle insuffisant (${role ?? "inconnu"})`,
        session.user.id
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/quizz/:path*", "/leaderboard/:path*", "/admin/:path*"],
};
