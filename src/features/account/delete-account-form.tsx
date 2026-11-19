"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const CONFIRM_WORD = "delete";

export function DeleteAccountForm() {
  const [confirmation, setConfirmation] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(): Promise<void> {
    setIsPending(true);
    setError(null);
    const { error: deleteError } = await authClient.deleteUser({
      callbackURL: "/",
    });
    if (deleteError) {
      setIsPending(false);
      setError(
        "For safety, sign out and back in, then delete within a day of signing in.",
      );
      return;
    }
    window.location.href = "/";
  }

  return (
    <div className="grid gap-3">
      <label htmlFor="account-confirmation" className="text-sm text-muted">
        Type <strong className="font-mono text-paper">{CONFIRM_WORD}</strong> to
        confirm
      </label>
      <input
        id="account-confirmation"
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
        autoComplete="off"
        className="h-11 w-full max-w-sm rounded-full border border-line bg-panel-2 px-4 font-mono text-sm focus:border-danger focus:outline-none"
      />
      <button
        type="button"
        onClick={handleDelete}
        disabled={confirmation !== CONFIRM_WORD || isPending}
        className="inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded-full bg-danger px-4 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 className="size-4" aria-hidden="true" />
        )}
        Delete my account and all data
      </button>
      <p aria-live="polite" className="min-h-5 text-sm text-alert">
        {error ?? ""}
      </p>
    </div>
  );
}
