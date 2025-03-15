
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import WeatherCard from '@/components/ui/weather-card';
import ForecastCard from '@/components/ui/forecast-card';
import LocationSearch from '@/components/ui/location-search';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { weatherService, WeatherData } from '@/services/weather';
import { AlertTriangle, Cloud, LogOut, Sun, User } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, isAuthenticated, logout, updateUserLocation } = useAuth();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // If user has a saved location, fetch weather for it
    if (user?.location) {
      fetchWeatherForSavedLocation();
    }
  }, [isAuthenticated, navigate, user]);

  const fetchWeatherForSavedLocation = async () => {
    if (!user?.location) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const geoData = await weatherService.geocodeLocation(user.location);
      await fetchWeatherData(geoData.lat, geoData.lon);
    } catch (error) {
      console.error('Error fetching weather for saved location:', error);
      setError('Failed to load weather data for your saved location. Please try searching for a new location.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = async ({ lat, lon, name }: { lat: number; lon: number; name: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update user's saved location
      updateUserLocation(name);
      
      // Fetch weather data for the selected location
      await fetchWeatherData(lat, lon);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to load weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const data = await weatherService.getWeatherData(lat, lon);
      setWeatherData(data);
      
      // Check for severe weather alerts
      if (data.alerts && data.alerts.length > 0) {
        // Only notify for severe or extreme alerts
        const severeAlerts = data.alerts.filter(
          alert => alert.severity === 'Severe' || alert.severity === 'Extreme'
        );
        
        if (severeAlerts.length > 0) {
          severeAlerts.forEach(alert => {
            toast.warning(`Weather Alert: ${alert.headline}`, {
              description: alert.description.substring(0, 100) + '...',
              duration: 10000,
            });
          });
        }
      }
    } catch (error) {
      console.error('Error in fetchWeatherData:', error);
      throw error;
    }
  };

  // Format the day name (e.g., "Today", "Tonight", or day of week)
  const formatDay = (periodName: string) => {
    return periodName;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-weather-light animate-fade-in">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center border-b">
        <div className="flex items-center space-x-2">
          <Sun className="h-6 w-6 text-weather-blue" />
          <span className="font-bold text-xl">WindowsWorld Weather</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 container py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Location Search */}
          <section className="animate-slide-down">
            <h1 className="text-3xl font-bold mb-4">Your Weather Dashboard</h1>
            <LocationSearch onLocationSelect={handleLocationSelect} />
          </section>

          {isLoading && (
            <div className="text-center py-12">
              <Cloud className="h-12 w-12 text-weather-blue animate-pulse mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Loading weather data...</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && weatherData && (
            <>
              {/* Current Weather */}
              <section className="animate-blur-in">
                <WeatherCard
                  temperature={weatherData.currentConditions.temperature}
                  temperatureUnit={weatherData.currentConditions.temperatureUnit}
                  condition={weatherData.currentConditions.shortForecast}
                  icon={weatherData.currentConditions.icon}
                  location={weatherData.location}
                  windSpeed={weatherData.currentConditions.windSpeed}
                  windDirection={weatherData.currentConditions.windDirection}
                  className="w-full"
                />
              </section>

              {/* Weather Alerts */}
              {weatherData.alerts && weatherData.alerts.length > 0 && (
                <section className="space-y-4 animate-slide-up">
                  <h2 className="text-xl font-semibold">Weather Alerts</h2>
                  {weatherData.alerts.map((alert) => (
                    <Alert key={alert.id} variant={alert.severity === "Extreme" ? "destructive" : "default"}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>{alert.event}</AlertTitle>
                      <AlertDescription className="mt-2">
                        {alert.headline}
                        <p className="text-sm mt-2">{alert.description.substring(0, 200)}...</p>
                        <div className="text-xs mt-2">
                          <span className="font-medium">Severity:</span> {alert.severity} • 
                          <span className="font-medium"> Urgency:</span> {alert.urgency}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </section>
              )}

              {/* Forecast */}
              <section className="space-y-4 animate-slide-up">
                <h2 className="text-xl font-semibold">Forecast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {weatherData.forecast.map((period) => (
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

              {/* Detailed Information */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
                <Card className="glass-card p-6">
                  <h2 className="text-xl font-semibold mb-4">Detailed Forecast</h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      {weatherData.currentConditions.detailedForecast}
                    </p>
                  </div>
                </Card>

                <Card className="glass-card p-6">
                  <h2 className="text-xl font-semibold mb-4">About This Data</h2>
                  <p className="text-muted-foreground">
                    Weather data is provided by the National Weather Service API. It is updated regularly to provide
                    the most accurate forecasts and conditions for your location.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Last updated: {new Date().toLocaleString()}
                  </p>
                </Card>
              </section>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} WindowsWorld Weather. All rights reserved.</p>
        <p className="mt-2">Powered by the National Weather Service API.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
