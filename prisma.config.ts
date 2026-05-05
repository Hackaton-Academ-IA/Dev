import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://unused:unused@localhost:5432/unused",
  },
  migrations: {
    seed: "npx tsx ./prisma/seed.ts",
  },
});