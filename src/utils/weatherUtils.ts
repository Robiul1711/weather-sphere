import { WeatherConditionInfo, TemperatureUnit } from '@/types/weather';

/**
 * Maps WMO Weather codes to readable descriptions, icons, and theme classes
 * Reference: https://open-meteo.com/en/docs
 */
export function getWeatherCondition(code: number, isDay: boolean = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Starry Night',
        description: isDay ? 'Bright and sunny skies' : 'Clear night skies',
        icon: isDay ? 'Sun' : 'Moon',
        theme: isDay ? 'clear-day' : 'clear-night',
      };
    case 1:
      return {
        label: isDay ? 'Mainly Clear' : 'Mostly Clear',
        description: 'Scattered fair weather clouds',
        icon: isDay ? 'SunMedium' : 'MoonStar',
        theme: isDay ? 'clear-day' : 'clear-night',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Passing clouds with sunny intervals',
        icon: isDay ? 'CloudSun' : 'CloudMoon',
        theme: 'cloudy',
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Thick continuous cloud cover',
        icon: 'Cloud',
        theme: 'cloudy',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy / Mist',
        description: 'Dense fog with reduced visibility',
        icon: 'CloudFog',
        theme: 'foggy',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        description: 'Light patchy drizzle showers',
        icon: 'CloudDrizzle',
        theme: 'rainy',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Chilly freezing drizzle',
        icon: 'CloudSnow',
        theme: 'snowy',
      };
    case 61:
      return {
        label: 'Slight Rain',
        description: 'Gentle light rainfall',
        icon: 'CloudRain',
        theme: 'rainy',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        description: 'Steady consistent rain',
        icon: 'CloudRain',
        theme: 'rainy',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        description: 'Heavy downpour and wet conditions',
        icon: 'CloudRainWind',
        theme: 'rainy',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Icy precipitation',
        icon: 'CloudSnow',
        theme: 'snowy',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: 'Snowfall',
        description: 'Snow flurries accumulating',
        icon: 'Snowflake',
        theme: 'snowy',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        description: 'Intermittent heavy rain showers',
        icon: 'CloudRain',
        theme: 'rainy',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Heavy snow shower bursts',
        icon: 'CloudSnow',
        theme: 'snowy',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Lightning, thunder, and rain',
        icon: 'CloudLightning',
        theme: 'thunderstorm',
      };
    case 96:
    case 99:
      return {
        label: 'Severe Thunderstorm',
        description: 'Thunderstorm with heavy hail',
        icon: 'Zap',
        theme: 'thunderstorm',
      };
    default:
      return {
        label: 'Clear',
        description: 'Normal weather conditions',
        icon: isDay ? 'Sun' : 'Moon',
        theme: isDay ? 'clear-day' : 'clear-night',
      };
  }
}

/**
 * Format temperature according to selected unit
 */
export function formatTemp(celsiusValue: number, unit: TemperatureUnit = 'celsius'): string {
  if (unit === 'fahrenheit') {
    const f = Math.round((celsiusValue * 9) / 5 + 32);
    return `${f}°`;
  }
  return `${Math.round(celsiusValue)}°`;
}

export function formatTempNumber(celsiusValue: number, unit: TemperatureUnit = 'celsius'): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsiusValue * 9) / 5 + 32);
  }
  return Math.round(celsiusValue);
}

/**
 * Convert wind speed
 */
