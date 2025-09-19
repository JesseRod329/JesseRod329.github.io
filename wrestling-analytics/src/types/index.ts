export interface MatchData {
  date: string;
  parsedDate: Date;
  year: number;
  wrestler: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw' | 'unknown';
  event: string;
  promotion: string;
  location: string;
  matchTime?: string;
  imageUrl?: string;
}

export interface WrestlerProfile {
  name: string;
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  matches: MatchData[];
  promotion: string;
  lastMatch?: Date;
  careerSpan?: {
    start: Date;
    end: Date;
  };
}

export interface DashboardMetrics {
  totalMatches: number;
  totalWrestlers: number;
  totalPromotions: number;
  avgMatchesPerWrestler: number;
  winRate: number;
}

export interface FilterState {
  searchTerm: string;
  selectedPromotion: string;
  selectedYear: string;
  selectedResult: string;
  minMatches: number;
}

export interface DashboardContextType {
  matchData: MatchData[];
  filteredData: MatchData[];
  wrestlers: WrestlerProfile[];
  metrics: DashboardMetrics;
  filters: FilterState;
  loading: boolean;
  error: string | null;
  updateFilters: (filters: Partial<FilterState>) => void;
  refreshData: () => Promise<void>;
}

export interface VisualizationConfig {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors: {
    primary: string;
    secondary: string;
    victory: string;
    defeat: string;
    draw: string;
  };
}

export interface NetworkNode {
  id: string;
  name: string;
  group: string;
  matches: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
}

export type VisualizationTab = 'timeline' | 'network' | 'promotions' | 'wrestlers';
