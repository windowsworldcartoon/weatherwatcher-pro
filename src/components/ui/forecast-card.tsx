
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WiRain, WiThunderstorm, WiDaySunny, WiCloudy, WiSnow, WiDayCloudy, WiStrongWind, WiNightClear, WiNightCloudy, WiNightRain, WiHumidity, WiSmallCraftAdvisory } from 'weather-icons-react';

interface ForecastCardProps {
  day: string;
  temperature: number;
  temperatureUnit: string;
  condition: string;
  icon: string;
  className?: string;
  precipitation?: number;
  humidity?: number;
  windSpeed?: string;
}

const ForecastCard: React.FC<ForecastCardProps> = ({
  day,
  temperature,
  temperatureUnit,
  condition,
  icon,
  className,
  precipitation,
  humidity,
  windSpeed
}) => {
  const getWeatherIcon = () => {
    const iconSize = 32; // Increased icon size
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

  const getPrecipitationBadge = () => {
    if (precipitation === undefined) return null;
    
    let color = 'bg-blue-100 text-blue-800';
    if (precipitation > 70) {
      color = 'bg-red-100 text-red-800';
    } else if (precipitation > 40) {
      color = 'bg-yellow-100 text-yellow-800';
    } else if (precipitation > 20) {
      color = 'bg-green-100 text-green-800';
    }
    
    return (
      <div className="flex items-center mt-1">
        <WiRain size={16} className="text-blue-500 mr-1" />
        <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${color}`}>{precipitation}%</span>
      </div>
    );
  };

  return (
    <Card className={`glass-card p-4 text-center transition-all duration-300 hover:shadow-lg hover:scale-105 ${className}`}>
      <h4 className="text-sm font-medium mb-2">{day}</h4>
      <div className="flex justify-center mb-2">
        {getWeatherIcon()}
      </div>
      <div className="flex items-center justify-center space-x-1">
        <span className="text-xl font-semibold">{temperature}</span>
        <span className="text-sm">°{temperatureUnit}</span>
      </div>
      
      <p className="text-xs text-muted-foreground mt-1 truncate max-w-full" title={condition}>
        {condition}
      </p>
      
      <div className="mt-2 space-y-1">
        {getPrecipitationBadge()}
        
        {humidity && (
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <WiHumidity size={16} className="text-blue-500 mr-1" />
            <span>{humidity}%</span>
          </div>
        )}
        
        {windSpeed && (
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <WiSmallCraftAdvisory size={16} className="text-blue-500 mr-1" />
            <span>{windSpeed}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ForecastCard;
