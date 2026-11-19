import { ingestBatch } from "@/features/ingest/ingest";
import { MAX_BODY_BYTES } from "@/features/ingest/limits";
import { IncomingBatch } from "@/features/ingest/schema";
import { errorName, log } from "@/lib/log";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
} as const;

function reply(
  status: number,
  body: { data: unknown; error: string | null },
): Response {
  return Response.json(body, { status, headers: CORS_HEADERS });
}

export function OPTIONS(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request): Promise<Response> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES)
    return reply(413, { data: null, error: "payload_too_large" });

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    return reply(413, { data: null, error: "payload_too_large" });
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return reply(400, { data: null, error: "invalid_json" });
  }

  const parsed = IncomingBatch.safeParse(json);
  if (!parsed.success)
    return reply(400, { data: null, error: "invalid_batch" });

  try {
    const result = await ingestBatch(parsed.data, new Date());
    if (result.status === "unknown_key")
      return reply(401, { data: null, error: "unknown_key" });
    if (result.status === "rate_limited")
      return reply(429, { data: null, error: "rate_limited" });
    return reply(202, { data: { accepted: result.count }, error: null });
  } catch (error) {
    log({ event: "ingest.failed", errorName: errorName(error) });
    return reply(500, { data: null, error: "ingest_failed" });
  }
}
