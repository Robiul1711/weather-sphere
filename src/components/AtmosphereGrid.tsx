'use client';

import React from 'react';
import {
  ShieldCheck,
  SunDim,
  Compass,
  Sunrise,
  Sunset,
  Eye,
  CloudFog,
  BarChart2,
  Clock4,
} from 'lucide-react';
import { CurrentWeather, DailyForecastItem, AirQualityData, TemperatureUnit } from '@/types/weather';
import {
  getAQIInfo,
  getUVInfo,
  getWindDirection,
  calculateDaylight,
  formatTemp,
  formatWindSpeed,
} from '@/utils/weatherUtils';

interface AtmosphereGridProps {
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
  airQuality: AirQualityData;
  unit: TemperatureUnit;
}

export const AtmosphereGrid: React.FC<AtmosphereGridProps> = ({
  current,
  todayDaily,
  airQuality,
  unit,
}) => {
  const aqi = getAQIInfo(airQuality.aqiUs);
  const uv = getUVInfo(current.uvIndex);
  const windDir = getWindDirection(current.windDirection);

  const sunrise = todayDaily ? todayDaily.sunrise : '05:45 AM';
  const sunset = todayDaily ? todayDaily.sunset : '06:30 PM';
  const daylight = todayDaily ? calculateDaylight(todayDaily.sunrise, todayDaily.sunset) : '12h 45m';

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-white font-display">
          Today's Atmosphere &amp; Air Quality
        </h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* 1. Air Quality Card */}
        <div className="glass-panel p-4 sm:p-5 flex flex-col justify-between gap-3 sm:gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Air Quality Index</span>
            </div>
            <span className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full border ${aqi.badgeClass}`}>
              {aqi.status}
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-display text-white">
              {airQuality.aqiUs} <span className="text-xs sm:text-sm font-normal text-slate-400">US AQI</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
              PM2.5: <strong className="text-slate-200">{airQuality.pm2_5} µg/m³</strong> &bull; PM10: {airQuality.pm10}
            </p>
          </div>

          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full transition-all"
              style={{ width: `${Math.min(airQuality.aqiUs / 2, 100)}%` }}
            />
          </div>
        </div>

        {/* 2. UV Index Card */}
        <div className="glass-panel p-4 sm:p-5 flex flex-col justify-between gap-3 sm:gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-400">
              <SunDim className="w-4 h-4 text-amber-400" />
              <span>UV Index</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {uv.status}
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-display text-white">{current.uvIndex}</div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">{uv.advice}</p>
          </div>

          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 to-rose-500 rounded-full"
              style={{ width: `${Math.min((current.uvIndex / 11) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* 3. Wind Speed & Direction with Rotating Compass */}
        <div className="glass-panel p-4 sm:p-5 flex flex-col justify-between gap-3 sm:gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-400">
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Wind &amp; Direction</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {windDir}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl sm:text-3xl font-black font-display text-white">
                {formatWindSpeed(current.windSpeed, unit)}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                Gusts up to <strong className="text-slate-200">{formatWindSpeed(current.windGusts, unit)}</strong>
              </p>
            </div>

            {/* Visual Compass Needle Dial */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center shrink-0">
              <div
                className="w-1 h-7 sm:h-8 rounded-full bg-gradient-to-t from-rose-500 to-sky-400 transition-transform duration-500"
                style={{ transform: `rotate(${current.windDirection}deg)` }}
              />
              <span className="absolute -bottom-4 sm:-bottom-5 text-[9px] sm:text-[10px] font-bold text-slate-400">
                {current.windDirection}°
              </span>
            </div>
          </div>

          <div className="text-[10px] sm:text-[11px] text-slate-400">
            Bearing: <span className="text-sky-300 font-semibold">{windDir} ({current.windDirection}°)</span>
          </div>
        </div>

        {/* 4. Sunrise & Sunset */}
        <div className="glass-panel p-4 sm:p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-400">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <span>Sun Schedule</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 sm:gap-2.5 min-w-0">
              <Sunrise className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">Sunrise</span>
                <span className="block text-xs sm:text-sm font-bold text-white truncate">{sunrise}</span>
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 sm:gap-2.5 min-w-0">
              <Sunset className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">Sunset</span>
                <span className="block text-xs sm:text-sm font-bold text-white truncate">{sunset}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 font-medium">
            <Clock4 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Daylight length: <strong className="text-slate-200">{daylight}</strong></span>
          </div>
        </div>

        {/* 5. Visibility */}
        <div className="glass-panel p-4 sm:p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-400">
              <Eye className="w-4 h-4 text-sky-400" />
              <span>Visibility</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {current.visibility >= 10 ? 'Clear' : 'Reduced'}
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-display text-white">
              {current.visibility} <span className="text-xs sm:text-sm font-normal text-slate-400">km</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
              {current.visibility >= 10 ? 'Clear horizon view' : 'Light haze or mist present'}
            </p>
          </div>

          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-400 rounded-full"
              style={{ width: `${Math.min((current.visibility / 10) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* 6. Dew Point */}
        <div className="glass-panel p-4 sm:p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-400">
              <CloudFog className="w-4 h-4 text-sky-400" />
              <span>Dew Point</span>
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-display text-white">
              {formatTemp(current.dewPoint, unit)}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
              Humidity: <strong className="text-slate-200">{current.relativeHumidity}%</strong>
            </p>
          </div>

          <div className="text-[10px] sm:text-[11px] text-slate-400">
            Comfort: {current.dewPoint > 24 ? 'Muggy & humid' : current.dewPoint > 18 ? 'Comfortable' : 'Crisp & dry'}
          </div>
        </div>
      </div>
    </div>
  );
};
