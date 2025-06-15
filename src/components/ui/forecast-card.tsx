

import React from 'react';
import { Card } from '@/components/ui/card';
// Remove all direct weather icon imports & use new prop

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
  weatherIcon?: JSX.Element; // <-- Now accept weatherIcon prop
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
  windSpeed,
  weatherIcon,
}) => {

  const getPrecipitationBadge = () => {
    if (precipitation === undefined) return null;
    let color = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (precipitation > 70) {
      color = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    } else if (precipitation > 40) {
      color = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    } else if (precipitation > 20) {
      color = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
    return (
      <div className="flex items-center mt-1">
        {weatherIcon}
        <span className={`ml-2 text-xs font-medium rounded-full px-2 py-0.5 ${color}`}>{precipitation}%</span>
      </div>
    );
  };

  return (
    <Card className={`glass-card p-4 text-center transition-all duration-300 hover:shadow-lg hover:scale-105 dark:bg-background/70 dark:border-background/60 ${className}`}>
      <h4 className="text-sm font-medium mb-2">{day}</h4>
      <div className="flex justify-center mb-2">
        {/* Show icon passed in from forecast section */}
        {weatherIcon}
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
            <span className="ml-1">{humidity}%</span>
          </div>
        )}
        {windSpeed && (
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <span className="ml-1">{windSpeed}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ForecastCard;
