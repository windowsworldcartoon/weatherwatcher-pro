
import React from 'react';
import { Card } from '@/components/ui/card';
import { Cloud, CloudRain, CloudSnow, CloudSun, Sun, Wind } from 'lucide-react';

interface ForecastCardProps {
  day: string;
  temperature: number;
  temperatureUnit: string;
  condition: string;
  icon: string;
  className?: string;
}

const ForecastCard: React.FC<ForecastCardProps> = ({
  day,
  temperature,
  temperatureUnit,
  condition,
  icon,
  className
}) => {
  const getWeatherIcon = () => {
    // Use Lucide icons based on condition
    if (condition.toLowerCase().includes('rain')) {
      return <CloudRain className="h-6 w-6 text-weather-blue" />;
    } else if (condition.toLowerCase().includes('snow')) {
      return <CloudSnow className="h-6 w-6 text-weather-blue" />;
    } else if (condition.toLowerCase().includes('cloud') && condition.toLowerCase().includes('sun')) {
      return <CloudSun className="h-6 w-6 text-weather-blue" />;
    } else if (condition.toLowerCase().includes('cloud')) {
      return <Cloud className="h-6 w-6 text-weather-blue" />;
    } else if (condition.toLowerCase().includes('wind')) {
      return <Wind className="h-6 w-6 text-weather-blue" />;
    } else {
      return <Sun className="h-6 w-6 text-weather-blue" />;
    }
  };

  return (
    <Card className={`glass-card p-4 text-center transition-all duration-300 hover:shadow-lg ${className}`}>
      <h4 className="text-sm font-medium mb-2">{day}</h4>
      <div className="flex justify-center mb-2">
        {getWeatherIcon()}
      </div>
      <div className="flex items-center justify-center space-x-1">
        <span className="text-xl font-semibold">{temperature}</span>
        <span className="text-sm">°{temperatureUnit}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1 truncate">{condition}</p>
    </Card>
  );
};

export default ForecastCard;
