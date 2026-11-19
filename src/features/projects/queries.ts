import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { cache } from "react";
import { z } from "zod";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { requireUser } from "@/features/auth/require-user";

export type ProjectSummary = {
  id: string;
  name: string;
  createdAt: Date;
  eventsLastDay: number;
};

export type ProjectDetail = {
  id: string;
  name: string;
  writeKey: string;
  createdAt: Date;
};

const ProjectId = z.uuid();

export async function listMyProjects(): Promise<ProjectSummary[]> {
  const user = await requireUser();
  return db
    .select({
      id: projects.id,
      name: projects.name,
      createdAt: projects.createdAt,
      eventsLastDay: sql<number>`(
        select count(*)::int from "events" recent
        where recent."project_id" = "projects"."id"
          and recent."received_at" > now() - interval '1 day'
      )`,
    })
    .from(projects)
    .where(eq(projects.ownerId, user.id))
    .orderBy(desc(projects.createdAt));
}

export async function findProjectForOwner(
  projectId: string,
  ownerId: string,
): Promise<ProjectDetail | null> {
  const parsed = ProjectId.safeParse(projectId);
  if (!parsed.success) return null;
  const [row] = await db
    .select({
      id: projects.id,
      name: projects.name,
      writeKey: projects.writeKey,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .where(and(eq(projects.id, parsed.data), eq(projects.ownerId, ownerId)))
    .limit(1);
  return row ?? null;
}

export const getMyProject = cache(
  async (projectId: string): Promise<ProjectDetail> => {
    const user = await requireUser();
    const project = await findProjectForOwner(projectId, user.id);
    if (!project) notFound();
    return project;
  },
);
