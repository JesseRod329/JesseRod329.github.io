#!/usr/bin/env node

/**
 * Import Capitol Trades data into PRODUCTION database
 * 
 * This script requires DATABASE_URL to be set to production database
 * 
 * Usage:
 *   DATABASE_URL="postgresql://..." node scripts/import-to-production.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is required');
  console.error('   Set it to your production database connection string');
  process.exit(1);
}

const prisma = new PrismaClient();

// Parse trade size strings like "1K–15K", "50K–100K", "$1M–$5M" to min/max values
function parseTradeSize(tradeSize) {
  if (!tradeSize) return { min: null, max: null };
  const cleaned = tradeSize.replace(/\$/g, '').replace(/\s/g, '');
  const match = cleaned.match(/([\d.]+)([KM]?)–([\d.]+)([KM]?)/);
  if (!match) return { min: null, max: null };
  const [, minVal, minUnit, maxVal, maxUnit] = match;
  const multiplier = { '': 1, 'K': 1000, 'M': 1000000 };
  const min = parseFloat(minVal) * (multiplier[minUnit] || 1);
  const max = parseFloat(maxVal) * (multiplier[maxUnit] || 1);
  return { min, max };
}

function mapChamber(chamber) {
  if (!chamber) return 'OTHER';
  const upper = chamber.toUpperCase();
  if (upper === 'HOUSE') return 'HOUSE';
  if (upper === 'SENATE') return 'SENATE';
  return 'OTHER';
}

function mapParty(party) {
  if (!party) return 'OTHER';
  const upper = party.toUpperCase();
  if (upper.includes('DEMOCRAT')) return 'DEMOCRAT';
  if (upper.includes('REPUBLICAN')) return 'REPUBLICAN';
  if (upper.includes('INDEPENDENT')) return 'INDEPENDENT';
  return 'OTHER';
}

function extractTicker(issuer) {
  if (!issuer?.ticker) return null;
  return issuer.ticker.replace(/:US$/, '').trim();
}

function parseTradeDate(tradeDate) {
  if (!tradeDate) return null;
  if (tradeDate.display) {
    const parsed = new Date(tradeDate.display);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  if (tradeDate.year) {
    const parsed = new Date(tradeDate.year);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return null;
}

function mapTransactionType(type) {
  if (!type) return 'UNKNOWN';
  const upper = type.toUpperCase();
  if (upper === 'BUY' || upper === 'PURCHASE') return 'BUY';
  if (upper === 'SELL' || upper === 'SALE') return 'SELL';
  return 'UNKNOWN';
}

function mapInstrumentType() {
  return 'STOCK';
}

async function importTrades(jsonlPath) {
  console.log(`📊 Reading trades from: ${jsonlPath}`);
  const content = readFileSync(jsonlPath, 'utf-8');
  const lines = content.trim().split('\n').filter(line => line.trim());
  
  console.log(`📦 Found ${lines.length} trade records`);
  console.log(`🔗 Connecting to: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  const batchSize = 100;
  
  for (let i = 0; i < lines.length; i += batchSize) {
    const batch = lines.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(lines.length / batchSize);
    
    if (batchNum % 50 === 0 || batchNum === totalBatches) {
      console.log(`⏳ Processing batch ${batchNum}/${totalBatches} (${i + 1}-${Math.min(i + batchSize, lines.length)} of ${lines.length})...`);
    }
    
    for (const line of batch) {
      try {
        const tradeData = JSON.parse(line);
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
        
        const { min: amountMin, max: amountMax } = parseTradeSize(tradeData.tradeSize);
        const reportedTransactionDate = parseTradeDate(tradeData.tradeDate);
        if (!reportedTransactionDate) {
          skipped++;
          continue;
        }
        
        let filedDate = null;
        if (tradeData.reportingGapDays && reportedTransactionDate) {
          filedDate = new Date(reportedTransactionDate);
          filedDate.setDate(filedDate.getDate() + (tradeData.reportingGapDays || 0));
        }
        
        const chamber = mapChamber(politician.chamber);
        const party = mapParty(politician.party);
        const transactionType = mapTransactionType(tradeData.transactionType);
        const instrumentType = mapInstrumentType();
        
        const externalIds = {
          capitolTrades: {
            slug: politician.slug,
            url: politician.url
          }
        };
        
        const politicianRecord = await prisma.politician.upsert({
          where: { fullName: politician.name },
          create: {
            fullName: politician.name,
            chamber,
            party,
            state: politician.state || null,
            committees: null,
            externalIds: JSON.stringify(externalIds)
          },
          update: {
            chamber,
            party,
            state: politician.state || null,
            externalIds: JSON.stringify(externalIds)
          }
        });
        
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
          console.error(`❌ Error processing line ${i + 1}:`, error.message);
        }
      }
    }
    
    if ((i + batchSize) % 5000 === 0 || i + batchSize >= lines.length) {
      console.log(`   ✅ Progress: ${imported} imported, ${skipped} skipped, ${errors} errors`);
    }
  }
  
  console.log('\n=== Import Complete ===');
  console.log(`📊 Total records processed: ${lines.length}`);
  console.log(`✅ Successfully imported: ${imported}`);
  console.log(`⏭️  Skipped (missing data): ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  
  return { imported, skipped, errors, total: lines.length };
}

const jsonlPath = process.argv[2] || join(__dirname, '../../data/capitol-trades/trades.jsonl');

console.log('🚀 Starting production import...\n');

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

