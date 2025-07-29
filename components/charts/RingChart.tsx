'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RingChartProps {
  title: string;
  newAlerts: number;
  resolved: number;
  loading?: boolean;
}

export default function RingChart({ title, newAlerts, resolved, loading = false }: RingChartProps) {
  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-6">{title}</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  const total = newAlerts + resolved;
  if (total === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-6">{title}</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  const newPercentage = (newAlerts / total) * 100;
  const resolvedPercentage = (resolved / total) * 100;

  const data = [
    { name: 'New Alerts', value: newPercentage, count: newAlerts },
    { name: 'Resolved', value: resolvedPercentage, count: resolved },
  ];

  const COLORS = ['#ef4444', '#10b981'];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <h3 className="text-xl font-semibold text-white mb-6">{title}</h3>
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              startAngle={90}
              endAngle={450}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{total}</div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-300">
            New Alerts ({newPercentage.toFixed(0)}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-300">
            Resolved ({resolvedPercentage.toFixed(0)}%)
          </span>
        </div>
      </div>
    </div>
  );
}