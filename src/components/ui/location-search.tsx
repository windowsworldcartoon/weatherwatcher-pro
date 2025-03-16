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
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchInput.trim()) {
      toast.error('Please enter a ZIP code or city name');
      return;
    }
    
    setIsSearching(true);
    try {
      let result;
      
      // Check if input looks like a ZIP code (5 digits)
      if (/^\d{5}$/.test(searchInput)) {
        // Use the WeatherService to get location data from ZIP code
        result = await weatherService.searchLocationsByZip(searchInput);
      } else {
        // Otherwise treat as city search
        result = await weatherService.searchLocationsByCity(searchInput);
      }
      
      onLocationSelect(result);
      toast.success(`Location set to ${result.name}`);
    } catch (error) {
      console.error('Error searching location:', error);
      toast.error('Could not find this location. Please try a different search term.');
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
          toast.error('Could not determine your location. Please search by city name or ZIP code.');
        } finally {
          setIsSearching(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Failed to get your location. Please search by city name or ZIP code.');
        setIsSearching(false);
      }
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter city name or ZIP code"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
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
