import React from 'react';
import { GoldPrice } from '../types';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface GoldPriceCardProps {
  goldPrice: GoldPrice;
}

export const GoldPriceCard: React.FC<GoldPriceCardProps> = ({ goldPrice }) => {
  // Mock previous price for demonstration (in real app, this would come from state or API)
  const previousPrice = goldPrice.price * 0.98; // Simulate 2% increase
  const change = goldPrice.price - previousPrice;
  const changePercent = (change / previousPrice) * 100;
  const isPositive = change >= 0;

  return (
    <div className="bg-gradient-to-r from-gold-500 to-gold-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 rounded-full p-3">
            <DollarSign className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Gold Price</h2>
            <p className="text-gold-100">Spot Price (USD per ounce)</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-4xl font-bold mb-2">
            ${goldPrice.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-semibold">
              {isPositive ? '+' : ''}${change.toFixed(2)} ({changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gold-400 border-opacity-30">
        <div className="flex justify-between text-sm text-gold-100">
          <span>Last Updated: {new Date(goldPrice.timestamp).toLocaleTimeString()}</span>
          <span>Currency: {goldPrice.currency}</span>
        </div>
      </div>
    </div>
  );
};
