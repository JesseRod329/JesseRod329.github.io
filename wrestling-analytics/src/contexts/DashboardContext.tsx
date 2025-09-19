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

  // Load ALL 594 wrestler files from the wresltedash directory
  const getAllWrestlerFiles = async (): Promise<string[]> => {
    try {
      // Fetch the directory listing from GitHub API to get all CSV files
      const response = await fetch('https://api.github.com/repos/JesseRod329/JesseRod329.github.io/contents/wresltedash');
      if (!response.ok) {
        console.warn('Failed to fetch directory listing, using fallback list');
        return getFallbackWrestlerFiles();
      }
      
      const files = await response.json();
      return files
        .filter((file: any) => file.name.endsWith('_matches.csv'))
        .map((file: any) => file.name)
        .sort();
    } catch (error) {
      console.warn('Error fetching wrestler files, using fallback:', error);
      return getFallbackWrestlerFiles();
    }
  };

  // Fallback list of wrestler files (first 50 for initial load)
  const getFallbackWrestlerFiles = (): string[] => {
    return [
      '2-Dope_matches.csv', '2_Cold_Scorpio_matches.csv', '911_matches.csv',
      'AJ_Lee_matches.csv', 'AJ_Styles_matches.csv', 'AR_Fox_matches.csv',
      'AZM_matches.csv', 'Absolute_Andy_matches.csv', 'Adam_Cole_matches.csv',
      'Adam_Copeland_matches.csv', 'Adam_Page_matches.csv', 'Adam_Rose_matches.csv',
      'Ahmed_Johnson_matches.csv', 'Aja_Kong_matches.csv', 'Akira_Taue_matches.csv',
      'Akira_Tozawa_matches.csv', 'Al_Snow_matches.csv', 'Alex_Riley_matches.csv',
      'Alex_Shelley_matches.csv', 'Alex_Wright_matches.csv', 'Alexa_Bliss_matches.csv',
      'Alexander_Rusev_matches.csv', 'Ali_matches.csv', 'Alistair_Overeem_matches.csv',
      'Ambrose_matches.csv', 'Andrade_matches.csv', 'Andre_the_Giant_matches.csv',
      'Angel_Garza_matches.csv', 'Angelo_Dawkins_matches.csv', 'Apollo_Crews_matches.csv',
      'Ariya_Daivari_matches.csv', 'Arn_Anderson_matches.csv', 'Asuka_matches.csv',
      'Austin_Aries_matches.csv', 'Austin_Theory_matches.csv', 'B-Team_matches.csv',
      'Baron_Corbin_matches.csv', 'Batista_matches.csv', 'Bayley_matches.csv',
      'Becky_Lynch_matches.csv', 'Big_Cass_matches.csv', 'Big_E_matches.csv',
      'Big_Show_matches.csv', 'Bill_Goldberg_matches.csv', 'Bobby_Lashley_matches.csv',
      'Bobby_Roode_matches.csv', 'Booker_T_matches.csv', 'Braun_Strowman_matches.csv'
    ];
  };



  // Helper function for future use
  // const extractResult = (resultStr: string): 'win' | 'loss' | 'draw' | 'unknown' => {
  //   const lower = resultStr.toLowerCase();
  //   if (lower.includes('win') || lower.includes('defeat') || lower.includes('beat')) return 'win';
  //   if (lower.includes('loss') || lower.includes('lost') || lower.includes('defeat')) return 'loss';
  //   if (lower.includes('draw') || lower.includes('tie')) return 'draw';
  //   return 'unknown';
  // };

  const refreshData = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      console.log('Loading wrestler directory...');
      
      // Just load wrestler names and basic info first (no match data yet)
      const wrestlerFiles = await getAllWrestlerFiles();
      console.log(`Found ${wrestlerFiles.length} wrestler files`);
      
      // Create wrestler profiles with basic info only
      const wrestlers: WrestlerProfile[] = wrestlerFiles.map(file => {
        const wrestlerName = file.replace('_matches.csv', '').replace(/_/g, ' ');
        return {
          name: wrestlerName,
          totalMatches: 0, // Will load on demand
          wins: 0,
          losses: 0,
          draws: 0,
          winRate: 0,
          matches: [], // Empty initially
          promotion: 'Unknown', // Will determine when loading matches
          lastMatch: new Date(),
          filename: file // Store filename for lazy loading
        };
      });
      
      dispatch({ type: 'SET_WRESTLERS', payload: wrestlers });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      console.log(`✅ Loaded ${wrestlers.length} wrestlers (matches will load on demand)`);
    } catch (error) {
      console.error('Error loading wrestler directory:', error);
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
