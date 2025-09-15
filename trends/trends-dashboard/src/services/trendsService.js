import { generateMockTrends, generateRegionalData } from '../mocks/trends-data';

class TrendsService {
  constructor() {
    this.apiBaseUrl = process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost'
      ? 'https://trends-dashboard-jlqjj42yr-jesserod329s-projects.vercel.app/api'
      : '/api';
    console.log(`🚀 Google Trends Service initialized - API URL: ${this.apiBaseUrl}`);
  }

  async getTrendingTopics(options = {}) {
    try {
      const params = new URLSearchParams({ region: options.region || 'US' });
      const response = await fetch(`${this.apiBaseUrl}/trending?${params}`);

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'API returned unsuccessful response');
      }
    } catch (error) {
      console.error('❌ Trends API error, falling back to mock data:', error);
      return generateMockTrends();
    }
  }

  async getRegionalInterest(term, options = {}) {
    if (!term) return generateRegionalData();

    try {
      const params = new URLSearchParams({ keyword: term, region: options.region || 'US' });
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

  getStatus() {
    return {
      mode: 'live',
      source: 'Backend API',
      apiUrl: this.apiBaseUrl
    };
  }
}

export default new TrendsService();
