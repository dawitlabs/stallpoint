"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useActionState } from "react";
import { type CreateProjectState, createProjectAction } from "./actions";
import { PROJECT_NAME_MAX } from "./limits";

const INITIAL_STATE: CreateProjectState = { status: "idle" };

export function CreateProjectForm() {
  const [state, formAction, isPending] = useActionState(
    createProjectAction,
    INITIAL_STATE,
  );
  const error = state.status === "invalid" ? state.error : undefined;
  return (
    <form action={formAction} className="grid gap-2">
      <label htmlFor="project-name" className="text-sm font-medium">
        Project name
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="project-name"
          name="name"
          required
          maxLength={PROJECT_NAME_MAX}
          placeholder="My SaaS"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby="project-name-error"
          className="h-11 flex-1 rounded-full border border-line bg-panel-2 px-4 text-[15px] placeholder:text-faint focus:border-faint focus:outline-none aria-invalid:border-alert"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-lime px-5 text-[15px] font-semibold text-on-lime transition-[background-color,transform] hover:bg-lime-hover active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Plus className="size-4" aria-hidden="true" />
          )}
          {isPending ? "Creating…" : "Create project"}
        </button>
      </div>
      <p
        id="project-name-error"
        aria-live="polite"
        className="min-h-5 text-sm text-alert"
      >
        {error ?? ""}
      </p>
    </form>
  );
}
