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
