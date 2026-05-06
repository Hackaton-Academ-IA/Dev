"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function NavBar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="panel panel-violet sticky top-3 z-40">
      <div className="flex items-center justify-between p-3 sm:p-4 gap-3">
        
        <Link href="/" className="flex items-center gap-3 md:gap-4 hover:opacity-80 transition-opacity">
          <Image
            src="/images/logo-blanc.png"
            alt="Logo ACADEM'IA"
            width={120}
            height={80}
            style={{ imageRendering: "pixelated" }}
            priority
          />
          <div className="flex flex-col justify-center">
            <span
              className="font-pixel text-white text-xs sm:text-sm tracking-widest"
              style={{ textShadow: "0 0 8px rgba(168, 85, 247, 0.8)" }}
            >
              ACADEM<span className="text-[#00ff9d]">&apos;</span>IA
            </span>
            <span className="font-pixel text-[7px] sm:text-[8px] text-[var(--ink-dim)] mt-1.5 hidden sm:block">
              &gt; LEARN. LEVEL UP. REPEAT.
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[["#concept","CONCEPT"],["#cibles","CLASSES"],["#tarifs","TARIFS"],["#faq","FAQ"]].map(([href, label]) => (
            <Link key={href} href={href} className="font-pixel text-[9px] px-3 py-2 text-[var(--ink-dim)] hover:text-white transition-colors">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isPending ? (
            <span className="font-pixel text-[9px] text-[var(--ink-dim)]">…</span>
          ) : session ? (
            <>
              <span className="font-pixel text-[9px] text-[var(--gold)] hidden sm:inline glow-gold">
                SALUT, {session.user.name?.split(" ")[0].toUpperCase()} !
              </span>
              <Link href="/dashboard" className="arcade arcade-emerald text-[9px] sm:text-[10px]">
                ▶ DASHBOARD
              </Link>
              <button
                className="arcade text-[9px] sm:text-[10px]"
                style={{ background: "var(--danger)", boxShadow: "0 4px 0 #7a0c14, inset 0 1px 0 rgba(255,255,255,.15)" }}
                onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { router.push("/"); router.refresh(); } } })}
              >
                ✕ QUITTER
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="arcade arcade-ghost text-[9px] hidden sm:inline-flex">
                ▷ CONNEXION
              </Link>
              <button className="arcade arcade-emerald text-[9px] sm:text-[10px]" onClick={() => router.push("/signup")}>
                ▶ DÉMARRER
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}