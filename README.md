# 🌦️ WeatherSphere - Professional Next.js Weather & Air Quality Web App

A state-of-the-art, responsive Weather web application built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Lucide React**, powered by the 100% free **Open-Meteo API** (No API Key Required).

---

## 🌟 Key Highlights & Features

- **100% Free Open-Meteo Integration**: Real-time atmospheric metrics, 24-hour hourly timeline, 7-day daily forecasts, and live US Air Quality Index (AQI with PM2.5).
- **Dynamic Atmospheric Adaptive Theme**: Background ambient lights and colors automatically sync with weather conditions (Sunny, Clear Night, Rainy, Thunderstorm, Cloudy, Snowy, Foggy).
- **Search Autocomplete**: Instant city/division/country suggestions worldwide with debounced API queries.
- **1-Click GPS Location**: Fast Geolocation API integration to detect current location.
- **Unit Conversion**: Seamless instant toggle between Celsius (°C) and Fahrenheit (°F) as well as km/h and mph.
- **Favorite Locations**: Save and bookmark your favorite cities with persistence in `localStorage`.
- **Smart Weather Insights**: Dynamic recommendations for Umbrella need, clothing guide, and outdoor fitness suitability.
- **Glassmorphism UI**: High-end translucent frosted-glass surfaces, glowing ambient accents, smooth transitions, and modern Google Fonts (`Plus Jakarta Sans` & `Outfit`).

---

## 🚀 Quick Start & How to Run

Navigate to the project folder and run the development server:

```bash
cd "C:\Users\robiu\.gemini\antigravity-ide\scratch\weather-sphere"
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Architecture

```
weather-sphere/
├── src/
│   ├── app/
│   │   ├── globals.css          # Glassmorphism design tokens & atmospheric themes
│   │   ├── layout.tsx           # Google Fonts & SEO Metadata
│   │   └── page.tsx             # Main reactive weather dashboard
│   ├── components/
│   │   ├── AtmosphereGrid.tsx   # AQI, UV, Wind Compass, Sun Schedule, Visibility
│   │   ├── CoordinatesCard.tsx  # Lat, Lon, Elevation, Timezone
│   │   ├── DailyForecast.tsx    # 7-day forecast with min/max visual bars
│   │   ├── DynamicBackground.tsx# Dynamic floating glow orbs & particles
│   │   ├── Footer.tsx           # Modern footer & credits
│   │   ├── HeroWeatherCard.tsx  # Main temperature hero card & 4 highlights
│   │   ├── HourlyForecast.tsx   # 24-hour carousel with time, weather & rain %
│   │   ├── Navbar.tsx           # Search bar, GPS locate button, unit toggle
│   │   ├── QuickChips.tsx       # Quick popular cities & saved favorites
│   │   ├── WeatherIcon.tsx      # Dynamic weather icon mapper
│   │   └── WeatherInsights.tsx  # Contextual smart recommendations
│   ├── services/
│   │   └── weatherApi.ts        # Open-Meteo Geocoding, Forecast, & AQI client
│   ├── types/
│   │   └── weather.ts           # Clean TypeScript definitions
│   └── utils/
│       └── weatherUtils.ts      # WMO weather code mapper, converters, AQI & UV scales
├── public/
├── package.json
└── tsconfig.json
```
# weather-sphere
