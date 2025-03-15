
import React from 'react';
import WeatherCard from '@/components/ui/weather-card';
import { WeatherData } from '@/services/weather';

interface CurrentWeatherProps {
  currentConditions: WeatherData['currentConditions'];
  location: string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ currentConditions, location }) => {
  return (
    <section className="animate-blur-in">
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
