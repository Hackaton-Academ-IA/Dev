"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { UserIcon, LockIcon, EyeIcon, GoogleG, GitHubCat, HeroLogo } from "@/components/ui/PixelIcons";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [pwd, setPwd]           = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState<string | null>(null);

  const ready = email.length > 3 && pwd.length >= 4;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || loading) return;
    setErr(null);
    setLoading(true);
    const { error } = await authClient.signIn.email({
      email,
      password: pwd,
      rememberMe: remember,
      callbackURL: "/dashboard",
    });
    if (error) {
      setErr(error.message ?? "Identifiants incorrects.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-[460px] relative">

        <div className="text-center mb-4 font-pixel text-[10px] text-[var(--ink-dim)]">
          ★ PLAYER LOGIN ★ <span className="text-[var(--emerald)]"><span className="caret">&nbsp;</span></span>
        </div>

        <div className="rpg-box rpg-box-corners">
          <span className="rpg-corner-tr" />
          <span className="rpg-corner-bl" />

          <div className="titlebar flex items-center justify-between">
            <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
              ▣ ACADEM&apos;IA — LOGIN.SAV
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[var(--emerald)] border-2 border-black" />
              <span className="w-3 h-3 bg-[var(--gold)] border-2 border-black" />
              <span className="w-3 h-3 bg-[var(--danger)] border-2 border-black" />
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-5">
            <div className="text-center space-y-3">
              <HeroLogo />
              <div className="font-pixel text-[14px] sm:text-[16px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
                BIENVENUE,<br />
                <span style={{ color: "#1eea7c", textShadow: "2px 2px 0 #000, 0 0 8px #1eea7c" }}>HÉROS.</span>
              </div>
              <div className="font-mono-pixel text-[18px] text-[var(--ink-dim)] leading-snug">
                <span className="text-[var(--emerald)]">&gt; </span>
                Identifie-toi pour reprendre ta quête.<span className="caret">&nbsp;</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              {/* Email */}
              <div>
                <label className="field-label">
                  <span className="w-2 h-2 bg-[var(--emerald)]" /> PSEUDO / EMAIL
                </label>
                <div className="relative">
                  <span className="field-icon"><UserIcon /></span>
                  <input
                    type="text" autoComplete="username"
                    placeholder="player_one@academia.io"
                    className="pix-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="field-label">
                  <span className="w-2 h-2 bg-[var(--neon-violet)]" /> MOT DE PASSE
                </label>
                <div className="relative">
                  <span className="field-icon"><LockIcon /></span>
                  <input
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="pix-input"
                    value={pwd}
                    onChange={e => setPwd(e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={showPwd ? "Masquer" : "Afficher"}
                    onClick={() => setShowPwd(s => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 border-2 border-black bg-[#0e0a22] hover:bg-[#19103a]"
                    style={{ boxShadow: "inset 0 -2px 0 rgba(0,0,0,.4)" }}
                  >
                    <EyeIcon open={showPwd} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 text-[var(--ink-dim)]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="peer sr-only" checked={remember} onChange={() => setRemember(r => !r)} />
                    <span className="pix-check" />
                    <span className="font-mono-pixel text-[16px]">SAVE PROGRESS</span>
                  </label>
                  <a href="#" className="font-pixel text-[8px] text-[var(--elec-blue)] hover:text-white">OUBLIÉ ?</a>
                </div>
              </div>

              {err && (
                <div className="font-mono-pixel text-[16px] text-[var(--danger)] border-2 border-black p-2 bg-[#3a0c14]">
                  ⚠ {err}
                </div>
              )}

              <button
                type="submit"
                className={`arcade text-[12px] sm:text-[14px] w-full ${ready ? "" : "disabled"}`}
                disabled={!ready || loading}
              >
                {loading ? (
                  <><span className="w-3 h-3 bg-white border-2 border-black" /><span>LOADING<span className="caret">&nbsp;</span></span></>
                ) : (
                  <><span>▶</span><span>PLAYER 1 : READY</span></>
                )}
              </button>
            </form>

            <div className="pix-divider">OR · LOAD GAME</div>

            <div className="space-y-3">
              <button type="button" className="save-slot">
                <div className="border-[3px] border-black p-1 bg-[#0e0a22]"><GoogleG /></div>
                <div className="flex-1">
                  <div className="text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>SAVE 02</div>
                  <div className="font-mono-pixel text-[16px] text-[var(--ink-dim)] mt-1">Continuer avec Google</div>
                </div>
                <div className="font-pixel text-[10px] text-[var(--emerald)]">▶</div>
              </button>
              <button type="button" className="save-slot">
                <div className="border-[3px] border-black p-1 bg-[#0e0a22]"><GitHubCat /></div>
                <div className="flex-1">
                  <div className="text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>SAVE 03</div>
                  <div className="font-mono-pixel text-[16px] text-[var(--ink-dim)] mt-1">Continuer avec GitHub</div>
                </div>
                <div className="font-pixel text-[10px] text-[var(--emerald)]">▶</div>
              </button>
            </div>

            <div className="text-center font-mono-pixel text-[16px] text-[var(--ink-dim)] pt-1">
              Pas encore de carte joueur ?{" "}
              <a href="#" className="text-[var(--gold)] hover:text-white font-pixel text-[10px] ml-1">INSERT COIN ▶</a>
            </div>
          </div>
        </div>

        <div className="text-center mt-5 font-mono-pixel text-[16px] text-[var(--ink-dim)]">
          © 2026 ACADEM&apos;IA · v1.16-bit · <span className="text-[var(--emerald)]">SERVER ONLINE</span>
        </div>
      </div>
    </main>
  );
}
