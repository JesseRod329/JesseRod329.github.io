# WaveOS

A proximity-based social app using BLE beacons and ephemeral IDs.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your Supabase credentials

3. Set up Supabase (see `supabase/README.md`)

4. Start the app:
```bash
npm start
```

## Project Structure

- `src/` - Source code
  - `navigation/` - React Navigation setup
  - `screens/` - Screen components
  - `services/` - BLE and Supabase services
  - `contexts/` - React contexts for state
  - `types/` - TypeScript types
  - `utils/` - Utility functions
- `supabase/` - Supabase backend (migrations, edge functions)


