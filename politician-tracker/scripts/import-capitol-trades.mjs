#!/usr/bin/env node

/**
 * Import Capitol Trades data from JSONL file into Prisma database
 * 
 * Usage:
 *   node scripts/import-capitol-trades.mjs [path-to-trades.jsonl]
 * 
 * Default: ../../data/capitol-trades/trades.jsonl
 */

import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const prisma = new PrismaClient();

// Parse trade size strings like "1K–15K", "50K–100K", "$1M–$5M" to min/max values
function parseTradeSize(tradeSize) {
  if (!tradeSize) return { min: null, max: null };
  
  // Remove $ and spaces
  const cleaned = tradeSize.replace(/\$/g, '').replace(/\s/g, '');
  
  // Match patterns like "1K–15K", "50K–100K", "1M–5M"
  const match = cleaned.match(/([\d.]+)([KM]?)–([\d.]+)([KM]?)/);
  if (!match) return { min: null, max: null };
  
  const [, minVal, minUnit, maxVal, maxUnit] = match;
  
  const multiplier = {
    '': 1,
    'K': 1000,
    'M': 1000000
  };
  
  const min = parseFloat(minVal) * (multiplier[minUnit] || 1);
  const max = parseFloat(maxVal) * (multiplier[maxUnit] || 1);
  
  return { min, max };
}

// Map chamber from Capitol Trades format to our format
function mapChamber(chamber) {
  if (!chamber) return 'OTHER';
  const upper = chamber.toUpperCase();
  if (upper === 'HOUSE') return 'HOUSE';
  if (upper === 'SENATE') return 'SENATE';
  return 'OTHER';
}

// Map party from Capitol Trades format to our format
function mapParty(party) {
  if (!party) return 'OTHER';
  const upper = party.toUpperCase();
  if (upper.includes('DEMOCRAT')) return 'DEMOCRAT';
  if (upper.includes('REPUBLICAN')) return 'REPUBLICAN';
  if (upper.includes('INDEPENDENT')) return 'INDEPENDENT';
  return 'OTHER';
}

// Extract ticker from issuer.ticker (remove :US suffix)
function extractTicker(issuer) {
  if (!issuer?.ticker) return null;
  return issuer.ticker.replace(/:US$/, '').trim();
}

