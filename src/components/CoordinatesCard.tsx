'use client';

import React from 'react';
import { Navigation } from 'lucide-react';
import { GeoLocation } from '@/types/weather';

interface CoordinatesCardProps {
  location: GeoLocation;
}

export const CoordinatesCard: React.FC<CoordinatesCardProps> = ({ location }) => {
  const latFormatted = `${Math.abs(location.latitude).toFixed(4)}° ${location.latitude >= 0 ? 'N' : 'S'}`;
  const lonFormatted = `${Math.abs(location.longitude).toFixed(4)}° ${location.longitude >= 0 ? 'E' : 'W'}`;

  return (
    <div className="glass-panel p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Navigation className="w-4 h-4 text-sky-400" />
        <span>Geo Coordinates &amp; Timezone</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Latitude</span>
          <span className="block text-xs font-bold text-white mt-0.5">{latFormatted}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Longitude</span>
          <span className="block text-xs font-bold text-white mt-0.5">{lonFormatted}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Elevation</span>
          <span className="block text-xs font-bold text-white mt-0.5">{location.elevation ?? 12} m</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Timezone</span>
          <span className="block text-xs font-bold text-white mt-0.5 truncate" title={location.timezone}>
            {location.timezone || 'Local'}
          </span>
        </div>
      </div>
    </div>
  );
};
