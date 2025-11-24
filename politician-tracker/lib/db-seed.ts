import { prisma } from '@/lib/prisma';
import { ingestRecentTrades } from '@/lib/ingestion';

let isSeeding = false;
let hasCheckedSeed = false;

export async function ensureDatabaseSeeded() {
  // Only check once per server instance
  if (hasCheckedSeed) return;
  hasCheckedSeed = true;

  try {
    // Quick check if we have any politicians
    const count = await prisma.politician.count();
    if (count === 0 && !isSeeding) {
      isSeeding = true;
      console.log('Database empty, seeding initial data...');
      await ingestRecentTrades({ since: new Date('2023-01-01') });
      console.log('Database seeded successfully');
      isSeeding = false;
    }
  } catch (error) {
    // If database doesn't exist or isn't accessible, log but don't crash
    console.error('Error checking/seeding database:', error);
    isSeeding = false;
  }
}

