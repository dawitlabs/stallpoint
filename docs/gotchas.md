# Gotchas

- **Local port is 3100**, not 3000. Dawit's machine runs another app on 3000. `pnpm dev` and `pnpm start` already pass `--port 3100`, and `NEXT_PUBLIC_APP_URL` in `.env.local` points there.
- **`NEXT_PUBLIC_APP_URL` is inlined at build time.** Change it, then rebuild, or the install snippet shows the old host.
- **Local Node is 26, Vercel runs 24.** `pnpm` prints an engines warning locally. It is harmless; don't use Node 26-only APIs.
