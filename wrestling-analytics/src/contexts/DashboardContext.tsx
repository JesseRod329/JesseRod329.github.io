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
      
      if (lines.length < 2) return [];
      
      const matches: MatchData[] = [];
      const wrestlerName = filename.replace('_matches.csv', '').replace(/_/g, ' ');
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        // Split by comma but handle quoted fields properly
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values.length >= 4) {
          const date = values[1]; // Second column is date
          const event = values[3]; // Fourth column is event description
          
          // Parse date (format: 08.09.2025)
          let parsedDate: Date | null = null;
          let year = 2023;
          
          if (date && date.includes('.')) {
            const dateParts = date.split('.');
            if (dateParts.length === 3) {
              const day = parseInt(dateParts[0]);
              const month = parseInt(dateParts[1]);
              const yearStr = dateParts[2];
              year = parseInt(yearStr);
              parsedDate = new Date(year, month - 1, day);
            }
          }
          
          // Extract result from event description
          const result = extractResultFromEvent(event, wrestlerName);
          
          // Extract promotion from event
          const promotion = extractPromotion(event);
          
          // Extract opponent from event
          const opponent = extractOpponent(event, wrestlerName);
          
          const match: MatchData = {
            date: date || 'Unknown',
            parsedDate: parsedDate || new Date(),
            year,
            wrestler: wrestlerName,
            opponent: opponent || 'Unknown',
            result,
            event: event || 'Unknown Event',
            promotion,
            location: values[4] || 'Unknown',
            matchTime: '0:00' // Default since not in CSV
          };
          
          matches.push(match);
        }
      }
      
      console.log(`Loaded ${matches.length} matches for ${wrestlerName}`);
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

  const extractResultFromEvent = (event: string, wrestlerName: string): 'win' | 'loss' | 'draw' | 'unknown' => {
    if (!event || !wrestlerName) return 'unknown';
    
    const lowerEvent = event.toLowerCase();
    const lowerWrestler = wrestlerName.toLowerCase();
    
    // Check for win patterns
    if (lowerEvent.includes(`${lowerWrestler}defeats`) || 
        lowerEvent.includes(`${lowerWrestler} defeats`) ||
        lowerEvent.includes(`${lowerWrestler}defeated`) ||
        lowerEvent.includes(`${lowerWrestler} defeated`)) {
      return 'win';
    }
    
    // Check for loss patterns (someone defeats this wrestler)
    if (lowerEvent.includes(`defeats${lowerWrestler}`) || 
        lowerEvent.includes(`defeats ${lowerWrestler}`) ||
        lowerEvent.includes(`defeated${lowerWrestler}`) ||
        lowerEvent.includes(`defeated ${lowerWrestler}`)) {
      return 'loss';
    }
    
    return 'unknown';
  };

  const extractOpponent = (event: string, wrestlerName: string): string => {
    if (!event || !wrestlerName) return 'Unknown';
    
    const lowerWrestler = wrestlerName.toLowerCase();
    
    // Try to extract opponent from "Wrestler defeats Opponent" pattern
    const defeatsPattern = new RegExp(`${lowerWrestler}\\s*defeats\\s*([^\\s(]+)`, 'i');
    const match1 = event.match(defeatsPattern);
    if (match1 && match1[1]) {
      return match1[1].trim();
    }
    
    // Try to extract opponent from "Opponent defeats Wrestler" pattern
    const defeatedPattern = new RegExp(`([^\\s(]+)\\s*defeats\\s*${lowerWrestler}`, 'i');
    const match2 = event.match(defeatedPattern);
    if (match2 && match2[1]) {
      return match2[1].trim();
    }
    
    return 'Unknown';
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
      console.log('Loading ALL 594 wrestlers...');
      
      // Get all wrestler files (594 total)
      const wrestlerFiles = await getAllWrestlerFiles();
      console.log(`Found ${wrestlerFiles.length} wrestler files`);
      
      const allMatches: MatchData[] = [];
      const wrestlers: WrestlerProfile[] = [];
      
      // Load data from ALL files with progress tracking
      let loadedCount = 0;
      const totalFiles = wrestlerFiles.length;
      
      for (const file of wrestlerFiles) {
        try {
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
          
          loadedCount++;
          if (loadedCount % 50 === 0) {
            console.log(`Loaded ${loadedCount}/${totalFiles} wrestlers...`);
          }
        } catch (error) {
          console.warn(`Failed to load ${file}:`, error);
          // Continue loading other files even if one fails
        }
      }
      
      dispatch({ type: 'SET_DATA', payload: allMatches });
      dispatch({ type: 'SET_WRESTLERS', payload: wrestlers });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      console.log(`✅ Successfully loaded ${allMatches.length} matches from ${wrestlers.length} wrestlers out of ${totalFiles} files`);
    } catch (error) {
      console.error('Error loading wrestler data:', error);
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
