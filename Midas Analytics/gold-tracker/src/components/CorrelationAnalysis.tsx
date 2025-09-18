import React from 'react';
import { GoldPriceHistory, CPIData } from '../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';

interface CorrelationAnalysisProps {
  correlation: number;
  goldData: GoldPriceHistory[];
  cpiData: CPIData[];
}

export const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({ 
  correlation, 
  goldData, 
  cpiData 
}) => {
  // Create combined data for visualization
  const combinedData = React.useMemo(() => {
    const dataMap = new Map();
    
    // Add gold data
    goldData.forEach(item => {
      const date = item.date;
      if (!dataMap.has(date)) {
        dataMap.set(date, { date, goldPrice: item.price, cpi: null });
      } else {
        dataMap.get(date).goldPrice = item.price;
      }
    });
    
    // Add CPI data
    cpiData.forEach(item => {
      const date = item.date;
      if (!dataMap.has(date)) {
        dataMap.set(date, { date, goldPrice: null, cpi: item.value });
      } else {
        dataMap.get(date).cpi = item.value;
      }
    });
    
    return Array.from(dataMap.values())
      .filter(item => item.goldPrice !== null && item.cpi !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-12); // Last 12 data points
  }, [goldData, cpiData]);

  const getCorrelationStrength = (corr: number): { strength: string; color: string; description: string } => {
    const abs = Math.abs(corr);
    if (abs >= 0.7) return { strength: 'Strong', color: 'text-red-600', description: 'Strong correlation' };
    if (abs >= 0.5) return { strength: 'Moderate', color: 'text-orange-600', description: 'Moderate correlation' };
    if (abs >= 0.3) return { strength: 'Weak', color: 'text-yellow-600', description: 'Weak correlation' };
    return { strength: 'Very Weak', color: 'text-gray-600', description: 'Very weak correlation' };
  };

  const correlationInfo = getCorrelationStrength(correlation);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              <span className={`font-medium ${entry.color}`}>
                {entry.dataKey === 'goldPrice' ? 'Gold: $' : 'CPI: '}
                {entry.value.toLocaleString('en-US', { 
                  minimumFractionDigits: entry.dataKey === 'goldPrice' ? 2 : 1, 
                  maximumFractionDigits: entry.dataKey === 'goldPrice' ? 2 : 1 
                })}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Correlation Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Gold vs CPI Correlation</h3>
          <span className={`text-sm font-medium ${correlationInfo.color}`}>
            {correlationInfo.strength}
          </span>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {correlation.toFixed(3)}
        </div>
        <p className="text-sm text-gray-600">
          {correlationInfo.description} between gold prices and Consumer Price Index
        </p>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${correlation >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${Math.abs(correlation) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>-1.0 (Negative)</span>
            <span>0.0 (No correlation)</span>
            <span>+1.0 (Positive)</span>
          </div>
        </div>
      </div>

      {/* Combined Chart */}
      {combinedData.length > 0 && (
        <div className="h-64">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Gold Price vs CPI Over Time</h4>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
              />
              <YAxis 
                yAxisId="gold"
                orientation="left"
                stroke="#f59e0b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <YAxis 
                yAxisId="cpi"
                orientation="right"
                stroke="#3b82f6"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                yAxisId="gold"
                type="monotone" 
                dataKey="goldPrice" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                name="Gold Price"
              />
              <Line 
                yAxisId="cpi"
                type="monotone" 
                dataKey="cpi" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                name="CPI"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Interpretation */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">What This Means</h4>
        <p className="text-sm text-blue-800">
          {correlation > 0.3 
            ? "Gold prices tend to move in the same direction as inflation, suggesting gold may be an effective hedge against inflation."
            : correlation < -0.3
            ? "Gold prices tend to move opposite to inflation, which is unusual and may indicate other market factors at play."
            : "Gold prices show little correlation with inflation in this time period, suggesting other factors may be driving gold prices."
          }
        </p>
      </div>
    </div>
  );
};
