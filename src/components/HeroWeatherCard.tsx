'use client';

import React from 'react';
import {
  MapPin,
  Bookmark,
  ArrowUp,
  ArrowDown,
  Wind,
  Droplets,
  CloudRain,
  Gauge,
} from 'lucide-react';
import { GeoLocation, CurrentWeather, DailyForecastItem, TemperatureUnit } from '@/types/weather';
import { getWeatherCondition, formatTemp, formatWindSpeed } from '@/utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface HeroWeatherCardProps {
  location: GeoLocation;
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
  unit: TemperatureUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const HeroWeatherCard: React.FC<HeroWeatherCardProps> = ({
  location,
  current,
  todayDaily,
  unit,
  isFavorite,
  onToggleFavorite,
}) => {
  const condition = getWeatherCondition(current.weatherCode, current.isDay);

  // Formatted date and time
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const highTemp = todayDaily ? formatTemp(todayDaily.tempMax, unit) : formatTemp(current.temperature + 3, unit);
  const lowTemp = todayDaily ? formatTemp(todayDaily.tempMin, unit) : formatTemp(current.temperature - 4, unit);
  const precipProb = todayDaily ? `${todayDaily.precipitationProbabilityMax}%` : `${current.precipitation} mm`;

  return (
    <div className="glass-panel p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Decorative gradient glow on card corner */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
        <div className="w-full sm:w-auto">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400 shrink-0" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-display tracking-tight break-words">
              {location.name}
            </h2>
            {location.country && (
              <span className="text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/10 text-slate-300 border border-white/10">
                {location.country}
              </span>
            )}
            <button
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              className={`p-1.5 sm:p-2 rounded-full border transition-all active:scale-95 ml-auto sm:ml-0 ${
                isFavorite
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-sm'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
          <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 mt-1 font-medium">{dateFormatted}</p>
        </div>

        {/* Condition Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-sky-500/15 border border-sky-500/30 text-white text-xs sm:text-sm font-semibold shadow-sm shrink-0">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-sky-400 pulse-glow" />
          <span>{condition.label}</span>
        </div>
      </div>

      {/* Main Temperature & Big Icon */}
      <div className="flex flex-row items-center sm:items-start gap-4 sm:gap-8 md:gap-10 mb-6 sm:mb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner shrink-0">
          <WeatherIcon
            name={condition.icon}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-sky-400 drop-shadow-[0_8px_16px_rgba(56,189,248,0.4)]"
          />
        </div>

        <div className="flex flex-col items-start min-w-0">
          <div className="flex items-baseline">
            <span className="text-5xl sm:text-6xl md:text-7xl font-black font-display text-white tracking-tighter">
              {formatTemp(current.temperature, unit).replace('°', '')}
            </span>
            <span className="text-3xl sm:text-4xl md:text-5xl font-light text-sky-400 ml-0.5">°</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm">
            <span className="text-slate-300">
              Feels like <strong className="text-white font-bold">{formatTemp(current.apparentTemperature, unit)}</strong>
            </span>
            <div className="flex items-center gap-2.5 sm:gap-3 font-semibold">
              <span className="flex items-center text-rose-400">
                <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5" /> High: {highTemp}
              </span>
              <span className="flex items-center text-sky-400">
                <ArrowDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5" /> Low: {lowTemp}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/25 border border-white/5">
        <div className="flex items-center gap-2.5 sm:gap-3 p-1.5 sm:p-2">
          <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 shrink-0" />
          <div className="min-w-0">
            <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Wind</span>
            <span className="block text-xs sm:text-sm md:text-base font-bold text-white mt-0.5 truncate">
              {formatWindSpeed(current.windSpeed, unit)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 p-1.5 sm:p-2">
          <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 shrink-0" />
          <div className="min-w-0">
            <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Humidity</span>
            <span className="block text-xs sm:text-sm md:text-base font-bold text-white mt-0.5 truncate">
              {current.relativeHumidity}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 p-1.5 sm:p-2">
          <CloudRain className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 shrink-0" />
          <div className="min-w-0">
            <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Precip</span>
            <span className="block text-xs sm:text-sm md:text-base font-bold text-white mt-0.5 truncate">
              {precipProb}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 p-1.5 sm:p-2">
          <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 shrink-0" />
          <div className="min-w-0">
            <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pressure</span>
            <span className="block text-xs sm:text-sm md:text-base font-bold text-white mt-0.5 truncate">
              {current.surfacePressure} hPa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
