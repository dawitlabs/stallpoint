import { STEP_PATTERN } from "./limits";

export type FunnelStep = { name: string; path: string | null };

export function parseStep(raw: string): FunnelStep | null {
  const match = STEP_PATTERN.exec(raw.trim());
  if (!match?.[1]) return null;
  return { name: match[1], path: match[2] ?? null };
}

export function formatStep(step: FunnelStep): string {
  return step.path ? `${step.name} ${step.path}` : step.name;
}
