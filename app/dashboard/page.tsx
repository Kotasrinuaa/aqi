'use client';

import { useState, useEffect, useMemo } from 'react';
import { Wind, Gauge, Activity, AlertTriangle, TrendingUp, BarChart3, Database, Filter, Menu, X } from 'lucide-react';
import StatCard from '@/components/StatCard';
import CustomLineChart from '@/components/charts/LineChart';
import CustomAreaChart from '@/components/charts/AreaChart';
import CustomBarChart from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import RingChart from '@/components/charts/RingChart';
import VerticalFilters from '@/components/filters/VerticalFilters';
import { parseCSV, analyzeData, generateInsights, applyFilters, generateSampleData } from '@/utils/aqiUtils';
import { AQIData, InsightData, FilterState } from '@/types/aqi';

export default function Dashboard() {
  const [rawData, setRawData] = useState<AQIData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analysis'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    selectedState: '',
    selectedArea: '',
    dateRange: { start: '', end: '' },
    selectedPollutants: [],
  });

  // Apply filters to get filtered data
  const filteredData = useMemo(() => {
    return applyFilters(rawData, filters);
  }, [rawData, filters]);

  // Analyze filtered data
  const insights = useMemo(() => {
    return analyzeData(filteredData);
  }, [filteredData]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/aqi.csv');
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        setRawData(parsedData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Generate sample data for demo
        const sampleData = generateSampleData();
        setRawData(sampleData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading AQI data...</p>
        </div>
      </div>
    );
  }

  if (rawData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-300">Error loading data</p>
        </div>
      </div>
    );
  }

  const textInsights = generateInsights(insights, filters);

  // Prepare chart data
  const timeSeriesData = insights.monthlyTrend.map(item => ({
    month: item.month,
    aqi: Math.round(item.aqi),
    date: item.month,
  }));

  const areaChartData = insights.weekdayStats.map(item => ({
    day: item.day,
    aqi: Math.round(item.avgAQI),
    stations: Math.round(item.avgStations),
  }));

  const statusBarData = insights.statusDistribution.map(item => ({
    status: item.status,
    count: item.count,
    percentage: item.percentage,
  }));

  const pollutantDonutData = insights.pollutantFrequency.slice(0, 5).map(item => ({
    name: item.pollutant,
    count: item.count,
    percentage: item.percentage,
  }));

  // Calculate alerts data
  const poorQualityCount = filteredData.filter(d => d.aqi_value > 200).length;
  const goodQualityCount = filteredData.filter(d => d.aqi_value <= 100).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Static Left Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50 lg:hidden">
            <h2 className="text-lg font-semibold text-white">Filters</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <VerticalFilters
            data={rawData}
            filters={filters}
            onFiltersChange={setFilters}
            loading={loading}
            isOpen={true}
            onToggle={() => {}}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white transition-all duration-200"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-white">AQI Dashboard</h1>
                  <p className="text-gray-400 mt-1">Real-time air quality monitoring and analysis</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'dashboard'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'analysis'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Analysis
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {activeTab === 'dashboard' ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Average AQI"
                  value={insights.avgAQI.toFixed(1)}
                  subtitle="Air Quality Index"
                  gradient="bg-gradient-to-br from-purple-600 to-purple-800"
                  icon={<Gauge className="w-6 h-6" />}
                />
                <StatCard
                  title="Avg Stations"
                  value={insights.avgStations.toFixed(1)}
                  subtitle="Monitoring Stations"
                  gradient="bg-gradient-to-br from-blue-600 to-blue-800"
                  icon={<Database className="w-6 h-6" />}
                />
                <StatCard
                  title="Total Records"
                  value={insights.totalRecords.toString()}
                  subtitle="Data Points"
                  gradient="bg-gradient-to-br from-cyan-600 to-cyan-800"
                  icon={<Activity className="w-6 h-6" />}
                />
                <StatCard
                  title="Average PM2.5"
                  value={`${insights.avgPM25.toFixed(1)} μg/m³`}
                  subtitle="Fine Particles"
                  gradient="bg-gradient-to-br from-amber-600 to-amber-800"
                  icon={<Wind className="w-6 h-6" />}
                />
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <CustomLineChart
                  data={timeSeriesData}
                  dataKey="aqi"
                  xAxisKey="month"
                  title="AQI Over Time"
                  color="#8b5cf6"
                  loading={false}
                />
                <CustomAreaChart
                  data={areaChartData}
                  title="Station Count by Weekday"
                  loading={false}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <CustomBarChart
                  data={statusBarData}
                  title="Air Quality Status Distribution"
                  loading={false}
                />
                <DonutChart
                  data={pollutantDonutData}
                  title="Prominent Pollutants"
                  loading={false}
                />
                <RingChart
                  title="Poor vs Good AQI"
                  newAlerts={poorQualityCount}
                  resolved={goodQualityCount}
                  loading={false}
                />
              </div>
            </>
          ) : (
            /* Analysis Tab */
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-purple-500" />
                  Data Insights & Analysis
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {textInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl p-4 border border-purple-500/20"
                    >
                      <p className="text-gray-200 leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filter Summary */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-semibold text-white mb-4">Current Filter Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {filteredData.length}
                    </div>
                    <div className="text-sm text-gray-400">
                      Filtered Records
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {filters.selectedState || 'All'}
                    </div>
                    <div className="text-sm text-gray-400">
                      State
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {filters.selectedArea || 'All'}
                    </div>
                    <div className="text-sm text-gray-400">
                      Area
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {filters.selectedPollutants.length || 'All'}
                    </div>
                    <div className="text-sm text-gray-400">
                      Pollutants
                    </div>
                  </div>
                </div>
              </div>

              {/* State Rankings */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-semibold text-white mb-4">State AQI Rankings</h3>
                <div className="space-y-3">
                  {insights.stateStats.slice(0, 5).map((state, index) => (
                    <div key={state.state} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-red-600' :
                          index === 1 ? 'bg-orange-600' :
                          index === 2 ? 'bg-yellow-600' : 'bg-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-white font-medium">{state.state}</span>
                      </div>
                      <span className="text-gray-300">{state.avgAQI.toFixed(1)} AQI</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}