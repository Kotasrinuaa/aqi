'use client';

import { Calendar, Loader2, X } from 'lucide-react';
import { useCallback } from 'react';

interface DateRangePickerProps {
  dateRange: { start: string; end: string };
  onDateRangeChange: (dateRange: { start: string; end: string }) => void;
  loading: boolean;
}

export default function DateRangePicker({ dateRange, onDateRangeChange, loading }: DateRangePickerProps) {
  const handleStartDateChange = useCallback((start: string) => {
    onDateRangeChange({ ...dateRange, start });
  }, [dateRange, onDateRangeChange]);

  const handleEndDateChange = useCallback((end: string) => {
    onDateRangeChange({ ...dateRange, end });
  }, [dateRange, onDateRangeChange]);

  const clearDates = useCallback(() => {
    onDateRangeChange({ start: '', end: '' });
  }, [onDateRangeChange]);

  const getDisplayText = () => {
    if (loading) return 'Loading...';
    if (dateRange.start && dateRange.end) {
      return `${dateRange.start} - ${dateRange.end}`;
    }
    if (dateRange.start) return `From ${dateRange.start}`;
    if (dateRange.end) return `Until ${dateRange.end}`;
    return 'Select date range';
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            ) : (
              <Calendar className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => handleStartDateChange(e.target.value)}
            disabled={loading}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            placeholder="Start Date"
          />
        </div>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            ) : (
              <Calendar className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => handleEndDateChange(e.target.value)}
            disabled={loading}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            placeholder="End Date"
          />
        </div>
      </div>
      
      {/* Date Range Display */}
      {(dateRange.start || dateRange.end) && (
        <div className="flex items-center justify-between bg-gray-700/30 rounded-lg px-3 py-2">
          <span className="text-sm text-gray-300 truncate">
            {getDisplayText()}
          </span>
          <button
            onClick={clearDates}
            className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
            title="Clear dates"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}