export interface LocationData {
  name: string;
  lat: number;
  lng: number;
  iso_a2?: string;
  iso_a3?: string;
}

export interface CountryData {
  location: string;
  gdp: number; // in USD
  gdpPerCapita: number;
  population: number;
  currency: string;
  capital: string;
  region: string;
  tradeExports: string[]; // real export products
  tradePartners: string[]; // major trading partners
  description: string; // real country description
}

export enum SystemStatus {
  READY = 'READY',
  LOADING = 'LOADING...',
  FETCHING_DATA = 'FETCHING DATA...',
  DATA_LOADED = 'DATA LOADED',
  ERROR = 'ERROR'
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'SYSTEM';
  text: string;
  timestamp: number;
}

export interface City {
  name: string;
  lat: number;
  lng: number;
  population: number;
  country: string;
}

export interface Arc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
}

export interface Bookmark {
  countryName: string;
  timestamp: number;
  countryData?: CountryData;
}

export interface HistoryEntry {
  countryName: string;
  timestamp: number;
  countryData?: CountryData;
}