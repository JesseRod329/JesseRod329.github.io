# Public Trade Transparency (Demo)

A Next.js + Prisma demo that tracks and analyzes stock and options trades disclosed by U.S. politicians. The app is designed for transparency and research only; it does **not** provide investment, legal, or tax advice. All data is derived from public disclosures and may be delayed or estimated.

## Project layout
- `app/` – Next.js App Router routes for dashboard, politician profiles, tickers, watchlist, and ingestion APIs.
- `prisma/` – Prisma schema defining politicians, trades, price snapshots, watchlists, and supporting enums.
- `lib/` – Data source interfaces, mock adapters, ingestion pipeline, Prisma client helper, and performance utilities.
- `components/` – Reusable UI blocks (tables, cards, placeholders).
- `tests/` – Small Vitest utilities coverage.

## Getting started
1. Install dependencies (requires Node 18+):
   ```bash
   cd politician-tracker
   npm install
   ```
2. Set environment variables by copying the example file:
   ```bash
   cp .env.example .env.local
   ```
3. Configure your database connection in `.env.local`:
   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/politician_trades"
   ```
4. Run migrations and generate the Prisma client:
   ```bash
   npm run prisma:migrate -- --name init
   npm run prisma:generate
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```

## APIs and services
- **Trade ingestion**: `POST /api/ingest` pulls recent trades from a pluggable data source (mocked by default) and upserts politicians and trades idempotently.
- **Market data**: `lib/marketData` exposes a provider interface with a mock HTTP adapter. Set `MARKET_DATA_API_URL` and `MARKET_DATA_API_KEY` to use a real service.
- **Frontend APIs**:
  - `GET /api/trades` – filters by chamber, party, ticker, date range, and politician; includes computed performance.
  - `GET /api/politicians` – search and filter politicians.
  - `GET /api/politicians/[id]` – detail with aggregated stats.
  - `GET /api/tickers/[ticker]` – per-ticker trades and price history.
  - `GET/POST/DELETE /api/watchlist` – minimal demo watchlist for a single user.

## Environment variables
```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/politician_trades"
POLITICIAN_TRADES_API_URL=""
POLITICIAN_TRADES_API_KEY=""
MARKET_DATA_API_URL=""
MARKET_DATA_API_KEY=""
```

## Disclaimer
This project is for transparency and research only. It is **not** investment, legal, or tax advice. Market data and trade disclosures may be delayed, estimated, or incomplete. Always perform independent verification before making financial decisions.
