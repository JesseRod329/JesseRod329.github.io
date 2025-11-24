import { PrismaClient } from "@prisma/client";

// Map database environment variables to Prisma expected names
// Supports both Prisma Postgres and generic Vercel Postgres
if (!process.env.DATABASE_URL) {
  if (process.env.PRISMA_DATABASE_URL) {
    // Prisma Postgres provider
    process.env.DATABASE_URL = process.env.PRISMA_DATABASE_URL;
  } else if (process.env.POSTGRES_PRISMA_URL) {
    // Generic Vercel Postgres
    process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL;
  }
}

if (!process.env.DIRECT_URL) {
  if (process.env.POSTGRES_URL) {
    // Prisma Postgres provider (or generic Vercel Postgres)
    process.env.DIRECT_URL = process.env.POSTGRES_URL;
  } else if (process.env.POSTGRES_URL_NON_POOLING) {
    // Generic Vercel Postgres
    process.env.DIRECT_URL = process.env.POSTGRES_URL_NON_POOLING;
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    errorFormat: "pretty"
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