// Parse date from tradeDate object
function parseTradeDate(tradeDate) {
  if (!tradeDate) return null;
  
  // Try to parse from display format like "10 Oct 2025"
  if (tradeDate.display) {
    const parsed = new Date(tradeDate.display);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  
  // Try year field
  if (tradeDate.year) {
    const parsed = new Date(tradeDate.year);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  
  return null;
}

// Map transaction type
function mapTransactionType(type) {
  if (!type) return 'UNKNOWN';
  const upper = type.toUpperCase();
  if (upper === 'BUY' || upper === 'PURCHASE') return 'BUY';
  if (upper === 'SELL' || upper === 'SALE') return 'SELL';
  return 'UNKNOWN';
}

// Map instrument type (default to STOCK, could be enhanced)
function mapInstrumentType(issuer, tradeData) {
  // Could check issuer name or other fields, but defaulting to STOCK
  return 'STOCK';
}

async function importTrades(jsonlPath) {
  console.log(`Reading trades from: ${jsonlPath}`);
  const content = readFileSync(jsonlPath, 'utf-8');
  const lines = content.trim().split('\n').filter(line => line.trim());
  
  console.log(`Found ${lines.length} trade records`);
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  const batchSize = 100;
  
  for (let i = 0; i < lines.length; i += batchSize) {
    const batch = lines.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(lines.length / batchSize);
    
    console.log(`Processing batch ${batchNum}/${totalBatches} (${i + 1}-${Math.min(i + batchSize, lines.length)} of ${lines.length})...`);
    
    for (const line of batch) {
      try {
        const tradeData = JSON.parse(line);
        
        // Extract and validate required fields
        const politician = tradeData.politician;
        const issuer = tradeData.issuer;
        
        if (!politician?.name || !issuer?.ticker) {
          skipped++;
          continue;
        }
        
        const ticker = extractTicker(issuer);
        if (!ticker) {
          skipped++;
          continue;
        }
        
        // Parse trade size
        const { min: amountMin, max: amountMax } = parseTradeSize(tradeData.tradeSize);
        
        // Parse dates
        const reportedTransactionDate = parseTradeDate(tradeData.tradeDate);
        if (!reportedTransactionDate) {
          skipped++;
          continue;
        }
        
        // Calculate filed date from reporting gap
        let filedDate = null;
        if (tradeData.reportingGapDays && reportedTransactionDate) {
          filedDate = new Date(reportedTransactionDate);
          filedDate.setDate(filedDate.getDate() + (tradeData.reportingGapDays || 0));
        }
        
        // Map fields
        const chamber = mapChamber(politician.chamber);
        const party = mapParty(politician.party);
        const transactionType = mapTransactionType(tradeData.transactionType);
        const instrumentType = mapInstrumentType(issuer, tradeData);
        
        // Prepare external IDs
        const externalIds = {
          capitolTrades: {
            slug: politician.slug,
            url: politician.url
          }
        };
        
        // Upsert politician
        const politicianRecord = await prisma.politician.upsert({
          where: { fullName: politician.name },
          create: {
            fullName: politician.name,
            chamber,
            party,
            state: politician.state || null,
            committees: null, // Capitol Trades doesn't provide committees in trade data
            externalIds: JSON.stringify(externalIds)
          },
          update: {
            chamber,
            party,
            state: politician.state || null,
            externalIds: JSON.stringify(externalIds)
          }
        });
        
        // Upsert trade - handle null values in unique constraint
        // First try to find existing trade
        const existingTrade = await prisma.trade.findFirst({
          where: {
            politicianId: politicianRecord.id,
            ticker,
            reportedTransactionDate,
            amountMin: amountMin ?? null,
            amountMax: amountMax ?? null,
            sourceName: 'capitol-trades',
            sourceRef: tradeData.detailUrl || null
          }
        });
        
        if (existingTrade) {
          // Update existing trade
          await prisma.trade.update({
            where: { id: existingTrade.id },
            data: {
              assetName: issuer.name || null,
              transactionType,
              filedDate,
              amountMin,
              amountMax,
              notes: tradeData.owner ? `Owner: ${tradeData.owner}` : null
            }
          });
        } else {
          // Create new trade
          await prisma.trade.create({
            data: {
              politicianId: politicianRecord.id,
              ticker,
              assetName: issuer.name || null,
              instrumentType,
              transactionType,
              reportedTransactionDate,
              filedDate,
              amountMin,
              amountMax,
              sourceName: 'capitol-trades',
              sourceRef: tradeData.detailUrl || null,
              notes: tradeData.owner ? `Owner: ${tradeData.owner}` : null
            }
          });
        }
        
        imported++;
      } catch (error) {
        errors++;
        if (errors <= 10) {
          console.error(`Error processing line ${i + 1}:`, error.message);
        }
      }
    }
    
    // Progress update
    if ((i + batchSize) % 1000 === 0 || i + batchSize >= lines.length) {
      console.log(`  Progress: ${imported} imported, ${skipped} skipped, ${errors} errors`);
    }
  }
  
  console.log('\n=== Import Complete ===');
  console.log(`Total records processed: ${lines.length}`);
  console.log(`Successfully imported: ${imported}`);
  console.log(`Skipped (missing data): ${skipped}`);
  console.log(`Errors: ${errors}`);
  
  return { imported, skipped, errors, total: lines.length };
}

// Main execution
const jsonlPath = process.argv[2] || join(__dirname, '../../data/capitol-trades/trades.jsonl');

importTrades(jsonlPath)
  .then((result) => {
    console.log('\n✅ Import finished successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

