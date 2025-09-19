import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';

export const NetworkGraph: React.FC = () => {
  const { filteredData } = useDashboard();

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Wrestler Network Graph</h3>
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🕸️</div>
        <p className="text-gray-600">Network visualization showing wrestler relationships</p>
        <p className="text-sm text-gray-500 mt-2">
          {filteredData.length} matches analyzed
        </p>
      </div>
    </div>
  );
};
