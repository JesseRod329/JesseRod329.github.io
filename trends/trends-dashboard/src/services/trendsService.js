/**
 * Google Trends Service
 * Frontend service that communicates with backend API
 */

import { generateMockTrends, generateTickerData, generateRegionalData } from '../mocks/trends-data';

class TrendsService {
  constructor() {
    // Check if we're in production (GitHub Pages) or development
    this.isProduction = process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost';
    this.apiBaseUrl = this.isProduction 
      ? 'https://trends-api-backend.vercel.app/api' // We'll deploy this
      : 'http://localhost:3001/api';
    this.useRealData = !this.isProduction; // Use mock data in production for now
    console.log(`🚀 Google Trends Service initialized - ${this.isProduction ? 'Production' : 'Development'} mode`);
  }

  /**
   * Get trending topics
   * @param {Object} options - Query options
   * @param {string} options.region - Geographic region (ISO 3166-2)
   * @param {string} options.category - Category filter
   * @param {string} options.timeRange - Time range (1d, 7d, 30d, 1y)
   * @returns {Promise<Array>} Trending topics
   */
  async getTrendingTopics(options = {}) {
    if (!this.useRealData) {
      console.log('🔧 Using mock data');
      return generateMockTrends();
    }

    try {
      console.log('📡 Fetching real Google Trends data from backend...');
      
      const params = new URLSearchParams({
        region: options.region || 'US'
      });

      const response = await fetch(`${this.apiBaseUrl}/trending?${params}`);
      
      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Real trends data loaded:', result.data.length, 'trends');
        return result.data;
      } else {
        throw new Error(result.error || 'API returned unsuccessful response');
      }
    } catch (error) {
      console.error('❌ Trends API error, falling back to mock data:', error);
      return generateMockTrends();
    }
  }

  /**
   * Get search interest for specific terms
   * @param {Array<string>} terms - Search terms
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Search interest data
   */
  async getSearchInterest(terms, options = {}) {
    if (!this.useRealData) {
      return this.generateMockSearchInterest(terms);
    }

    try {
      console.log('📈 Fetching search interest for:', terms);
      
      const keyword = Array.isArray(terms) ? terms[0] : terms;
      const params = new URLSearchParams({
        keyword,
        region: options.region || 'US'
      });

      const response = await fetch(`${this.apiBaseUrl}/interest-over-time?${params}`);
      const result = await response.json();
      
      if (result.success) {
        return this.transformSearchInterestData(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Search interest API error:', error);
      return this.generateMockSearchInterest(terms);
    }
  }

  /**
   * Get regional interest breakdown
   * @param {string} term - Search term
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Regional interest data
   */
  async getRegionalInterest(term, options = {}) {
    if (!this.useRealData || !term) {
      return generateRegionalData();
    }

    try {
      console.log('🌍 Fetching regional interest for:', term);
      
      const params = new URLSearchParams({
        keyword: term,
        region: options.region || 'US'
      });

      const response = await fetch(`${this.apiBaseUrl}/regional-interest?${params}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Regional interest API error:', error);
      return generateRegionalData();
    }
  }

  /**
   * Get related queries for a term
   * @param {string} term - Search term
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Related queries
   */
  async getRelatedQueries(term, options = {}) {
    if (!this.useRealData || !term) {
      return [
        `${term} news`,
        `${term} analysis`,
        `${term} latest`,
        `${term} update`,
        `${term} 2025`
      ];
    }

    try {
      console.log('🔗 Fetching related queries for:', term);
      
      const params = new URLSearchParams({
        keyword: term,
        region: options.region || 'US'
      });

      const response = await fetch(`${this.apiBaseUrl}/related-queries?${params}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Related queries API error:', error);
      return [`${term} news`, `${term} latest`];
    }
  }

  /**
   * Transform search interest data (kept for compatibility)
   */

  transformSearchInterestData(apiData) {
    // Transform search interest timeline data
    return {
      timeline: apiData.timeline || [],
      averageInterest: apiData.averageInterest || 50,
      peakDate: apiData.peakDate || new Date().toISOString()
    };
  }


  /**
   * Generate mock search interest for development
   */
  generateMockSearchInterest(terms) {
    return {
      timeline: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
        values: terms.reduce((acc, term) => {
          acc[term] = Math.floor(Math.random() * 100);
          return acc;
        }, {})
      })),
      averageInterest: Math.floor(Math.random() * 100),
      peakDate: new Date().toISOString()
    };
  }

  formatVolume(volume) {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(0)}K`;
    }
    return volume?.toString() || '0';
  }


  /**
   * Check if real API is available
   */
  isRealApiAvailable() {
    return this.useRealData;
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      mode: this.useRealData ? 'live' : 'mock',
      source: 'Backend API',
      apiUrl: this.apiBaseUrl
    };
  }
}

export default new TrendsService();
