import Link from "next/link";
import { Suspense } from "react";
import { BrandMark } from "@/components/brand";
import { UserMenu, UserMenuSkeleton } from "@/features/dashboard/user-menu";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 w-[min(1200px,100%-2rem)] items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-bold tracking-[-0.02em]"
          >
            <BrandMark />
            Stallpoint
            <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.06em] text-muted uppercase">
              Beta
            </span>
          </Link>
          <Suspense fallback={<UserMenuSkeleton />}>
            <UserMenu />
          </Suspense>
        </div>
      </header>
      <div className="mx-auto w-[min(1200px,100%-2rem)] py-10">{children}</div>
    </div>
  );
}
