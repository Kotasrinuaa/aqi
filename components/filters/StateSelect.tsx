'use client';

import { ChevronDown, Search, Loader2, MapPin } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';

interface StateSelectProps {
  states: string[];
  selectedState: string;
  onStateChange: (state: string) => void;
  loading: boolean;
}

export default function StateSelect({ states, selectedState, onStateChange, loading }: StateSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize filtered states for performance
  const filteredStates = useMemo(() => {
    if (!searchTerm) return states;
    return states.filter(state => 
      state.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [states, searchTerm]);

  const handleSelect = useCallback((state: string) => {
    onStateChange(state);
    setIsOpen(false);
    setSearchTerm('');
  }, [onStateChange]);

  const handleToggle = useCallback(() => {
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

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        disabled={loading}
        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-left text-white hover:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            ) : (
              <MapPin className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
            )}
            <span className={`truncate ${selectedState ? 'text-white' : 'text-gray-400'}`}>
              {loading ? 'Loading states...' : selectedState || 'Select State'}
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
            {/* Search Input */}
            <div className="p-2 border-b border-gray-600">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search states..."
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
                <button
                  onClick={() => handleSelect('')}
                  className={`w-full px-4 py-2 text-left transition-colors duration-150 flex items-center gap-2 ${
                    selectedState === ''
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  All States
                </button>
                
                {filteredStates.length === 0 ? (
                  <div className="px-4 py-3 text-gray-400 text-sm text-center">
                    {searchTerm ? 'No states found' : 'No states available'}
                  </div>
                ) : (
                  filteredStates.map((state) => (
                    <button
                      key={state}
                      onClick={() => handleSelect(state)}
                      className={`w-full px-4 py-2 text-left transition-colors duration-150 flex items-center gap-2 ${
                        selectedState === state
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      {state}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}