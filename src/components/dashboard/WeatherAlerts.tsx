
import React, { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ArrowRight, Siren, Tornado, Mail } from 'lucide-react';
import { WeatherData } from '@/services/weather';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WeatherAlertsProps {
  alerts: WeatherData['alerts'];
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  const { user, sendAlertEmail } = useAuth();
  
  useEffect(() => {
    // Check for tornado warnings and automatically send email alerts
    const tornadoWarning = alerts?.find(alert => 
      alert.event.toLowerCase().includes('tornado') && 
      alert.event.toLowerCase().includes('warning')
    );
    
    if (tornadoWarning && user?.alertPreferences?.email) {
      sendAlertEmail({
        event: tornadoWarning.event,
        description: tornadoWarning.description
      }).then(success => {
        if (success) {
          toast.success('Tornado warning email alert sent!', {
            description: 'Details have been sent to your email address.'
          });
        }
      });
    }
    
    // Check if there are any other severe alerts to send
    const severeAlerts = alerts?.filter(alert => 
      alert.severity.toLowerCase() === 'severe' || 
      alert.severity.toLowerCase() === 'extreme'
    );
    
    if (severeAlerts?.length && user?.alertPreferences?.email && !tornadoWarning) {
      severeAlerts.forEach(alert => {
        sendAlertEmail({
          event: alert.event,
          description: alert.description
        });
      });
      
      if (severeAlerts.length > 0) {
        toast.info(`${severeAlerts.length} weather alert(s) sent to your email`, {
          description: 'Check your inbox for details.'
        });
      }
    }
  }, [alerts, user, sendAlertEmail]);

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

  const handleSendAlert = (alert: any) => {
    if (user?.alertPreferences?.email) {
      sendAlertEmail({
        event: alert.event,
        description: alert.description
      }).then(success => {
        if (success) {
          toast.success('Alert email sent!', {
            description: 'Weather alert details have been sent to your email.'
          });
        }
      });
    } else {
      toast.error('Email alerts not enabled', {
        description: 'Enable email alerts in your profile settings.'
      });
    }
  };

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
                  <div className="flex gap-2 mt-2">
                    <Link to="/severe-weather">
                      <Button variant="destructive" size="sm">
                        View Full Details <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-500 text-red-700"
                      onClick={() => handleSendAlert(tornadoWarning)}
                    >
                      <Mail className="mr-1 h-4 w-4" /> Email Alert
                    </Button>
                  </div>
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
                <div className="flex gap-2">
                  <Link to="/severe-weather">
                    <Button variant="outline" size="sm" className="border-orange-500 text-orange-700 hover:bg-orange-100">
                      Details <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-orange-500 text-orange-700 hover:bg-orange-100"
                    onClick={() => handleSendAlert(tornadoWatch)}
                  >
                    <Mail className="mr-1 h-4 w-4" /> Email
                  </Button>
                </div>
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
            <div className="flex gap-2 mt-2">
              <Link to="/severe-weather">
                <Button variant="outline" size="sm">
                  Show More <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSendAlert(alert)}
              >
                <Mail className="mr-1 h-4 w-4" /> Email Alert
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </section>
  );
};

export default WeatherAlerts;
