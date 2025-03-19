
import React from 'react';
import { Card } from '@/components/ui/card';
import { Cloud, CloudRain, CloudSnow, CloudSun, Sun, Wind } from 'lucide-react';
import { WiRain, WiThunderstorm, WiDaySunny, WiCloudy, WiSnow, WiDayCloudy, WiStrongWind } from 'weather-icons-react';

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
    const iconSize = 42;
    const iconColor = "#0EA5E9"; // weather-blue from tailwind config
    
    // Check for rain and thunderstorms first
    if (condition.toLowerCase().includes('thunderstorm')) {
      return <WiThunderstorm size={iconSize} color={iconColor} />;
    } else if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('shower')) {
      return <WiRain size={iconSize} color={iconColor} />;
    } 
    
    // Then check other conditions
    else if (condition.toLowerCase().includes('snow')) {
      return <WiSnow size={iconSize} color={iconColor} />;
    } else if (condition.toLowerCase().includes('cloud') && condition.toLowerCase().includes('sun')) {
      return <WiDayCloudy size={iconSize} color={iconColor} />;
    } else if (condition.toLowerCase().includes('cloud')) {
      return <WiCloudy size={iconSize} color={iconColor} />;
    } else if (condition.toLowerCase().includes('wind')) {
      return <WiStrongWind size={iconSize} color={iconColor} />;
    } else {
      return <WiDaySunny size={iconSize} color={iconColor} />;
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
