-- CreateTable
CREATE TABLE "Politician" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "chamber" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "state" TEXT,
    "committees" TEXT,
    "externalIds" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "politicianId" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "assetName" TEXT,
    "instrumentType" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "reportedTransactionDate" DATETIME NOT NULL,
    "filedDate" DATETIME,
    "amountMin" REAL,
    "amountMax" REAL,
    "sourceName" TEXT,
    "sourceRef" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Trade_politicianId_fkey" FOREIGN KEY ("politicianId") REFERENCES "Politician" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PriceSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tradeId" TEXT,
    "ticker" TEXT NOT NULL,
    "asOfDate" DATETIME NOT NULL,
    "closePrice" REAL NOT NULL,
    "sourceName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PriceSnapshot_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Watchlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "watchlistId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "politicianId" TEXT,
    "ticker" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WatchlistItem_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "Watchlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WatchlistItem_politicianId_fkey" FOREIGN KEY ("politicianId") REFERENCES "Politician" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Politician_fullName_key" ON "Politician"("fullName");

-- CreateIndex
CREATE INDEX "Trade_politicianId_idx" ON "Trade"("politicianId");

-- CreateIndex
CREATE UNIQUE INDEX "Trade_politicianId_ticker_reportedTransactionDate_amountMin_amountMax_sourceName_sourceRef_key" ON "Trade"("politicianId", "ticker", "reportedTransactionDate", "amountMin", "amountMax", "sourceName", "sourceRef");

-- CreateIndex
CREATE INDEX "PriceSnapshot_ticker_asOfDate_idx" ON "PriceSnapshot"("ticker", "asOfDate");

-- CreateIndex
CREATE UNIQUE INDEX "PriceSnapshot_ticker_asOfDate_key" ON "PriceSnapshot"("ticker", "asOfDate");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_name_key" ON "Watchlist"("userId", "name");

-- CreateIndex
CREATE INDEX "WatchlistItem_watchlistId_idx" ON "WatchlistItem"("watchlistId");
