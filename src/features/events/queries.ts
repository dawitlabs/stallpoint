import "server-only";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";

export type LiveEvent = {
  id: number;
  name: string;
  path: string | null;
  userId: string | null;
  visitor: string;
  occurredAt: string;
};

const LIVE_LIMIT = 50;
const NAME_LOOKBACK = sql`now() - interval '30 days'`;

export async function listRecentEvents(
  projectId: string,
): Promise<LiveEvent[]> {
  const rows = await db
    .select({
      id: events.id,
      name: events.name,
      path: events.path,
      userId: events.userId,
      visitorId: events.visitorId,
      occurredAt: events.occurredAt,
    })
    .from(events)
    .where(eq(events.projectId, projectId))
    .orderBy(desc(events.receivedAt), desc(events.id))
    .limit(LIVE_LIMIT);
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    path: row.path,
    userId: row.userId,
    visitor: row.visitorId.slice(0, 8),
    occurredAt: row.occurredAt.toISOString(),
  }));
}

export type EventNameStat = { name: string; count: number };

export async function listEventNames(
  projectId: string,
): Promise<EventNameStat[]> {
  return db
    .select({ name: events.name, count: sql<number>`count(*)::int` })
    .from(events)
    .where(
      and(
        eq(events.projectId, projectId),
        gt(events.receivedAt, NAME_LOOKBACK),
      ),
    )
    .groupBy(events.name)
    .orderBy(desc(sql`count(*)`))
    .limit(100);
}

export async function listTopPaths(
  projectId: string,
): Promise<EventNameStat[]> {
  return db
    .select({
      name: sql<string>`${events.path}`,
      count: sql<number>`count(*)::int`,
    })
    .from(events)
    .where(
      and(
        eq(events.projectId, projectId),
        eq(events.name, "page_view"),
        gt(events.receivedAt, NAME_LOOKBACK),
        sql`${events.path} is not null`,
      ),
    )
    .groupBy(events.path)
    .orderBy(desc(sql`count(*)`))
    .limit(50);
}
