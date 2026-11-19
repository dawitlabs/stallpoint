import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { funnels } from "@/db/schema";
import { getMyProject } from "@/features/projects/queries";
import { type FunnelStep, parseStep } from "./step";

export type FunnelSummary = {
  id: string;
  name: string;
  steps: FunnelStep[];
  windowHours: number;
};

function toSummary(row: {
  id: string;
  name: string;
  steps: string[];
  windowHours: number;
}): FunnelSummary {
  return {
    id: row.id,
    name: row.name,
    steps: row.steps
      .map(parseStep)
      .filter((step): step is FunnelStep => step !== null),
    windowHours: row.windowHours,
  };
}

export async function listMyFunnels(
  projectId: string,
): Promise<FunnelSummary[]> {
  const project = await getMyProject(projectId);
  const rows = await db
    .select({
      id: funnels.id,
      name: funnels.name,
      steps: funnels.steps,
      windowHours: funnels.windowHours,
    })
    .from(funnels)
    .where(eq(funnels.projectId, project.id))
    .orderBy(desc(funnels.createdAt));
  return rows.map(toSummary);
}

export async function getMyFunnel(
  projectId: string,
  funnelId: string,
): Promise<FunnelSummary> {
  const project = await getMyProject(projectId);
  const parsedId = z.uuid().safeParse(funnelId);
  if (!parsedId.success) notFound();
  const [row] = await db
    .select({
      id: funnels.id,
      name: funnels.name,
      steps: funnels.steps,
      windowHours: funnels.windowHours,
    })
    .from(funnels)
    .where(
      and(eq(funnels.id, parsedId.data), eq(funnels.projectId, project.id)),
    )
    .limit(1);
  if (!row) notFound();
  return toSummary(row);
}
