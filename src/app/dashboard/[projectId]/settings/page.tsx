import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ProjectSettings,
  ProjectSettingsSkeleton,
} from "@/features/projects/project-settings";

export const metadata: Metadata = { title: "Project settings" };

export default function ProjectSettingsPage({
  params,
}: PageProps<"/dashboard/[projectId]/settings">) {
  return (
    <Suspense fallback={<ProjectSettingsSkeleton />}>
      <ProjectSettings params={params} />
    </Suspense>
  );
}
