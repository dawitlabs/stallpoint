import type { Metadata } from "next";
import { Suspense } from "react";
import {
  AccountPanel,
  AccountPanelSkeleton,
} from "@/features/account/account-panel";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <>
      <h1 className="mb-8 text-[clamp(2rem,4vw,2.75rem)] font-extrabold tracking-[-0.045em]">
        Account
      </h1>
      <Suspense fallback={<AccountPanelSkeleton />}>
        <AccountPanel />
      </Suspense>
    </>
  );
}
