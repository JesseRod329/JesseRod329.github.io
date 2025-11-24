# Politician Tracker - Features & Data Summary

## 📊 Scraped Data Statistics

### Capitol Trades Dataset
- **Total Trades Scraped**: 35,425 trades
- **Unique Politicians**: 214 politicians
- **Unique Issuers/Tickers**: 3,223 different stocks/companies
- **Total Filings**: 1,729 disclosure filings
- **Reported Volume**: $2.263 billion
- **Data Source**: https://www.capitoltrades.com/trades
- **Scraped On**: November 24, 2025
- **Pages Fetched**: 2,953 pages
- **Data Format**: JSONL (35,425 lines) + CSV export available

### Data Files Location
- **JSONL Format**: `data/capitol-trades/trades.jsonl`
- **CSV Format**: `data/capitol-trades/trades.csv` (run `npm run trades:csv` to generate)
- **Summary**: `data/capitol-trades/summary.json`

### Data Fields Captured
Each trade record includes:
- Politician information (name, chamber, party, state, committees)
- Trade details (ticker, asset name, transaction type, dates)
- Amount ranges (min/max values)
- Filing metadata (source, reference IDs)
- Issuer information

---

## 🎯 Current Application Features

### 1. **Dashboard (Home Page)**
- **Interactive Globe Map**: 3D visualization of political trading activity
- **State Analysis**: Click any US state to get AI-powered analysis (Gemini AI)
- **Live Feed Indicators**: Shows "LIVE FEED" and "GEMINI AI CONNECTED" status
- **Recent Trades Table**: Displays 10 most recent trades
- **Statistics Cards**: 
  - Recent trades count
  - Unique tickers count
  - Top ticker by volume

### 2. **Politicians Page** (`/politicians`)
- Browse all politicians in the database
- Search and filter functionality
- View individual politician profiles
- See aggregated trading statistics per politician

### 3. **Politician Detail Pages** (`/politicians/[id]`)
- Individual politician profiles
- Complete trade history
- Trading statistics and analytics
- Performance metrics

### 4. **Ticker Pages** (`/tickers/[ticker]`)
- View all trades for a specific stock ticker
- Price history and snapshots
- Politician trading activity per ticker

### 5. **Watchlist** (`/watchlist`)
- Personal watchlist for tracking specific politicians or tickers
- Demo user functionality
- Add/remove items

### 6. **State Analysis API** (`/api/states`)
- AI-powered analysis of political trading by state
- Cached results for performance
- Uses Gemini AI for insights

---

## 🔌 API Endpoints

### Trade APIs
- `GET /api/trades` - Filter trades by chamber, party, ticker, date range, politician
- `POST /api/ingest` - Ingest new trades from data sources

### Politician APIs
- `GET /api/politicians` - Search and filter politicians
- `GET /api/politicians/[id]` - Get politician details with aggregated stats

### Ticker APIs
- `GET /api/tickers/[ticker]` - Get all trades and price history for a ticker

### Watchlist APIs
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add item to watchlist
- `DELETE /api/watchlist` - Remove item from watchlist

### State APIs
- `GET /api/states?state=XX` - Get AI analysis for a specific state

---

## ⚠️ Current Status

### ✅ What's Working
- Database connection (Prisma Postgres)
- Interactive globe map
- State selection and analysis
- All pages load without errors
- API endpoints functional

### ⚠️ What Needs Integration
- **Capitol Trades Data**: The 35,425 scraped trades are NOT yet imported into the database
- **Mock Data**: App currently shows sample/mock trades (Nancy Pelosi, etc.)
- **Data Import**: Need to create an import script to load the scraped JSONL/CSV data into the Prisma database

### 📝 Next Steps to Use Scraped Data
1. Create import script to parse `trades.jsonl` or `trades.csv`
2. Map Capitol Trades data format to Prisma schema
3. Import all 35,425 trades into the database
4. Update ingestion pipeline to use real data instead of mocks

---

## 🛠️ Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Prisma ORM)
- **Deployment**: Vercel
- **AI Integration**: Google Gemini API for state analysis
- **Visualization**: React Globe GL (3D globe)
- **Data Scraping**: Custom Node.js scripts with Cheerio

---

## 📈 Data Quality

The scraped data includes:
- ✅ Complete trade records with all metadata
- ✅ Politician information (214 unique politicians)
- ✅ Issuer/ticker information (3,223 unique companies)
- ✅ Trade amounts (ranges, not exact values per disclosure rules)
- ✅ Transaction dates and filing dates
- ✅ Source references for verification

---

## 🚀 How to Use Scraped Data

### View Raw Data
```bash
# View first few trades
head -n 5 data/capitol-trades/trades.jsonl

# View summary stats
cat data/capitol-trades/summary.json

# Convert to CSV (if needed)
npm run trades:csv
```

### Import into Database (TODO)
A script needs to be created to:
1. Read `trades.jsonl` or `trades.csv`
2. Parse each trade record
3. Upsert politicians and trades into Prisma database
4. Handle duplicates and data validation

