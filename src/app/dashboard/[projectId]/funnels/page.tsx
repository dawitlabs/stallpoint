import type { Metadata } from "next";
import { Suspense } from "react";
import {
  FunnelsIndex,
  FunnelsIndexSkeleton,
} from "@/features/funnels/funnels-index";

export const metadata: Metadata = { title: "Funnels" };

export default function FunnelsPage({
  params,
}: PageProps<"/dashboard/[projectId]/funnels">) {
  return (
    <Suspense fallback={<FunnelsIndexSkeleton />}>
      <FunnelsIndex params={params} />
    </Suspense>
  );
}
