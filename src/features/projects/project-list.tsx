import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { CreateProjectForm } from "./create-project-form";
import { listMyProjects } from "./queries";

const DATE_FORMAT = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export async function ProjectList() {
  const projects = await listMyProjects();

  if (projects.length === 0) {
    return (
      <div className="grid gap-6 rounded-panel border border-line bg-panel p-7 sm:p-10">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.03em]">
            Create your first project
          </h2>
          <p className="mt-2 max-w-[52ch] text-[15px] text-muted">
            A project is one site or app. You&apos;ll get a script tag to paste,
            and events start showing up right away.
          </p>
        </div>
        <CreateProjectForm />
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <ul className="overflow-hidden rounded-panel border border-line bg-panel">
        {projects.map((project) => (
          <li key={project.id} className="border-b border-line last:border-b-0">
            <Link
              href={`${SITE.dashboardPath}/${project.id}`}
              className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-panel-2 sm:px-6"
            >
              <span className="min-w-0">
                <span className="block truncate font-semibold">
                  {project.name}
                </span>
                <span className="mt-0.5 block font-mono text-xs text-faint">
                  Created {DATE_FORMAT.format(project.createdAt)}
                </span>
              </span>
              <span className="flex items-center gap-4">
                <span className="text-right font-mono text-xs text-muted">
                  <span className="block text-base text-paper tabular-nums">
                    {project.eventsLastDay.toLocaleString("en-US")}
                  </span>
                  events, 24h
                </span>
                <ChevronRight
                  className="size-4 text-faint"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="rounded-panel border border-line p-6">
        <h2 className="mb-3 text-lg font-semibold tracking-[-0.02em]">
          New project
        </h2>
        <CreateProjectForm />
      </div>
    </div>
  );
}

export function ProjectListSkeleton() {
  return (
    <output
      aria-label="Loading projects"
      className="grid gap-px overflow-hidden rounded-panel border border-line"
    >
      {[0, 1, 2].map((row) => (
        <div key={row} className="h-[74px] animate-pulse bg-panel" />
      ))}
    </output>
  );
}
