import { z } from "zod";
import { WRITE_KEY_PREFIX } from "@/features/projects/limits";
import {
  EVENT_NAME_PATTERN,
  MAX_EVENTS_PER_BATCH,
  MAX_PROPERTIES,
} from "./limits";

const PropertyValue = z.union([
  z.string().max(256),
  z.number(),
  z.boolean(),
  z.null(),
]);

const Properties = z
  .record(z.string().min(1).max(64), PropertyValue)
  .refine((value) => Object.keys(value).length <= MAX_PROPERTIES, {
    error: `At most ${MAX_PROPERTIES} properties per event`,
  });

export const IncomingEvent = z.object({
  name: z.string().regex(EVENT_NAME_PATTERN),
  visitorId: z.string().min(1).max(64),
  userId: z.string().min(1).max(128).nullish(),
  path: z.string().startsWith("/").max(512).nullish(),
  referrer: z.string().max(512).nullish(),
  properties: Properties.optional(),
  timestamp: z.number().int().positive().optional(),
});

export const IncomingBatch = z.object({
  key: z.string().startsWith(WRITE_KEY_PREFIX).max(64),
  events: z.array(IncomingEvent).min(1).max(MAX_EVENTS_PER_BATCH),
});

export type IncomingBatch = z.infer<typeof IncomingBatch>;
