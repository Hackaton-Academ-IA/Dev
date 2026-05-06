import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { type NextRequest } from "next/server";
import { logger } from "@/lib/logger";

const { GET, POST: authPOST } = toNextJsHandler(auth);

export { GET };

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const isSignUp = url.pathname.endsWith("/sign-up/email");

  // Clone before forwarding so we can read the body for logging on failure
  const email = isSignUp
    ? await req.clone().json().then((b: Record<string, unknown>) => b.email as string | undefined).catch(() => undefined)
    : undefined;

  const response = await authPOST(req);

  if (isSignUp && !response.ok && email) {
    const errBody = await response.clone().json().catch(() => ({})) as Record<string, unknown>;
    logger.error("SIGNUP_FAILED", String(errBody?.message ?? `HTTP ${response.status}`), email);
  }

  return response;
}
