import { Reveal } from "@/components/reveal";
import type { StyleWithVars } from "@/lib/css-vars";
import { publicEnv } from "@/lib/public-env";
import { SectionIndex, SectionTitle } from "./section-head";
import { type StepTab, StepTabs } from "./step-tabs";

const CODE =
  "m-0 overflow-x-auto p-6 font-mono text-[13px] leading-[1.8] whitespace-pre-wrap break-words sm:text-sm";

const EXAMPLE_FUNNEL = [
  { name: "page_view /pricing", value: 100 },
  { name: "signup_started", value: 46 },
  { name: "signup_completed", value: 31 },
  { name: "project_created", value: 22 },
] as const;

function InstallPane() {
  return (
    <pre className={CODE}>
      <code>
        <span className="text-faint">{"<!-- before </head> -->"}</span>
        {"\n"}
        <span className="text-lime">{"<script"}</span> defer{"\n"}
        {"  "}src=
        <span className="text-muted">
          &quot;{publicEnv.NEXT_PUBLIC_APP_URL}/sdk.js&quot;
        </span>
        {"\n"}
        {"  "}data-key=
        <span className="text-muted">&quot;YOUR_WRITE_KEY&quot;</span>
        <span className="text-lime">{"></script>"}</span>
      </code>
    </pre>
  );
}

function TrackPane() {
  return (
    <pre className={CODE}>
      <code>
        <span className="text-faint">{"// page views are automatic"}</span>
        {"\n\n"}
        <span className="text-lime">stallpoint</span>.track(
        <span className="text-muted">&quot;project_created&quot;</span>, {"{"}
        {"\n"}
        {"  "}plan: <span className="text-muted">&quot;free&quot;</span>,{"\n"}
        {"}"});{"\n\n"}
        <span className="text-lime">stallpoint</span>.identify(
        <span className="text-muted">&quot;user_8127&quot;</span>);
      </code>
    </pre>
  );
}

function FunnelPane() {
  return (
    <ol className="grid gap-1 p-6">
      {EXAMPLE_FUNNEL.map((step) => {
        const width: StyleWithVars = { "--w": `${step.value}%` };
        return (
          <li
            key={step.name}
            className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 py-2.5 text-sm"
          >
            <span className="truncate font-mono text-[13px]">{step.name}</span>
            <span className="font-mono text-[13px] text-muted">
              {step.value}%
            </span>
            <span className="col-span-2 h-2 overflow-hidden rounded-full bg-panel-2">
              <span
                style={width}
                className="block h-full w-(--w) rounded-full bg-lime"
              />
            </span>
          </li>
        );
      })}
      <li className="pt-3 font-mono text-xs text-faint">Example data</li>
    </ol>
  );
}

const TABS: StepTab[] = [
  {
    id: "install",
    title: "Install",
    description: "Create a project, copy one script tag into your site.",
    crumb: "index.html",
    pane: <InstallPane />,
  },
  {
    id: "track",
    title: "Track",
    description:
      "Page views arrive on their own. Name the moments that matter with one call.",
    crumb: "app.js",
    pane: <TrackPane />,
  },
  {
    id: "funnel",
    title: "Find the stall",
    description:
      "Pick the steps. Stallpoint shows how many visitors reach each one and where they leave.",
    crumb: "funnels/signup",
    pane: <FunnelPane />,
  },
];

export function HowSection() {
  return (
    <section
      id="how"
      aria-labelledby="how-title"
      className="border-b border-line py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto w-[min(1200px,100%-2rem)]">
        <Reveal className="mb-10 sm:mb-16">
          <SectionIndex number="02" label="How it works" />
          <SectionTitle id="how-title">
            From one script tag to a funnel in minutes.
          </SectionTitle>
        </Reveal>
        <Reveal>
          <StepTabs tabs={TABS} />
        </Reveal>
      </div>
    </section>
  );
}
