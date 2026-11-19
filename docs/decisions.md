# Decisions

## 2026-11-19: Write keys are public

The write key sits in the page source of every site that installs the script, like a Mixpanel project token. It can only add events to one project; it can never read data. Reading always needs a signed-in owner. Rotating the key in settings cuts off abuse.

## 2026-11-19: Intake accepts `text/plain` JSON

`sendBeacon` and `fetch` with `text/plain` are "simple" CORS requests, so browsers skip the preflight. The endpoint answers `Access-Control-Allow-Origin: *` with no credentials.

## 2026-11-19: Events live in Postgres

One `events` table in Neon, indexed for the live feed and for funnels. Good enough for v0.1 volumes. A columnar store (ClickHouse, Tinybird) is the move once a single project passes a few million events a month.

## 2026-11-19: Rate limiting in Postgres

Fixed one-minute windows per project in an `ingest_windows` table, upserted inside the insert transaction. No extra service. Better Auth's own limiter uses database storage for the same reason: in-memory limits do nothing on Vercel.

## 2026-11-19: Sign-in is Google and GitHub only

Dawit's call. No passwords means no reset or verification emails, so no Resend in v0.1.
