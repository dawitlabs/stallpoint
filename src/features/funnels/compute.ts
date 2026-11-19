import "server-only";
import { type SQL, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import type { FunnelStep } from "./step";

const CountsRow = z.object({ counts: z.array(z.number()) });

function stepMatches(step: FunnelStep): SQL {
  return step.path
    ? sql`e.name = ${step.name} and e.path = ${step.path}`
    : sql`e.name = ${step.name}`;
}

function stepTable(index: number): SQL {
  return sql.raw(`s${index}`);
}

export async function computeFunnelCounts(
  projectId: string,
  steps: FunnelStep[],
  windowHours: number,
  rangeDays: number,
): Promise<number[]> {
  const [first, ...rest] = steps;
  if (!first) return [];

  const firstCte = sql`${stepTable(0)} as (
    select e.visitor_id, min(e.occurred_at) as t, min(e.occurred_at) as t0
    from events e
    where e.project_id = ${projectId}
      and e.occurred_at >= now() - make_interval(days => ${rangeDays})
      and ${stepMatches(first)}
    group by e.visitor_id
  )`;

  const nextCtes = rest.map(
    (step, offset) => sql`${stepTable(offset + 1)} as (
    select p.visitor_id, min(e.occurred_at) as t, p.t0
    from ${stepTable(offset)} p
    join events e
      on e.project_id = ${projectId}
      and e.visitor_id = p.visitor_id
      and e.occurred_at >= p.t
      and e.occurred_at <= p.t0 + make_interval(hours => ${windowHours})
      and ${stepMatches(step)}
    group by p.visitor_id, p.t0
  )`,
  );

  const counts = steps.map(
    (_, index) => sql`(select count(*)::int from ${stepTable(index)})`,
  );

  const result = await db.execute(
    sql`with ${sql.join([firstCte, ...nextCtes], sql`, `)} select array[${sql.join(counts, sql`, `)}] as counts`,
  );
  const row = CountsRow.parse(result.rows[0]);
  return row.counts;
}
