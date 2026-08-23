'use client';

import React, { useEffect } from 'react';

interface DynamicBackgroundProps {
  theme: string;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ theme }) => {
  useEffect(() => {
    // Sync theme class to body
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-all duration-700">
      {/* Ambient glowing orbs */}
      <div
        className="animate-orb-1 absolute -top-[10%] -right-[5%] w-[550px] h-[550px] rounded-full blur-[130px] opacity-35"
        style={{ background: 'var(--orb-1)' }}
      />
      <div
        className="animate-orb-2 absolute bottom-[5%] -left-[10%] w-[480px] h-[480px] rounded-full blur-[130px] opacity-30"
        style={{ background: 'var(--orb-2)' }}
      />
      <div
        className="animate-orb-3 absolute top-[40%] right-[25%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-25"
        style={{ background: 'var(--orb-3)' }}
      />

      {/* Weather particles overlay (Rain/Snow subtle ambiance) */}
      {theme === 'rainy' && (
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
      )}
      {theme === 'snowy' && (
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:28px_28px]" />
      )}
    </div>
  );
};
