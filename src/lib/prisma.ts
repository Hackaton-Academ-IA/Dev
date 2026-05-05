import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma_jalon3: PrismaClient };

if (!process.env.DATABASE_URL) {
  throw new Error("La variable DATABASE_URL est absente du fichier .env");
}

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma_jalon3 ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma_jalon3 = prisma;