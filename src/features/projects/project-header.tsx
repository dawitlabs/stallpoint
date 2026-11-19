import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { ProjectTabs } from "./project-tabs";
import { getMyProject } from "./queries";

export async function ProjectHeader({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getMyProject(projectId);
  return (
    <div className="mb-8 border-b border-line">
      <Link
        href={SITE.dashboardPath}
        className="inline-flex items-center gap-1 font-mono text-xs text-muted transition-colors hover:text-paper"
      >
        <ChevronLeft className="size-3.5" aria-hidden="true" />
        Projects
      </Link>
      <h1 className="mt-3 mb-4 truncate text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold tracking-[-0.045em]">
        {project.name}
      </h1>
      <ProjectTabs projectId={project.id} />
    </div>
  );
}

export function ProjectHeaderSkeleton() {
  return (
    <div className="mb-8 border-b border-line pb-14" aria-hidden="true">
      <div className="h-4 w-20 animate-pulse rounded bg-panel-2" />
      <div className="mt-4 h-10 w-64 animate-pulse rounded-xl bg-panel-2" />
    </div>
  );
}
