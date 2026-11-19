"use client";

import { LoaderCircle, RefreshCw, Trash2 } from "lucide-react";
import { useActionState } from "react";
import {
  deleteProjectAction,
  type ProjectMutationState,
  rotateWriteKeyAction,
} from "./actions";

const INITIAL_STATE: ProjectMutationState = { status: "idle" };

export function RotateKeyForm({ projectId }: { projectId: string }) {
  const [state, formAction, isPending] = useActionState(
    rotateWriteKeyAction,
    INITIAL_STATE,
  );
  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="projectId" value={projectId} />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold transition-colors hover:bg-panel-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <RefreshCw className="size-4" aria-hidden="true" />
        )}
        Rotate write key
      </button>
      <p
        aria-live="polite"
        className={`min-h-5 text-sm ${state.status === "failed" ? "text-alert" : "text-lime"}`}
      >
        {state.status === "done"
          ? "New key created. Update the script tag on your site; the old key no longer works."
          : state.status === "failed"
            ? state.error
            : ""}
      </p>
    </form>
  );
}

export function DeleteProjectForm({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const [state, formAction, isPending] = useActionState(
    deleteProjectAction,
    INITIAL_STATE,
  );
  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="projectId" value={projectId} />
      <label htmlFor="delete-confirmation" className="text-sm text-muted">
        Type <strong className="font-mono text-paper">{projectName}</strong> to
        confirm
      </label>
      <input
        id="delete-confirmation"
        name="confirmation"
        required
        autoComplete="off"
        className="h-11 w-full max-w-sm rounded-full border border-line bg-panel-2 px-4 font-mono text-sm focus:border-danger focus:outline-none"
      />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded-full bg-danger px-4 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 className="size-4" aria-hidden="true" />
        )}
        Delete project and all events
      </button>
      <p aria-live="polite" className="min-h-5 text-sm text-alert">
        {state.status === "failed" ? state.error : ""}
      </p>
    </form>
  );
}
