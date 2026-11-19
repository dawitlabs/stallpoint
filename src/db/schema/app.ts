import { relations } from "drizzle-orm";
import {
  bigint,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export type EventProperties = Record<string, string | number | boolean | null>;

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    writeKey: text("write_key").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("projects_owner_created_idx").on(t.ownerId, t.createdAt.desc()),
  ],
);

export const events = pgTable(
  "events",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    visitorId: text("visitor_id").notNull(),
    userId: text("user_id"),
    path: text("path"),
    referrer: text("referrer"),
    properties: jsonb("properties")
      .$type<EventProperties>()
      .notNull()
      .default({}),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    receivedAt: timestamp("received_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("events_project_received_idx").on(t.projectId, t.receivedAt.desc()),
    index("events_project_name_occurred_idx").on(
      t.projectId,
      t.name,
      t.occurredAt,
    ),
    index("events_project_visitor_occurred_idx").on(
      t.projectId,
      t.visitorId,
      t.occurredAt,
    ),
  ],
);

export const funnels = pgTable(
  "funnels",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    steps: text("steps").array().notNull(),
    windowHours: integer("window_hours").notNull().default(168),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("funnels_project_created_idx").on(t.projectId, t.createdAt.desc()),
  ],
);

export const ingestWindows = pgTable(
  "ingest_windows",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
    count: integer("count").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.windowStart] })],
);

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(user, { fields: [projects.ownerId], references: [user.id] }),
  events: many(events),
  funnels: many(funnels),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  project: one(projects, {
    fields: [events.projectId],
    references: [projects.id],
  }),
}));

export const funnelsRelations = relations(funnels, ({ one }) => ({
  project: one(projects, {
    fields: [funnels.projectId],
    references: [projects.id],
  }),
}));
