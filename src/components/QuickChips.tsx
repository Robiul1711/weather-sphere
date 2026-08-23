'use client';

import React from 'react';
import { MapPin, Bookmark } from 'lucide-react';
import { GeoLocation } from '@/types/weather';

interface QuickChipsProps {
  currentLocation: GeoLocation;
  onSelectCity: (loc: GeoLocation) => void;
  favorites: GeoLocation[];
}

const DEFAULT_POPULAR_CITIES: GeoLocation[] = [
  { id: 1185241, name: 'Dhaka', latitude: 23.8103, longitude: 90.4125, country: 'Bangladesh', country_code: 'BD' },
  { id: 1200860, name: 'Chattogram', latitude: 22.3569, longitude: 91.7832, country: 'Bangladesh', country_code: 'BD' },
  { id: 1185095, name: 'Sylhet', latitude: 24.8949, longitude: 91.8687, country: 'Bangladesh', country_code: 'BD' },
  { id: 2643743, name: 'London', latitude: 51.5085, longitude: -0.1257, country: 'United Kingdom', country_code: 'GB' },
  { id: 5128581, name: 'New York', latitude: 40.7143, longitude: -74.006, country: 'United States', country_code: 'US' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6895, longitude: 139.6917, country: 'Japan', country_code: 'JP' },
  { id: 292223, name: 'Dubai', latitude: 25.0772, longitude: 55.3093, country: 'United Arab Emirates', country_code: 'AE' },
];

export const QuickChips: React.FC<QuickChipsProps> = ({
  currentLocation,
  onSelectCity,
  favorites,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 shrink-0 mr-1">
        <MapPin className="w-3.5 h-3.5 text-sky-400" />
        <span>Quick / Saved:</span>
      </div>

      {/* Favorites if any */}
      {favorites.map((city) => {
        const isActive = city.latitude === currentLocation.latitude && city.longitude === currentLocation.longitude;
        return (
          <button
            key={`fav-${city.id}-${city.name}`}
            onClick={() => onSelectCity(city)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all ${
              isActive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-amber-400/40'
            }`}
          >
            <Bookmark className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{city.name}</span>
          </button>
        );
      })}

      {/* Popular predefined cities */}
      {DEFAULT_POPULAR_CITIES.map((city) => {
        const isActive = city.latitude === currentLocation.latitude && city.longitude === currentLocation.longitude;
        return (
          <button
            key={`pop-${city.id}-${city.name}`}
            onClick={() => onSelectCity(city)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 flex items-center gap-1 transition-all ${
              isActive
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-sky-400/40'
            }`}
          >
            <span>{city.name}</span>
          </button>
        );
      })}
    </div>
  );
};
