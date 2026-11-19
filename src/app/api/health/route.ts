import { sql } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { errorName, log } from "@/lib/log";

export async function GET(): Promise<Response> {
  await connection();
  try {
    await db.execute(sql`select 1`);
    return Response.json({ data: { status: "ok" }, error: null });
  } catch (error) {
    log({ event: "health.db_unreachable", errorName: errorName(error) });
    return Response.json(
      { data: null, error: "database_unreachable" },
      { status: 503 },
    );
  }
}
