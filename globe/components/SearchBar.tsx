import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  countries: Array<{ name: string; iso_a3: string }>;
  onSelectCountry: (countryName: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ countries, onSelectCountry }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ name: string; iso_a3: string }>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = countries
        .filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 8);
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
    setSelectedIndex(-1);
  }, [query, countries]);

  const handleSelect = (countryName: string) => {
    onSelectCountry(countryName);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex].name);
    } else if (e.key === 'Escape') {
      setQuery('');
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-80">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-cyan" size={18} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="SEARCH LOCATION..."
          className="w-full bg-cyber-black/80 border border-cyber-cyan/50 text-white pl-10 pr-10 py-2 font-mono text-sm focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] transition-all placeholder-gray-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-cyan hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-cyber-black/95 border border-cyber-cyan/50 backdrop-blur-md max-h-64 overflow-y-auto z-50 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
          {suggestions.map((country, index) => (
            <button
              key={country.iso_a3}
              onClick={() => handleSelect(country.name)}
              className={`w-full text-left px-4 py-2 font-mono text-sm transition-colors ${
                index === selectedIndex
                  ? 'bg-cyber-cyan/20 text-white border-l-2 border-cyber-pink'
                  : 'text-cyber-cyan hover:bg-cyber-cyan/10'
              }`}
            >
              <span className="text-gray-500 text-xs mr-2">[{country.iso_a3}]</span>
              {country.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

