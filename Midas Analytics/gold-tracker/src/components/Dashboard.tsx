import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentGoldPrice, getGoldPriceHistory, getCPIData, getMarketIndicators, calculateCorrelation } from '../services/api';
import { GoldPriceCard } from './GoldPriceCard';
import { PriceChart } from './PriceChart';
import { CorrelationAnalysis } from './CorrelationAnalysis';
import { MarketIndicators } from './MarketIndicators';
import { LoadingSpinner } from './LoadingSpinner';

export const Dashboard: React.FC = () => {
  // Fetch current gold price
  const { data: goldPriceData, isLoading: goldPriceLoading } = useQuery({
    queryKey: ['goldPrice'],
    queryFn: getCurrentGoldPrice,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch gold price history
  const { data: goldHistoryData, isLoading: goldHistoryLoading } = useQuery({
    queryKey: ['goldHistory'],
    queryFn: () => getGoldPriceHistory(30),
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Fetch CPI data
  const { data: cpiData, isLoading: cpiLoading } = useQuery({
    queryKey: ['cpiData'],
    queryFn: () => getCPIData(12),
    refetchInterval: 3600000, // Refetch every hour
  });

  // Fetch market indicators
  const { data: marketIndicatorsData, isLoading: marketIndicatorsLoading } = useQuery({
    queryKey: ['marketIndicators'],
    queryFn: getMarketIndicators,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Calculate correlation
  const correlation = React.useMemo(() => {
    if (goldHistoryData?.data && cpiData?.data) {
      return calculateCorrelation(goldHistoryData.data, cpiData.data);
    }
    return 0;
  }, [goldHistoryData, cpiData]);

  const isLoading = goldPriceLoading || goldHistoryLoading || cpiLoading || marketIndicatorsLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Midas Analytics</h1>
              <p className="text-gray-600">Gold Price Tracker & Inflation Analysis</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Gold Price */}
        {goldPriceData?.success && (
          <div className="mb-8">
            <GoldPriceCard goldPrice={goldPriceData.data} />
          </div>
        )}

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Price Chart */}
          {goldHistoryData?.success && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Gold Price History</h2>
              <PriceChart data={goldHistoryData.data} />
            </div>
          )}

          {/* Correlation Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Inflation Correlation</h2>
            <CorrelationAnalysis 
              correlation={correlation}
              goldData={goldHistoryData?.data || []}
              cpiData={cpiData?.data || []}
            />
          </div>
        </div>

        {/* Market Indicators */}
        {marketIndicatorsData?.success && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Market Indicators</h2>
            <MarketIndicators indicators={marketIndicatorsData.data} />
          </div>
        )}

        {/* Error Messages */}
        {goldPriceData?.success === false && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="text-red-400">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Gold Price</h3>
                <div className="mt-2 text-sm text-red-700">
                  {goldPriceData.error || 'Unable to fetch current gold price data.'}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
