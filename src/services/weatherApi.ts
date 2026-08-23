import { CompleteWeatherData, GeoLocation, HourlyForecastItem, DailyForecastItem, AirQualityData } from '@/types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';


/**
 * Search global locations via Open-Meteo Geocoding API
 */
export async function searchLocations(query: string): Promise<GeoLocation[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `${GEOCODING_API}?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding API error');
    const data = await res.json();

    if (!data.results) return [];

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      country_code: item.country_code || '',
      admin1: item.admin1 || '',
      timezone: item.timezone || 'auto',
      elevation: item.elevation || 0,
    }));
  } catch (err) {
    console.error('Error searching locations:', err);
    return [];
  }
}

/**
 * Reverse geocode or fetch location details from coordinates
 */
export async function getLocationFromCoords(latitude: number, longitude: number): Promise<GeoLocation> {
  try {
    // Open-Meteo reverse geocoding via bigdatacloud free or Open-Meteo fallback
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      return {
        id: Math.floor(Math.random() * 100000),
        name: data.city || data.locality || data.principalSubdivision || 'Current Location',
        latitude,
        longitude,
        country: data.countryName || '',
        country_code: data.countryCode || '',
        admin1: data.principalSubdivision || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        elevation: 10,
      };
    }
  } catch (e) {
    console.warn('Reverse geocode failed, using coordinates name:', e);
  }

  return {
    id: Date.now(),
    name: 'Current Location',
    latitude,
    longitude,
    country: '',
    country_code: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    elevation: 0,
  };
}

/**
 * Fetch full weather data from Open-Meteo APIs
 */
export async function getWeatherData(location: GeoLocation): Promise<CompleteWeatherData> {
  const { latitude, longitude } = location;

  const weatherUrl = `${FORECAST_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,weather_code,surface_pressure,visibility,wind_speed_10m,is_day,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

  const airQualityUrl = `${AIR_QUALITY_API}?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;

  const [weatherRes, airRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(airQualityUrl).catch(() => null),
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Weather service response error: ${weatherRes.status}`);
  }

  const weatherData = await weatherRes.json();
  let airQualityData: AirQualityData = {
    aqiUs: 38,
    pm2_5: 9.2,
    pm10: 18.4,
    ozone: 42,
    nitrogenDioxide: 12,
    sulphurDioxide: 4,
    carbonMonoxide: 220,
  };

  if (airRes && airRes.ok) {
    try {
      const airJson = await airRes.json();
      if (airJson.current) {
        airQualityData = {
          aqiUs: Math.round(airJson.current.us_aqi ?? 38),
          pm2_5: Number((airJson.current.pm2_5 ?? 9.2).toFixed(1)),
          pm10: Number((airJson.current.pm10 ?? 18.4).toFixed(1)),
          ozone: Math.round(airJson.current.ozone ?? 42),
          nitrogenDioxide: Math.round(airJson.current.nitrogen_dioxide ?? 12),
          sulphurDioxide: Math.round(airJson.current.sulphur_dioxide ?? 4),
          carbonMonoxide: Math.round(airJson.current.carbon_monoxide ?? 220),
        };
      }
    } catch (e) {
      console.warn('Air quality data parsing warning:', e);
    }
  }

  // Parse Current Weather
  const cur = weatherData.current;
  const hourlyRaw = weatherData.hourly;
  const dailyRaw = weatherData.daily;

  // Find index of current hour in hourly forecast using location's local current time string
  const currentHourPrefix = (cur?.time || '').slice(0, 13);
  let startHourIdx = 0;

  if (hourlyRaw && hourlyRaw.time && currentHourPrefix) {
    const foundIdx = hourlyRaw.time.findIndex((t: string) => t.startsWith(currentHourPrefix));
    if (foundIdx !== -1) {
      startHourIdx = foundIdx;
    }
  }

  // Get current UV index, visibility, and dew point from hourly array at current index
  const currentUv = hourlyRaw?.uv_index ? hourlyRaw.uv_index[startHourIdx] ?? 4 : 4;
  const currentVisibilityKm = hourlyRaw?.visibility ? Math.round((hourlyRaw.visibility[startHourIdx] ?? 10000) / 1000) : 10;
  const currentDewPoint = hourlyRaw?.dew_point_2m ? Math.round(hourlyRaw.dew_point_2m[startHourIdx] ?? 18) : 18;

  const current = {
    temperature: cur.temperature_2m,
    apparentTemperature: cur.apparent_temperature,
    weatherCode: cur.weather_code,
    isDay: cur.is_day === 1,
    windSpeed: cur.wind_speed_10m,
    windDirection: cur.wind_direction_10m,
    windGusts: cur.wind_gusts_10m || cur.wind_speed_10m * 1.3,
    relativeHumidity: cur.relative_humidity_2m,
    surfacePressure: Math.round(cur.surface_pressure),
    precipitation: cur.precipitation,
    uvIndex: currentUv,
    visibility: currentVisibilityKm,
    dewPoint: currentDewPoint,
    time: cur.time,
  };

  // Next 24 Hours
  const hourly: HourlyForecastItem[] = [];
  if (hourlyRaw && hourlyRaw.time) {
    for (let i = startHourIdx; i < Math.min(startHourIdx + 24, hourlyRaw.time.length); i++) {
      const timeStr = hourlyRaw.time[i];
      const d = new Date(timeStr);
      const isNow = i === startHourIdx;
      const formattedTime = isNow ? 'Now' : d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

      hourly.push({
        time: timeStr,
        timestamp: d.getTime(),
        formattedTime,
        temperature: isNow ? cur.temperature_2m : hourlyRaw.temperature_2m[i],
        apparentTemperature: isNow ? cur.apparent_temperature : hourlyRaw.apparent_temperature[i],
        weatherCode: isNow ? cur.weather_code : hourlyRaw.weather_code[i],
        isDay: isNow ? cur.is_day === 1 : (hourlyRaw.is_day ? hourlyRaw.is_day[i] === 1 : true),
        precipitationProbability: hourlyRaw.precipitation_probability ? hourlyRaw.precipitation_probability[i] ?? 0 : 0,
        windSpeed: isNow ? cur.wind_speed_10m : (hourlyRaw.wind_speed_10m ? hourlyRaw.wind_speed_10m[i] : 0),
      });
    }
  }

  // Next 7 Days
  const daily: DailyForecastItem[] = [];
  if (dailyRaw && dailyRaw.time) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < Math.min(7, dailyRaw.time.length); i++) {
      const dateStr = dailyRaw.time[i];
      const d = new Date(dateStr);
      const dayName = i === 0 ? 'Today' : days[d.getDay()];
      const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Format sunrise / sunset to 12h time
      const sunriseTime = dailyRaw.sunrise && dailyRaw.sunrise[i] 
        ? new Date(dailyRaw.sunrise[i]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) 
        : '6:00 AM';
      const sunsetTime = dailyRaw.sunset && dailyRaw.sunset[i] 
        ? new Date(dailyRaw.sunset[i]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) 
        : '6:30 PM';

      daily.push({
        date: dateStr,
        dayName,
        formattedDate,
        weatherCode: dailyRaw.weather_code[i],
        tempMax: dailyRaw.temperature_2m_max[i],
        tempMin: dailyRaw.temperature_2m_min[i],
        apparentTempMax: dailyRaw.apparent_temperature_max[i],
        apparentTempMin: dailyRaw.apparent_temperature_min[i],
        precipitationProbabilityMax: dailyRaw.precipitation_probability_max ? dailyRaw.precipitation_probability_max[i] ?? 0 : 0,
        uvIndexMax: dailyRaw.uv_index_max ? dailyRaw.uv_index_max[i] ?? 5 : 5,
        sunrise: sunriseTime,
        sunset: sunsetTime,
        windSpeedMax: dailyRaw.wind_speed_10m_max ? dailyRaw.wind_speed_10m_max[i] : 10,
      });
    }
  }

  return {
    location: {
      ...location,
      elevation: weatherData.elevation ?? location.elevation ?? 0,
      timezone: weatherData.timezone || location.timezone || 'UTC',
    },
    current,
    hourly,
    daily,
    airQuality: airQualityData,
  };
}
