import type { StyleWithVars } from "@/lib/css-vars";
import { plural } from "@/lib/plural";

export type FunnelBarStep = {
  label: string;
  count: number;
  percentOfFirst: number;
  percentOfPrevious: number | null;
  isBiggestDrop: boolean;
};

export function FunnelBars({
  steps,
  unit,
}: {
  steps: FunnelBarStep[];
  unit: string;
}) {
  const gridVars: StyleWithVars = { "--steps": steps.length };
  return (
    <ol
      className="grid gap-[18px] sm:grid-cols-[repeat(var(--steps),minmax(0,1fr))] sm:gap-0"
      style={gridVars}
    >
      {steps.map((step, index) => {
        const previous =
          index === 0
            ? step.percentOfFirst
            : (steps[index - 1]?.percentOfFirst ?? step.percentOfFirst);
        const barVars: StyleWithVars = {
          "--pct": step.percentOfFirst,
          "--prev": previous,
          "--i": index,
        };
        return (
          <li
            key={`${step.label}-${index}`}
            style={barVars}
            className="relative grid min-w-0 gap-2 sm:grid-rows-[200px_auto] sm:gap-3.5 sm:px-3 sm:first:pl-0 sm:last:pr-0"
          >
            <div className="relative order-2 h-3 overflow-hidden rounded-full bg-panel-2 sm:order-none sm:h-auto sm:rounded-[10px]">
              <span
                className={`absolute inset-y-0 left-[calc(var(--pct)*1%)] w-[calc((var(--prev)-var(--pct))*1%)] sm:inset-x-0 sm:top-auto sm:bottom-[calc(var(--pct)*1%)] sm:left-0 sm:h-[calc((var(--prev)-var(--pct))*1%)] sm:w-auto ${step.isBiggestDrop ? "hatch-alert" : "hatch"}`}
              />
              <span className="absolute inset-y-0 left-0 w-[calc(var(--pct)*1%)] origin-left animate-[grow-x_900ms_var(--ease-expo)_both] rounded-full bg-lime [animation-delay:calc(300ms+var(--i)*90ms)] sm:inset-x-0 sm:top-auto sm:bottom-0 sm:h-[calc(var(--pct)*1%)] sm:w-auto sm:origin-bottom sm:animate-[grow-y_900ms_var(--ease-expo)_both] sm:rounded-t-lg sm:rounded-b-none" />
            </div>
            <div className="order-1 flex min-w-0 items-baseline gap-2.5 sm:order-none sm:block">
              <span
                className="flex-1 truncate font-mono text-[11px] tracking-[0.04em] text-faint uppercase sm:block"
                title={step.label}
              >
                {step.label}
              </span>
              {step.percentOfPrevious !== null ? (
                <span
                  className={`rounded-full border bg-panel px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap sm:absolute sm:top-6 sm:left-0 sm:z-10 sm:-translate-x-1/2 sm:text-[11px] ${step.isBiggestDrop ? "border-alert/60 text-alert" : "border-line text-muted"}`}
                >
                  → {step.percentOfPrevious}%
                </span>
              ) : null}
              <span className="order-3 text-lg font-semibold tracking-[-0.03em] tabular-nums sm:mt-1.5 sm:block sm:text-[28px]">
                {step.percentOfFirst}%
              </span>
              <span className="hidden font-mono text-xs text-faint sm:mt-0.5 sm:block">
                {plural(step.count, unit)}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function buildFunnelSteps(
  rows: { label: string; count: number }[],
): FunnelBarStep[] {
  const first = rows[0]?.count ?? 0;
  const drops = rows.map((row, index) =>
    index === 0 ? 0 : (rows[index - 1]?.count ?? 0) - row.count,
  );
  const biggestDrop = Math.max(0, ...drops);
  return rows.map((row, index) => {
    const previousCount = index === 0 ? null : (rows[index - 1]?.count ?? 0);
    return {
      label: row.label,
      count: row.count,
      percentOfFirst:
        first === 0 ? 0 : Math.round((row.count / first) * 1000) / 10,
      percentOfPrevious:
        previousCount === null
          ? null
          : previousCount === 0
            ? 0
            : Math.round((row.count / previousCount) * 100),
      isBiggestDrop: biggestDrop > 0 && drops[index] === biggestDrop,
    };
  });
}
