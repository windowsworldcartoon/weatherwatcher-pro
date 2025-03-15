
import React from 'react';
import ForecastCard from '@/components/ui/forecast-card';
import { WeatherData } from '@/services/weather';

interface ForecastSectionProps {
  forecast: WeatherData['forecast'];
  formatDay: (periodName: string) => string;
}

const ForecastSection: React.FC<ForecastSectionProps> = ({ forecast, formatDay }) => {
  return (
    <section className="space-y-4 animate-slide-up">
      <h2 className="text-xl font-semibold">Forecast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {forecast.map((period) => (
          <ForecastCard
            key={period.number}
            day={formatDay(period.name)}
            temperature={period.temperature}
            temperatureUnit={period.temperatureUnit}
            condition={period.shortForecast}
            icon={period.icon}
          />
        ))}
      </div>
    </section>
  );
};

export default ForecastSection;
