import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { 
  DashboardContextType, 
  MatchData, 
  WrestlerProfile, 
  DashboardMetrics, 
  FilterState 
} from '../types';

interface DashboardState {
  matchData: MatchData[];
  filteredData: MatchData[];
  wrestlers: WrestlerProfile[];
  metrics: DashboardMetrics;
  filters: FilterState;
  loading: boolean;
  error: string | null;
}

type DashboardAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DATA'; payload: MatchData[] }
  | { type: 'UPDATE_FILTERS'; payload: Partial<FilterState> }
  | { type: 'SET_WRESTLERS'; payload: WrestlerProfile[] }
  | { type: 'UPDATE_METRICS'; payload: DashboardMetrics };

const initialState: DashboardState = {
  matchData: [],
  filteredData: [],
  wrestlers: [],
  metrics: {
    totalMatches: 0,
    totalWrestlers: 0,
    totalPromotions: 0,
    avgMatchesPerWrestler: 0,
    winRate: 0,
  },
  filters: {
    searchTerm: '',
    selectedPromotion: '',
    selectedYear: '',
    selectedResult: '',
    minMatches: 0,
  },
  loading: true,
  error: null,
};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_DATA':
      return { ...state, matchData: action.payload, loading: false };
    
    case 'UPDATE_FILTERS':
      const newFilters = { ...state.filters, ...action.payload };
      const filteredData = applyFilters(state.matchData, newFilters);
      return { 
        ...state, 
        filters: newFilters, 
        filteredData,
        metrics: calculateMetrics(filteredData, state.wrestlers)
      };
    
    case 'SET_WRESTLERS':
      return { 
        ...state, 
        wrestlers: action.payload,
        metrics: calculateMetrics(state.filteredData, action.payload)
      };
    
    case 'UPDATE_METRICS':
      return { ...state, metrics: action.payload };
    
    default:
      return state;
  }
}

function applyFilters(data: MatchData[], filters: FilterState): MatchData[] {
  return data.filter(match => {
    const matchesSearch = !filters.searchTerm || 
      match.wrestler.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      match.opponent.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesPromotion = !filters.selectedPromotion || 
      match.promotion === filters.selectedPromotion;
    
    const matchesYear = !filters.selectedYear || 
      match.year.toString() === filters.selectedYear;
    
    const matchesResult = !filters.selectedResult || 
      match.result === filters.selectedResult;
    
    return matchesSearch && matchesPromotion && matchesYear && matchesResult;
  });
}

function calculateMetrics(matches: MatchData[], wrestlers: WrestlerProfile[]): DashboardMetrics {
  const totalMatches = matches.length;
  const totalWrestlers = wrestlers.length;
  const totalPromotions = [...new Set(matches.map(m => m.promotion))].length;
  const avgMatchesPerWrestler = totalWrestlers > 0 ? Math.round(totalMatches / totalWrestlers) : 0;
  
  const wins = matches.filter(m => m.result === 'win').length;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
  
  return {
    totalMatches,
    totalWrestlers,
    totalPromotions,
    avgMatchesPerWrestler,
    winRate,
  };
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Load data on component mount
  useEffect(() => {
    refreshData();
  }, []);

  const updateFilters = (filters: Partial<FilterState>) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: filters });
  };

  // Sample wrestler files for demo
  const wrestlerFiles = [
    'John_Cena_matches.csv',
    'Roman_Reigns_matches.csv', 
    'Brock_Lesnar_matches.csv',
    'CM_Punk_matches.csv',
    'Seth_Rollins_matches.csv',
    'AJ_Styles_matches.csv',
    'The_Rock_matches.csv',
    'Triple_H_matches.csv',
    'Undertaker_matches.csv',
    'Kane_matches.csv'
  ];

  const parseCSV = async (filename: string): Promise<MatchData[]> => {
    try {
      console.log(`Loading ${filename}...`);
      const response = await fetch(`https://raw.githubusercontent.com/JesseRod329/JesseRod329.github.io/main/wresltedash/${filename}`);
      if (!response.ok) {
        console.warn(`Failed to load ${filename}: ${response.status}`);
        return [];
      }
      
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const matches: MatchData[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        if (values.length >= headers.length) {
          const match: any = {};
          headers.forEach((header, index) => {
            match[header] = values[index] || '';
          });
          
          // Parse date
          if (match.date) {
            const dateParts = match.date.split('.');
            if (dateParts.length === 3) {
              match.parsedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
              match.year = parseInt(dateParts[2]);
            }
          }
          
          match.wrestler = filename.replace('_matches.csv', '').replace(/_/g, ' ');
          match.promotion = extractPromotion(match.event || '');
          match.result = extractResult(match.result || '');
          match.opponent = 'Unknown Opponent'; // Simplified for demo
          
          matches.push(match as MatchData);
        }
      }
      return matches;
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return [];
    }
  };

  const extractPromotion = (event: string): string => {
    if (event.toLowerCase().includes('wwe')) return 'WWE';
    if (event.toLowerCase().includes('aew')) return 'AEW';
    if (event.toLowerCase().includes('njpw')) return 'NJPW';
    if (event.toLowerCase().includes('tna') || event.toLowerCase().includes('impact')) return 'TNA';
    return 'Independent';
  };

  const extractResult = (resultStr: string): 'win' | 'loss' | 'draw' | 'unknown' => {
    const lower = resultStr.toLowerCase();
    if (lower.includes('win') || lower.includes('defeat') || lower.includes('beat')) return 'win';
    if (lower.includes('loss') || lower.includes('lost') || lower.includes('defeat')) return 'loss';
    if (lower.includes('draw') || lower.includes('tie')) return 'draw';
    return 'unknown';
  };

  const refreshData = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const allMatches: MatchData[] = [];
      const wrestlers: WrestlerProfile[] = [];
      
      // Load data from sample files
      for (const file of wrestlerFiles) {
        const matches = await parseCSV(file);
        if (matches.length > 0) {
          allMatches.push(...matches);
          
          const wrestlerName = file.replace('_matches.csv', '').replace(/_/g, ' ');
          const wins = matches.filter(m => m.result === 'win').length;
          const losses = matches.filter(m => m.result === 'loss').length;
          const draws = matches.filter(m => m.result === 'draw').length;
          
          wrestlers.push({
            name: wrestlerName,
            totalMatches: matches.length,
            wins,
            losses,
            draws,
            winRate: matches.length > 0 ? Math.round((wins / matches.length) * 100) : 0,
            matches,
            promotion: extractPromotion(matches[0]?.event || ''),
            lastMatch: matches[matches.length - 1]?.parsedDate,
          });
        }
      }
      
      dispatch({ type: 'SET_DATA', payload: allMatches });
      dispatch({ type: 'SET_WRESTLERS', payload: wrestlers });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      console.log(`Loaded ${allMatches.length} matches from ${wrestlers.length} wrestlers`);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const contextValue: DashboardContextType = {
    ...state,
    updateFilters,
    refreshData,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextType {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
