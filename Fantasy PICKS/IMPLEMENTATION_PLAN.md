# Implementation Plan — Fantasy Wrestling Booking

This document captures the current architecture, the work that has been completed, and concrete next steps to keep the project scalable, secure, and maintainable.

## Overview
- Frontend: Static pages (Vite) + vanilla JS modules
- Backend: Supabase (Auth + Postgres + RPC + RLS)
- Styling: Tailwind
- Deployment: Vercel (static hosting)

## Completed Work (This Iteration)
- Modularized frontend code
  - `js/constants.js` — scoring constants and labels
  - `js/scoring.js` — pure scoring logic + event score hydration
  - `js/predictions.js` — predictions flow, render, data loaders, UI bindings
  - `js/leaderboard.js` — leaderboard flows with pagination & MV support
  - `js/admin.js` — admin UI wired to secure RPCs
  - `js/ui.js` — animation, navigation, event handler helpers
  - `js/auth.js` — AuthManager with profile bootstrap
  - `js/supabaseInit.js` — centralized Supabase init (env‑only)
  - `js/monitoring.js` — optional Sentry + error hooks

- Security & backend hardening
  - RLS for admin match updates + admin RPCs
    - `admin-rls.sql`, `admin-rpc.sql`
  - Batch saving picks (one RPC call)
    - `picks-rpc.sql`, wired in `js/predictions.js`
  - Users table defaults & RLS (self‑service profiles)
    - `user-profiles.sql`

- Performance & data
  - DB indexes for common access patterns
    - `db-indexes.sql`
  - Optional materialized leaderboards + admin refresh
    - `leaderboard-materialized.sql`
  - Leaderboard pagination (client‑side range queries)

- UX & reliability
  - Dynamic prediction summary (matches predicted, bonus, earned, max possible)
  - Countdown/locks aligned with DB
  - Centralized Supabase init + dismissible missing‑config banner
  - Optional Sentry monitoring hooks

## Supabase Migrations to Apply
Apply in this order (idempotent where possible):
- `user-profiles.sql` — users columns, defaults, RLS
- `profile-bootstrap-trigger.sql` (or `profile-bootstrap-complete.sql` if needed)
- `admin-rls.sql` — admins/is_admin + matches RLS
- `admin-rpc.sql` — admin_upsert RPCs
- `picks-rpc.sql` — save_picks RPC
- `db-indexes.sql` — indexes/unique constraints
- `leaderboard-materialized.sql` — MVs + refresh function

Seed admin emails (example):
```sql
insert into public.admins(email) values ('jesse.rodriguez89@gmail.com') on conflict do nothing;
```

Initial MV populate:
```sql
select public.refresh_leaderboards();
```

## Environment & Configuration
- Required (both local `.env` and Vercel environment):
  - `VITE_SUPABASE_URL` = https://<project>.supabase.co
  - `VITE_SUPABASE_ANON_KEY` = <anon key>
- Optional monitoring:
  - `VITE_SENTRY_DSN` = <sentry dsn>
- Supabase init is strict and will not fallback to hardcoded values.

## Testing Checklist
- Auth/profile
  - Sign in with Google → verify profile row auto‑created/updated (display_name, username)
  - Picks are tied to `auth.uid()`
- Predictions
  - Make several picks → Submit → single RPC call (save_picks)
  - Sidebar summary updates (Matches Predicted, Bonus Points, Earned, Max)
  - Lock behavior enforced by DB (RLS) and UX (countdown)
- Leaderboards
  - Event/global/weekly tabs render via MVs
  - Pagination (Prev/Next) works, accuracy is correct
  - Admin refresh button appears only for admins, refreshes MVs
- Admin
  - Single result save & bulk save use secure RPCs
  - Non‑admins blocked by RLS
- Config/Monitoring
  - With env set → `[supabaseInit] Supabase client initialized`
  - Without env → red banner appears, dismissible via ×
  - (If configured) Sentry receives an intentional test error

## Next Steps / Backlog
- Profile editor UI
  - Allow users to change `display_name` and (uniquely validated) `username`
  - Surface basic validation + availability checks
- Materialized leaderboards refresh strategy
  - Schedule cron or trigger refresh on write (admin match updates) if needed
  - Optionally merge “correct winners” and “points” into a single consolidated scoring view
- Telemetry & logging
  - Add structured logs around critical flows (sign‑in, save picks, admin saves)
  - Expand Sentry breadcrumbs for RPC calls
- Accessibility & UX
  - Add focus states, keyboard navigation for predictions
  - Improve empty/loading states across pages
- CI/CD
  - Add lint/type checks (ESLint/TypeScript) and a minimal CI pipeline (build, sanity tests)
- Codebase polish
  - Reduce remaining global `window.FantasyWrestling` references by using imports in page‑specific entry points
  - Continue extracting test pages to use centralized init and shared modules

## File Map (Key Paths)
- Frontend modules:
  - `js/supabaseInit.js`, `js/monitoring.js`
  - `js/auth.js`, `js/constants.js`, `js/scoring.js`
  - `js/predictions.js`, `js/leaderboard.js`, `js/admin.js`, `js/ui.js`
- SQL migrations:
  - `user-profiles.sql`, `profile-bootstrap-trigger.sql` (or `profile-bootstrap-complete.sql`)
  - `admin-rls.sql`, `admin-rpc.sql`, `picks-rpc.sql`
  - `db-indexes.sql`, `leaderboard-materialized.sql`

---
This plan is living; as we iterate, update this file to track future phases and decisions.

