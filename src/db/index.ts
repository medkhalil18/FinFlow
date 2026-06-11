import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

function isLocalDatabase(url: string) {
  return (
    url.includes("127.0.0.1") ||
    url.includes("localhost") ||
    url.includes("@db:")
  );
}

function getPoolConfig(connectionString: string): PoolConfig {
  const databaseSsl = process.env.DATABASE_SSL;
  const shouldUseSsl =
    databaseSsl === "true" ||
    (databaseSsl !== "false" && !isLocalDatabase(connectionString));

  return {
    connectionString,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
  };
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool(getPoolConfig(databaseUrl));

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
