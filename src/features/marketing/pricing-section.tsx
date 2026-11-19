import { Check } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";
import { SectionIndex, SectionLede, SectionTitle } from "./section-head";

const BETA_INCLUDES = [
  "Unlimited projects",
  "Funnels with up to five steps",
  "Live event stream",
  "Fair use: around 1M events a month",
  "Delete your data any time",
] as const;

export function PricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="border-b border-line py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto grid w-[min(1200px,100%-2rem)] items-start gap-10 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <SectionIndex number="03" label="Pricing" />
          <SectionTitle id="pricing-title">
            Free while it&apos;s in beta.
          </SectionTitle>
          <div className="mt-6">
            <SectionLede>
              Paid plans come later, priced by events, not seats. You&apos;ll
              get 30 days&apos; notice before anything changes, and you can
              export or delete everything before then.
            </SectionLede>
          </div>
        </Reveal>
        <Reveal className="flex flex-col gap-5 rounded-tile border border-lime bg-panel p-7 shadow-[inset_0_0_0_1px_var(--lime)]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold tracking-[-0.02em]">Beta</h3>
            <span className="font-mono text-[11px] tracking-[0.06em] text-lime uppercase">
              Open now
            </span>
          </div>
          <p className="flex items-baseline gap-2">
            <span className="text-[56px] leading-none font-bold tracking-[-0.05em]">
              $0
            </span>
            <span className="text-sm text-muted">during beta</span>
          </p>
          <Link
            href={SITE.signInPath}
            className="inline-flex h-11 items-center justify-center rounded-full bg-lime px-5 text-[15px] font-semibold text-on-lime transition-[background-color,transform] hover:bg-lime-hover active:scale-[0.97]"
          >
            Start free
          </Link>
          <ul className="grid gap-3 border-t border-line pt-5 text-[15px]">
            {BETA_INCLUDES.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Check
                  className="size-4 flex-none text-lime"
                  strokeWidth={3}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
