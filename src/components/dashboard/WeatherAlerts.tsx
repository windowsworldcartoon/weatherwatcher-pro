
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ArrowRight, Siren, Tornado } from 'lucide-react';
import { WeatherData } from '@/services/weather';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

  // Check if there's a tornado warning
  const tornadoWarning = alerts.find(alert => 
    alert.event.toLowerCase().includes('tornado') && 
    alert.event.toLowerCase().includes('warning')
  );
  
  // Check if there's a tornado watch
  const tornadoWatch = alerts.find(alert => 
    alert.event.toLowerCase().includes('tornado') && 
    alert.event.toLowerCase().includes('watch')
  );

  return (
    <section className="space-y-4 animate-slide-up">
      {tornadoWarning && (
        <Dialog defaultOpen>
          <DialogContent className="sm:max-w-xl border-red-500 border-2">
            <DialogHeader>
              <DialogTitle className="text-2xl text-red-500 flex items-center gap-2">
                <Siren className="h-6 w-6 text-red-500 animate-pulse" />
                TORNADO WARNING
              </DialogTitle>
            </DialogHeader>
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <div className="flex items-start gap-3">
                <Tornado className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <p className="font-semibold">{tornadoWarning.headline}</p>
                  <p className="text-sm">{tornadoWarning.description.substring(0, 300)}...</p>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    <div><span className="font-medium">Start:</span> {new Date(tornadoWarning.onset).toLocaleString()}</div>
                    <div><span className="font-medium">End:</span> {new Date(tornadoWarning.ends).toLocaleString()}</div>
                  </div>
                  <Link to="/severe-weather">
                    <Button variant="destructive" size="sm" className="mt-2">
                      View Full Details <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {tornadoWatch && !tornadoWarning && (
        <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950/30">
          <div className="flex items-start gap-3">
            <Tornado className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 w-full">
              <h3 className="font-semibold text-orange-800 dark:text-orange-300">TORNADO WATCH</h3>
              <p className="text-sm text-orange-700 dark:text-orange-400">{tornadoWatch.headline}</p>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-orange-700">
                  <span className="font-medium">Valid until:</span> {new Date(tornadoWatch.ends).toLocaleString()}
                </div>
                <Link to="/severe-weather">
                  <Button variant="outline" size="sm" className="border-orange-500 text-orange-700 hover:bg-orange-100">
                    Details <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Alert>
      )}

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
      
      {alerts.filter(a => 
        !(a.event.toLowerCase().includes('tornado') && 
          (a.event.toLowerCase().includes('warning') || a.event.toLowerCase().includes('watch')))
      ).slice(0, 1).map((alert) => (
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
