import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ProjectList,
  ProjectListSkeleton,
} from "@/features/projects/project-list";

export const metadata: Metadata = { title: "Projects" };

export default function DashboardPage() {
  return (
    <>
      <h1 className="mb-8 text-[clamp(2rem,4vw,2.75rem)] font-extrabold tracking-[-0.045em]">
        Projects
      </h1>
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectList />
      </Suspense>
    </>
  );
}
