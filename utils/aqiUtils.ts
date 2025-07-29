import { AQIData, FilterState, InsightData } from '@/types/aqi';

export function parseCSV(csvText: string): AQIData[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const row: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      if (['date', 'state', 'area', 'air_quality_status', 'prominent_pollutants'].includes(header)) {
        row[header] = value;
      } else {
        row[header] = parseFloat(value) || 0;
      }
    });
    
    return {
      date: row.date,
      state: row.state,
      area: row.area,
      aqi_value: row.aqi_value || row.aqi || 0,
      air_quality_status: row.air_quality_status || 'Unknown',
      prominent_pollutants: row.prominent_pollutants || '',
      number_of_monitoring_stations: row.number_of_monitoring_stations || 0,
      pm25: row.pm25 || row['pm2.5'] || 0,
      pm10: row.pm10 || 0,
      co: row.co || 0,
      no2: row.no2 || 0,
      o3: row.o3 || 0,
      so2: row.so2 || 0,
    };
  });
}

export function applyFilters(data: AQIData[], filters: FilterState): AQIData[] {
  return data.filter(item => {
    // State filter
    if (filters.selectedState && item.state !== filters.selectedState) {
      return false;
    }
    
    // Area filter
    if (filters.selectedArea && item.area !== filters.selectedArea) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange.start && item.date < filters.dateRange.start) {
      return false;
    }
    if (filters.dateRange.end && item.date > filters.dateRange.end) {
      return false;
    }
    
    // Pollutant filter
    if (filters.selectedPollutants.length > 0) {
      const itemPollutants = item.prominent_pollutants.split(',').map(p => p.trim());
      const hasSelectedPollutant = filters.selectedPollutants.some(selected => 
        itemPollutants.some(pollutant => pollutant.includes(selected))
      );
      if (!hasSelectedPollutant) {
        return false;
      }
    }
    
    return true;
  });
}

export function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0) return 0;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

export function getAQICategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

