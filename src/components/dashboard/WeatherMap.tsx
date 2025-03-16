
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { MapPin } from 'lucide-react';

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
}

const WeatherMap: React.FC<WeatherMapProps> = ({ location }) => {
  return (
    <section className="animate-blur-in my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Weather Map</h2>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location.name}</span>
        </div>
      </div>
      
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
