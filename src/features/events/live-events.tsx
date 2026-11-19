"use client";

import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

const POLL_MS = 3000;

const LiveEventSchema = z.object({
  id: z.number(),
  name: z.string(),
  path: z.string().nullable(),
  userId: z.string().nullable(),
  visitor: z.string(),
  occurredAt: z.string(),
});

const ResponseSchema = z.object({
  data: z.array(LiveEventSchema).nullable(),
  error: z.string().nullable(),
});

type LiveEvent = z.infer<typeof LiveEventSchema>;

type FeedState =
  | { status: "loading" }
  | { status: "ready"; events: LiveEvent[] }
  | { status: "error"; events: LiveEvent[] };

const TIME_FORMAT = new Intl.DateTimeFormat("en", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

async function fetchEvents(
  projectId: string,
  signal: AbortSignal,
): Promise<LiveEvent[]> {
  const response = await fetch(`/api/projects/${projectId}/events`, {
    signal,
    cache: "no-store",
  });
  const body = ResponseSchema.parse(await response.json());
  if (!response.ok || !body.data) throw new Error(body.error ?? "load_failed");
  return body.data;
}

function useLiveEvents(projectId: string): FeedState {
  const [state, setState] = useState<FeedState>({ status: "loading" });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let controller: AbortController | null = null;

    async function poll(): Promise<void> {
      if (document.visibilityState === "hidden") return;
      controller = new AbortController();
      try {
        const events = await fetchEvents(projectId, controller.signal);
        setState({ status: "ready", events });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setState((previous) => ({
          status: "error",
          events: previous.status === "loading" ? [] : previous.events,
        }));
      }
      timer = setTimeout(poll, POLL_MS);
    }

    function handleVisibility(): void {
      if (document.visibilityState !== "visible") return;
      if (timer) clearTimeout(timer);
      void poll();
    }

    void poll();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      if (timer) clearTimeout(timer);
      controller?.abort();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [projectId]);

  return state;
}

function EmptyFeed() {
  return (
    <div className="grid place-items-center gap-3 px-6 py-16 text-center">
      <span className="relative grid size-10 place-items-center rounded-full bg-panel-2">
        <span className="absolute size-10 animate-ping rounded-full bg-lime/20 motion-reduce:animate-none" />
        <Activity className="size-4 text-lime" aria-hidden="true" />
      </span>
      <p className="font-semibold">Waiting for the first event</p>
      <p className="max-w-[40ch] text-sm text-muted">
        Paste the script tag into your site and open any page. It shows up here
        within a few seconds.
      </p>
    </div>
  );
}

export function LiveEvents({ projectId }: { projectId: string }) {
  const state = useLiveEvents(projectId);
  const events = state.status === "loading" ? [] : state.events;

  return (
    <section
      aria-labelledby="live-title"
      className="overflow-hidden rounded-panel border border-line bg-panel"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h2 id="live-title" className="font-semibold">
          Live events
        </h2>
        <span className="flex items-center gap-2 font-mono text-xs text-muted">
          <span
            aria-hidden="true"
            className={`size-1.5 rounded-full ${state.status === "error" ? "bg-alert" : "animate-pulse-dot bg-lime"}`}
          />
          {state.status === "error" ? "Reconnecting…" : "Live, every 3 s"}
        </span>
      </div>

      {state.status === "loading" ? (
        <output aria-label="Loading events" className="grid gap-px">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="h-12 animate-pulse bg-panel-2/60" />
          ))}
        </output>
      ) : events.length === 0 ? (
        state.status === "error" ? (
          <p role="alert" className="px-5 py-12 text-center text-sm text-alert">
            Couldn&apos;t load events. Retrying every few seconds.
          </p>
        ) : (
          <EmptyFeed />
        )
      ) : (
        <ol className="max-h-[480px] divide-y divide-line overflow-y-auto font-mono text-[13px]">
          {events.map((event) => (
            <li
              key={event.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3"
            >
              <time
                dateTime={event.occurredAt}
                className="text-faint tabular-nums"
              >
                {TIME_FORMAT.format(new Date(event.occurredAt))}
              </time>
              <span className="min-w-0">
                <span
                  className={
                    event.name === "page_view" ? "text-paper" : "text-lime"
                  }
                >
                  {event.name}
                </span>
                {event.path ? (
                  <span className="ml-2 truncate text-muted">{event.path}</span>
                ) : null}
              </span>
              <span className="truncate text-right text-faint">
                {event.userId ?? event.visitor}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
