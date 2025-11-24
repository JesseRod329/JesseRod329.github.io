import { ingestRecentTrades } from '../lib/ingestion';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('Seeding database...');
  try {
    // Ingest mock trades for various politicians across different states
    const result = await ingestRecentTrades({ since: new Date('2023-01-01') });
    console.log(`Seeded ${result.count} trades.`);
    
    // Verify we have politicians in different states
    const politicians = await prisma.politician.findMany({
      select: { state: true, fullName: true }
    });
    console.log('Politicians seeded:', politicians);
    
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
