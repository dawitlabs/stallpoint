import { Trash2 } from "lucide-react";
import Link from "next/link";
import {
  buildFunnelSteps,
  type FunnelBarStep,
  FunnelBars,
} from "@/components/funnel-bars";
import { SITE } from "@/lib/site";
import { deleteFunnelAction } from "./actions";
import { computeFunnelCounts } from "./compute";
import { DEFAULT_RANGE_DAYS, RANGE_OPTIONS, WINDOW_OPTIONS } from "./limits";
import { getMyFunnel } from "./queries";
import { formatStep } from "./step";

type RangeDays = (typeof RANGE_OPTIONS)[number];

function parseRange(value: string | string[] | undefined): RangeDays {
  const days = Number(value);
  return RANGE_OPTIONS.find((option) => option === days) ?? DEFAULT_RANGE_DAYS;
}

function windowLabel(hours: number): string {
  return (
    WINDOW_OPTIONS.find((option) => option.hours === hours)?.label ??
    `${hours} hours`
  );
}

function RangeNav({ base, active }: { base: string; active: RangeDays }) {
  return (
    <nav
      aria-label="Date range"
      className="flex gap-1 rounded-full border border-line p-1 font-mono text-xs"
    >
      {RANGE_OPTIONS.map((days) => (
        <Link
          key={days}
          href={`${base}?days=${days}`}
          aria-current={days === active ? "page" : undefined}
          className={`rounded-full px-3 py-1.5 transition-colors ${days === active ? "bg-paper text-ink" : "text-muted hover:text-paper"}`}
        >
          {days}d
        </Link>
      ))}
    </nav>
  );
}

function EmptyFunnel({
  firstStep,
  rangeDays,
}: {
  firstStep: string;
  rangeDays: RangeDays;
}) {
  return (
    <div className="py-14 text-center">
      <p className="font-semibold">
        No visitors reached step 1 in the last {rangeDays} days
      </p>
      <p className="mx-auto mt-2 max-w-[48ch] text-sm text-muted">
        Check that <code className="font-mono text-paper">{firstStep}</code>{" "}
        matches an event in the live stream, or pick a longer range.
      </p>
    </div>
  );
}

function BiggestDropNote({ steps }: { steps: FunnelBarStep[] }) {
  const index = steps.findIndex((step) => step.isBiggestDrop);
  const before = steps[index - 1];
  const after = steps[index];
  if (index < 1 || !before || !after) return <div className="pb-5" />;
  return (
    <p className="mt-6 flex items-start gap-2.5 border-t border-line pt-3 pb-5 text-sm text-muted">
      <span
        className="mt-1.5 size-2 flex-none rounded-full bg-alert"
        aria-hidden="true"
      />
      <span>
        <strong className="font-semibold text-alert">Biggest drop:</strong>{" "}
        {(before.count - after.count).toLocaleString("en-US")} visitors reach{" "}
        <code className="font-mono text-paper">{before.label}</code> but never{" "}
        <code className="font-mono text-paper">{after.label}</code>.
      </span>
    </p>
  );
}

function DeleteFunnelButton({
  projectId,
  funnelId,
}: {
  projectId: string;
  funnelId: string;
}) {
  return (
    <form
      action={deleteFunnelAction}
      className="flex justify-end border-t border-line px-5 py-3"
    >
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="funnelId" value={funnelId} />
      <button
        type="submit"
        className="inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-danger/10 hover:text-danger"
      >
        <Trash2 className="size-4" aria-hidden="true" />
        Delete funnel
      </button>
    </form>
  );
}

export async function FunnelReport({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string; funnelId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ projectId, funnelId }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const funnel = await getMyFunnel(projectId, funnelId);
  const rangeDays = parseRange(query.days);
  const counts = await computeFunnelCounts(
    projectId,
    funnel.steps,
    funnel.windowHours,
    rangeDays,
  );
  const steps = buildFunnelSteps(
    funnel.steps.map((step, index) => ({
      label: formatStep(step),
      count: counts[index] ?? 0,
    })),
  );
  const first = steps[0]?.count ?? 0;
  const overall = steps.at(-1)?.percentOfFirst ?? 0;

  return (
    <section
      aria-labelledby="funnel-title"
      className="overflow-hidden rounded-panel border border-line bg-panel"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div className="min-w-0">
          <h2
            id="funnel-title"
            className="truncate text-lg font-semibold tracking-[-0.02em]"
          >
            {funnel.name}
          </h2>
          <p className="mt-1 font-mono text-xs text-faint">
            {first.toLocaleString("en-US")} visitors · {overall}% overall ·
            finish within {windowLabel(funnel.windowHours)}
          </p>
        </div>
        <RangeNav
          base={`${SITE.dashboardPath}/${projectId}/funnels/${funnel.id}`}
          active={rangeDays}
        />
      </div>
      <div className="px-4 pt-6 sm:px-5">
        {first === 0 ? (
          <EmptyFunnel
            firstStep={steps[0]?.label ?? ""}
            rangeDays={rangeDays}
          />
        ) : (
          <>
            <FunnelBars steps={steps} unit="visitors" />
            <BiggestDropNote steps={steps} />
          </>
        )}
      </div>
      <DeleteFunnelButton projectId={projectId} funnelId={funnel.id} />
    </section>
  );
}

export function FunnelReportSkeleton() {
  return (
    <div
      className="h-[420px] animate-pulse rounded-panel border border-line bg-panel"
      aria-hidden="true"
    />
  );
}
