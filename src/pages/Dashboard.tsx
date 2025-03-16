import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { weatherService, WeatherData } from '@/services/weather';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import LocationSearch from '@/components/ui/location-search';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import CurrentWeather from '@/components/dashboard/CurrentWeather';
import WeatherAlerts from '@/components/dashboard/WeatherAlerts';
import ForecastSection from '@/components/dashboard/ForecastSection';
import DetailedInfo from '@/components/dashboard/DetailedInfo';
import WeatherLoading from '@/components/dashboard/WeatherLoading';
import WeatherMap from '@/components/dashboard/WeatherMap';

const DEFAULT_LOCATION = { lat: 40.7128, lon: -74.0060, name: "New York, NY" };

const Dashboard = () => {
  const { user, isAuthenticated, logout, updateUserLocation } = useAuth();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // If user has a saved location, fetch weather for it
    // Otherwise, use the default location
    if (user?.location) {
      fetchWeatherForSavedLocation();
    } else {
      fetchWeatherForDefaultLocation();
    }
  }, [isAuthenticated, navigate, user]);

  const fetchWeatherForDefaultLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await fetchWeatherData(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
      setCurrentLocation(DEFAULT_LOCATION);
      
      // Update user's location if they're logged in
      if (user) {
        updateUserLocation(DEFAULT_LOCATION.name);
      }
    } catch (error) {
      console.error('Error fetching weather for default location:', error);
      setError('Failed to load weather data for the default location. Please try searching for a location.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherForSavedLocation = async () => {
    if (!user?.location) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Since we no longer have geocodeLocation, we'll extract coordinates from user object
      // or use a default fallback method to get coordinates for the saved location name
      // For now, we'll default to New York coordinates if we can't determine the location
      setCurrentLocation(DEFAULT_LOCATION);
      await fetchWeatherData(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
      toast.info("Using default location coordinates. Please search for your location to get accurate weather data.");
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
      
      // Set current location for map display
      setCurrentLocation({ lat, lon, name });
      
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

  const formatDay = (periodName: string) => {
    return periodName;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-weather-light animate-fade-in">
      <DashboardHeader userEmail={user?.email} onLogout={handleLogout} />

      <main className="flex-1 container py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Location Search */}
          <section className="animate-slide-down">
            <h1 className="text-3xl font-bold mb-4">Your Weather Dashboard</h1>
            <LocationSearch onLocationSelect={handleLocationSelect} />
          </section>

          {isLoading && <WeatherLoading />}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && weatherData && (
            <>
              <CurrentWeather 
                currentConditions={weatherData.currentConditions} 
                location={weatherData.location} 
              />
              
              <WeatherMap location={currentLocation} />
              
              <WeatherAlerts alerts={weatherData.alerts} />
              
              <ForecastSection 
                forecast={weatherData.forecast} 
                formatDay={formatDay} 
              />
              
              <DetailedInfo 
                detailedForecast={weatherData.currentConditions.detailedForecast} 
              />
            </>
          )}
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
