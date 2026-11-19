export const FUNNEL_NAME_MAX = 60;
export const MIN_STEPS = 2;
export const MAX_STEPS = 5;
export const WINDOW_OPTIONS = [
  { hours: 1, label: "1 hour" },
  { hours: 24, label: "24 hours" },
  { hours: 168, label: "7 days" },
  { hours: 720, label: "30 days" },
] as const;
export const RANGE_OPTIONS = [7, 30, 90] as const;
export const DEFAULT_RANGE_DAYS = 30;
export const STEP_PATTERN = /^([A-Za-z0-9_.:-]{1,64})(?: (\/\S{0,199}))?$/;
