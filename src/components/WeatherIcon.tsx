import React from 'react';
import {
  Sun,
  Moon,
  SunMedium,
  MoonStar,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Zap,
  LucideProps,
} from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  name: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6', ...props }) => {
  switch (name) {
    case 'Sun':
      return <Sun className={className} {...props} />;
    case 'Moon':
      return <Moon className={className} {...props} />;
    case 'SunMedium':
      return <SunMedium className={className} {...props} />;
    case 'MoonStar':
      return <MoonStar className={className} {...props} />;
    case 'CloudSun':
      return <CloudSun className={className} {...props} />;
    case 'CloudMoon':
      return <CloudMoon className={className} {...props} />;
    case 'Cloud':
      return <Cloud className={className} {...props} />;
    case 'CloudFog':
      return <CloudFog className={className} {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={className} {...props} />;
    case 'CloudRain':
      return <CloudRain className={className} {...props} />;
    case 'CloudRainWind':
      return <CloudRainWind className={className} {...props} />;
    case 'CloudSnow':
      return <CloudSnow className={className} {...props} />;
    case 'Snowflake':
      return <Snowflake className={className} {...props} />;
    case 'CloudLightning':
      return <CloudLightning className={className} {...props} />;
    case 'Zap':
      return <Zap className={className} {...props} />;
    default:
      return <Sun className={className} {...props} />;
  }
};
