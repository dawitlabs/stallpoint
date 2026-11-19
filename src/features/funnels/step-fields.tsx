"use client";

import { Plus, X } from "lucide-react";
import { useId, useState } from "react";
import { MAX_STEPS, MIN_STEPS } from "./limits";

export const FIELD_CLASS =
  "h-11 w-full rounded-full border border-line bg-panel-2 px-4 text-[15px] placeholder:text-faint focus:border-faint focus:outline-none";

type StepRow = { id: number; value: string };

function initialRows(suggestions: string[]): StepRow[] {
  return Array.from({ length: MIN_STEPS }, (_, index) => ({
    id: index,
    value: suggestions[index] ?? "",
  }));
}

export function StepFields({ suggestions }: { suggestions: string[] }) {
  const [rows, setRows] = useState<StepRow[]>(() => initialRows(suggestions));
  const listId = useId();

  function addRow(): void {
    setRows((current) => [
      ...current,
      { id: Math.max(...current.map((row) => row.id)) + 1, value: "" },
    ]);
  }

  function removeRow(id: number): void {
    setRows((current) => current.filter((row) => row.id !== id));
  }

  function updateRow(id: number, value: string): void {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, value } : row)),
    );
  }

  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-sm font-medium">Steps, in order</legend>
      <datalist id={listId}>
        {suggestions.map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
      {rows.map((row, index) => (
        <div key={row.id} className="flex items-center gap-2">
          <span className="w-6 flex-none font-mono text-xs text-lime">
            {String(index + 1).padStart(2, "0")}
          </span>
          <label htmlFor={`step-${row.id}`} className="sr-only">
            Step {index + 1}
          </label>
          <input
            id={`step-${row.id}`}
            name="step"
            list={listId}
            value={row.value}
            onChange={(event) => updateRow(row.id, event.target.value)}
            placeholder="page_view /pricing"
            autoComplete="off"
            spellCheck={false}
            className={`${FIELD_CLASS} font-mono text-sm`}
          />
          <button
            type="button"
            onClick={() => removeRow(row.id)}
            disabled={rows.length <= MIN_STEPS}
            aria-label={`Remove step ${index + 1}`}
            className="grid size-11 flex-none cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-panel-2 hover:text-paper disabled:cursor-not-allowed disabled:opacity-30"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
      {rows.length < MAX_STEPS ? (
        <button
          type="button"
          onClick={addRow}
          className="mt-1 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-panel-2 hover:text-paper"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add step
        </button>
      ) : null}
      <p className="text-xs text-faint">
        An event name, or{" "}
        <code className="font-mono text-muted">page_view /path</code> for a
        specific page.
      </p>
    </fieldset>
  );
}
