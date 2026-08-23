'use client';

import React, { useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, Droplet } from 'lucide-react';
import { HourlyForecastItem, TemperatureUnit } from '@/types/weather';
import { getWeatherCondition, formatTemp } from '@/utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  unit: TemperatureUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="glass-panel p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-white font-display">24-Hour Hourly Forecast</h3>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1 sm:p-1.5 rounded-full bg-white/5 hover:bg-white/15 active:bg-white/20 border border-white/10 text-slate-300 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 sm:p-1.5 rounded-full bg-white/5 hover:bg-white/15 active:bg-white/20 border border-white/10 text-slate-300 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar sm:custom-scrollbar scroll-smooth overscroll-x-contain touch-pan-x"
      >
        {hourly.map((item, index) => {
          const condition = getWeatherCondition(item.weatherCode, item.isDay);
          const isNow = index === 0;

          return (
            <div
              key={`${item.time}-${index}`}
              className={`flex flex-col items-center justify-between min-w-[74px] sm:min-w-[85px] p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border shrink-0 transition-all ${
                isNow
                  ? 'bg-sky-500/20 border-sky-400/50 shadow-md shadow-sky-500/10'
                  : 'bg-white/5 hover:bg-white/10 active:bg-white/15 border-white/5 hover:border-white/20'
              }`}
            >
              <span className={`text-[11px] sm:text-xs font-semibold ${isNow ? 'text-sky-300' : 'text-slate-400'}`}>
                {item.formattedTime}
              </span>

              <div className="my-1.5 sm:my-2.5">
                <WeatherIcon
                  name={condition.icon}
                  className="w-6 h-6 sm:w-7 sm:h-7 text-sky-400 drop-shadow-sm"
                />
              </div>

              <span className="text-sm sm:text-base font-bold text-white font-display">
                {formatTemp(item.temperature, unit)}
              </span>

              {/* Precipitation chance */}
              <div className="flex items-center gap-0.5 mt-1 sm:mt-1.5 text-[10px] sm:text-[11px] font-medium text-sky-400">
                <Droplet className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>{item.precipitationProbability}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
