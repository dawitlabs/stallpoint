import type { CSSProperties } from "react";

export type StyleWithVars = CSSProperties &
  Record<`--${string}`, string | number>;
