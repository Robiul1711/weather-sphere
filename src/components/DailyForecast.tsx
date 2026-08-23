'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { DailyForecastItem, TemperatureUnit } from '@/types/weather';
import { getWeatherCondition, formatTemp } from '@/utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  unit: TemperatureUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, unit }) => {
  // Find global min and max for relative bar calculation
  const allMins = daily.map((d) => d.tempMin);
  const allMaxs = daily.map((d) => d.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempRange = Math.max(globalMax - globalMin, 1);

  return (
    <div className="glass-panel p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-white font-display">7-Day Forecast</h3>
        </div>
        <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Daily Outlook</span>
      </div>

      {/* Daily Rows */}
      <div className="flex flex-col gap-2 sm:gap-2.5">
        {daily.map((item, idx) => {
          const condition = getWeatherCondition(item.weatherCode, true);
          const isToday = idx === 0;

          // Bar calculations
          const leftPercent = Math.max(0, ((item.tempMin - globalMin) / tempRange) * 100);
          const widthPercent = Math.min(100 - leftPercent, ((item.tempMax - item.tempMin) / tempRange) * 100);

          return (
            <div
              key={item.date}
              className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all ${
                isToday
                  ? 'bg-sky-500/10 border-sky-400/30'
                  : 'bg-white/5 hover:bg-white/10 active:bg-white/15 border-white/5 hover:border-white/15'
              }`}
            >
              {/* Day & Date */}
              <div className="w-16 sm:w-20 md:w-24 shrink-0">
                <span className={`block text-xs sm:text-sm font-bold ${isToday ? 'text-sky-300' : 'text-white'}`}>
                  {item.dayName}
                </span>
                <span className="block text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">{item.formattedDate}</span>
              </div>

              {/* Weather Icon & Label */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 flex-1 min-w-0 px-1 sm:px-2">
                <WeatherIcon
                  name={condition.icon}
                  className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400 shrink-0"
                />
                <span className="hidden sm:inline-block text-xs font-medium text-slate-300 truncate max-w-[120px]">
                  {condition.label}
                </span>
              </div>

              {/* Min - Temperature Bar - Max */}
              <div className="flex items-center gap-1.5 sm:gap-3 w-28 sm:w-36 md:w-44 justify-end shrink-0">
                <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-400 w-7 sm:w-8 text-right">
                  {formatTemp(item.tempMin, unit)}
                </span>

                <div className="flex-1 h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden relative">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${Math.max(widthPercent, 15)}%`,
                    }}
                  />
                </div>

                <span className="text-[11px] sm:text-xs md:text-sm font-bold text-white w-7 sm:w-8 text-left">
                  {formatTemp(item.tempMax, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
