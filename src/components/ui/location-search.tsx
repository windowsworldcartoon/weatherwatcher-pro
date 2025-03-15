
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { weatherService } from '@/services/weather';

interface LocationSearchProps {
  onLocationSelect: (latLon: { lat: number; lon: number; name: string }) => void;
  className?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect, className }) => {
  const [zipCode, setZipCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zipCode.trim()) {
      toast.error('Please enter a ZIP code');
      return;
    }
    
    setIsSearching(true);
    try {
      // Check if input looks like a ZIP code (5 digits)
      if (!/^\d{5}$/.test(zipCode)) {
        toast.error('Please enter a valid 5-digit ZIP code');
        setIsSearching(false);
        return;
      }
      
      // Use the WeatherService to get location data from ZIP code
      const result = await weatherService.searchLocationsByZip(zipCode);
      onLocationSelect(result);
      toast.success(`Location set to ${result.name}`);
    } catch (error) {
      console.error('Error searching location:', error);
      toast.error('Could not find this ZIP code. Please try a different one.');
    } finally {
      setIsSearching(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const pointData = await weatherService.getPointData(
            position.coords.latitude,
            position.coords.longitude
          );
          
          const locationName = `${pointData.properties.relativeLocation.properties.city}, ${pointData.properties.relativeLocation.properties.state}`;
          
          onLocationSelect({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: locationName
          });
          
          toast.success(`Using current location: ${locationName}`);
        } catch (error) {
          console.error('Error getting location data:', error);
          toast.error('Could not determine your location. Please search by ZIP code.');
        } finally {
          setIsSearching(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Failed to get your location. Please search by ZIP code.');
        setIsSearching(false);
      }
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter 5-digit ZIP code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="w-full"
        />
        <Button type="submit" disabled={isSearching}>
          <Search className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </form>
      <Button 
        variant="outline" 
        type="button" 
        onClick={getCurrentLocation}
        disabled={isSearching}
        className="w-full"
      >
        <MapPin className="h-4 w-4 mr-2" />
        Use my current location
      </Button>
    </div>
  );
};

export default LocationSearch;
