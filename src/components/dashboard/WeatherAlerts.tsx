
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { WeatherData } from '@/services/weather';

interface WeatherAlertsProps {
  alerts: WeatherData['alerts'];
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <section className="space-y-4 animate-slide-up">
      <h2 className="text-xl font-semibold">Weather Alerts</h2>
      {alerts.map((alert) => (
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
  );
};

export default WeatherAlerts;
