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
    <div className="glass-panel p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative gradient glow on card corner */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <MapPin className="w-6 h-6 text-sky-400 shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              {location.name}
            </h2>
            {location.country && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10">
                {location.country}
              </span>
            )}
            <button
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              className={`p-2 rounded-full border transition-all ${
                isFavorite
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-sm'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-medium">{dateFormatted}</p>
        </div>

        {/* Condition Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/15 border border-sky-500/30 text-white text-xs sm:text-sm font-semibold shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 pulse-glow" />
          <span>{condition.label}</span>
        </div>
      </div>

      {/* Main Temperature & Big Icon */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 mb-8">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
          <WeatherIcon
            name={condition.icon}
            className="w-16 h-16 text-sky-400 drop-shadow-[0_8px_16px_rgba(56,189,248,0.4)]"
          />
        </div>

        <div className="flex flex-col items-center sm:items-start">
          <div className="flex items-baseline">
            <span className="text-6xl sm:text-7xl font-black font-display text-white tracking-tighter">
              {formatTemp(current.temperature, unit).replace('°', '')}
            </span>
            <span className="text-4xl sm:text-5xl font-light text-sky-400 ml-1">°</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm">
            <span className="text-slate-300">
              Feels like <strong className="text-white font-bold">{formatTemp(current.apparentTemperature, unit)}</strong>
            </span>
            <div className="flex items-center gap-3 font-semibold">
              <span className="flex items-center text-rose-400">
                <ArrowUp className="w-3.5 h-3.5 mr-0.5" /> High: {highTemp}
              </span>
              <span className="flex items-center text-sky-400">
                <ArrowDown className="w-3.5 h-3.5 mr-0.5" /> Low: {lowTemp}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-black/25 border border-white/5">
        <div className="flex items-center gap-3 p-2">
          <Wind className="w-5 h-5 text-sky-400 shrink-0" />
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Wind</span>
            <span className="block text-sm sm:text-base font-bold text-white mt-0.5">
              {formatWindSpeed(current.windSpeed, unit)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <Droplets className="w-5 h-5 text-sky-400 shrink-0" />
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Humidity</span>
            <span className="block text-sm sm:text-base font-bold text-white mt-0.5">
              {current.relativeHumidity}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <CloudRain className="w-5 h-5 text-sky-400 shrink-0" />
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Precip Chance</span>
            <span className="block text-sm sm:text-base font-bold text-white mt-0.5">
              {precipProb}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <Gauge className="w-5 h-5 text-sky-400 shrink-0" />
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pressure</span>
            <span className="block text-sm sm:text-base font-bold text-white mt-0.5">
              {current.surfacePressure} hPa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
