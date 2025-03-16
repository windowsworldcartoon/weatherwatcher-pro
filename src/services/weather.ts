
interface WeatherPoint {
  properties: {
    forecast: string;
    forecastHourly: string;
    relativeLocation: {
      properties: {
        city: string;
        state: string;
      };
    };
    gridId: string;
    gridX: number;
    gridY: number;
  };
}

interface ForecastPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string | null;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

interface Forecast {
  properties: {
    periods: ForecastPeriod[];
  };
}

interface AlertProperties {
  id: string;
  areaDesc: string;
  headline: string;
  description: string;
  severity: string;
  urgency: string;
  event: string;
  onset: string;
  ends: string;
}

interface Alert {
  properties: AlertProperties;
}

interface AlertsResponse {
  features: Alert[];
}

export interface WeatherData {
  location: string;
  currentConditions: ForecastPeriod;
  forecast: ForecastPeriod[];
  alerts: AlertProperties[];
}

class WeatherService {
  private baseUrl = 'https://api.weather.gov';

  async getPointData(lat: number, lon: number): Promise<WeatherPoint> {
    try {
      const response = await fetch(`${this.baseUrl}/points/${lat},${lon}`);
      if (!response.ok) throw new Error('Failed to fetch point data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching point data:', error);
      throw error;
    }
  }

  async getForecast(forecastUrl: string): Promise<Forecast> {
    try {
      const response = await fetch(forecastUrl);
      if (!response.ok) throw new Error('Failed to fetch forecast');
      return await response.json();
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  }

  async getAlerts(lat: number, lon: number): Promise<AlertsResponse> {
    try {
      // The NWS API has specific formatting requirements for the area parameter
      const response = await fetch(`${this.baseUrl}/alerts/active?point=${lat},${lon}`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return { features: [] };
    }
  }

  async searchLocationsByCity(cityName: string): Promise<{ lat: number; lon: number; name: string }> {
    try {
      // Use the OpenStreetMap Nominatim API to search for city coordinates
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`);
      
      if (!response.ok) {
        throw new Error('City not found or network error');
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error('City not found');
      }
      
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        name: data[0].display_name.split(',').slice(0, 2).join(',')
      };
    } catch (error) {
      console.error('Error searching by city:', error);
      throw error;
    }
  }

  async searchLocationsByZip(zipCode: string): Promise<{ lat: number; lon: number; name: string }> {
    try {
      // Use the OpenStreetMap Nominatim API to search for ZIP code
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&postalcode=${zipCode}&country=USA&limit=1`);
      
      if (!response.ok) {
        throw new Error('ZIP code not found or network error');
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error('ZIP code not found');
      }
      
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        name: data[0].display_name.split(',').slice(0, 2).join(',')
      };
    } catch (error) {
      console.error('Error searching by ZIP:', error);
      throw error;
    }
  }

  async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    try {
      // Get point data first to find forecast URLs
      const pointData = await this.getPointData(lat, lon);
      
      // Get forecast data
      const forecastData = await this.getForecast(pointData.properties.forecast);
      
      // Get alerts
      const alertsData = await this.getAlerts(lat, lon);
      
      // Format location
      const location = `${pointData.properties.relativeLocation.properties.city}, ${pointData.properties.relativeLocation.properties.state}`;
      
      // Return formatted weather data
      return {
        location,
        currentConditions: forecastData.properties.periods[0],
        forecast: forecastData.properties.periods.slice(1, 7), // Next 6 periods
        alerts: alertsData.features.map(alert => alert.properties)
      };
    } catch (error) {
      console.error('Error getting weather data:', error);
      throw error;
    }
  }
}

export const weatherService = new WeatherService();
