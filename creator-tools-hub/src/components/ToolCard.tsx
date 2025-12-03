import React from 'react';

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    description: string;
    category: string;
    path: string;
    status: string;
  };
  categoryInfo?: {
    icon: string;
    color: string;
  };
  onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, categoryInfo, onClick }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    red: 'bg-red-500 hover:bg-red-600',
    green: 'bg-green-500 hover:bg-green-600',
    pink: 'bg-pink-500 hover:bg-pink-600',
    orange: 'bg-orange-500 hover:bg-orange-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
    indigo: 'bg-indigo-500 hover:bg-indigo-600',
    teal: 'bg-teal-500 hover:bg-teal-600',
    gray: 'bg-gray-500 hover:bg-gray-600',
  };

  const bgColor = categoryInfo?.color ? colorClasses[categoryInfo.color] || 'bg-gray-500' : 'bg-gray-500';

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`${bgColor} text-white rounded-lg p-3 text-2xl`}>
          {categoryInfo?.icon || '🔧'}
        </div>
        {tool.status === 'ready' && (
          <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
            Ready
          </span>
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {tool.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {tool.description}
      </p>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">Click to open →</span>
      </div>
    </div>
  );
};

export default ToolCard;

