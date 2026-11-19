export const MAX_BODY_BYTES = 64 * 1024;
export const MAX_EVENTS_PER_BATCH = 50;
export const MAX_EVENTS_PER_MINUTE = 1_200;
export const MAX_PROPERTIES = 20;
export const MAX_CLOCK_SKEW_MS = 24 * 60 * 60 * 1000;
export const EVENT_NAME_PATTERN = /^[A-Za-z0-9_.:-]{1,64}$/;
export const WINDOW_RETENTION_MS = 60 * 60 * 1000;
