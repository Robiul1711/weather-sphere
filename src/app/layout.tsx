import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WeatherSphere | Real-Time Global Live Forecast & Air Quality',
  description:
    'Experience high-precision live weather forecasts, 7-day outlooks, 24-hour hourly timelines, and air quality monitoring powered by Open-Meteo.',
  keywords: ['weather', 'forecast', 'radar', 'air quality', 'temperature', 'hourly forecast', 'next.js weather app'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${outfit.variable} dark`}>
      <body className="min-h-screen bg-[#090d16] font-sans antialiased text-slate-100 selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
