# Environment Setup for Fantasy Wrestling Booking

## Required Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Sentry Monitoring
VITE_SENTRY_DSN=your-sentry-dsn
```

## How to Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your project
3. Go to Settings > API
4. Copy the Project URL and anon public key
5. Paste them into your `.env` file

## Testing Without Supabase

If you don't have Supabase set up yet, the application will show a red banner at the top indicating missing configuration. This is normal and expected.

## Running the Application

### Option 1: Vite Dev Server (Recommended)
```bash
npm run dev
```
Then open: `http://localhost:5173`

### Option 2: Python HTTP Server
```bash
python3 -m http.server 8000
```
Then open: `http://localhost:8000`

## Test Pages

- **Main App:** `http://localhost:5173/`
- **Predictions:** `http://localhost:5173/predictions.html`
- **Leaderboard:** `http://localhost:5173/leaderboard.html`
- **Admin:** `http://localhost:5173/admin.html`
- **Modular Test:** `http://localhost:5173/test-modular-integration.html`

