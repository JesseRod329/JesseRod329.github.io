import { MatchData, EventDetails, WrestlerStats, VenueStats, HeroMetrics } from '../types';

/**
 * Parse multiple CSV files from wrestler data
 */
export const parseMultipleCSVs = async (): Promise<MatchData[]> => {
  const matches: MatchData[] = [];
  const processedMatches = new Set<string>(); // To avoid duplicates
  
  try {
    // Get list of wrestler CSV files
    const wrestlerFiles = await getWrestlerFiles();
    
    for (const fileName of wrestlerFiles) {
      try {
        const response = await fetch(`/wrestling-analytics-dashboard/data/${fileName}`);
        if (!response.ok) continue;
        
        const csvText = await response.text();
        const wrestlerMatches = parseWrestlerCSV(csvText, fileName);
        
        // Add matches, avoiding duplicates
        wrestlerMatches.forEach(match => {
          const matchKey = `${match.date}-${match.id}`;
          if (!processedMatches.has(matchKey)) {
            matches.push(match);
            processedMatches.add(matchKey);
          }
        });
      } catch (error) {
        console.warn(`Error processing ${fileName}:`, error);
      }
    }
  } catch (error) {
    console.error('Error loading wrestler data:', error);
  }
  
  return matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * Get list of wrestler CSV files
 */
const getWrestlerFiles = async (): Promise<string[]> => {
  // For performance, we'll start with top wrestlers for initial load
  // Users can search for more wrestlers dynamically
  const priorityWrestlers = [
    'CM_Punk_matches.csv',
    'John_Cena_matches.csv',
    'Roman_Reigns_matches.csv',
    'Seth_Rollins_matches.csv',
    'Cody_Rhodes_matches.csv',
    'Drew_McIntyre_matches.csv',
    'Brock_Lesnar_matches.csv',
    'Becky_Lynch_matches.csv',
    'Charlotte_Flair_matches.csv',
    'Bayley_matches.csv',
    'Bianca_Belair_matches.csv',
    'Rhea_Ripley_matches.csv',
    'Finn_Balor_matches.csv',
    'AJ_Styles_matches.csv',
    'Adam_Cole_matches.csv',
    'Johnny_Gargano_matches.csv',
    'Adam_Copeland_matches.csv',
    'Jon_Moxley_matches.csv',
    'Bryan_Danielson_matches.csv',
    'Kenny_Omega_matches.csv',
    'Adam_Page_matches.csv',
    'Darby_Allin_matches.csv',
    'Orange_Cassidy_matches.csv',
    'Eddie_Kingston_matches.csv',
    'CM_Punk_matches.csv',
    'Jade_Cargill_matches.csv',
    'Hikaru_Shida_matches.csv',
    'Dr._Britt_Baker_DMD_matches.csv',
    'Thunder_Rosa_matches.csv',
    'Toni_Storm_matches.csv',
    'Hiroshi_Tanahashi_matches.csv',
    'Kazuchika_Okada_matches.csv',
    'Will_Ospreay_matches.csv',
    'Kota_Ibushi_matches.csv',
    'Jay_White_matches.csv',
    'Tetsuya_Naito_matches.csv',
    'Shingo_Takagi_matches.csv',
    'Tomohiro_Ishii_matches.csv',
    'Hiromu_Takahashi_matches.csv',
    'EVIL_matches.csv',
    'KUSHIDA_matches.csv',
    'Zack_Sabre_Jr._matches.csv',
    'Samoa_Joe_matches.csv',
    'Kurt_Angle_matches.csv',
    'Mick_Foley_matches.csv',
    'The_Rock_matches.csv',
    'Steve_Austin_matches.csv',
    'Triple_H_matches.csv',
    'The_Undertaker_matches.csv'
  ];
  
  return priorityWrestlers;
};

/**
 * Search for specific wrestler files
 */
export const searchWrestlerFiles = async (searchTerm: string): Promise<string[]> => {
  // This would ideally make an API call to get all available files
  // For now, we'll return a basic search result
  const allWrestlers = [
    'CM_Punk_matches.csv',
    'John_Cena_matches.csv',
    'Roman_Reigns_matches.csv',
    'Seth_Rollins_matches.csv',
    'Cody_Rhodes_matches.csv',
    'Drew_McIntyre_matches.csv',
    'Brock_Lesnar_matches.csv',
    'Becky_Lynch_matches.csv',
    'Charlotte_Flair_matches.csv',
    'Bayley_matches.csv',
    'Bianca_Belair_matches.csv',
    'Rhea_Ripley_matches.csv'
    // Add more as needed
  ];
  
  const searchLower = searchTerm.toLowerCase().replace(/\s+/g, '_');
  return allWrestlers.filter(file => 
    file.toLowerCase().includes(searchLower)
  );
};

/**
 * Parse a single wrestler's CSV file
 */
const parseWrestlerCSV = (csvText: string, fileName: string): MatchData[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  const matches: MatchData[] = [];
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    try {
      const values = parseCSVLine(lines[i]);
      if (values.length < 4) continue; // Skip incomplete rows
      
      const match = parseRealMatchData(values, fileName);
      if (match) {
        matches.push(match);
      }
    } catch (error) {
      console.warn(`Error parsing line ${i + 1} in ${fileName}:`, error);
    }
  }
  
  return matches;
};

