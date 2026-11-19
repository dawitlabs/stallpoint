import { buildFunnelSteps, FunnelBars } from "@/components/funnel-bars";

const EXAMPLE_STEPS = buildFunnelSteps([
  { label: "Started trial", count: 18_402 },
  { label: "Created project", count: 13_249 },
  { label: "Opened settings", count: 7_545 },
  { label: "Connected data", count: 6_993 },
  { label: "Upgraded to paid", count: 3_496 },
]);

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

        <div className="mt-6 sm:mt-7">
          <FunnelBars steps={EXAMPLE_STEPS} unit="trial" />
        </div>

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
