export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string; // State or division
  timezone?: string;
  elevation?: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  isDay: boolean;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  relativeHumidity: number;
  surfacePressure: number;
  precipitation: number;
  uvIndex: number;
  visibility: number;
  dewPoint: number;
  time: string;
}

export interface HourlyForecastItem {
  time: string;
  timestamp: number;
  formattedTime: string;
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  isDay: boolean;
  precipitationProbability: number;
  windSpeed: number;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  formattedDate: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  precipitationProbabilityMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  windSpeedMax: number;
}

export interface AirQualityData {
  aqiUs: number;
  pm2_5: number;
  pm10: number;
  ozone: number;
  nitrogenDioxide: number;
  sulphurDioxide: number;
  carbonMonoxide: number;
}

export interface CompleteWeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality: AirQualityData;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface WeatherConditionInfo {
  label: string;
  description: string;
  icon: string;
  theme: 'clear-day' | 'clear-night' | 'cloudy' | 'rainy' | 'thunderstorm' | 'snowy' | 'foggy';
}
