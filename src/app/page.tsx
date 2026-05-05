"use client";

import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
      },
    });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left mt-8">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {isPending ? (
              "Chargement..."
            ) : session ? (
              `Bienvenue, ${session.user.name} !`
            ) : (
              "Authentification avec Better Auth"
            )}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {session 
              ? `Vous êtes connecté en tant que ${session.user.email}.`
              : "Connectez-vous ou créez un compte pour accéder aux fonctionnalités sécurisées."}
          </p>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row mt-8">
          {session ? (
            <button
              onClick={handleLogout}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-zinc-950 text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 md:w-[158px]"
            >
              Se déconnecter
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-zinc-950 text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 md:w-[158px]"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
