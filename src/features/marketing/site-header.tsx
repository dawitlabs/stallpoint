import Link from "next/link";
import { BrandLink } from "@/components/brand";
import { NAV_LINKS, SITE } from "@/lib/site";
import { MobileMenu } from "./mobile-menu";

export function SiteHeader() {
  return (
    <>
      <div className="flex justify-center gap-2.5 border-b border-line px-4 py-2.5 font-mono text-xs tracking-[0.02em] text-muted">
        <span
          className="size-1.5 self-center rounded-full bg-lime"
          aria-hidden="true"
        />
        <span>Public beta · open source</span>
        <a
          href={SITE.githubUrl}
          className="text-paper transition-colors hover:text-lime"
        >
          GitHub <span aria-hidden="true">→</span>
        </a>
      </div>
      <div className="mx-auto w-[min(1200px,100%-2rem)]">
        <header className="relative flex h-[72px] items-center justify-between gap-4">
          <BrandLink />
          <nav
            aria-label="Main"
            className="hidden gap-1 font-mono text-[13px] text-muted lg:flex"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 transition-colors hover:text-paper"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href={SITE.signInPath}
              className="hidden h-9 items-center rounded-full px-3.5 text-sm font-semibold transition-colors hover:bg-panel-2 sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href={SITE.signInPath}
              className="inline-flex h-9 items-center rounded-full bg-lime px-3.5 text-sm font-semibold text-on-lime transition-[background-color,transform] hover:bg-lime-hover active:scale-[0.97]"
            >
              Start free
            </Link>
            <MobileMenu />
          </div>
        </header>
      </div>
    </>
  );
}
