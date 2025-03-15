
import React from 'react';
import { Cloud } from 'lucide-react';

const WeatherLoading: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Cloud className="h-12 w-12 text-weather-blue animate-pulse mx-auto mb-4" />
      <p className="text-lg text-muted-foreground">Loading weather data...</p>
    </div>
  );
};

export default WeatherLoading;
