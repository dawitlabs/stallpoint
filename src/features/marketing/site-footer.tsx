import Link from "next/link";
import { BrandLink } from "@/components/brand";
import { SITE } from "@/lib/site";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#product", label: "Features" },
      { href: "/#how", label: "How it works" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Open source",
    links: [
      { href: SITE.githubUrl, label: "GitHub" },
      { href: `${SITE.githubUrl}/issues`, label: "Issues" },
      {
        href: `${SITE.githubUrl}/blob/main/docs/decisions.md`,
        label: "Decisions",
      },
    ],
  },
  {
    title: "Account",
    links: [
      { href: SITE.signInPath, label: "Sign in" },
      { href: SITE.dashboardPath, label: "Dashboard" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="pt-16 pb-24">
      <div className="mx-auto w-[min(1200px,100%-2rem)]">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <BrandLink />
            <p className="mt-4 max-w-[30ch] text-sm text-muted">
              Product analytics that shows the step, not just the number.
            </p>
          </div>
          {COLUMNS.map((column) => (
            <nav
              key={column.title}
              aria-label={column.title}
              className="grid content-start gap-2.5 text-sm text-muted"
            >
              <h3 className="mb-1.5 font-mono text-[11px] font-medium tracking-[0.08em] text-faint uppercase">
                {column.title}
              </h3>
              {column.links.map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="hover:text-paper"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="hover:text-paper"
                  >
                    {link.label}
                  </a>
                ),
              )}
            </nav>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap justify-between gap-4 border-t border-line pt-6 font-mono text-xs text-faint">
          <span>Public beta</span>
          <span>© 2026 Stallpoint · MIT licensed</span>
        </div>
      </div>
    </footer>
  );
}
