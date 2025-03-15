
import React from 'react';
import { Card } from '@/components/ui/card';
import { Cloud, CloudRain, CloudSnow, CloudSun, Sun, Wind } from 'lucide-react';

interface WeatherCardProps {
  temperature: number;
  temperatureUnit: string;
  condition: string;
  icon: string;
  location: string;
  windSpeed: string;
  windDirection: string;
  className?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  temperatureUnit,
  condition,
  icon,
  location,
  windSpeed,
  windDirection,
  className
}) => {
  const getWeatherIcon = () => {
    // Use Lucide icons based on condition
    if (condition.toLowerCase().includes('rain')) {
      return <CloudRain className="h-12 w-12 text-weather-blue" />;
    } else if (condition.toLowerCase().includes('snow')) {
      return <CloudSnow className="h-12 w-12 text-weather-blue" />;
    } else if (condition.toLowerCase().includes('cloud') && condition.toLowerCase().includes('sun')) {
      return <CloudSun className="h-12 w-12 text-weather-blue" />;
    } else if (condition.toLowerCase().includes('cloud')) {
      return <Cloud className="h-12 w-12 text-weather-blue" />;
    } else if (condition.toLowerCase().includes('wind')) {
      return <Wind className="h-12 w-12 text-weather-blue" />;
    } else {
      return <Sun className="h-12 w-12 text-weather-blue" />;
    }
  };

  return (
    <Card className={`glass-card p-6 overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-muted-foreground">{location}</h3>
          <div className="flex items-end space-x-1">
            <span className="text-4xl font-bold">{temperature}</span>
            <span className="text-2xl mb-1">°{temperatureUnit}</span>
          </div>
          <p className="text-sm text-muted-foreground">{condition}</p>
          <p className="text-xs text-muted-foreground">
            Wind: {windSpeed} {windDirection}
          </p>
        </div>
        <div className="relative">
          {getWeatherIcon()}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-weather-light rounded-full opacity-20 blur-xl"></div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherCard;
