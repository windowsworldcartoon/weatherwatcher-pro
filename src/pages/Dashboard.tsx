
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button'; // Added missing Button import
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
import UserProfile from '@/components/dashboard/UserProfile';

const DEFAULT_LOCATION = { lat: 0, lon: 0, name: "Loading location..." };

const Dashboard = () => {
  const { user, isAuthenticated, logout, updateUserLocation } = useAuth();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);
  const [locationBlocked, setLocationBlocked] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    tryGeolocationOrDefault();
  }, [isAuthenticated, navigate]);

  const tryGeolocationOrDefault = () => {
    if (!navigator.geolocation) {
      fetchWeatherForSavedLocation();
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const pointData = await weatherService.getPointData(
            position.coords.latitude, 
            position.coords.longitude
          );
          
          const locationName = `${pointData.properties.relativeLocation.properties.city}, ${pointData.properties.relativeLocation.properties.state}`;
          const newLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: locationName
          };
          
          setCurrentLocation(newLocation);
          setLocationBlocked(false);
          
          if (user) {
            updateUserLocation(locationName);
          }
          
          await fetchWeatherData(position.coords.latitude, position.coords.longitude);
          toast.info(`Using your current location: ${locationName}`);
        } catch (error) {
          console.error('Error fetching weather for geolocation:', error);
          fetchWeatherForSavedLocation();
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationBlocked(true);
        fetchWeatherForSavedLocation();
      }
    );
  };

  const fetchWeatherForSavedLocation = async () => {
    if (user?.location) {
      try {
        const locationData = await weatherService.searchLocationsByCity(user.location);
        setCurrentLocation(locationData);
        await fetchWeatherData(locationData.lat, locationData.lon);
        return;
      } catch (error) {
        console.error('Error fetching saved location:', error);
      }
    }
    
    const fallbackLocation = { lat: 40.7128, lon: -74.0060, name: "New York, NY" };
    setCurrentLocation(fallbackLocation);
    await fetchWeatherData(fallbackLocation.lat, fallbackLocation.lon);
  };

  const handleLocationSelect = async ({ lat, lon, name }: { lat: number; lon: number; name: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      updateUserLocation(name);
      
      setCurrentLocation({ lat, lon, name });
      setLocationBlocked(false);
      
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
      
      if (data.alerts && data.alerts.length > 0) {
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

  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-weather-light animate-fade-in">
      <DashboardHeader 
        userEmail={user?.email} 
        onLogout={handleLogout} 
        onProfileClick={toggleUserProfile}
      />

      <main className="flex-1 container py-8 max-w-6xl">
        <div className="space-y-8">
          <section className="animate-slide-down">
            <h1 className="text-3xl font-bold mb-4">Your Weather Dashboard</h1>
            
            {showUserProfile ? (
              <div className="mb-8">
                <UserProfile />
                <Button 
                  variant="ghost" 
                  onClick={toggleUserProfile} 
                  className="mt-4"
                >
                  Back to Weather
                </Button>
              </div>
            ) : (
              <LocationSearch onLocationSelect={handleLocationSelect} />
            )}
          </section>

          {!showUserProfile && (
            <>
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
                  
                  <WeatherMap 
                    location={currentLocation} 
                    locationBlocked={locationBlocked} 
                  />
                  
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
            </>
          )}
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
