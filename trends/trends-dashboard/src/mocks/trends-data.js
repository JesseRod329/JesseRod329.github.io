const trendTitles = [
  'OpenAI GPT-5 Release',
  'Apple Vision Pro Update',
  'Climate Summit 2025',
  'SpaceX Mars Mission',
  'Quantum Computing Breakthrough',
  'Bitcoin ATH',
  'AI Regulation Bill',
  'Meta VR Platform',
  'Electric Vehicle Sales',
  'Renewable Energy Record',
  'Tech Layoffs Wave',
  'Cybersecurity Alert',
  'Stock Market Rally',
  'Fed Interest Rates',
  'Global Supply Chain',
];

const categories = ['TECH', 'FINANCE', 'POLITICS', 'SCIENCE', 'BUSINESS', 'ENVIRONMENT'];
const sentiments = ['POSITIVE', 'NEGATIVE', 'NEUTRAL'];

/**
 * Generate mock trending topics data
 * @returns {import('../types/trends').TrendItem[]}
 */
export function generateMockTrends() {
  return trendTitles.slice(0, 10).map((title, index) => ({
    id: `trend-${index}`,
    title,
    volume: `${Math.floor(Math.random() * 900 + 100)}K`,
    change: Math.floor(Math.random() * 200 - 50),
    category: categories[Math.floor(Math.random() * categories.length)],
    peakTime: `${Math.floor(Math.random() * 12 + 1)}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
    sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    velocity: `${Math.floor(Math.random() * 100 + 50)}/hr`,
    sparkline: Array.from({ length: 24 }, () => Math.floor(Math.random() * 80 + 20)),
    relatedQueries: [
      `${title} news`,
      `${title} analysis`,
      `${title} impact`,
      `${title} latest`,
      `${title} updates`,
    ].slice(0, Math.floor(Math.random() * 3 + 2)),
  }));
}

/**
 * Generate mock ticker data
 * @returns {import('../types/trends').TickerItem[]}
 */
export function generateTickerData() {
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'BTC', 'ETH'];
  return symbols.map(symbol => ({
    symbol,
    value: `$${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 100)}`,
    change: Math.floor(Math.random() * 10 - 5) + Math.random(),
  }));
}

/**
 * Generate mock regional data
 * @returns {import('../types/trends').RegionalData[]}
 */
export function generateRegionalData() {
  const regions = [
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'JP', name: 'Japan' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'CN', name: 'China' },
    { code: 'IN', name: 'India' },
    { code: 'BR', name: 'Brazil' },
    { code: 'AU', name: 'Australia' },
    { code: 'CA', name: 'Canada' },
  ];
  
  return regions
    .map(region => ({
      ...region,
      interest: Math.floor(Math.random() * 60 + 40),
    }))
    .sort((a, b) => b.interest - a.interest);
}
