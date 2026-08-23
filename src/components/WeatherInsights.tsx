'use client';

import React from 'react';
import { Sparkles, Umbrella, Shirt, Activity } from 'lucide-react';
import { generateInsights } from '@/utils/weatherUtils';

interface WeatherInsightsProps {
  temperatureCelsius: number;
  precipitationProbability: number;
  uvIndex: number;
  aqiUs: number;
  windSpeed: number;
}

export const WeatherInsights: React.FC<WeatherInsightsProps> = ({
  temperatureCelsius,
  precipitationProbability,
  uvIndex,
  aqiUs,
  windSpeed,
}) => {
  const insights = generateInsights(
    temperatureCelsius,
    precipitationProbability,
    uvIndex,
    aqiUs,
    windSpeed
  );

  return (
    <div className="glass-panel p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <h3 className="text-base sm:text-lg font-bold text-white font-display">
          Smart Weather Insights
        </h3>
      </div>

      {/* Insights List */}
      <div className="flex flex-col gap-3">
        {/* Umbrella Tip */}
        <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
            <Umbrella className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">{insights.umbrella.title}</h4>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{insights.umbrella.desc}</p>
          </div>
        </div>

        {/* Clothing Tip */}
        <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Shirt className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">{insights.clothing.title}</h4>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{insights.clothing.desc}</p>
          </div>
        </div>

        {/* Outdoor Fitness Tip */}
        <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">{insights.activity.title}</h4>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{insights.activity.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
