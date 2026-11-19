import { headers } from "next/headers";
import { listRecentEvents } from "@/features/events/queries";
import { findProjectForOwner } from "@/features/projects/queries";
import { auth } from "@/lib/auth";
import { errorName, log } from "@/lib/log";

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/projects/[projectId]/events">,
): Promise<Response> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return Response.json(
      { data: null, error: "unauthorized" },
      { status: 401, headers: NO_STORE },
    );
  const { projectId } = await ctx.params;
  const project = await findProjectForOwner(projectId, session.user.id);
  if (!project)
    return Response.json(
      { data: null, error: "not_found" },
      { status: 404, headers: NO_STORE },
    );
  try {
    const events = await listRecentEvents(project.id);
    return Response.json({ data: events, error: null }, { headers: NO_STORE });
  } catch (error) {
    log({ event: "live_events.failed", errorName: errorName(error) });
    return Response.json(
      { data: null, error: "load_failed" },
      { status: 500, headers: NO_STORE },
    );
  }
}
