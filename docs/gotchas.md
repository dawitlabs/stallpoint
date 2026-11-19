# Gotchas

- **Local port is 3100**, not 3000. Dawit's machine runs another app on 3000. `pnpm dev` and `pnpm start` already pass `--port 3100`, and `NEXT_PUBLIC_APP_URL` in `.env.local` points there.
- **`NEXT_PUBLIC_APP_URL` is inlined at build time.** Change it, then rebuild, or the install snippet shows the old host.
- **Local Node is 26, Vercel runs 24.** `pnpm` prints an engines warning locally. It is harmless; don't use Node 26-only APIs.
- **Regenerating the Better Auth schema:** the CLI cannot load `import "server-only"`. Remove that line from `src/lib/auth.ts`, `src/lib/env.ts` and `src/db/index.ts`, run `pnpm dlx auth@latest generate --config src/lib/auth.ts --output src/db/schema/auth.ts --yes`, then put the lines back.
- **Every migration gets a down file** in `drizzle/rollback/<name>.down.sql`. It must also delete its row from `drizzle.__drizzle_migrations` (by `created_at` = the journal's `when`), or `pnpm db:migrate` will never re-apply it.
- **Local Postgres runs on 127.0.0.1:55433** (`docker compose up -d`). Port 5432 belongs to another project's container on Dawit's machine.
- **Deleting a project cascades through `events`.** Fine at beta volumes; a project with millions of events will need batched deletes.
