import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { APIError } from "better-auth/api";

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
                    if (password) {
                        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                        if (!passwordRegex.test(password)) {
                            throw new APIError("BAD_REQUEST", {
                                message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
                            });
                        }
                    }
                },
            },
        },
    },
});
