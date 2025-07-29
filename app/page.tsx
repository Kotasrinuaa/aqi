import Link from 'next/link';
import { Wind, BarChart3, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <Wind className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white mb-4">
            AQI Dashboard
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Real-time air quality monitoring and comprehensive data analysis
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Interactive Charts</h3>
            <p className="text-gray-400 text-sm">Visualize AQI trends with dynamic charts and graphs</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Data Analysis</h3>
            <p className="text-gray-400 text-sm">Get insights from pollutant correlations and patterns</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <Wind className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Monitoring</h3>
            <p className="text-gray-400 text-sm">Track air quality metrics across multiple cities</p>
          </div>
        </div>
        
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <BarChart3 className="w-5 h-5" />
          View Dashboard
        </Link>
      </div>
    </div>
  );
}
