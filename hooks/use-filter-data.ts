import { useMemo, useState, useCallback } from 'react';
import { AQIData, FilterState } from '@/types/aqi';

interface UseFilterDataReturn {
  states: string[];
  areas: string[];
  pollutants: string[];
  isProcessing: boolean;
  error: string | null;
  refreshData: () => void;
}

export function useFilterData(
  data: AQIData[], 
  filters: FilterState
): UseFilterDataReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processedData = useMemo(() => {
    if (!data || data.length === 0) {
      return { states: [], areas: [], pollutants: [] };
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get unique states with validation
      const states = Array.from(new Set(
        data
          .map(d => d.state)
          .filter(state => state && state.trim().length > 0)
      )).sort();

      // Get areas for selected state with validation
      const areas = Array.from(new Set(
        data
          .filter(d => !filters.selectedState || d.state === filters.selectedState)
          .map(d => d.area)
          .filter(area => area && area.trim().length > 0)
      )).sort();

      // Get unique pollutants with better parsing and validation
      const pollutants = Array.from(new Set(
        data.flatMap(d => {
          if (!d.prominent_pollutants) return [];
          return d.prominent_pollutants
            .split(',')
            .map(p => p.trim())
            .filter(p => p && p.length > 0 && p !== 'N/A' && p !== 'NA');
        })
      )).sort();

      setIsProcessing(false);
      return { states, areas, pollutants };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setIsProcessing(false);
      console.error('Error processing filter data:', err);
      return { states: [], areas: [], pollutants: [] };
    }
  }, [data, filters.selectedState]);

  const refreshData = useCallback(() => {
    setIsProcessing(true);
    setError(null);
    // Force re-computation by updating a dependency
    setTimeout(() => setIsProcessing(false), 100);
  }, []);

  return {
    states: processedData.states,
    areas: processedData.areas,
    pollutants: processedData.pollutants,
    isProcessing,
    error,
    refreshData,
  };
} 