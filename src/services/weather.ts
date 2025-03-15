
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

  async searchLocationsByZip(zipCode: string): Promise<{ lat: number; lon: number; name: string }> {
    try {
      // The NWS API doesn't have a direct ZIP code lookup, so we use a workaround
      // Try to get point data for an approximate lat/lon for the ZIP code
      // Most US zip codes can be approximated with this pattern
      const response = await fetch(`${this.baseUrl}/points/${zipCode}`);
      
      if (!response.ok) {
        throw new Error('Invalid ZIP code or location not found');
      }
      
      const data: WeatherPoint = await response.json();
      
      return {
        lat: data.properties.relativeLocation.properties.city ? parseFloat(data.properties.gridY.toString()) : 0,
        lon: data.properties.relativeLocation.properties.state ? parseFloat(data.properties.gridX.toString()) : 0,
        name: `${data.properties.relativeLocation.properties.city}, ${data.properties.relativeLocation.properties.state}`
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
