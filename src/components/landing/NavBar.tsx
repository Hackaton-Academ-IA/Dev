"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  const colorMap: Record<string, string> = { v: "#1a1233", K: "#fff", b: "#b14bff", e: "#1eea7c" };

  return (
    <header className="panel panel-violet sticky top-3 z-40">
      <div className="flex items-center justify-between p-3 sm:p-4 gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-[44px] h-[44px] grid grid-cols-8 grid-rows-8 border-4 border-black"
            style={{ boxShadow: "0 4px 0 #000, inset 0 0 0 2px #2c0f4d" }}
          >
            {["vvvvvvvv","vKKKvKKv","vKbKvKvv","vKKKvKvv","vKbKvKvv","vKbKvKvv","vvvvvvvv","eeeeeeee"].map((row, y) =>
              row.split("").map((ch, x) => (
                <div key={`${x}-${y}`} style={{ background: colorMap[ch] }} />
              ))
            )}
          </div>
          <div className="font-pixel text-[14px] sm:text-[18px] glow-violet leading-none">
            ACADEM<span style={{ color: "#1eea7c" }}>&apos;</span>IA
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {[["#concept","CONCEPT"],["#cibles","CLASSES"],["#tarifs","TARIFS"],["#faq","FAQ"]].map(([href, label]) => (
            <Link key={href} href={href} className="font-pixel text-[9px] px-3 py-2 text-[var(--ink-dim)] hover:text-white transition-colors">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="arcade arcade-ghost text-[9px] hidden sm:inline-flex">
            ▷ CONNEXION
          </Link>
          <button className="arcade arcade-emerald text-[9px] sm:text-[10px]" onClick={() => router.push("/login")}>
            ▶ DÉMARRER
          </button>
        </div>
      </div>
    </header>
  );
}
