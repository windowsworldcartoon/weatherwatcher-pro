
import React from 'react';
import { Card } from '@/components/ui/card';
import { WiRain, WiThunderstorm, WiDaySunny, WiCloudy, WiSnow, WiDayCloudy, WiStrongWind, WiNightClear, WiNightCloudy, WiNightRain } from 'weather-icons-react';

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
    const iconSize = 24;
    const iconColor = "#0EA5E9"; // weather-blue from tailwind config
    
    // Check if it's night time first
    if (day.toLowerCase() === 'tonight') {
      if (condition.toLowerCase().includes('thunderstorm')) {
        return <WiThunderstorm size={iconSize} color={iconColor} />;
      } else if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('shower')) {
        return <WiNightRain size={iconSize} color={iconColor} />;
      } else if (condition.toLowerCase().includes('cloud')) {
        return <WiNightCloudy size={iconSize} color={iconColor} />;
      } else {
        return <WiNightClear size={iconSize} color={iconColor} />;
      }
    }
    
    // For daytime conditions
    if (condition.toLowerCase().includes('thunderstorm')) {
      return <WiThunderstorm size={iconSize} color={iconColor} />;
    } else if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('shower')) {
      return <WiRain size={iconSize} color={iconColor} />;
    } else if (condition.toLowerCase().includes('snow')) {
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
