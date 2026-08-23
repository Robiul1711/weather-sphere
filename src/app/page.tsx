'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { QuickChips } from '@/components/QuickChips';
import { HeroWeatherCard } from '@/components/HeroWeatherCard';
import { HourlyForecast } from '@/components/HourlyForecast';
import { DailyForecast } from '@/components/DailyForecast';
import { AtmosphereGrid } from '@/components/AtmosphereGrid';
import { WeatherInsights } from '@/components/WeatherInsights';
import { CoordinatesCard } from '@/components/CoordinatesCard';
import { DynamicBackground } from '@/components/DynamicBackground';
import { Footer } from '@/components/Footer';
import { CompleteWeatherData, GeoLocation, TemperatureUnit } from '@/types/weather';
import { getWeatherData, getLocationFromCoords } from '@/services/weatherApi';
import { getWeatherCondition } from '@/utils/weatherUtils';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const DEFAULT_LOCATION: GeoLocation = {
  id: 1185241,
  name: 'Dhaka',
  latitude: 23.8103,
  longitude: 90.4125,
  country: 'Bangladesh',
  country_code: 'BD',
  admin1: 'Dhaka Division',
  timezone: 'Asia/Dhaka',
  elevation: 12,
};

export default function Home() {
  const [currentLocation, setCurrentLocation] = useState<GeoLocation>(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState<CompleteWeatherData | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [favorites, setFavorites] = useState<GeoLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved preferences & favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedUnit = localStorage.getItem('weathersphere_unit') as TemperatureUnit;
      if (savedUnit && (savedUnit === 'celsius' || savedUnit === 'fahrenheit')) {
        setUnit(savedUnit);
      }

      const savedFavs = localStorage.getItem('weathersphere_favorites');
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }

      const savedLoc = localStorage.getItem('weathersphere_last_location');
      if (savedLoc) {
        setCurrentLocation(JSON.parse(savedLoc));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Fetch weather data when location changes
  const fetchWeather = useCallback(async (location: GeoLocation) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(location);
      setWeatherData(data);
      localStorage.setItem('weathersphere_last_location', JSON.stringify(location));
    } catch (err: any) {
      console.error('Weather load error:', err);
      setError('Unable to load weather forecast right now. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(currentLocation);
  }, [currentLocation, fetchWeather]);

  // Handle unit switch
  const handleToggleUnit = (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    localStorage.setItem('weathersphere_unit', newUnit);
  };

  // Handle favorites toggle
  const handleToggleFavorite = () => {
    let updated: GeoLocation[];
    const exists = favorites.some((f) => f.name === currentLocation.name && f.country === currentLocation.country);

    if (exists) {
      updated = favorites.filter((f) => !(f.name === currentLocation.name && f.country === currentLocation.country));
    } else {
      updated = [currentLocation, ...favorites].slice(0, 8);
    }

    setFavorites(updated);
    localStorage.setItem('weathersphere_favorites', JSON.stringify(updated));
  };

  // Geolocation Handler
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const loc = await getLocationFromCoords(lat, lon);
          setCurrentLocation(loc);
        } catch (e) {
          console.error('Locate error:', e);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        alert('Could not access current location. Please allow location permissions or search by city name.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Calculate current theme
  const currentTheme = weatherData
    ? getWeatherCondition(weatherData.current.weatherCode, weatherData.current.isDay).theme
    : 'clear-day';

  const isCurrentFavorite = favorites.some(
    (f) => f.name === currentLocation.name && f.country === currentLocation.country
  );

  return (
    <div className="min-h-screen text-slate-100 flex flex-col justify-between">
      {/* Adaptive Weather Background */}
      <DynamicBackground theme={currentTheme} />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 flex-1">
        {/* Navigation / Header */}
        <Navbar
          onSelectLocation={(loc) => setCurrentLocation(loc)}
          onLocateMe={handleLocateMe}
          unit={unit}
          onToggleUnit={handleToggleUnit}
          isLocating={isLocating}
        />

        {/* Quick Popular / Favorites Chips */}
        <QuickChips
          currentLocation={currentLocation}
          onSelectCity={(loc) => setCurrentLocation(loc)}
          favorites={favorites}
        />

        {/* Error Notification */}
        {error && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchWeather(currentLocation)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 font-semibold text-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Overlay State */}
        {isLoading && !weatherData ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-sky-400/20 border-t-sky-400 animate-spin" />
              <Loader2 className="w-8 h-8 text-sky-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-slate-300">Fetching live atmospheric data for {currentLocation.name}...</p>
          </div>
        ) : weatherData ? (
          <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
            {/* Left Main Column (8 cols on lg) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Hero Weather Card */}
              <HeroWeatherCard
                location={weatherData.location}
                current={weatherData.current}
                todayDaily={weatherData.daily[0]}
                unit={unit}
                isFavorite={isCurrentFavorite}
                onToggleFavorite={handleToggleFavorite}
              />

              {/* 24-Hour Hourly Forecast Carousel */}
              <HourlyForecast hourly={weatherData.hourly} unit={unit} />

              {/* Detailed Atmospheric & Air Quality Grid */}
              <AtmosphereGrid
                current={weatherData.current}
                todayDaily={weatherData.daily[0]}
                airQuality={weatherData.airQuality}
                unit={unit}
              />
            </div>

            {/* Right Sidebar Column (4 cols on lg) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* 7-Day Forecast Card */}
              <DailyForecast daily={weatherData.daily} unit={unit} />

              {/* Smart Weather Recommendations & Insights */}
              <WeatherInsights
                temperatureCelsius={weatherData.current.temperature}
                precipitationProbability={weatherData.daily[0]?.precipitationProbabilityMax ?? 0}
                uvIndex={weatherData.current.uvIndex}
                aqiUs={weatherData.airQuality.aqiUs}
                windSpeed={weatherData.current.windSpeed}
              />

              {/* Geo Coordinates Card */}
              <CoordinatesCard location={weatherData.location} />
            </div>
          </main>
        ) : null}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
