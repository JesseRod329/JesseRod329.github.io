// Wrestling Analytics Dashboard Types

export interface MatchData {
  id: string;
  date: string;
  winners: string[];
  losers: string[];
  matchTime: string;
  event: EventDetails;
  isTagTeam: boolean;
  isPPV: boolean;
}

export interface EventDetails {
  promotion: string;
  eventName: string;
  eventType: string;
  venue: string;
  city: string;
  country: string;
  isSpecialEvent: boolean;
}

export interface WrestlerStats {
  name: string;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  averageMatchTime: number;
  opponents: string[];
  venues: string[];
  promotions: string[];
  tagPartners: string[];
  ppvMatches: number;
}

export interface TagTeamStats {
  name: string;
  members: string[];
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  averageMatchTime: number;
  opponents: string[];
}

export interface VenueStats {
  name: string;
  city: string;
  country: string;
  totalMatches: number;
  wrestlers: string[];
  averageMatchTime: number;
  promotions: string[];
}

export interface VisualizationConfig {
  filters: FilterState;
  selectedWrestlers: string[];
  selectedPromotions: string[];
  timeRange: DateRange;
  chartType: ChartType;
}

export interface FilterState {
  promotions: string[];
  wrestlers: string[];
  venues: string[];
  dateRange: DateRange;
  matchType: MatchType;
  eventType: EventType;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type ChartType = 'network' | 'timeline' | 'radial' | 'map' | 'matrix';
export type MatchType = 'all' | 'singles' | 'tag' | 'multi';
export type EventType = 'all' | 'ppv' | 'tv' | 'house';

export interface NetworkNode {
  id: string;
  name: string;
  group: string;
  totalMatches: number;
  wins: number;
  radius: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
  matchCount: number;
}

export interface TimelineData {
  date: Date;
  wrestler: string;
  value: number;
  matchType: string;
  opponent: string;
}

export interface HeroMetrics {
  totalMatches: number;
  totalWrestlers: number;
  totalVenues: number;
  totalPromotions: number;
  averageMatchTime: number;
  lastUpdated: Date;
}

export interface DashboardState {
  data: MatchData[];
  wrestlers: WrestlerStats[];
  venues: VenueStats[];
  tagTeams: TagTeamStats[];
  heroMetrics: HeroMetrics;
  isLoading: boolean;
  error: string | null;
  config: VisualizationConfig;
}
