export const SITE = {
  name: "Stallpoint",
  githubUrl: "https://github.com/dawitlabs/stallpoint",
  signInPath: "/sign-in",
  dashboardPath: "/dashboard",
} as const;

export const NAV_LINKS = [
  { href: "/#product", label: "Product" },
  { href: "/#how", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
] as const;
