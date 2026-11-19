import "server-only";
import { and, eq, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { events, ingestWindows, projects } from "@/db/schema";
import {
  MAX_CLOCK_SKEW_MS,
  MAX_EVENTS_PER_MINUTE,
  WINDOW_RETENTION_MS,
} from "./limits";
import type { IncomingBatch } from "./schema";

export type IngestResult =
  | { status: "accepted"; count: number }
  | { status: "unknown_key" }
  | { status: "rate_limited" };

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

function occurredAt(timestamp: number | undefined, now: Date): Date {
  if (!timestamp) return now;
  return Math.abs(now.getTime() - timestamp) > MAX_CLOCK_SKEW_MS
    ? now
    : new Date(timestamp);
}

function minuteStart(now: Date): Date {
  const start = new Date(now);
  start.setUTCSeconds(0, 0);
  return start;
}

async function countInWindow(
  tx: Transaction,
  projectId: string,
  eventCount: number,
  now: Date,
): Promise<number> {
  const [window] = await tx
    .insert(ingestWindows)
    .values({ projectId, windowStart: minuteStart(now), count: eventCount })
    .onConflictDoUpdate({
      target: [ingestWindows.projectId, ingestWindows.windowStart],
      set: { count: sql`${ingestWindows.count} + ${eventCount}` },
    })
    .returning({ count: ingestWindows.count });
  const total = window?.count ?? eventCount;
  const isNewWindow = total === eventCount;
  if (isNewWindow) {
    await tx
      .delete(ingestWindows)
      .where(
        and(
          eq(ingestWindows.projectId, projectId),
          lt(
            ingestWindows.windowStart,
            new Date(now.getTime() - WINDOW_RETENTION_MS),
          ),
        ),
      );
  }
  return total;
}

export async function ingestBatch(
  batch: IncomingBatch,
  now: Date,
): Promise<IngestResult> {
  const [project] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.writeKey, batch.key))
    .limit(1);
  if (!project) return { status: "unknown_key" };

  return db.transaction(async (tx) => {
    const total = await countInWindow(tx, project.id, batch.events.length, now);
    if (total > MAX_EVENTS_PER_MINUTE) return { status: "rate_limited" };

    await tx.insert(events).values(
      batch.events.map((event) => ({
        projectId: project.id,
        name: event.name,
        visitorId: event.visitorId,
        userId: event.userId ?? null,
        path: event.path ?? null,
        referrer: event.referrer ?? null,
        properties: event.properties ?? {},
        occurredAt: occurredAt(event.timestamp, now),
        receivedAt: now,
      })),
    );
    return { status: "accepted", count: batch.events.length };
  });
}
