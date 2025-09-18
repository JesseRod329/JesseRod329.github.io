import React from 'react';
import { MarketIndicator } from '../types';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3 } from 'lucide-react';

interface MarketIndicatorsProps {
  indicators: MarketIndicator[];
}

export const MarketIndicators: React.FC<MarketIndicatorsProps> = ({ indicators }) => {
  const getIndicatorIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'vix':
        return <Activity className="h-5 w-5" />;
      case 'dollar index':
        return <DollarSign className="h-5 w-5" />;
      case '10-year treasury yield':
        return <BarChart3 className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeBgColor = (change: number) => {
    if (change > 0) return 'bg-green-100';
    if (change < 0) return 'bg-red-100';
    return 'bg-gray-100';
  };

  if (indicators.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        <div className="text-center">
          <div className="text-lg font-medium">No market data available</div>
          <div className="text-sm">Unable to load market indicators</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {indicators.map((indicator, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="text-gray-600">
                {getIndicatorIcon(indicator.name)}
              </div>
              <h3 className="text-sm font-medium text-gray-900">{indicator.name}</h3>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeBgColor(indicator.change)} ${getChangeColor(indicator.change)}`}>
              {indicator.change > 0 ? (
                <TrendingUp className="h-3 w-3 inline mr-1" />
              ) : indicator.change < 0 ? (
                <TrendingDown className="h-3 w-3 inline mr-1" />
              ) : null}
              {indicator.changePercent > 0 ? '+' : ''}{indicator.changePercent.toFixed(2)}%
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">
              {indicator.value.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>Change: {indicator.change > 0 ? '+' : ''}{indicator.change.toFixed(2)}</span>
              <span>{new Date(indicator.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
