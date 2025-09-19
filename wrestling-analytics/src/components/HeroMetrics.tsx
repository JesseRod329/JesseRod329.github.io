import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  color?: 'primary' | 'victory' | 'defeat' | 'championship';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-blue-500',
    victory: 'bg-victory',
    defeat: 'bg-defeat',
    championship: 'bg-championship',
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <div className="text-white text-xl font-bold">
            {typeof value === 'number' && value > 1000 ? '🏆' : 
             typeof value === 'number' && value > 100 ? '🥊' : '📊'}
          </div>
        </div>
      </div>
    </div>
  );
};

export const HeroMetrics: React.FC = () => {
  const { metrics, loading } = useDashboard();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total Matches"
        value={metrics.totalMatches.toLocaleString()}
        subtitle="All time matches"
        color="primary"
      />
      <MetricCard
        title="Wrestlers"
        value={metrics.totalWrestlers.toLocaleString()}
        subtitle="Active wrestlers"
        color="victory"
      />
      <MetricCard
        title="Promotions"
        value={metrics.totalPromotions}
        subtitle="Wrestling promotions"
        color="championship"
      />
      <MetricCard
        title="Win Rate"
        value={`${metrics.winRate}%`}
        subtitle="Overall win rate"
        color="victory"
      />
    </div>
  );
};
