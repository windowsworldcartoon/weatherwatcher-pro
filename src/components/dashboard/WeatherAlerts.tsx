
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { WeatherData } from '@/services/weather';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface WeatherAlertsProps {
  alerts: WeatherData['alerts'];
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  const severityColor = (severity: string) => {
    switch(severity.toLowerCase()) {
      case 'extreme':
        return 'destructive';
      case 'severe':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <section className="space-y-4 animate-slide-up">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Weather Alerts</h2>
        {alerts.length > 1 && (
          <Link to="/severe-weather">
            <Button variant="ghost" size="sm" className="text-sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
      
      {alerts.slice(0, 1).map((alert) => (
        <Alert key={alert.id} variant={severityColor(alert.severity)}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{alert.event}</AlertTitle>
          <AlertDescription className="mt-2">
            {alert.headline}
            <p className="text-sm mt-2">{alert.description.substring(0, 200)}...</p>
            <div className="text-xs mt-2">
              <span className="font-medium">Severity:</span> {alert.severity} • 
              <span className="font-medium"> Urgency:</span> {alert.urgency}
            </div>
            {alerts.length === 1 && (
              <Link to="/severe-weather">
                <Button variant="outline" size="sm" className="mt-2">
                  Show More <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            )}
          </AlertDescription>
        </Alert>
      ))}
    </section>
  );
};

export default WeatherAlerts;
