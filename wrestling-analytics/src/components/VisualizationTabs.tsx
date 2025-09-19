import { useState } from 'react';
import type { VisualizationTab } from '../types';
import { TimelineChart } from './TimelineChart';
import { NetworkGraph } from './NetworkGraph';
import { PromotionsChart } from './PromotionsChart';
import { WrestlerDirectory } from './WrestlerDirectory';

export const VisualizationTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<VisualizationTab>('timeline');

  const tabs: { id: VisualizationTab; label: string; icon: string }[] = [
    { id: 'timeline', label: 'Timeline', icon: '📈' },
    { id: 'network', label: 'Network', icon: '🕸️' },
    { id: 'promotions', label: 'Promotions', icon: '🏢' },
    { id: 'wrestlers', label: 'Wrestlers', icon: '👥' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'timeline':
        return <TimelineChart />;
      case 'network':
        return <NetworkGraph />;
      case 'promotions':
        return <PromotionsChart />;
      case 'wrestlers':
        return <WrestlerDirectory />;
      default:
        return <TimelineChart />;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};
