export interface AQIData {
  date: string;
  state: string;
  area: string;
  aqi_value: number;
  air_quality_status: string;
  prominent_pollutants: string;
  number_of_monitoring_stations: number;
  pm25?: number;
  pm10?: number;
  co?: number;
  no2?: number;
  o3?: number;
  so2?: number;
}

export interface FilterState {
  selectedState: string;
  selectedArea: string;
  dateRange: {
    start: string;
    end: string;
  };
  selectedPollutants: string[];
}

export interface InsightData {
  avgAQI: number;
  avgStations: number;
  totalRecords: number;
  avgPM25: number;
  maxAQI: { value: number; date: string; area: string };
  minAQI: { value: number; date: string; area: string };
  stateStats: { state: string; avgAQI: number }[];
  areaStats: { area: string; avgAQI: number }[];
  statusDistribution: { status: string; count: number; percentage: number }[];
  pollutantFrequency: { pollutant: string; count: number; percentage: number }[];
  weekdayStats: { day: string; avgAQI: number; avgStations: number }[];
  monthlyTrend: { month: string; aqi: number; stations: number }[];
  correlations: {
    stations_aqi: number;
  };
}