/**
 * Parse CSV data into structured match data (legacy function for compatibility)
 */
export const parseCSV = (csvText: string): MatchData[] => {
  // This is kept for backward compatibility, but now we use parseMultipleCSVs
  return parseWrestlerCSV(csvText, 'legacy.csv');
};

/**
 * Parse a single CSV line handling quoted values
 */
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

/**
 * Parse real match data from wrestler CSV format
 */
const parseRealMatchData = (values: string[], fileName: string): MatchData | null => {
  try {
    // Format: [index, date, event, result, location, image_url]
    if (values.length < 4) return null;
    
    const [, dateStr, , eventStr] = values;
    
    // Parse date (format: DD.MM.YYYY)
    const dateParts = dateStr.split('.');
    if (dateParts.length !== 3) return null;
    const date = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
    
    // Extract wrestler name from filename
    const wrestlerName = fileName.replace('_matches.csv', '').replace(/_/g, ' ');
    
    // Parse the complex event string
    const matchInfo = parseEventString(eventStr, wrestlerName);
    if (!matchInfo) return null;
    
    const match: MatchData = {
      id: `${date}-${matchInfo.winners.join('-')}-${matchInfo.losers.join('-')}`,
      date,
      winners: matchInfo.winners,
      losers: matchInfo.losers,
      matchTime: matchInfo.matchTime,
      event: matchInfo.event,
      isTagTeam: matchInfo.isTagTeam,
      isPPV: matchInfo.isPPV
    };
    
    return match;
  } catch (error) {
    console.warn('Error parsing real match data:', error);
    return null;
  }
};

/**
 * Parse the complex event string from real data
 */
