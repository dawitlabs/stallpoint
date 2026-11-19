import { Suspense } from "react";
import { LiveEvents } from "@/features/events/live-events";
import {
  InstallCard,
  InstallCardSkeleton,
} from "@/features/projects/install-card";

async function LiveEventsForProject({
  params,
}: {
  params: PageProps<"/dashboard/[projectId]">["params"];
}) {
  const { projectId } = await params;
  return <LiveEvents projectId={projectId} />;
}

export default function ProjectOverviewPage({
  params,
}: PageProps<"/dashboard/[projectId]">) {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <Suspense fallback={<InstallCardSkeleton />}>
        <InstallCard params={params} />
      </Suspense>
      <Suspense fallback={null}>
        <LiveEventsForProject params={params} />
      </Suspense>
    </div>
  );
}
