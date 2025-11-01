# Supabase Configuration

This directory contains the Supabase backend setup for WaveOS.

## Structure

- `migrations/` - Database migration files
  - `001_initial_schema.sql` - Creates all tables
  - `002_rls_policies.sql` - Sets up Row-Level Security policies

- `functions/` - Edge Functions (Deno)
  - `beacon-register/` - Register new ephemeral beacon IDs
  - `beacon-resolve/` - Server-side beacon→user resolution
  - `wave-handshake/` - Handle mutual wave creation and chat initialization
  - `presence-cleanup/` - Scheduled cleanup of stale data

## Setup Instructions

1. Create a Supabase project at https://supabase.com
2. Run migrations:
   ```bash
   supabase db push
   ```
3. Deploy edge functions:
   ```bash
   supabase functions deploy beacon-register
   supabase functions deploy beacon-resolve
   supabase functions deploy wave-handshake
   supabase functions deploy presence-cleanup
   ```
4. Set up cron job for `presence-cleanup` (via Supabase Dashboard or pg_cron)

## Environment Variables

Set these in your Supabase project:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for edge functions)


