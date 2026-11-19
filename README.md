# Stallpoint

Open-source product analytics that shows the step where users stall.

Paste one script tag, send events, build a funnel, and see where visitors drop off. Public beta.

## What it does

- **Tracking script** (`public/sdk.js`): automatic page views, `stallpoint.track(name, props)`, `stallpoint.identify(id)`. Sends paths without query strings and referrers as origin only.
- **Event intake** (`POST /api/v1/events`): validated, size-limited, rate-limited per project.
- **Live events**: the latest events for a project, refreshed every few seconds.
- **Funnels**: two to five steps, computed in one SQL query with a conversion window.
- **Deletion**: delete a project and its events, or your whole account.

## Stack

Next.js 16 (App Router, Cache Components), Postgres via Drizzle, Better Auth (Google and GitHub), Tailwind CSS v4, Biome, pnpm. Deployed on Vercel with Neon.

## Run it locally

```bash
pnpm install
docker compose up -d
cp .env.example .env.local
pnpm db:migrate
pnpm dev
```

The app runs on http://localhost:3100. Postgres listens on 127.0.0.1:55433.

Sign-in needs at least one OAuth app:

| Provider | Callback URL |
|---|---|
| Google | `http://localhost:3100/api/auth/callback/google` |
| GitHub | `http://localhost:3100/api/auth/callback/github` |

Put the client ID and secret in `.env.local`.

## Install on a site

```html
<script defer src="https://YOUR-STALLPOINT-HOST/sdk.js" data-key="YOUR_WRITE_KEY"></script>
```

```js
stallpoint.track("signup_completed", { plan: "free" });
stallpoint.identify("user_8127");
```

## Docs

- `docs/plan.md`: v0.1 scope
- `docs/decisions.md`: why things are the way they are
- `docs/gotchas.md`: traps for anyone changing the code

## License

MIT