export function analyzeData(data: AQIData[]): InsightData {
  if (data.length === 0) {
    return {
      avgAQI: 0,
      avgStations: 0,
      totalRecords: 0,
      avgPM25: 0,
      maxAQI: { value: 0, date: '', area: '' },
      minAQI: { value: 0, date: '', area: '' },
      stateStats: [],
      areaStats: [],
      statusDistribution: [],
      pollutantFrequency: [],
      weekdayStats: [],
      monthlyTrend: [],
      correlations: { stations_aqi: 0 },
    };
  }

  // Basic statistics
  const avgAQI = data.reduce((sum, d) => sum + d.aqi_value, 0) / data.length;
  const avgStations = data.reduce((sum, d) => sum + d.number_of_monitoring_stations, 0) / data.length;
  const avgPM25 = data.reduce((sum, d) => sum + (d.pm25 || 0), 0) / data.length;
  const totalRecords = data.length;

  // Max and Min AQI
  const maxAQIEntry = data.reduce((max, d) => d.aqi_value > max.aqi_value ? d : max);
  const minAQIEntry = data.reduce((min, d) => d.aqi_value < min.aqi_value ? d : min);

  // State-wise statistics
  const stateGroups = data.reduce((acc, d) => {
    if (!acc[d.state]) acc[d.state] = [];
    acc[d.state].push(d);
    return acc;
  }, {} as Record<string, AQIData[]>);

  const stateStats = Object.entries(stateGroups).map(([state, stateData]) => ({
    state,
    avgAQI: stateData.reduce((sum, d) => sum + d.aqi_value, 0) / stateData.length,
  })).sort((a, b) => b.avgAQI - a.avgAQI);

  // Area-wise statistics
  const areaGroups = data.reduce((acc, d) => {
    if (!acc[d.area]) acc[d.area] = [];
    acc[d.area].push(d);
    return acc;
  }, {} as Record<string, AQIData[]>);

  const areaStats = Object.entries(areaGroups).map(([area, areaData]) => ({
    area,
    avgAQI: areaData.reduce((sum, d) => sum + d.aqi_value, 0) / areaData.length,
  })).sort((a, b) => b.avgAQI - a.avgAQI);

  // Status distribution
  const statusCounts = data.reduce((acc, d) => {
    acc[d.air_quality_status] = (acc[d.air_quality_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: (count / data.length) * 100,
  }));

  // Pollutant frequency
  const pollutantCounts = data.reduce((acc, d) => {
    const pollutants = d.prominent_pollutants.split(',').map(p => p.trim());
    pollutants.forEach(pollutant => {
      if (pollutant) {
        acc[pollutant] = (acc[pollutant] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const pollutantFrequency = Object.entries(pollutantCounts).map(([pollutant, count]) => ({
    pollutant,
    count,
    percentage: (count / data.length) * 100,
  })).sort((a, b) => b.count - a.count);

  // Weekday analysis
  const weekdayGroups = data.reduce((acc, d) => {
    const date = new Date(d.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    if (!acc[dayName]) acc[dayName] = [];
    acc[dayName].push(d);
    return acc;
  }, {} as Record<string, AQIData[]>);

  const weekdayStats = Object.entries(weekdayGroups).map(([day, dayData]) => {
    const avgAQI = dayData.reduce((sum, d) => sum + d.aqi_value, 0) / dayData.length;
    const avgStations = dayData.reduce((sum, d) => sum + d.number_of_monitoring_stations, 0) / dayData.length;
    
    return { day, avgAQI, avgStations };
  });

  // Monthly trend
  const monthlyGroups = data.reduce((acc, d) => {
    const date = new Date(d.date);
    const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(d);
    return acc;
  }, {} as Record<string, AQIData[]>);

  const monthlyTrend = Object.entries(monthlyGroups).map(([month, monthData]) => ({
    month,
    aqi: monthData.reduce((sum, d) => sum + d.aqi_value, 0) / monthData.length,
    stations: monthData.reduce((sum, d) => sum + d.number_of_monitoring_stations, 0) / monthData.length,
  }));

  // Correlations
  const aqiValues = data.map(d => d.aqi_value);
  const stationValues = data.map(d => d.number_of_monitoring_stations);

  const correlations = {
    stations_aqi: calculateCorrelation(stationValues, aqiValues),
  };

  return {
    avgAQI,
    avgStations,
    totalRecords,
    avgPM25,
    maxAQI: { value: maxAQIEntry.aqi_value, date: maxAQIEntry.date, area: maxAQIEntry.area },
    minAQI: { value: minAQIEntry.aqi_value, date: minAQIEntry.date, area: minAQIEntry.area },
    stateStats,
    areaStats,
    statusDistribution,
    pollutantFrequency,
    weekdayStats,
    monthlyTrend,
    correlations,
  };
}

export function generateInsights(insights: InsightData, filters: FilterState): string[] {
  const textInsights = [];
  
  // AQI Category
  const aqiCategory = getAQICategory(insights.avgAQI);
  textInsights.push(`Overall air quality is ${aqiCategory.toLowerCase()} with an average AQI of ${insights.avgAQI.toFixed(1)}`);
  
  // Worst state/area
  if (insights.stateStats.length > 0) {
    const worstState = insights.stateStats[0];
    textInsights.push(`${worstState.state} has the highest average AQI of ${worstState.avgAQI.toFixed(1)}`);
  }
  
  if (insights.areaStats.length > 0) {
    const worstArea = insights.areaStats[0];
    textInsights.push(`${worstArea.area} has the highest average AQI of ${worstArea.avgAQI.toFixed(1)}`);
  }
  
  // Station correlation
  if (Math.abs(insights.correlations.stations_aqi) > 0.3) {
    const corrType = insights.correlations.stations_aqi > 0 ? 'positive' : 'negative';
    textInsights.push(`${corrType.charAt(0).toUpperCase() + corrType.slice(1)} correlation (${insights.correlations.stations_aqi.toFixed(2)}) between monitoring stations and AQI`);
  }
  
  // Weekday analysis
  if (insights.weekdayStats.length > 0) {
    const worstWeekday = insights.weekdayStats.reduce((max, day) => day.avgAQI > max.avgAQI ? day : max);
    textInsights.push(`${worstWeekday.day}s have the highest average AQI of ${worstWeekday.avgAQI.toFixed(1)}`);
  }
  
  // Dominant pollutant
  if (insights.pollutantFrequency.length > 0) {
    const dominantPollutant = insights.pollutantFrequency[0];
    textInsights.push(`${dominantPollutant.pollutant} is the most prominent pollutant (${dominantPollutant.percentage.toFixed(1)}% of records)`);
  }
  
  // Filter-specific insights
  if (filters.selectedState) {
    textInsights.push(`Analysis filtered for ${filters.selectedState} state`);
  }
  
  if (filters.selectedPollutants.length > 0) {
    textInsights.push(`Showing data for pollutants: ${filters.selectedPollutants.join(', ')}`);
  }
  
  return textInsights;
}

export function generateSampleData(): AQIData[] {
  const states = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal'];
  const areas = {
    'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Anand Vihar'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri']
  };
  const statuses = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor'];
  const pollutants = ['PM2.5', 'PM10', 'NO2', 'CO', 'O3', 'SO2'];
  
  const sampleData: AQIData[] = [];
  
  for (let i = 0; i < 200; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const state = states[Math.floor(Math.random() * states.length)];
    const stateAreas = areas[state as keyof typeof areas];
    const area = stateAreas[Math.floor(Math.random() * stateAreas.length)];
    
    const aqi = Math.floor(Math.random() * 300) + 50;
    const status = statuses[Math.min(Math.floor(aqi / 60), statuses.length - 1)];
    
    const selectedPollutants = pollutants
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);
    
    sampleData.push({
      date: date.toISOString().split('T')[0],
      state,
      area,
      aqi_value: aqi,
      air_quality_status: status,
      prominent_pollutants: selectedPollutants.join(', '),
      number_of_monitoring_stations: Math.floor(Math.random() * 10) + 1,
      pm25: Math.floor(Math.random() * 100) + 20,
      pm10: Math.floor(Math.random() * 150) + 30,
      co: Math.floor(Math.random() * 10) + 1,
      no2: Math.floor(Math.random() * 80) + 10,
      o3: Math.floor(Math.random() * 120) + 20,
      so2: Math.floor(Math.random() * 50) + 5,
    });
  }
  
  return sampleData;
}