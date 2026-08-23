'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 pb-4 border-t border-white/10 text-xs text-slate-400">
      <p>
        <strong className="text-slate-200">WeatherSphere</strong> &bull; Professional Next.js Weather Web Application
      </p>
      <p>
        Data powered by{' '}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:underline font-semibold"
        >
          Open-Meteo API
        </a>{' '}
        (100% Free &amp; Open-Source)
      </p>
    </footer>
  );
};
