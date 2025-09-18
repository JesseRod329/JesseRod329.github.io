import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mb-4"></div>
        <div className="text-lg font-medium text-gray-900 mb-2">Loading Gold Data</div>
        <div className="text-sm text-gray-600">Fetching latest prices and market indicators...</div>
      </div>
    </div>
  );
};
