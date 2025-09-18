import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { DashboardState, MatchData, FilterState, VisualizationConfig } from '../types';

// Initial state
const initialState: DashboardState = {
  data: [],
  wrestlers: [],
  venues: [],
  tagTeams: [],
  heroMetrics: {
    totalMatches: 0,
    totalWrestlers: 0,
    totalVenues: 0,
    totalPromotions: 0,
    averageMatchTime: 0,
    lastUpdated: new Date()
  },
  isLoading: false,
  error: null,
  config: {
    filters: {
      promotions: [],
      wrestlers: [],
      venues: [],
      dateRange: {
        start: new Date('2024-01-01'),
        end: new Date()
      },
      matchType: 'all',
      eventType: 'all'
    },
    selectedWrestlers: [],
    selectedPromotions: [],
    timeRange: {
      start: new Date('2024-01-01'),
      end: new Date()
    },
    chartType: 'network'
  }
};

// Action types
type DashboardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DATA'; payload: MatchData[] }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'SET_CONFIG'; payload: Partial<VisualizationConfig> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SELECT_WRESTLER'; payload: string }
  | { type: 'DESELECT_WRESTLER'; payload: string }
  | { type: 'SET_CHART_TYPE'; payload: 'network' | 'timeline' | 'radial' | 'map' | 'matrix' };

// Reducer
const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_DATA':
      return { 
        ...state, 
        data: action.payload,
        isLoading: false,
        error: null
      };
    
    case 'SET_FILTERS':
      return {
        ...state,
        config: {
          ...state.config,
          filters: { ...state.config.filters, ...action.payload }
        }
      };
    
    case 'SET_CONFIG':
      return {
        ...state,
        config: { ...state.config, ...action.payload }
      };
    
    case 'RESET_FILTERS':
      return {
        ...state,
        config: {
          ...state.config,
          filters: initialState.config.filters,
          selectedWrestlers: [],
          selectedPromotions: []
        }
      };
    
    case 'SELECT_WRESTLER':
      return {
        ...state,
        config: {
          ...state.config,
          selectedWrestlers: [...state.config.selectedWrestlers, action.payload]
        }
      };
    
    case 'DESELECT_WRESTLER':
      return {
        ...state,
        config: {
          ...state.config,
          selectedWrestlers: state.config.selectedWrestlers.filter(w => w !== action.payload)
        }
      };
    
    case 'SET_CHART_TYPE':
      return {
        ...state,
        config: {
          ...state.config,
          chartType: action.payload
        }
      };
    
    default:
      return state;
  }
};

// Context
interface DashboardContextType {
  state: DashboardState;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setData: (data: MatchData[]) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setConfig: (config: Partial<VisualizationConfig>) => void;
  resetFilters: () => void;
  selectWrestler: (wrestler: string) => void;
  deselectWrestler: (wrestler: string) => void;
  setChartType: (chartType: 'network' | 'timeline' | 'radial' | 'map' | 'matrix') => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Provider component
interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setData = useCallback((data: MatchData[]) => {
    dispatch({ type: 'SET_DATA', payload: data });
  }, []);

  const setFilters = useCallback((filters: Partial<FilterState>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const setConfig = useCallback((config: Partial<VisualizationConfig>) => {
    dispatch({ type: 'SET_CONFIG', payload: config });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const selectWrestler = useCallback((wrestler: string) => {
    dispatch({ type: 'SELECT_WRESTLER', payload: wrestler });
  }, []);

  const deselectWrestler = useCallback((wrestler: string) => {
    dispatch({ type: 'DESELECT_WRESTLER', payload: wrestler });
  }, []);

  const setChartType = useCallback((chartType: 'network' | 'timeline' | 'radial' | 'map' | 'matrix') => {
    dispatch({ type: 'SET_CHART_TYPE', payload: chartType });
  }, []);

  const value: DashboardContextType = {
    state,
    setLoading,
    setError,
    setData,
    setFilters,
    setConfig,
    resetFilters,
    selectWrestler,
    deselectWrestler,
    setChartType
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Hook to use the dashboard context
export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
