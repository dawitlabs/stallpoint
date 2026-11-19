"use client";

import { LoaderCircle } from "lucide-react";
import { useActionState } from "react";
import { type CreateFunnelState, createFunnelAction } from "./actions";
import { FUNNEL_NAME_MAX, WINDOW_OPTIONS } from "./limits";
import { FIELD_CLASS, StepFields } from "./step-fields";

const INITIAL_STATE: CreateFunnelState = { status: "idle" };
const DEFAULT_WINDOW_HOURS = 168;

export function CreateFunnelForm({
  projectId,
  suggestions,
}: {
  projectId: string;
  suggestions: string[];
}) {
  const [state, formAction, isPending] = useActionState(
    createFunnelAction,
    INITIAL_STATE,
  );
  const error = state.status === "invalid" ? state.error : undefined;

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="projectId" value={projectId} />

      <div className="grid gap-2">
        <label htmlFor="funnel-name" className="text-sm font-medium">
          Funnel name
        </label>
        <input
          id="funnel-name"
          name="name"
          required
          maxLength={FUNNEL_NAME_MAX}
          placeholder="Visit to signup"
          autoComplete="off"
          className={FIELD_CLASS}
        />
      </div>

      <StepFields suggestions={suggestions} />

      <div className="grid gap-2">
        <label htmlFor="funnel-window" className="text-sm font-medium">
          Visitors must finish within
        </label>
        <select
          id="funnel-window"
          name="windowHours"
          defaultValue={DEFAULT_WINDOW_HOURS}
          className={FIELD_CLASS}
        >
          {WINDOW_OPTIONS.map((option) => (
            <option key={option.hours} value={option.hours}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <p aria-live="polite" className="min-h-5 text-sm text-alert">
        {error ?? ""}
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 w-fit cursor-pointer items-center gap-2 rounded-full bg-lime px-5 text-[15px] font-semibold text-on-lime transition-[background-color,transform] hover:bg-lime-hover active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        {isPending ? "Saving…" : "Save funnel"}
      </button>
    </form>
  );
}
