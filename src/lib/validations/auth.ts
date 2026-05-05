import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  password: z.string().min(1, {
    message: "Le mot de passe est requis.",
  }),
});

export const signupSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Le mot de passe doit contenir au moins 8 caractères.",
    })
    .regex(/[A-Z]/, {
      message: "Le mot de passe doit contenir au moins une majuscule.",
    })
    .regex(/[a-z]/, {
      message: "Le mot de passe doit contenir au moins une minuscule.",
    })
    .regex(/[0-9]/, {
      message: "Le mot de passe doit contenir au moins un chiffre.",
    })
    .regex(/[@$!%*?&]/, {
      message: "Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&).",
    }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
