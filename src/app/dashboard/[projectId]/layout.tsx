import { Suspense } from "react";
import {
  ProjectHeader,
  ProjectHeaderSkeleton,
} from "@/features/projects/project-header";

export default function ProjectLayout({
  children,
  params,
}: LayoutProps<"/dashboard/[projectId]">) {
  return (
    <>
      <Suspense fallback={<ProjectHeaderSkeleton />}>
        <ProjectHeader params={params} />
      </Suspense>
      {children}
    </>
  );
}
