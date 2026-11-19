import { GithubMark } from "@/components/brand";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";
import { SectionIndex, SectionLede, SectionTitle } from "./section-head";

const EXAMPLE_EVENTS = [
  { time: "12:04:31", name: "page_view", detail: "/settings" },
  { time: "12:04:32", name: "invite_skipped", detail: "web" },
  { time: "12:04:35", name: "data_connected", detail: "segment" },
  { time: "12:04:38", name: "plan_upgraded", detail: "growth" },
] as const;

const COMING_NEXT = [
  "AI path insights",
  "Experiments",
  "Warehouse sync",
  "Team seats",
] as const;

const TILE =
  "flex flex-col justify-between gap-8 rounded-tile border border-line bg-panel p-6 sm:p-7";

function TileCopy({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold tracking-[-0.02em]">{title}</h3>
      <p className="mt-2 max-w-[40ch] text-[15px] leading-normal text-muted">
        {body}
      </p>
    </div>
  );
}

function FunnelsTile() {
  return (
    <Reveal className={`${TILE} md:col-span-4`}>
      <TileCopy
        title="Funnels"
        body="Pick two to five events. See how many visitors reach each one, in order, and where the biggest drop is."
      />
      <svg viewBox="0 0 600 180" className="h-auto w-full" aria-hidden="true">
        <g fill="none" strokeWidth="3" className="stroke-drop">
          <path d="M10 90 C 160 90, 200 30, 590 30" />
          <path d="M10 90 C 160 90, 220 70, 590 70" />
          <path d="M10 90 C 160 90, 220 140, 590 140" />
        </g>
        <path
          d="M10 90 C 180 90, 240 120, 400 120 S 520 170, 590 172"
          fill="none"
          strokeWidth="5"
          className="stroke-lime"
        />
        <circle cx="10" cy="90" r="6" className="fill-paper" />
        <circle cx="400" cy="120" r="6" className="fill-lime" />
      </svg>
    </Reveal>
  );
}

function LiveStreamTile() {
  return (
    <Reveal className={`${TILE} md:col-span-2`}>
      <TileCopy
        title="Live event stream"
        body="Events show up seconds after they happen. Good for checking an install."
      />
      <ol aria-label="Example events" className="grid gap-2 font-mono text-xs">
        {EXAMPLE_EVENTS.map((event) => (
          <li
            key={event.time}
            className="grid grid-cols-[auto_1fr_auto] gap-3 rounded-md bg-panel-2 px-2.5 py-2"
          >
            <time className="text-faint">{event.time}</time>
            <span className="truncate">{event.name}</span>
            <span className="text-muted">{event.detail}</span>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

export function ProductSection() {
  return (
    <section
      id="product"
      aria-labelledby="product-title"
      className="border-b border-line py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto w-[min(1200px,100%-2rem)]">
        <Reveal className="mb-10 grid items-end gap-8 sm:mb-16 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionIndex number="01" label="Product" />
            <SectionTitle id="product-title">
              Everything between the first click and the upgrade.
            </SectionTitle>
          </div>
          <SectionLede>
            One script collects page views and the events you name. Stallpoint
            links them per visitor and shows the step where they stop.
          </SectionLede>
        </Reveal>

        <div className="grid gap-3 md:grid-cols-6">
          <FunnelsTile />

          <LiveStreamTile />

          <Reveal className={`${TILE} md:col-span-2`}>
            <TileCopy
              title="One-line install"
              body="Paste one script tag. Page views start right away, custom events take one call."
            />
            <code className="block rounded-xl bg-panel-2 p-3 font-mono text-xs leading-relaxed break-all text-muted">
              <span className="text-lime">stallpoint</span>.track(
              <span className="text-paper">&quot;plan_upgraded&quot;</span>)
            </code>
          </Reveal>

          <Reveal className={`${TILE} md:col-span-2`}>
            <TileCopy
              title="Deletable by design"
              body="Delete a project and every event goes with it. Delete your account and everything goes. Nothing is sold."
            />
            <p className="font-mono text-xs text-faint">
              No ad trackers. No data resale.
            </p>
          </Reveal>

          <Reveal className={`${TILE} md:col-span-2`}>
            <TileCopy
              title="Open source"
              body="Every line is public. Read how events are stored before you send one."
            />
            <a
              href={SITE.githubUrl}
              className="inline-flex items-center gap-2 text-sm font-semibold hover:text-lime"
            >
              <GithubMark />
              dawitlabs/stallpoint
            </a>
          </Reveal>
        </div>

        <Reveal className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs text-faint">
          <span className="mr-1 tracking-[0.08em] uppercase">Coming next</span>
          {COMING_NEXT.map((item) => (
            <span
              key={item}
              className="rounded-full border border-line px-2.5 py-1 text-muted"
            >
              {item}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
