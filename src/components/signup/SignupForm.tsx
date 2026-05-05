"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { UserIcon, LockIcon, HeroLogo } from "@/components/ui/PixelIcons";

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: SignupInput) => {
    setLoading(true);
    setServerError(null);
    await authClient.signUp.email(
      { email: values.email, password: values.password, name: values.name },
      {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onError: (ctx) => {
          const code = ctx.error.status;
          if (code === 422 || ctx.error.message?.toLowerCase().includes("already exists")) {
            setServerError("Cet email est déjà utilisé. Connecte-toi ou choisis un autre email.");
          } else if (code === 400) {
            setServerError(ctx.error.message || "Données invalides. Vérifie les champs.");
          } else {
            setServerError("Erreur de connexion — réessaie dans quelques instants.");
          }
        },
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      }
    );
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-[460px] relative">

        <div className="text-center mb-4 font-pixel text-[10px] text-[var(--ink-dim)]">
          ★ NEW PLAYER ★ <span className="text-[var(--gold)]"><span className="caret">&nbsp;</span></span>
        </div>

        <div className="rpg-box rpg-box-corners">
          <span className="rpg-corner-tr" />
          <span className="rpg-corner-bl" />

          <div className="titlebar flex items-center justify-between">
            <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
              ▣ ACADEM&apos;IA — NEW.SAV
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
              <div
                className="font-pixel text-[14px] sm:text-[16px] text-white"
                style={{ textShadow: "2px 2px 0 #000" }}
              >
                NOUVEAU<br />
                <span style={{ color: "#ffd23a", textShadow: "2px 2px 0 #000, 0 0 8px #ffd23a" }}>
                  HÉROS.
                </span>
              </div>
              <div className="font-mono-pixel text-[18px] text-[var(--ink-dim)] leading-snug">
                <span className="text-[var(--gold)]">&gt; </span>
                Crée ta carte joueur pour commencer ta quête.<span className="caret">&nbsp;</span>
              </div>
            </div>

            <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
              {/* Nom complet */}
              <div>
                <label className="field-label">
                  <span className="w-2 h-2 bg-[var(--emerald)]" /> NOM COMPLET
                </label>
                <div className="relative">
                  <span className="field-icon"><UserIcon /></span>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jean Dupont"
                    className="pix-input"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="font-mono-pixel text-[14px] text-[var(--danger)] mt-1">
                    ⚠ {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="field-label">
                  <span className="w-2 h-2 bg-[var(--emerald)]" /> EMAIL
                </label>
                <div className="relative">
                  <span className="field-icon"><UserIcon /></span>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="hero@academia.io"
                    className="pix-input"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="font-mono-pixel text-[14px] text-[var(--danger)] mt-1">
                    ⚠ {errors.email.message}
                  </p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="field-label">
                  <span className="w-2 h-2 bg-[var(--neon-violet)]" /> MOT DE PASSE
                </label>
                <div className="relative">
                  <span className="field-icon"><LockIcon /></span>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="pix-input"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="font-mono-pixel text-[14px] text-[var(--danger)] mt-1">
                    ⚠ {errors.password.message}
                  </p>
                )}
                <p className="font-mono-pixel text-[14px] text-[var(--ink-dim)] mt-1">
                  8 car. · MAJ · min · chiffre · spécial (@$!%*?&amp;)
                </p>
              </div>

              {serverError && (
                <div className="font-mono-pixel text-[16px] text-[var(--danger)] border-2 border-black p-2 bg-[#3a0c14]">
                  ⚠ {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`arcade text-[12px] sm:text-[14px] w-full ${loading ? "disabled" : ""}`}
              >
                {loading ? (
                  <>
                    <span className="w-3 h-3 bg-white border-2 border-black" />
                    <span>CRÉATION<span className="caret">&nbsp;</span></span>
                  </>
                ) : (
                  <>
                    <span>▶</span>
                    <span>CRÉER LE HÉROS</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center font-mono-pixel text-[16px] text-[var(--ink-dim)] pt-1">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-[var(--elec-blue)] hover:text-white font-pixel text-[10px] ml-1">
                ▶ SE CONNECTER
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-5 font-mono-pixel text-[16px] text-[var(--ink-dim)]">
          © 2026 ACADEM&apos;IA · v1.16-bit · <span className="text-[var(--gold)]">READY</span>
        </div>
      </div>
    </main>
  );
}
