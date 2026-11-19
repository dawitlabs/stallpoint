"use client";

import { useEffect, useRef, useState } from "react";

const RESET_AFTER_MS = 1600;

type CopyState = "idle" | "copied" | "failed";

const LABELS: Record<CopyState, string> = {
  idle: "Copy",
  copied: "Copied",
  failed: "Press ⌘C",
};

export function CopyButton({
  value,
  label,
  className = "",
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), RESET_AFTER_MS);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      className={`min-w-[58px] cursor-pointer rounded-full bg-panel-2 px-2.5 py-1.5 font-mono text-xs transition-colors hover:text-paper ${state === "copied" ? "text-lime" : "text-muted"} ${className}`}
    >
      <span aria-live="polite">{LABELS[state]}</span>
    </button>
  );
}
