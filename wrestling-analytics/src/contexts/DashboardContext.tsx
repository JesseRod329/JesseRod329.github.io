import { createContext, useContext, useReducer } from 'react';
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

  const updateFilters = (filters: Partial<FilterState>) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: filters });
  };

  const refreshData = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Data loading logic will be implemented here
      dispatch({ type: 'SET_LOADING', payload: false });
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
