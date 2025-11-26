import { CountryData } from '../types';

// Country name mapping for API compatibility
const countryNameMap: Record<string, string> = {
  'United States of America': 'United States',
  'United Kingdom': 'United Kingdom',
  'Russia': 'Russian Federation',
  'South Korea': 'Korea',
  'North Korea': 'Korea, Democratic People\'s Republic of',
  'Iran': 'Iran, Islamic Republic of',
  'Venezuela': 'Venezuela, Bolivarian Republic of',
  'Syria': 'Syrian Arab Republic',
  'Libya': 'Libya',
  'Myanmar': 'Myanmar',
  'Laos': 'Lao People\'s Democratic Republic',
  'Brunei': 'Brunei Darussalam',
  'Macedonia': 'North Macedonia',
  'East Timor': 'Timor-Leste',
};

// Format large numbers
const formatNumber = (num: number): string => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

const formatPopulation = (num: number): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toString();
};

// Get country name for API
const getApiCountryName = (countryName: string): string => {
  return countryNameMap[countryName] || countryName;
};

// Common exports by region (fallback data)
const getCommonExports = (region: string): string[] => {
  const exportsByRegion: Record<string, string[]> = {
    'Europe': ['Machinery', 'Vehicles', 'Pharmaceuticals', 'Aircraft', 'Electronics'],
    'Asia': ['Electronics', 'Textiles', 'Machinery', 'Petroleum', 'Steel'],
    'Americas': ['Petroleum', 'Aircraft', 'Vehicles', 'Agricultural Products', 'Minerals'],
    'Africa': ['Petroleum', 'Minerals', 'Agricultural Products', 'Diamonds', 'Gold'],
    'Oceania': ['Agricultural Products', 'Minerals', 'Natural Gas', 'Coal', 'Meat'],
  };
  return exportsByRegion[region] || ['Various Products'];
};

// Common trading partners by region (fallback)
const getCommonPartners = (region: string): string[] => {
  const partnersByRegion: Record<string, string[]> = {
    'Europe': ['Germany', 'France', 'United Kingdom', 'Italy', 'Netherlands'],
    'Asia': ['China', 'Japan', 'South Korea', 'India', 'Singapore'],
    'Americas': ['United States', 'Canada', 'Mexico', 'Brazil', 'Argentina'],
    'Africa': ['China', 'United States', 'India', 'France', 'Germany'],
    'Oceania': ['China', 'Japan', 'United States', 'South Korea', 'India'],
  };
  return partnersByRegion[region] || ['Various Countries'];
};

export const fetchCountryData = async (countryName: string): Promise<CountryData> => {
  const apiName = getApiCountryName(countryName);
  
  try {
    // Try exact name first
    let response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(apiName)}?fullText=true`);
    
    // If not found, try partial match
    if (!response.ok) {
      response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(apiName)}`);
    }
    
    if (!response.ok) {
      throw new Error(`Country not found: ${countryName}`);
    }
    
    const data = await response.json();
    const country = Array.isArray(data) ? data[0] : data;
    
    // Extract currency information
    const currencies = country.currencies || {};
    const currencyCode = Object.keys(currencies)[0] || 'N/A';
    const currency = currencies[currencyCode]?.name || currencyCode;
    const currencySymbol = currencies[currencyCode]?.symbol || '';
    
    // Get GDP data (if available in alternative sources, otherwise estimate)
    // REST Countries doesn't always have GDP, so we'll use population-based estimates
    // or try to get from World Bank API if needed
    const population = country.population || 0;
    const area = country.area || 0;
    
    // Estimate GDP based on region averages (rough estimates)
    // In a real implementation, you'd use World Bank API or similar
    const region = country.region || 'Unknown';
    const gdpPerCapitaEstimate = getGDPPerCapitaEstimate(region, country.subregion);
    const gdp = population * gdpPerCapitaEstimate;
    
    // Get capital
    const capital = country.capital?.[0] || 'N/A';
    
    // Get description
    const description = country.altSpellings?.[0] 
      ? `${country.name.common} is located in ${region}. ${country.subregion ? `Part of ${country.subregion}. ` : ''}Capital: ${capital}.`
      : `${country.name.common} is a country in ${region}.`;
    
    // Get exports and trade partners (fallback to regional data)
    const tradeExports = getCommonExports(region);
    const tradePartners = getCommonPartners(region);
    
    return {
      location: country.name.common || countryName,
      gdp: gdp,
      gdpPerCapita: gdpPerCapitaEstimate,
      population: population,
      currency: `${currency} (${currencySymbol || currencyCode})`,
      capital: capital,
      region: `${region}${country.subregion ? ` - ${country.subregion}` : ''}`,
      tradeExports: tradeExports,
      tradePartners: tradePartners,
      description: description,
    };
  } catch (error) {
    console.error('Error fetching country data:', error);
    
    // Return fallback data structure
    return {
      location: countryName,
      gdp: 0,
      gdpPerCapita: 0,
      population: 0,
      currency: 'N/A',
      capital: 'N/A',
      region: 'Unknown',
      tradeExports: ['Data Unavailable'],
      tradePartners: ['Data Unavailable'],
      description: `Data unavailable for ${countryName}. Please try again or check the country name.`,
    };
  }
};

// GDP per capita estimates by region (in USD)
// These are rough averages - in production, use World Bank API
const getGDPPerCapitaEstimate = (region: string, subregion?: string): number => {
  const estimates: Record<string, number> = {
    'Europe': 35000,
    'Asia': 12000,
    'Americas': 25000,
    'Africa': 3000,
    'Oceania': 40000,
  };
  
  // Adjust for specific subregions
  if (subregion) {
    const subregionAdjustments: Record<string, number> = {
      'Western Europe': 1.5,
      'Northern Europe': 1.4,
      'Southern Europe': 0.9,
      'Eastern Europe': 0.6,
      'Northern America': 1.3,
      'Central America': 0.4,
      'South America': 0.5,
      'Eastern Asia': 1.2,
      'Southern Asia': 0.3,
      'Southeastern Asia': 0.5,
      'Western Asia': 0.8,
      'Northern Africa': 0.4,
      'Sub-Saharan Africa': 0.3,
    };
    
    const multiplier = subregionAdjustments[subregion] || 1.0;
    return (estimates[region] || 10000) * multiplier;
  }
  
  return estimates[region] || 10000;
};