export function formatWindSpeed(kmh: number, unit: TemperatureUnit = 'celsius'): string {
  if (unit === 'fahrenheit') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

/**
 * Convert wind degrees to cardinal direction
 */
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Air Quality Index interpretation
 */
export function getAQIInfo(aqi: number) {
  if (aqi <= 50) {
    return {
      status: 'Good',
      color: '#4ade80',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Air quality is satisfactory and poses little or no risk.',
    };
  } else if (aqi <= 100) {
    return {
      status: 'Moderate',
      color: '#facc15',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      description: 'Air quality is acceptable for most, sensitive groups take care.',
    };
  } else if (aqi <= 150) {
    return {
      status: 'Sensitive Warning',
      color: '#fb923c',
      badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      description: 'Members of sensitive groups may experience health effects.',
    };
  } else if (aqi <= 200) {
    return {
      status: 'Unhealthy',
      color: '#f87171',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      description: 'Everyone may begin to experience health effects.',
    };
  } else {
    return {
      status: 'Hazardous',
      color: '#c084fc',
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      description: 'Health alert: serious risk for the entire population.',
    };
  }
}

/**
 * UV Index interpretation
 */
export function getUVInfo(uv: number) {
  if (uv <= 2) {
    return { status: 'Low', advice: 'No protection needed. Safe outdoors.' };
  } else if (uv <= 5) {
    return { status: 'Moderate', advice: 'Wear sunglasses & sunscreen on sunny days.' };
  } else if (uv <= 7) {
    return { status: 'High', advice: 'Cover up, wear a hat and apply SPF 30+.' };
  } else if (uv <= 10) {
    return { status: 'Very High', advice: 'Extra protection needed. Avoid midday sun.' };
  } else {
    return { status: 'Extreme', advice: 'Take all precautions. Stay indoors if possible.' };
  }
}

/**
 * Calculate Daylight duration
 */
export function calculateDaylight(sunriseStr: string, sunsetStr: string): string {
  try {
    const rise = new Date(sunriseStr);
    const set = new Date(sunsetStr);
    const diffMs = set.getTime() - rise.getTime();
    if (isNaN(diffMs) || diffMs <= 0) return '12h 00m';
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  } catch {
    return '12h 00m';
  }
}

/**
 * Generate Smart Weather Insights & Recommendations
 */
export function generateInsights(tempCelsius: number, rainProb: number, uv: number, aqi: number, windSpeed: number) {
  // Umbrella advice
  let umbrellaTitle = 'No Umbrella Needed';
  let umbrellaDesc = 'Low chance of rain today. Great weather for outdoor activities!';
  if (rainProb >= 60) {
    umbrellaTitle = 'Umbrella Essential!';
    umbrellaDesc = `High chance of rain (${rainProb}%). Keep an umbrella or raincoat handy.`;
  } else if (rainProb >= 30) {
    umbrellaTitle = 'Umbrella Recommended';
    umbrellaDesc = `Moderate chance of scattered showers (${rainProb}%). Good to carry an umbrella.`;
  }

  // Clothing advice
  let clothingTitle = 'Light & Breathable';
  let clothingDesc = 'Light cotton clothes are ideal for today.';
  if (tempCelsius >= 32) {
    clothingTitle = 'Stay Cool & Hydrated';
    clothingDesc = 'High heat. Wear loose, light-colored clothing and drink plenty of water.';
  } else if (tempCelsius <= 15 && tempCelsius > 8) {
    clothingTitle = 'Light Jacket / Sweater';
    clothingDesc = 'Chilly breeze outdoors. A light jacket or warm layers will keep you cozy.';
  } else if (tempCelsius <= 8) {
    clothingTitle = 'Heavy Winter Gear';
    clothingDesc = 'Freezing temperatures. Wear a warm thermal jacket, gloves, and a beanie.';
  }

  // Outdoor activity advice
  let activityTitle = 'Great for Outdoor Fitness';
  let activityDesc = 'Favorable temperature and atmospheric conditions for running or walks.';
  if (aqi > 150) {
    activityTitle = 'Limit Outdoor Strenuous Work';
    activityDesc = 'Elevated air pollution levels. Prefer indoor workouts or wear a protective mask.';
  } else if (tempCelsius >= 35 || rainProb >= 70 || windSpeed > 40) {
    activityTitle = 'Indoor Activities Recommended';
    activityDesc = 'Weather conditions are harsh for extended outdoor workouts.';
  }

  return {
    umbrella: { title: umbrellaTitle, desc: umbrellaDesc },
    clothing: { title: clothingTitle, desc: clothingDesc },
    activity: { title: activityTitle, desc: activityDesc },
  };
}
