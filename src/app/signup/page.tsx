"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupInput) => {
    setLoading(true);
    setError("");

    await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
    }, {
      onRequest: () => setLoading(true),
      onResponse: () => setLoading(false),
      onError: (ctx) => {
        setError(ctx.error.message || "Une erreur est survenue lors de l'inscription.");
      },
      onSuccess: () => {
        router.push("/");
        router.refresh();
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col gap-2 mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Créer un compte
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Inscrivez-vous pour commencer
          </p>
        </div>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label 
              htmlFor="name" 
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              placeholder="Jean Dupont"
              {...register("name")}
              className="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label 
              htmlFor="email" 
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="nom@exemple.com"
              {...register("email")}
              className="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label 
              htmlFor="password" 
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.password && (
              <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-900/50">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 dark:bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-50 dark:text-zinc-950 transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">
            Vous avez déjà un compte ?{" "}
          </span>
          <a 
            href="/login" 
            className="font-medium text-zinc-950 dark:text-zinc-50 hover:underline underline-offset-4"
          >
            Se connecter
          </a>
        </div>
      </div>
    </div>
  );
}

