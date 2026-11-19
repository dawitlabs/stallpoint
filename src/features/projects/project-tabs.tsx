"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `${SITE.dashboardPath}/${projectId}`;
  const tabs = [
    { href: base, label: "Overview", isActive: pathname === base },
    {
      href: `${base}/funnels`,
      label: "Funnels",
      isActive: pathname.startsWith(`${base}/funnels`),
    },
    {
      href: `${base}/settings`,
      label: "Settings",
      isActive: pathname.startsWith(`${base}/settings`),
    },
  ];
  return (
    <nav aria-label="Project" className="-mb-px flex gap-1 overflow-x-auto">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.isActive ? "page" : undefined}
          className={`border-b-2 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${tab.isActive ? "border-lime text-paper" : "border-transparent text-muted hover:text-paper"}`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
