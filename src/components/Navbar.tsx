'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CloudSun, Search, Crosshair, X, MapPin, Loader2 } from 'lucide-react';
import { GeoLocation, TemperatureUnit } from '@/types/weather';
import { searchLocations } from '@/services/weatherApi';

interface NavbarProps {
  onSelectLocation: (loc: GeoLocation) => void;
  onLocateMe: () => void;
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  isLocating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectLocation,
  onLocateMe,
  unit,
  onToggleUnit,
  isLocating,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchLocations(query);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setIsSearching(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: GeoLocation) => {
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 py-2">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
            <CloudSun className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white font-display">
              Weather<span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Sphere</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Real-Time Global Forecast</p>
          </div>
        </div>

        {/* Mobile Locate & Unit Controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onLocateMe}
            disabled={isLocating}
            className="p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-sky-400 hover:bg-slate-700"
            title="Locate Me"
          >
            {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crosshair className="w-5 h-5" />}
          </button>
          <div className="flex p-1 bg-slate-900/80 border border-white/10 rounded-xl">
            <button
              onClick={() => onToggleUnit('celsius')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                unit === 'celsius' ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow' : 'text-slate-400'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => onToggleUnit('fahrenheit')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                unit === 'fahrenheit' ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow' : 'text-slate-400'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Search & Controls */}
      <div className="flex items-center gap-3 w-full md:w-auto md:flex-1 md:max-w-2xl justify-end">
        {/* Search Bar */}
        <div ref={searchRef} className="relative w-full md:max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city (e.g., Dhaka, London, Tokyo)..."
              className="w-full pl-11 pr-10 py-2.5 text-sm glass-input focus:ring-2 focus:ring-sky-400/40"
            />
            {isSearching ? (
              <Loader2 className="absolute right-3.5 w-4 h-4 text-sky-400 animate-spin" />
            ) : query.length > 0 ? (
              <button
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                }}
                className="absolute right-3.5 p-0.5 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          {/* Autocomplete Suggestions Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 py-1 bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl z-50 max-h-72 overflow-y-auto">
              {suggestions.map((item) => (
                <div
                  key={`${item.id}-${item.latitude}-${item.longitude}`}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-2.5 flex items-center justify-between hover:bg-sky-500/15 cursor-pointer transition-colors border-b border-white/5 last:border-none"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <span className="text-sm font-semibold text-white">{item.name}</span>
                      {item.admin1 && <span className="text-xs text-slate-400 ml-1.5 font-normal">({item.admin1})</span>}
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                    {item.country || 'Global'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Locate Me Desktop Button */}
        <button
          onClick={onLocateMe}
          disabled={isLocating}
          className="hidden md:flex items-center gap-2 px-4 py-2.5 glass-btn text-sm font-semibold text-white whitespace-nowrap"
          title="Detect Current Location"
        >
          {isLocating ? <Loader2 className="w-4 h-4 text-sky-400 animate-spin" /> : <Crosshair className="w-4 h-4 text-sky-400" />}
          <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
        </button>

        {/* Unit Switcher Desktop */}
        <div className="hidden md:flex p-1 bg-slate-900/80 border border-white/10 rounded-2xl">
          <button
            onClick={() => onToggleUnit('celsius')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              unit === 'celsius' ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => onToggleUnit('fahrenheit')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              unit === 'fahrenheit' ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
};
