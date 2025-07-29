'use client';

import { ChevronDown, Check, Search, Loader2, Zap } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';

interface PollutantSelectProps {
  pollutants: string[];
  selectedPollutants: string[];
  onPollutantsChange: (pollutants: string[]) => void;
  loading: boolean;
}

export default function PollutantSelect({ pollutants, selectedPollutants, onPollutantsChange, loading }: PollutantSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize filtered pollutants for performance
  const filteredPollutants = useMemo(() => {
    if (!searchTerm) return pollutants;
    return pollutants.filter(pollutant => 
      pollutant.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pollutants, searchTerm]);

  const handleToggle = useCallback((pollutant: string) => {
    const isSelected = selectedPollutants.includes(pollutant);
    if (isSelected) {
      onPollutantsChange(selectedPollutants.filter(p => p !== pollutant));
    } else {
      onPollutantsChange([...selectedPollutants, pollutant]);
    }
  }, [selectedPollutants, onPollutantsChange]);

  const clearAll = useCallback(() => {
    onPollutantsChange([]);
  }, [onPollutantsChange]);

  const selectAll = useCallback(() => {
    onPollutantsChange(pollutants);
  }, [pollutants, onPollutantsChange]);

  const handleToggleDropdown = useCallback(() => {
    if (!loading) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  }, [isOpen, loading]);

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
  }, []);

  const dropdownRef = useClickOutside(handleClickOutside);

  const getDisplayText = () => {
    if (loading) return 'Loading pollutants...';
    if (selectedPollutants.length === 0) return 'Select Pollutants';
    if (selectedPollutants.length === 1) return selectedPollutants[0];
    return `${selectedPollutants.length} selected`;
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggleDropdown}
        disabled={loading}
        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-left text-white hover:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            ) : (
              <Zap className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
            )}
            <span className={`truncate ${selectedPollutants.length > 0 ? 'text-white' : 'text-gray-400'}`}>
              {getDisplayText()}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1"
        >
          <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-hidden">
            {/* Header with Select All/Clear All */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-600">
              <button
                onClick={selectAll}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors duration-150 font-medium"
              >
                Select All
              </button>
              <button
                onClick={clearAll}
                className="text-xs text-gray-400 hover:text-white transition-colors duration-150"
              >
                Clear All
              </button>
            </div>

            {/* Search Input */}
            <div className="p-2 border-b border-gray-600">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pollutants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              <div className="py-1">
                {filteredPollutants.length === 0 ? (
                  <div className="px-4 py-3 text-gray-400 text-sm text-center">
                    {searchTerm ? 'No pollutants found' : 'No pollutants available'}
                  </div>
                ) : (
                  filteredPollutants.map((pollutant) => {
                    const isSelected = selectedPollutants.includes(pollutant);
                    return (
                      <button
                        key={pollutant}
                        onClick={() => handleToggle(pollutant)}
                        className="w-full px-4 py-2 text-left flex items-center justify-between text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                      >
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          <span>{pollutant}</span>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-purple-500" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}