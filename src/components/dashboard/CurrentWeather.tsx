
import React, { useEffect, useState } from 'react';
import WeatherCard from '@/components/ui/weather-card';
import { WeatherData } from '@/services/weather';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface CurrentWeatherProps {
  currentConditions: WeatherData['currentConditions'];
  location: string;
  onReload: () => void;
  lastFetch: Date;
}

function getLocalTime(date: Date, offsetMinutes: number) {
  // Returns HH:MM AM/PM using the user's device timezone
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  currentConditions,
  location,
  onReload,
  lastFetch,
}) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000 * 15); // update every 15 sec
    return () => clearInterval(interval);
  }, []);

  // We'll display a refresh warning if the time differs by at least 2 minutes
  const needsRefresh = Math.abs(now.getTime() - lastFetch.getTime()) > 1000 * 60 * 2;

  return (
    <section className="animate-blur-in space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-semibold">{location}</h2>
          <div className="flex items-baseline text-muted-foreground space-x-2">
            <span>
              Current time:&nbsp;
              <span className="font-mono">
                {getLocalTime(now, 0)}
              </span>
            </span>
            {needsRefresh && (
              <span className="text-xs text-red-500 animate-pulse ml-2">Out of date</span>
            )}
          </div>
        </div>
        <Button
          variant={needsRefresh ? 'destructive' : 'ghost'}
          size="sm"
          onClick={onReload}
          title="Reload weather"
          aria-label="Reload weather"
        >
          <RefreshCcw className={`mr-1 ${needsRefresh ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <WeatherCard
        temperature={currentConditions.temperature}
        temperatureUnit={currentConditions.temperatureUnit}
        condition={currentConditions.shortForecast}
        icon={currentConditions.icon}
        location={location}
        windSpeed={currentConditions.windSpeed}
        windDirection={currentConditions.windDirection}
        className="w-full"
      />
    </section>
  );
};

export default CurrentWeather;
