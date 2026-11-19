"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/site";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-line"
      >
        {isOpen ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Menu className="size-5" aria-hidden="true" />
        )}
      </button>
      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!isOpen}
        className="absolute inset-x-0 top-full z-20 grid gap-0.5 rounded-panel border border-line bg-panel p-2"
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="rounded-2xl p-3 text-[15px] font-medium hover:bg-panel-2"
          >
            {link.label}
          </a>
        ))}
        <Link
          href={SITE.signInPath}
          className="rounded-2xl p-3 text-[15px] font-medium hover:bg-panel-2"
        >
          Sign in
        </Link>
      </nav>
    </div>
  );
}
