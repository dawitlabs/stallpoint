import "server-only";
import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/lib/env";
import * as schema from "./schema";

const IDLE_TIMEOUT_MS = 5_000;
const CONNECTION_TIMEOUT_MS = 10_000;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  idleTimeoutMillis: IDLE_TIMEOUT_MS,
  connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
});

attachDatabasePool(pool);

export const db = drizzle(pool, { schema });
export type Db = typeof db;
