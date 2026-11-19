import type { ReactNode } from "react";

export function SectionIndex({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <p className="mb-5 flex gap-3 font-mono text-xs tracking-[0.08em] text-faint uppercase">
      <span className="text-lime">{number}</span>
      {label}
    </p>
  );
}

export function SectionTitle({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="max-w-[18ch] text-[clamp(2.25rem,5vw,4rem)] leading-[0.98] font-extrabold tracking-[-0.045em] text-balance"
    >
      {children}
    </h2>
  );
}

export function SectionLede({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[44ch] text-[17px] leading-relaxed text-pretty text-muted">
      {children}
    </p>
  );
}
