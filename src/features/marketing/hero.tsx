import Link from "next/link";
import { GithubMark } from "@/components/brand";
import type { StyleWithVars } from "@/lib/css-vars";
import { SITE } from "@/lib/site";
import { FunnelPreview } from "./funnel-preview";

const HEADLINE = [
  { word: "Find", isAccent: false },
  { word: "the", isAccent: false },
  { word: "step", isAccent: true },
  { word: "that", isAccent: false },
  { word: "costs", isAccent: false },
  { word: "you", isAccent: false },
  { word: "revenue.", isAccent: false },
] as const;

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="pt-14 text-center sm:pt-20 lg:pt-28"
    >
      <p className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-muted uppercase">
        <span className="size-1.5 rounded-full bg-lime" aria-hidden="true" />
        Open-source product analytics
      </p>
      <h1
        id="hero-title"
        className="mx-auto mt-5 max-w-[13ch] text-[clamp(3rem,8.4vw,7.25rem)] leading-[0.92] font-extrabold tracking-[-0.055em] text-balance"
      >
        {HEADLINE.map(({ word, isAccent }, index) => {
          const delay: StyleWithVars = { "--i": index };
          return (
            <span key={word}>
              <span
                style={delay}
                className={`inline-block animate-rise [animation-delay:calc(var(--i)*70ms)] ${isAccent ? "text-lime" : ""}`}
              >
                {word}
              </span>{" "}
            </span>
          );
        })}
      </h1>
      <p className="mx-auto mt-7 max-w-[56ch] animate-fade text-[clamp(16px,1.6vw,19px)] leading-relaxed text-pretty text-muted [animation-delay:420ms]">
        Stallpoint reads your raw product events and turns them into funnels:
        where users convert, where they stall, and which step to fix first.
      </p>
      <div className="mt-9 flex animate-fade flex-wrap justify-center gap-3 [animation-delay:420ms]">
        <Link
          href={SITE.signInPath}
          className="inline-flex h-11 items-center rounded-full bg-lime px-5 text-[15px] font-semibold text-on-lime transition-[background-color,transform] hover:bg-lime-hover active:scale-[0.97]"
        >
          Start free during beta
        </Link>
        <a
          href={SITE.githubUrl}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-panel px-5 text-[15px] font-semibold transition-colors hover:bg-panel-2"
        >
          <GithubMark />
          View the code
        </a>
      </div>
      <div className="mt-12 pb-20 sm:mt-16 lg:mt-20 lg:pb-24">
        <FunnelPreview />
      </div>
    </section>
  );
}
