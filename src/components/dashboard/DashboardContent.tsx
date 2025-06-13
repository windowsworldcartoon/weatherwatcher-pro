
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Thermometer, Wind, Droplets } from 'lucide-react';
import WeatherLoading from './WeatherLoading';

interface DashboardContentProps {
  userLocation: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ userLocation }) => {
  // Mock weather data for now - this would be replaced with real API calls
  const isLoading = false;
  const weatherData = {
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8,
    windDirection: 'NW'
  };

  if (isLoading) {
    return <WeatherLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Current Location */}
      <div className="flex items-center gap-2 text-lg">
        <MapPin className="h-5 w-5 text-blue-600" />
        <span className="font-medium">{userLocation}</span>
      </div>

      {/* Current Weather Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Current Weather
          </CardTitle>
          <CardDescription>Real-time conditions for your location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{weatherData.temperature}°F</div>
              <div className="text-sm text-muted-foreground">{weatherData.condition}</div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Wind: {weatherData.windSpeed} mph {weatherData.windDirection}</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Humidity: {weatherData.humidity}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for additional weather components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>7-Day Forecast</CardTitle>
            <CardDescription>Weather outlook for the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Forecast data will be displayed here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weather Alerts</CardTitle>
            <CardDescription>Important weather notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No active weather alerts
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
