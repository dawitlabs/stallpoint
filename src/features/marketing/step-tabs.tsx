"use client";

import { type KeyboardEvent, type ReactNode, useRef, useState } from "react";

export type StepTab = {
  id: string;
  title: string;
  description: string;
  crumb: string;
  pane: ReactNode;
};

const ARROW_OFFSETS: Record<string, number> = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
};

export function StepTabs({ tabs }: { tabs: StepTab[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const active = tabs[activeIndex];

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ): void {
    const offset = ARROW_OFFSETS[event.key];
    if (!offset) return;
    event.preventDefault();
    const next = (index + offset + tabs.length) % tabs.length;
    setActiveIndex(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div
        role="tablist"
        aria-label="Steps"
        aria-orientation="vertical"
        className="grid border-t border-line"
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={tab.id}
              ref={(element) => {
                buttons.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`pane-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`flex cursor-pointer gap-5 border-b border-line px-1 py-5 text-left transition-opacity hover:opacity-100 sm:py-6 ${isActive ? "opacity-100" : "opacity-50"}`}
            >
              <span className="pt-1 font-mono text-xs text-lime">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="grid gap-1.5">
                <strong className="text-[22px] font-semibold tracking-[-0.03em]">
                  {tab.title}
                </strong>
                <span className="text-[15px] leading-normal text-muted">
                  {tab.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="min-h-[340px] overflow-hidden rounded-panel border border-line bg-panel">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5 font-mono text-xs text-muted">
          <span>
            your-app <span className="text-faint">/</span>{" "}
            <span className="text-paper">{active?.crumb}</span>
          </span>
        </div>
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`pane-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={index !== activeIndex}
          >
            {tab.pane}
          </div>
        ))}
      </div>
    </div>
  );
}
