
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { MapPin, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Fix for default marker icon issue in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface WeatherMapProps {
  location: {
    lat: number;
    lon: number;
    name: string;
  };
  locationBlocked?: boolean;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ location, locationBlocked = false }) => {
  return (
    <section className="animate-blur-in my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Weather Map</h2>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location.name}</span>
        </div>
      </div>
      
      {locationBlocked && (
        <Card className="mb-4 border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-400">Location Access Blocked</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
                We're showing a default location because access to your device's location is blocked. 
                Enable location services in your browser settings to see weather for your current location.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="h-[400px] w-full rounded-lg overflow-hidden border bg-card shadow-sm">
        <MapContainer 
          center={[location.lat, location.lon]} 
          zoom={10} 
          style={{ height: '100%', width: '100%' }}
          attributionControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.lat, location.lon]} icon={DefaultIcon}>
            <Popup>
              {location.name}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
};

export default WeatherMap;
