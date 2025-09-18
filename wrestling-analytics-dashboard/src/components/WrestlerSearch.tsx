import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { searchWrestlerFiles } from '../utils/dataProcessor';

interface WrestlerSearchProps {
  onWrestlerSelect: (wrestlerFile: string) => void;
  isLoading: boolean;
}

const WrestlerSearch: React.FC<WrestlerSearchProps> = ({ onWrestlerSelect, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchWrestlerFiles(term);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching wrestlers:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleWrestlerClick = (wrestlerFile: string) => {
    onWrestlerSelect(wrestlerFile);
    setSearchTerm('');
    setSearchResults([]);
  };

  const formatWrestlerName = (fileName: string): string => {
    return fileName
      .replace('_matches.csv', '')
      .replace(/_/g, ' ')
      .replace(/\./g, '. ');
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search for a wrestler (e.g., CM Punk, John Cena)..."
          disabled={isLoading}
          className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                   placeholder-gray-500 dark:placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Loading Spinner */}
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"
            />
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {searchResults.map((wrestlerFile, index) => (
            <motion.button
              key={wrestlerFile}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleWrestlerClick(wrestlerFile)}
              className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-100 
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150
                       first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">🥊</span>
                <span className="font-medium">{formatWrestlerName(wrestlerFile)}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* No Results */}
      {searchTerm.length >= 2 && searchResults.length === 0 && !isSearching && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4"
        >
          <div className="text-center text-gray-500 dark:text-gray-400">
            <span className="text-lg">🔍</span>
            <p className="mt-1 text-sm">No wrestlers found for "{searchTerm}"</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WrestlerSearch;
