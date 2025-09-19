import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';

export const PromotionsChart: React.FC = () => {
  const { filteredData } = useDashboard();

  const promotionData = filteredData.reduce((acc, match) => {
    const promo = match.promotion || 'Unknown';
    acc[promo] = (acc[promo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalMatches = Object.values(promotionData).reduce((sum, count) => sum + count, 0);

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Matches by Promotion</h3>
      <div className="space-y-4">
        {Object.entries(promotionData).map(([promotion, count]) => {
          const percentage = ((count / totalMatches) * 100).toFixed(1);
          return (
            <div key={promotion} className="flex items-center space-x-4">
              <div className="w-32 text-sm font-medium text-gray-700">{promotion}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-6">
                <div
                  className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${percentage}%` }}
                >
                  <span className="text-xs text-white font-medium">{count}</span>
                </div>
              </div>
              <div className="w-16 text-sm text-gray-600 text-right">{percentage}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
