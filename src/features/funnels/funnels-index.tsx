import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { listEventNames, listTopPaths } from "@/features/events/queries";
import { getMyProject } from "@/features/projects/queries";
import { SITE } from "@/lib/site";
import { CreateFunnelForm } from "./create-funnel-form";
import { listMyFunnels } from "./queries";
import { formatStep } from "./step";

const SUGGESTION_LIMIT = 40;

export async function FunnelsIndex({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getMyProject(projectId);
  const [funnelList, names, paths] = await Promise.all([
    listMyFunnels(project.id),
    listEventNames(project.id),
    listTopPaths(project.id),
  ]);
  const suggestions = [
    ...paths.map((path) => `page_view ${path.name}`),
    ...names.map((name) => name.name),
  ].slice(0, SUGGESTION_LIMIT);
  const base = `${SITE.dashboardPath}/${project.id}/funnels`;

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <section
        aria-labelledby="funnels-title"
        className="overflow-hidden rounded-panel border border-line bg-panel"
      >
        <h2
          id="funnels-title"
          className="border-b border-line px-5 py-4 font-semibold"
        >
          Funnels
        </h2>
        {funnelList.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-semibold">No funnels yet</p>
            <p className="mx-auto mt-2 max-w-[42ch] text-sm text-muted">
              {names.length === 0
                ? "Install the script first, then build a funnel from the events that arrive."
                : "Pick two to five steps on the right to see where visitors drop off."}
            </p>
          </div>
        ) : (
          <ul>
            {funnelList.map((funnel) => (
              <li
                key={funnel.id}
                className="border-b border-line last:border-b-0"
              >
                <Link
                  href={`${base}/${funnel.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-panel-2"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">
                      {funnel.name}
                    </span>
                    <span className="mt-1 block truncate font-mono text-xs text-faint">
                      {funnel.steps.map(formatStep).join(" → ")}
                    </span>
                  </span>
                  <ChevronRight
                    className="size-4 flex-none text-faint"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section
        aria-labelledby="new-funnel-title"
        className="rounded-panel border border-line p-5 sm:p-6"
      >
        <h2 id="new-funnel-title" className="mb-4 font-semibold">
          New funnel
        </h2>
        <CreateFunnelForm projectId={project.id} suggestions={suggestions} />
      </section>
    </div>
  );
}

export function FunnelsIndexSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]" aria-hidden="true">
      <div className="h-64 animate-pulse rounded-panel border border-line bg-panel" />
      <div className="h-96 animate-pulse rounded-panel border border-line bg-panel" />
    </div>
  );
}
