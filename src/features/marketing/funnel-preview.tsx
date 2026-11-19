import type { StyleWithVars } from "@/lib/css-vars";

const EXAMPLE_TOTAL = 18_402;

const EXAMPLE_STEPS = [
  { name: "Started trial", value: 100 },
  { name: "Created project", value: 72 },
  { name: "Opened settings", value: 41, isBiggestDrop: true },
  { name: "Connected data", value: 38 },
  { name: "Upgraded to paid", value: 19 },
] as const;

function formatCount(percent: number): string {
  return Math.round((EXAMPLE_TOTAL * percent) / 100).toLocaleString("en-US");
}

export function FunnelPreview() {
  return (
    <div
      role="img"
      aria-label="Example funnel for 18,402 trials: 72% create a project, 41% open settings, 38% connect data and 19% upgrade. The biggest drop is 31% of trials, who create a project but never open settings."
      className="overflow-hidden rounded-panel border border-line bg-panel text-left"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 font-mono text-xs text-muted">
        <div className="flex gap-2">
          <span>acme</span>
          <span className="text-faint">/</span>
          <span>funnels</span>
          <span className="text-faint">/</span>
          <span className="text-paper">trial-to-paid</span>
        </div>
        <span className="rounded-full border border-line px-2.5 py-1">
          Example data
        </span>
      </div>

      <div className="px-4 pt-5 sm:px-5 sm:pt-6">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div>
            <p className="text-[15px] font-semibold">Trial to paid funnel</p>
            <p className="mt-1 font-mono text-xs text-faint">
              18,402 trials · 19.0% overall conversion · last 30 days
            </p>
          </div>
          <div
            className="hidden gap-4 font-mono text-[11px] text-muted sm:flex"
            aria-hidden="true"
          >
            <span className="flex items-center gap-1.5">
              <i className="size-2.5 rounded-[3px] bg-lime" />
              Reached step
            </span>
            <span className="flex items-center gap-1.5">
              <i className="hatch size-2.5 rounded-[3px]" />
              Dropped off
            </span>
          </div>
        </div>

        <ol className="mt-6 grid gap-[18px] sm:mt-7 sm:grid-cols-5 sm:gap-0">
          {EXAMPLE_STEPS.map((step, index) => {
            const previous =
              index === 0 ? step.value : EXAMPLE_STEPS[index - 1].value;
            const conversion = Math.round((step.value / previous) * 100);
            const isBiggestDrop = "isBiggestDrop" in step;
            const barVars: StyleWithVars = {
              "--pct": step.value,
              "--prev": previous,
              "--i": index,
            };
            return (
              <li
                key={step.name}
                style={barVars}
                className="relative grid min-w-0 gap-2 sm:grid-rows-[200px_auto] sm:gap-3.5 sm:px-3 sm:first:pl-0 sm:last:pr-0"
              >
                <div className="relative order-2 h-3 overflow-hidden rounded-full bg-panel-2 sm:order-none sm:h-auto sm:rounded-[10px]">
                  <span
                    className={`absolute inset-y-0 left-[calc(var(--pct)*1%)] w-[calc((var(--prev)-var(--pct))*1%)] sm:inset-x-0 sm:top-auto sm:bottom-[calc(var(--pct)*1%)] sm:left-0 sm:h-[calc((var(--prev)-var(--pct))*1%)] sm:w-auto ${isBiggestDrop ? "hatch-alert" : "hatch"}`}
                  />
                  <span className="absolute inset-y-0 left-0 w-[calc(var(--pct)*1%)] origin-left animate-[grow-x_900ms_var(--ease-expo)_both] rounded-full bg-lime [animation-delay:calc(500ms+var(--i)*90ms)] sm:inset-x-0 sm:top-auto sm:bottom-0 sm:h-[calc(var(--pct)*1%)] sm:w-auto sm:origin-bottom sm:animate-[grow-y_900ms_var(--ease-expo)_both] sm:rounded-t-lg sm:rounded-b-none" />
                </div>
                <div className="order-1 flex min-w-0 items-baseline gap-2.5 sm:order-none sm:block">
                  <span className="flex-1 truncate font-mono text-[11px] tracking-[0.04em] text-faint uppercase sm:block">
                    {step.name}
                  </span>
                  {index > 0 ? (
                    <span
                      className={`rounded-full border bg-panel px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap sm:absolute sm:top-6 sm:left-0 sm:z-10 sm:-translate-x-1/2 sm:text-[11px] ${isBiggestDrop ? "border-alert/60 text-alert" : "border-line text-muted"}`}
                    >
                      → {conversion}%
                    </span>
                  ) : null}
                  <span className="order-3 text-lg font-semibold tracking-[-0.03em] tabular-nums sm:mt-1.5 sm:block sm:text-[28px]">
                    {step.value}%
                  </span>
                  <span className="hidden font-mono text-xs text-faint sm:mt-0.5 sm:block">
                    {formatCount(step.value)} trials
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-6 flex items-start gap-2.5 border-t border-line pt-3 pb-5 text-[13px] text-muted sm:items-center sm:text-sm">
          <span
            className="mt-1.5 size-2 flex-none rounded-full bg-alert sm:mt-0"
            aria-hidden="true"
          />
          <span>
            <strong className="font-semibold text-alert">Biggest drop:</strong>{" "}
            5,704 trials (31%) create a project but never open settings.
          </span>
        </p>
      </div>
    </div>
  );
}
