import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { APIError } from "better-auth/api";
import { logger } from "@/lib/logger";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const password = user.password;
          if (typeof password === "string") {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
              logger.warn("SIGNUP_BLOCKED", `Mot de passe trop faible pour ${user.email}`);
              throw new APIError("BAD_REQUEST", {
                message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
              });
            }
          }
          logger.info("SIGNUP_ATTEMPT", `Tentative de création pour ${user.email}`);
        },
        after: async (user) => {
          logger.info("SIGNUP_SUCCESS", "Compte créé avec succès", user.id);
        },
      },
    },
  },
});
