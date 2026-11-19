import type { Metadata } from "next";
import { Suspense } from "react";
import {
  FunnelReport,
  FunnelReportSkeleton,
} from "@/features/funnels/funnel-report";

export const metadata: Metadata = { title: "Funnel" };

export default function FunnelPage({
  params,
  searchParams,
}: PageProps<"/dashboard/[projectId]/funnels/[funnelId]">) {
  return (
    <Suspense fallback={<FunnelReportSkeleton />}>
      <FunnelReport params={params} searchParams={searchParams} />
    </Suspense>
  );
}