const parseEventString = (eventStr: string, wrestlerName: string): {
  winners: string[];
  losers: string[];
  matchTime: string;
  event: EventDetails;
  isTagTeam: boolean;
  isPPV: boolean;
} | null => {
  try {
    // Example: "CM Punk defeats Gunther(c) (30:19) WWE SummerSlam 2025 - Saturday- Premium Live Event @ MetLife Stadium in East Rutherford, New Jersey, USA"
    
    // Extract match time
    const timeMatch = eventStr.match(/\((\d{1,2}:\d{2})\)/);
    const matchTime = timeMatch ? timeMatch[1] : '0:00';
    
    // Extract venue and location
    const venueMatch = eventStr.match(/@\s*([^@]+)$/);
    const venueInfo = venueMatch ? venueMatch[1].trim() : 'Unknown Venue';
    const venueParts = venueInfo.split(' in ');
    const venue = venueParts[0]?.trim() || 'Unknown Venue';
    const locationParts = venueParts[1]?.split(', ') || [];
    const city = locationParts[0]?.trim() || 'Unknown City';
    const country = locationParts[locationParts.length - 1]?.trim() || 'Unknown Country';
    
    // Extract event info
    const eventMatch = eventStr.match(/(?:WWE|AEW|NJPW|Impact|TNA)\s+([^@]+?)(?:\s*@|$)/);
    const eventInfo = eventMatch ? eventMatch[1].trim() : 'Unknown Event';
    const eventParts = eventInfo.split(' - ');
    const eventName = eventParts[0]?.trim() || 'Unknown Event';
    const eventType = eventParts[1]?.trim() || 'Unknown Type';
    
    // Determine promotion
    let promotion = 'Unknown';
    if (eventStr.includes('WWE')) promotion = 'WWE';
    else if (eventStr.includes('AEW')) promotion = 'AEW';
    else if (eventStr.includes('NJPW')) promotion = 'NJPW';
    else if (eventStr.includes('Impact') || eventStr.includes('TNA')) promotion = 'Impact Wrestling';
    
    // Determine if PPV
    const isPPV = eventStr.includes('Premium Live Event') || 
                 eventStr.includes('Pay-Per-View') || 
                 eventStr.includes('PPV') ||
                 eventName.includes('WrestleMania') ||
                 eventName.includes('SummerSlam') ||
                 eventName.includes('Royal Rumble') ||
                 eventName.includes('Survivor Series') ||
                 eventName.includes('Money In The Bank') ||
                 eventName.includes('Hell In A Cell') ||
                 eventName.includes('Elimination Chamber') ||
                 eventName.includes('Forbidden Door') ||
                 eventName.includes('All Out') ||
                 eventName.includes('Revolution') ||
                 eventName.includes('Double or Nothing');
    
    // Parse winners and losers
    const { winners, losers, isTagTeam } = parseMatchResult(eventStr, wrestlerName);
    
    // Determine if special event
    const isSpecialEvent = eventName.includes('Forbidden Door') ||
                          eventName.includes('WrestleMania') ||
                          eventName.includes('G1 Climax') ||
                          eventName.includes('Royal Rumble');
    
    const event: EventDetails = {
      promotion,
      eventName,
      eventType,
      venue,
      city,
      country,
      isSpecialEvent
    };
    
    return {
      winners,
      losers,
      matchTime,
      event,
      isTagTeam,
      isPPV
    };
  } catch (error) {
    console.warn('Error parsing event string:', error);
    return null;
  }
};

/**
 * Parse match result to determine winners and losers
 */
