import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";
import { SectionIndex, SectionLede, SectionTitle } from "./section-head";

const FAQ = [
  {
    question: "How long does setup take?",
    answer:
      "A few minutes. Sign in, create a project, paste one script tag. Page views show up in the live stream as soon as someone loads a page.",
  },
  {
    question: "Do I need a tracking plan?",
    answer:
      "No. Page views are automatic. Call stallpoint.track() for the moments you care about, then build funnels from any event you've sent.",
  },
  {
    question: "What does the script store in the browser?",
    answer:
      "A random visitor ID in localStorage, so steps from the same visitor can be linked. No cookies, no fingerprinting. Where your users' law requires consent for this, you're responsible for asking.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "In a Postgres database hosted by Neon in the US (AWS us-east-1). Events are encrypted in transit and at rest, and never sold or shared.",
  },
  {
    question: "Can I delete my data?",
    answer:
      "Yes. Deleting a project removes all its events. Deleting your account removes your projects, events and sign-in records.",
  },
  {
    question: "What happens after the beta?",
    answer:
      "Paid plans priced by events. You'll get 30 days' notice, and a free tier will stay for small projects.",
  },
] as const;

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="border-b border-line py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto grid w-[min(1200px,100%-2rem)] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <SectionIndex number="04" label="FAQ" />
          <SectionTitle id="faq-title">
            Questions before you install.
          </SectionTitle>
          <div className="mt-6">
            <SectionLede>
              Something else?{" "}
              <a
                href={`${SITE.githubUrl}/issues`}
                className="text-paper underline decoration-lime underline-offset-[3px]"
              >
                Open an issue on GitHub
              </a>
              .
            </SectionLede>
          </div>
        </Reveal>
        <Reveal className="border-t border-line">
          {FAQ.map((item, index) => (
            <details
              key={item.question}
              open={index === 0}
              className="group border-b border-line"
            >
              <summary className="flex cursor-pointer list-none justify-between gap-6 py-6 text-lg font-medium tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="font-mono text-[22px] leading-none font-normal text-lime transition-transform duration-150 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="-mt-2 mb-6 max-w-[56ch] text-base leading-relaxed text-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
