"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { requireUser } from "@/features/auth/require-user";
import { SITE } from "@/lib/site";
import { PROJECT_NAME_MAX } from "./limits";
import { generateWriteKey } from "./write-key";

const CreateProjectInput = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Give the project a name" })
    .max(PROJECT_NAME_MAX, {
      error: `Keep it under ${PROJECT_NAME_MAX} characters`,
    }),
});

export type CreateProjectState =
  | { status: "idle" }
  | { status: "invalid"; error: string };

export async function createProjectAction(
  _previous: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  const user = await requireUser();
  const parsed = CreateProjectInput.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return {
      status: "invalid",
      error: parsed.error.issues[0]?.message ?? "Invalid name",
    };
  }
  const [row] = await db
    .insert(projects)
    .values({
      ownerId: user.id,
      name: parsed.data.name,
      writeKey: generateWriteKey(),
    })
    .returning({ id: projects.id });
  if (!row)
    return {
      status: "invalid",
      error: "Couldn't create the project. Try again.",
    };
  redirect(`${SITE.dashboardPath}/${row.id}`);
}

const ProjectIdInput = z.object({ projectId: z.uuid() });

export type ProjectMutationState =
  | { status: "idle" }
  | { status: "done" }
  | { status: "failed"; error: string };

export async function rotateWriteKeyAction(
  _previous: ProjectMutationState,
  formData: FormData,
): Promise<ProjectMutationState> {
  const user = await requireUser();
  const parsed = ProjectIdInput.safeParse({
    projectId: formData.get("projectId"),
  });
  if (!parsed.success) return { status: "failed", error: "Unknown project" };
  const [row] = await db
    .update(projects)
    .set({ writeKey: generateWriteKey() })
    .where(
      and(
        eq(projects.id, parsed.data.projectId),
        eq(projects.ownerId, user.id),
      ),
    )
    .returning({ id: projects.id });
  if (!row) return { status: "failed", error: "Project not found" };
  revalidatePath(`${SITE.dashboardPath}/${row.id}`, "layout");
  return { status: "done" };
}

const DeleteProjectInput = z.object({
  projectId: z.uuid(),
  confirmation: z.string(),
});

export async function deleteProjectAction(
  _previous: ProjectMutationState,
  formData: FormData,
): Promise<ProjectMutationState> {
  const user = await requireUser();
  const parsed = DeleteProjectInput.safeParse({
    projectId: formData.get("projectId"),
    confirmation: formData.get("confirmation"),
  });
  if (!parsed.success) return { status: "failed", error: "Unknown project" };
  const [project] = await db
    .select({ name: projects.name })
    .from(projects)
    .where(
      and(
        eq(projects.id, parsed.data.projectId),
        eq(projects.ownerId, user.id),
      ),
    )
    .limit(1);
  if (!project) return { status: "failed", error: "Project not found" };
  if (parsed.data.confirmation.trim() !== project.name) {
    return {
      status: "failed",
      error: "Type the project name exactly to confirm",
    };
  }
  await db
    .delete(projects)
    .where(
      and(
        eq(projects.id, parsed.data.projectId),
        eq(projects.ownerId, user.id),
      ),
    );
  revalidatePath(SITE.dashboardPath);
  redirect(SITE.dashboardPath);
}
