import Link from "next/link";
import { GithubMark } from "@/components/brand";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

export function ClosingSection() {
  return (
    <section
      aria-labelledby="closing-title"
      className="border-b border-line py-24 text-center sm:py-36 lg:py-48"
    >
      <Reveal className="mx-auto w-[min(1200px,100%-2rem)]">
        <h2
          id="closing-title"
          className="mx-auto max-w-[14ch] text-[clamp(3rem,9vw,8rem)] leading-[0.92] font-extrabold tracking-[-0.055em]"
        >
          Stop guessing where users leave.
        </h2>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
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
            Star on GitHub
          </a>
        </div>
      </Reveal>
    </section>
  );
}
