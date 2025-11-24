-- CreateTable
CREATE TABLE "StateAnalysisCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stateCode" TEXT NOT NULL,
    "yearMonth" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "StateAnalysisCache_stateCode_yearMonth_key" ON "StateAnalysisCache"("stateCode", "yearMonth");