const parseMatchResult = (eventStr: string, wrestlerName: string): {
  winners: string[];
  losers: string[];
  isTagTeam: boolean;
} => {
  const winners: string[] = [];
  const losers: string[] = [];
  
  try {
    // Look for "defeats" or "vs" patterns
    if (eventStr.includes('defeats')) {
      const defeatMatch = eventStr.match(/^([^@]+?)\s+defeats?\s+([^@(]+?)(?:\s*\(|\s*@|$)/i);
      if (defeatMatch) {
        const winnerText = defeatMatch[1].trim();
        const loserText = defeatMatch[2].trim();
        
        // Parse winners
        const winnerNames = parseWrestlerNames(winnerText);
        winners.push(...winnerNames);
        
        // Parse losers
        const loserNames = parseWrestlerNames(loserText);
        losers.push(...loserNames);
      }
    } else if (eventStr.includes(' vs ')) {
      // For vs matches, assume the wrestler from filename won
      const vsMatch = eventStr.match(/^([^@]+?)\s+vs\.?\s+([^@(]+?)(?:\s*\(|\s*@|$)/i);
      if (vsMatch) {
        const participant1 = vsMatch[1].trim();
        const participant2 = vsMatch[2].trim();
        
        // Determine who won (wrestler from filename is usually the winner)
        if (participant1.toLowerCase().includes(wrestlerName.toLowerCase())) {
          winners.push(...parseWrestlerNames(participant1));
          losers.push(...parseWrestlerNames(participant2));
        } else {
          winners.push(...parseWrestlerNames(participant2));
          losers.push(...parseWrestlerNames(participant1));
        }
      }
    }
    
    // Fallback: if we can't parse, assume the wrestler from filename was involved
    if (winners.length === 0 && losers.length === 0) {
      winners.push(wrestlerName);
      losers.push('Unknown Opponent');
    }
    
    // Determine if tag team match
    const isTagTeam = winners.length > 1 || losers.length > 1 || 
                     eventStr.includes('&') || eventStr.includes(' and ');
    
    return { winners, losers, isTagTeam };
  } catch (error) {
    console.warn('Error parsing match result:', error);
    return { winners: [wrestlerName], losers: ['Unknown Opponent'], isTagTeam: false };
  }
};

/**
 * Parse match data from CSV values (legacy function)
 */
const parseMatchData = (values: string[]): MatchData | null => {
  try {
    const [dateStr, winnersStr, , losersStr, matchTimeStr, eventDetailsStr] = values;
    
    // Parse date
    const dateParts = dateStr.split('.');
    if (dateParts.length !== 3) return null;
    const date = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
    
    // Parse winners and losers
    const winners = parseWrestlerNames(winnersStr);
    const losers = parseWrestlerNames(losersStr);
    
    if (winners.length === 0 || losers.length === 0) return null;
    
    // Parse event details
    const eventDetails = parseEventDetails(eventDetailsStr);
    if (!eventDetails) return null;
    
    // Determine if it's a tag team match
    const isTagTeam = winners.length > 1 || losers.length > 1 || 
                     winnersStr.includes('&') || losersStr.includes('&');
    
    // Determine if it's a PPV
    const isPPV = eventDetails.eventType.toLowerCase().includes('pay per view') ||
                 eventDetails.eventType.toLowerCase().includes('ppv') ||
                 eventDetails.eventName.toLowerCase().includes('wrestlemania') ||
                 eventDetails.eventName.toLowerCase().includes('forbidden door');
    
    const match: MatchData = {
      id: `${date}-${winners.join('-')}-${losers.join('-')}`,
      date,
      winners,
      losers,
      matchTime: matchTimeStr || '0:00',
      event: eventDetails,
      isTagTeam,
      isPPV
    };
    
    return match;
  } catch (error) {
    console.warn('Error parsing match data:', error);
    return null;
  }
};

/**
 * Parse wrestler names from a string
 */
const parseWrestlerNames = (namesStr: string): string[] => {
  if (!namesStr) return [];
  
  // Handle different formats: "Name1 & Name2", "Name1, Name2", "(Name1 & Name2)"
  let cleaned = namesStr.replace(/[()]/g, '').trim();
  
  // Split by & or , and clean up names
  const names = cleaned.split(/[&,]/).map(name => name.trim()).filter(name => name.length > 0);
  
  return names;
};

/**
 * Parse event details from event string
 */
const parseEventDetails = (eventStr: string): EventDetails | null => {
  try {
    // Expected format: "Promotion/Event Name - Event Type - Venue, City, Country"
    const parts = eventStr.split(' - ');
    if (parts.length < 3) return null;
    
    const [promotionEvent, eventType, location] = parts;
    
    // Parse promotion and event name
    const promotionParts = promotionEvent.split('/');
    const promotion = promotionParts[0]?.trim() || 'Unknown';
    const eventName = promotionParts[1]?.trim() || 'Unknown Event';
    
    // Parse location
    const locationParts = location.split(',').map(part => part.trim());
    const venue = locationParts[0] || 'Unknown Venue';
    const city = locationParts[1] || 'Unknown City';
    const country = locationParts[2] || 'Unknown Country';
    
    // Determine if it's a special event
    const isSpecialEvent = eventName.toLowerCase().includes('forbidden door') ||
                          eventName.toLowerCase().includes('wrestlemania') ||
                          eventName.toLowerCase().includes('royal rumble') ||
                          eventName.toLowerCase().includes('summerslam');
    
    return {
      promotion,
      eventName,
      eventType: eventType.trim(),
      venue,
      city,
      country,
      isSpecialEvent
    };
  } catch (error) {
    console.warn('Error parsing event details:', error);
    return null;
  }
};

/**
 * Calculate wrestler statistics from match data
 */
export const calculateWrestlerStats = (matches: MatchData[]): WrestlerStats[] => {
  const wrestlerMap = new Map<string, WrestlerStats>();
  
  matches.forEach(match => {
    // Process winners
    match.winners.forEach(wrestler => {
      updateWrestlerStats(wrestlerMap, wrestler, match, true);
    });
    
    // Process losers
    match.losers.forEach(wrestler => {
      updateWrestlerStats(wrestlerMap, wrestler, match, false);
    });
  });
  
  return Array.from(wrestlerMap.values()).sort((a, b) => b.totalMatches - a.totalMatches);
};

/**
 * Update wrestler statistics
 */
const updateWrestlerStats = (
  wrestlerMap: Map<string, WrestlerStats>,
  wrestler: string,
  match: MatchData,
  isWinner: boolean
): void => {
  if (!wrestlerMap.has(wrestler)) {
    wrestlerMap.set(wrestler, {
      name: wrestler,
      totalMatches: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      averageMatchTime: 0,
      opponents: [],
      venues: [],
      promotions: [],
      tagPartners: [],
      ppvMatches: 0
    });
  }
  
  const stats = wrestlerMap.get(wrestler)!;
  stats.totalMatches++;
  
  if (isWinner) {
    stats.wins++;
    // Add opponents (losers)
    match.losers.forEach(opponent => {
      if (!stats.opponents.includes(opponent)) {
        stats.opponents.push(opponent);
      }
    });
    // Add tag partners
    match.winners.forEach(partner => {
      if (partner !== wrestler && !stats.tagPartners.includes(partner)) {
        stats.tagPartners.push(partner);
      }
    });
  } else {
    stats.losses++;
    // Add opponents (winners)
    match.winners.forEach(opponent => {
      if (!stats.opponents.includes(opponent)) {
        stats.opponents.push(opponent);
      }
    });
    // Add tag partners
    match.losers.forEach(partner => {
      if (partner !== wrestler && !stats.tagPartners.includes(partner)) {
        stats.tagPartners.push(partner);
      }
    });
  }
  
  // Add venue
  if (!stats.venues.includes(match.event.venue)) {
    stats.venues.push(match.event.venue);
  }
  
  // Add promotion
  if (!stats.promotions.includes(match.event.promotion)) {
    stats.promotions.push(match.event.promotion);
  }
  
  // Count PPV matches
  if (match.isPPV) {
    stats.ppvMatches++;
  }
  
  // Calculate win rate
  stats.winRate = stats.totalMatches > 0 ? (stats.wins / stats.totalMatches) * 100 : 0;
  
  // Calculate average match time (simplified)
  const matchMinutes = parseMatchTime(match.matchTime);
  stats.averageMatchTime = ((stats.averageMatchTime * (stats.totalMatches - 1)) + matchMinutes) / stats.totalMatches;
};

/**
 * Parse match time string to minutes
 */
const parseMatchTime = (timeStr: string): number => {
  if (!timeStr || timeStr === '0:00') return 0;
  
  const parts = timeStr.split(':');
  if (parts.length !== 2) return 0;
  
  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;
  
  return minutes + (seconds / 60);
};

/**
 * Calculate venue statistics
 */
export const calculateVenueStats = (matches: MatchData[]): VenueStats[] => {
  const venueMap = new Map<string, VenueStats>();
  
  matches.forEach(match => {
    const venueKey = `${match.event.venue}-${match.event.city}`;
    
    if (!venueMap.has(venueKey)) {
      venueMap.set(venueKey, {
        name: match.event.venue,
        city: match.event.city,
        country: match.event.country,
        totalMatches: 0,
        wrestlers: [],
        averageMatchTime: 0,
        promotions: []
      });
    }
    
    const venue = venueMap.get(venueKey)!;
    venue.totalMatches++;
    
    // Add wrestlers
    [...match.winners, ...match.losers].forEach(wrestler => {
      if (!venue.wrestlers.includes(wrestler)) {
        venue.wrestlers.push(wrestler);
      }
    });
    
    // Add promotion
    if (!venue.promotions.includes(match.event.promotion)) {
      venue.promotions.push(match.event.promotion);
    }
    
    // Update average match time
    const matchMinutes = parseMatchTime(match.matchTime);
    venue.averageMatchTime = ((venue.averageMatchTime * (venue.totalMatches - 1)) + matchMinutes) / venue.totalMatches;
  });
  
  return Array.from(venueMap.values()).sort((a, b) => b.totalMatches - a.totalMatches);
};

/**
 * Calculate hero metrics
 */
export const calculateHeroMetrics = (matches: MatchData[]): HeroMetrics => {
  const wrestlers = new Set<string>();
  const venues = new Set<string>();
  const promotions = new Set<string>();
  let totalMatchTime = 0;
  let validMatches = 0;
  
  matches.forEach(match => {
    // Count unique wrestlers
    [...match.winners, ...match.losers].forEach(wrestler => wrestlers.add(wrestler));
    
    // Count unique venues
    venues.add(`${match.event.venue}-${match.event.city}`);
    
    // Count unique promotions
    promotions.add(match.event.promotion);
    
    // Calculate average match time
    const matchMinutes = parseMatchTime(match.matchTime);
    if (matchMinutes > 0) {
      totalMatchTime += matchMinutes;
      validMatches++;
    }
  });
  
  return {
    totalMatches: matches.length,
    totalWrestlers: wrestlers.size,
    totalVenues: venues.size,
    totalPromotions: promotions.size,
    averageMatchTime: validMatches > 0 ? totalMatchTime / validMatches : 0,
    lastUpdated: new Date()
  };
};

/**
 * Filter matches based on filter criteria
 */
export const filterMatches = (matches: MatchData[], filters: any): MatchData[] => {
  return matches.filter(match => {
    // Date range filter
    const matchDate = new Date(match.date);
    if (filters.dateRange) {
      if (matchDate < filters.dateRange.start || matchDate > filters.dateRange.end) {
        return false;
      }
    }
    
    // Promotion filter
    if (filters.promotions && filters.promotions.length > 0) {
      if (!filters.promotions.includes(match.event.promotion)) {
        return false;
      }
    }
    
    // Wrestler filter
    if (filters.wrestlers && filters.wrestlers.length > 0) {
      const matchWrestlers = [...match.winners, ...match.losers];
      const hasWrestler = filters.wrestlers.some((w: string) => matchWrestlers.includes(w));
      if (!hasWrestler) {
        return false;
      }
    }
    
    // Match type filter
    if (filters.matchType && filters.matchType !== 'all') {
      if (filters.matchType === 'singles' && match.isTagTeam) return false;
      if (filters.matchType === 'tag' && !match.isTagTeam) return false;
    }
    
    // Event type filter
    if (filters.eventType && filters.eventType !== 'all') {
      if (filters.eventType === 'ppv' && !match.isPPV) return false;
      if (filters.eventType === 'tv' && match.isPPV) return false;
    }
    
    return true;
  });
};
