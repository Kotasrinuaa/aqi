'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';

interface AreaChartProps {
  data: any[];
  title: string;
  loading?: boolean;
}

export default function CustomAreaChart({ data, title, loading = false }: AreaChartProps) {
  const [visibleLines, setVisibleLines] = useState({
    aqi: true,
    stations: true,
  });

  const toggleLine = (key: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white font-semibold" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(1)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-6">{title}</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <div className="flex gap-2">
          {Object.entries(visibleLines).map(([key, visible]) => (
            <button
              key={key}
              onClick={() => toggleLine(key as keyof typeof visibleLines)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                visible 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {key === 'aqi' ? 'AQI' : 'Stations'}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAQI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorStations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {visibleLines.aqi && (
              <Area
                type="monotone"
                dataKey="aqi"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorAQI)"
                strokeWidth={2}
                name="AQI"
              />
            )}
            {visibleLines.stations && (
              <Area
                type="monotone"
                dataKey="stations"
                stroke="#06b6d4"
                fillOpacity={1}
                fill="url(#colorStations)"
                strokeWidth={2}
                name="Stations"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}