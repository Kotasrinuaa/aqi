'use client';

import { useState, useMemo, useCallback } from 'react';
import { Calendar, Filter, MapPin, Zap, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import StateSelect from './StateSelect';
import AreaSelect from './AreaSelect';
import DateRangePicker from './DateRangePicker';
import PollutantSelect from './PollutantSelect';
import { AQIData, FilterState } from '@/types/aqi';
import { useFilterData } from '@/hooks/use-filter-data';

interface VerticalFiltersProps {
  data: AQIData[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  loading: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export default function VerticalFilters({ 
  data, 
  filters, 
  onFiltersChange, 
  loading, 
  isOpen, 
  onToggle 
}: VerticalFiltersProps) {
  // Use custom hook for optimized data processing
  const { states, areas, pollutants, isProcessing, error, refreshData } = useFilterData(data, filters);

  const handleStateChange = useCallback((state: string) => {
    onFiltersChange({
      ...filters,
      selectedState: state,
      selectedArea: '', // Reset area when state changes
    });
  }, [filters, onFiltersChange]);

  const handleAreaChange = useCallback((area: string) => {
    onFiltersChange({
      ...filters,
      selectedArea: area,
    });
  }, [filters, onFiltersChange]);

  const handleDateRangeChange = useCallback((dateRange: { start: string; end: string }) => {
    onFiltersChange({
      ...filters,
      dateRange,
    });
  }, [filters, onFiltersChange]);

  const handlePollutantsChange = useCallback((pollutants: string[]) => {
    onFiltersChange({
      ...filters,
      selectedPollutants: pollutants,
    });
  }, [filters, onFiltersChange]);

  const clearFilters = useCallback(() => {
    onFiltersChange({
      selectedState: '',
      selectedArea: '',
      dateRange: { start: '', end: '' },
      selectedPollutants: [],
    });
  }, [onFiltersChange]);

  const hasActiveFilters = useMemo(() => {
    return filters.selectedState || filters.selectedArea || 
      filters.dateRange.start || filters.selectedPollutants.length > 0;
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.selectedState) count++;
    if (filters.selectedArea) count++;
    if (filters.dateRange.start) count++;
    if (filters.selectedPollutants.length > 0) count++;
    return count;
  }, [filters]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="w-5 h-5 text-purple-500" />
            {isProcessing && (
              <Loader2 className="absolute -top-1 -right-1 w-3 h-3 animate-spin text-purple-500" />
            )}
          </div>
          <h2 className="text-lg font-semibold text-white">Filters</h2>
          {hasActiveFilters && (
            <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
              {activeFilterCount}
            </span>
          )}
        </div>
        {error && (
          <button
            onClick={refreshData}
            className="text-red-400 hover:text-red-300 transition-colors duration-200 p-1"
            title="Retry data processing"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-600/10 border border-red-600/20 rounded-lg">
          <div className="flex items-center gap-2 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Error processing data</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mx-6 mt-4 p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
          <div className="flex items-center gap-2 text-blue-300 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading data...</span>
          </div>
        </div>
      )}

      {/* Filters Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* State Filter */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <MapPin className="w-4 h-4" />
            State
            {filters.selectedState && (
              <span className="bg-purple-600/20 text-purple-300 px-1.5 py-0.5 rounded text-xs">
                ✓
              </span>
            )}
          </label>
          <StateSelect
            states={states}
            selectedState={filters.selectedState}
            onStateChange={handleStateChange}
            loading={loading || isProcessing}
          />
        </div>

        {/* Area Filter */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <MapPin className="w-4 h-4" />
            Area
            {filters.selectedArea && (
              <span className="bg-purple-600/20 text-purple-300 px-1.5 py-0.5 rounded text-xs">
                ✓
              </span>
            )}
          </label>
          <AreaSelect
            areas={areas}
            selectedArea={filters.selectedArea}
            onAreaChange={handleAreaChange}
            loading={loading || isProcessing}
            disabled={!filters.selectedState}
          />
        </div>

        {/* Date Range Filter */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Calendar className="w-4 h-4" />
            Date Range
            {filters.dateRange.start && (
              <span className="bg-purple-600/20 text-purple-300 px-1.5 py-0.5 rounded text-xs">
                ✓
              </span>
            )}
          </label>
          <DateRangePicker
            dateRange={filters.dateRange}
            onDateRangeChange={handleDateRangeChange}
            loading={loading || isProcessing}
          />
        </div>

        {/* Pollutants Filter */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Zap className="w-4 h-4" />
            Pollutants
            {filters.selectedPollutants.length > 0 && (
              <span className="bg-purple-600/20 text-purple-300 px-1.5 py-0.5 rounded text-xs">
                {filters.selectedPollutants.length}
              </span>
            )}
          </label>
          <PollutantSelect
            pollutants={pollutants}
            selectedPollutants={filters.selectedPollutants}
            onPollutantsChange={handlePollutantsChange}
            loading={loading || isProcessing}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700/50">
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
} 