import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeStateData } from '@/lib/gemini';

// Mapping of State Name to Code (if needed, expanding this is good practice)
const STATE_MAP: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stateName = searchParams.get('state');

  if (!stateName) {
    return NextResponse.json({ error: 'State parameter is required' }, { status: 400 });
  }

  // Convert full name to code if possible, otherwise use as is
  const stateCode = STATE_MAP[stateName] || stateName;

  try {
    // 1. Get politicians in state
    const politicians = await prisma.politician.findMany({
      where: {
        state: stateCode
      },
      include: {
        _count: {
          select: { trades: true }
        }
      }
    });

    if (politicians.length === 0) {
      return NextResponse.json({
        stateName,
        politicians: [],
        topTickers: [],
        analysis: {
          stateName,
          summary: "No politician trading data found for this region.",
          topSectors: [],
          tradingActivityLevel: "LOW",
          keyInsight: "No data."
        }
      });
    }

    // 2. Get top tickers for these politicians
    const politicianIds = politicians.map(p => p.id);
    
    const trades = await prisma.trade.groupBy({
      by: ['ticker'],
      where: {
        politicianId: { in: politicianIds }
      },
      _count: {
        ticker: true
      },
      orderBy: {
        _count: {
          ticker: 'desc'
        }
      },
      take: 5
    });

    // 3. Gemini Analysis (cached monthly inside helper)
    const analysis = await analyzeStateData(stateName, stateCode, politicians, trades);

    return NextResponse.json({
      stateName,
      politicians: politicians.map(p => ({
        id: p.id,
        name: p.fullName,
        party: p.party,
        chamber: p.chamber,
        tradeCount: p._count.trades
      })),
      topTickers: trades.map(t => ({ ticker: t.ticker, count: t._count.ticker })),
      analysis: {
        stateName: analysis.stateName || stateName,
        summary: analysis.summary || "Analysis unavailable.",
        topSectors: analysis.topSectors || [],
        tradingActivityLevel: analysis.tradingActivityLevel || "LOW",
        keyInsight: analysis.keyInsight || "No data available."
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



