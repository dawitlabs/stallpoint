# Stallpoint v0.1 plan

Stallpoint is product analytics that shows the step where users stall. v0.1 proves the loop end to end: install a script, events arrive, a funnel shows where users drop.

Agreed with Dawit on 2026-11-19. Name checked the same day: "Signalpath" was taken (Verily clinical software, and a support-ticket analytics SaaS), so the product is Stallpoint. `stallpoint.io` was unregistered on 2026-11-19.

## Scope

| # | Part | Done when |
|---|---|---|
| 1 | Landing page | Ink + Lime design from `~/dev/projects/signalpath-landing/stallpoint.html`, honest copy, no invented customers or stats, pricing says free during beta |
| 2 | Accounts | Better Auth with Google and GitHub sign-in only. No email/password, so no Resend |
| 3 | Projects | Create a project, get a public write key and an install snippet |
| 4 | Tracking script | `public/sdk.js`: auto page views, `stallpoint.track(name, props)`, `stallpoint.identify(id)`, batched, `sendBeacon` on page hide |
| 5 | Event intake | `POST /api/v1/events`: write key check, Zod validation, size limits, per-project rate limit, batch insert |
| 6 | Live events | Polling list of the latest events for a project |
| 7 | Funnels | Save 2 to 5 event steps with a conversion window, chart computed in one SQL query |
| 8 | Settings | Rotate write key, delete project, delete account (cascades everything) |
| 9 | Ops | `/api/health`, structured logs without PII, Sentry once Dawit has a DSN |
| 10 | Deploy | Working Vercel URL, Neon through the Vercel integration |

Out of v0.1: AI insights, experiments, Stripe billing, warehouse sync, integrations, email.

## Proof of done

The landing page itself loads `sdk.js` with a Stallpoint project key, and that project's funnel shows real visits.

## Order

1. Landing page port (no backend needed)
2. Env module, DB client, schema, first migration
3. Auth (Google + GitHub), sign-in page, protected dashboard shell
4. Projects + write keys
5. Intake endpoint + `sdk.js`
6. Live events
7. Funnels
8. Settings and deletion
9. Deploy to Vercel, OAuth callback URLs, dogfood the script on the landing page

## Status, 2026-11-19

Done and verified locally (production build, Playwright at 1440 px and 390 px, no console or server errors):

- Steps 1 to 8: landing page, schema and migration (with tested rollback), auth wiring, projects and write keys, intake API, `sdk.js`, live events, funnels, settings, account deletion.
- Intake: success, unknown key (401), bad JSON (400), invalid batch (400), oversized body (413), CORS preflight, rate limit (429 once a minute passes 1,200 events).
- SDK in a real browser: auto page view, query strings stripped, `identify`, SPA `pushState` page views, `sendBeacon` on tab close.
- Security: signed out → `/dashboard` redirects, events API 401; another user → events API 404, project page shows not-found.
- Repo public at https://github.com/dawitlabs/stallpoint (`main`).

Not done yet:

- Real Google and GitHub sign-in: needs Dawit's OAuth credentials in `.env.local` and on Vercel.
- Step 9: Vercel project on the `dawit` team, Neon through the Vercel integration (needs Dawit to accept Neon's terms), env vars, OAuth callback URLs, dogfooding `sdk.js` on the landing page.
- Sentry: needs a DSN from Dawit.
