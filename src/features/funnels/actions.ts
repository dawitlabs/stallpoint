"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { funnels, projects } from "@/db/schema";
import { requireUser } from "@/features/auth/require-user";
import { SITE } from "@/lib/site";
import {
  FUNNEL_NAME_MAX,
  MAX_STEPS,
  MIN_STEPS,
  WINDOW_OPTIONS,
} from "./limits";
import { formatStep, parseStep } from "./step";

const WINDOW_HOURS: readonly number[] = WINDOW_OPTIONS.map(
  (option) => option.hours,
);

const CreateFunnelInput = z.object({
  projectId: z.uuid(),
  name: z
    .string()
    .trim()
    .min(1, { error: "Give the funnel a name" })
    .max(FUNNEL_NAME_MAX, {
      error: `Keep it under ${FUNNEL_NAME_MAX} characters`,
    }),
  steps: z
    .array(z.string().trim())
    .transform((steps) => steps.filter((step) => step.length > 0))
    .pipe(
      z
        .array(z.string())
        .min(MIN_STEPS, { error: `Add at least ${MIN_STEPS} steps` })
        .max(MAX_STEPS, { error: `Use at most ${MAX_STEPS} steps` }),
    ),
  windowHours: z.coerce
    .number()
    .refine((hours) => WINDOW_HOURS.includes(hours), {
      error: "Pick a conversion window",
    }),
});

export type CreateFunnelState =
  | { status: "idle" }
  | { status: "invalid"; error: string };

async function ownsProject(
  projectId: string,
  userId: string,
): Promise<boolean> {
  const [row] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.ownerId, userId)))
    .limit(1);
  return Boolean(row);
}

export async function createFunnelAction(
  _previous: CreateFunnelState,
  formData: FormData,
): Promise<CreateFunnelState> {
  const user = await requireUser();
  const parsed = CreateFunnelInput.safeParse({
    projectId: formData.get("projectId"),
    name: formData.get("name"),
    steps: formData.getAll("step").map(String),
    windowHours: formData.get("windowHours"),
  });
  if (!parsed.success)
    return {
      status: "invalid",
      error: parsed.error.issues[0]?.message ?? "Check the form",
    };

  const steps = parsed.data.steps.map(parseStep);
  const badIndex = steps.indexOf(null);
  if (badIndex !== -1) {
    return {
      status: "invalid",
      error: `Step ${badIndex + 1} isn't valid. Use an event name, optionally followed by a path: page_view /pricing`,
    };
  }
  const normalized = steps.flatMap((step) => (step ? [formatStep(step)] : []));
  if (new Set(normalized).size !== normalized.length) {
    return { status: "invalid", error: "Each step must be different" };
  }
  if (!(await ownsProject(parsed.data.projectId, user.id))) {
    return { status: "invalid", error: "Project not found" };
  }

  const [row] = await db
    .insert(funnels)
    .values({
      projectId: parsed.data.projectId,
      name: parsed.data.name,
      steps: normalized,
      windowHours: parsed.data.windowHours,
    })
    .returning({ id: funnels.id });
  if (!row)
    return { status: "invalid", error: "Couldn't save the funnel. Try again." };
  redirect(`${SITE.dashboardPath}/${parsed.data.projectId}/funnels/${row.id}`);
}

const DeleteFunnelInput = z.object({ projectId: z.uuid(), funnelId: z.uuid() });

export async function deleteFunnelAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = DeleteFunnelInput.safeParse({
    projectId: formData.get("projectId"),
    funnelId: formData.get("funnelId"),
  });
  if (!parsed.success) return;
  if (!(await ownsProject(parsed.data.projectId, user.id))) return;
  await db
    .delete(funnels)
    .where(
      and(
        eq(funnels.id, parsed.data.funnelId),
        eq(funnels.projectId, parsed.data.projectId),
      ),
    );
  const listPath = `${SITE.dashboardPath}/${parsed.data.projectId}/funnels`;
  revalidatePath(listPath);
  redirect(listPath);
}
