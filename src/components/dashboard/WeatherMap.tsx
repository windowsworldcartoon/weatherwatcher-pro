
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { MapPin, AlertTriangle, Radar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';

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
  const [showRadar, setShowRadar] = useState(true);
  const [radarOpacity, setRadarOpacity] = useState(0.7);

  const radarUrl = `https://tilecache.rainviewer.com/v2/radar/nowcast/512/${Math.floor(Date.now() / 1000)}/256/{z}/{x}/{y}/8/1_1.png`;
  const stationRadarUrl = `https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?service=WMS&request=GetMap&version=1.1.1&layers=nexrad-n0r&styles=&format=image/png&transparent=true&srs=EPSG:3857&bbox={bbox}&width=256&height=256`;

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
      
      <div className="flex items-center gap-2 mb-2">
        <Toggle 
          pressed={showRadar} 
          onPressedChange={setShowRadar}
          className="flex items-center gap-1"
        >
          <Radar className="h-4 w-4 mr-1" />
          Radar
        </Toggle>
        
        {showRadar && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Opacity:</span>
            <input 
              type="range" 
              min="0.1" 
              max="1" 
              step="0.1" 
              value={radarOpacity} 
              onChange={(e) => setRadarOpacity(parseFloat(e.target.value))}
              className="w-24"
            />
          </div>
        )}
      </div>
      
      <div className="h-[400px] w-full rounded-lg overflow-hidden border bg-card shadow-sm">
        <MapContainer 
          center={[location.lat, location.lon]} 
          zoom={8} 
          style={{ height: '100%', width: '100%' }}
          attributionControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <LayersControl position="topright">
            {showRadar && (
              <LayersControl.Overlay checked name="Radar">
                <TileLayer
                  url={radarUrl}
                  opacity={radarOpacity}
                  attribution="RainViewer"
                />
              </LayersControl.Overlay>
            )}
            
            <LayersControl.Overlay name="NEXRAD Stations">
              <TileLayer
                url={stationRadarUrl}
                opacity={radarOpacity}
                attribution="NEXRAD/NWS"
              />
            </LayersControl.Overlay>
          </LayersControl>
          
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
