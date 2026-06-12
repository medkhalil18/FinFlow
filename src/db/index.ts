import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

function getPoolConfig(connectionString: string): PoolConfig {
  const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
  const sslFlag = process.env.DATABASE_SSL;
  const shouldUseSsl = sslFlag === "true" || (sslFlag !== "false" && !isLocal);

  return {
    connectionString,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
    max: 1, // important for Vercel serverless / pgbouncer
  };
}

const globalForDb = globalThis as typeof globalThis & { __finflowPool?: Pool };

export const pool = globalForDb.__finflowPool ?? new Pool(getPoolConfig(databaseUrl));
if (process.env.NODE_ENV !== "production") {
  globalForDb.__finflowPool = pool;
}

export const db = drizzle(pool, { logger: process.env.NODE_ENV !== "production" });
