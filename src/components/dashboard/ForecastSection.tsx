
import React from 'react';
import ForecastCard from '@/components/ui/forecast-card';
import { WeatherData } from '@/services/weather';

// Helper to extract % chance of precipitation from text
function extractPrecipitation(str: string): number | undefined {
  const match = str.match(/(\d{1,3})%/);
  if (match && Number(match[1]) >= 0 && Number(match[1]) <= 100) {
    return Number(match[1]);
  }
  return undefined;
}
// Optionally extract humidity (not usually present in forecast endpoint, but add fallback)
function extractHumidity(str: string): number | undefined {
  const match = str.match(/humidity\s+(\d{1,3})%/i);
  if (match && Number(match[1]) >= 0 && Number(match[1]) <= 100) {
    return Number(match[1]);
  }
  return undefined;
}

interface ForecastSectionProps {
  forecast: WeatherData['forecast'];
  formatDay: (periodName: string) => string;
}

const ForecastSection: React.FC<ForecastSectionProps> = ({ forecast, formatDay }) => {
  return (
    <section className="space-y-4 animate-slide-up">
      <h2 className="text-xl font-semibold">Forecast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {forecast.map((period) => {
          const precipitation = extractPrecipitation(period.detailedForecast || period.shortForecast);
          const humidity = extractHumidity(period.detailedForecast || period.shortForecast);
          const windSpeed = period.windSpeed ? period.windSpeed : undefined;
          return (
            <ForecastCard
              key={period.number}
              day={formatDay(period.name)}
              temperature={period.temperature}
              temperatureUnit={period.temperatureUnit}
              condition={period.shortForecast}
              icon={period.icon}
              precipitation={precipitation}
              humidity={humidity}
              windSpeed={windSpeed}
            />
          )
        })}
      </div>
    </section>
  );
};

export default ForecastSection;

