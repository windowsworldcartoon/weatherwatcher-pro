
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ArrowLeft, Tornado, Siren } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { weatherService } from '@/services/weather';
import { useQuery } from '@tanstack/react-query';

const SevereWeather = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const fetchAlerts = async () => {
    if (!user?.location) {
      throw new Error('No location set');
    }
    
    try {
      const locationData = await weatherService.searchLocationsByCity(user.location);
      const weatherData = await weatherService.getWeatherData(locationData.lat, locationData.lon);
      return weatherData.alerts || [];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  };

  const { data: alerts, isLoading, error } = useQuery({
    queryKey: ['alerts', user?.location],
    queryFn: fetchAlerts,
    enabled: !!user?.location && isAuthenticated
  });

  const getSeverityClass = (severity: string, event: string) => {
    if (event.toLowerCase().includes('tornado')) {
      if (event.toLowerCase().includes('warning')) {
        return 'bg-red-50 border-red-300';
      } else if (event.toLowerCase().includes('watch')) {
        return 'bg-orange-50 border-orange-300';
      }
    }
    
    switch(severity.toLowerCase()) {
      case 'extreme':
        return 'bg-red-50 border-red-200';
      case 'severe':
        return 'bg-red-50 border-red-200';
      case 'moderate':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };
  
  const getAlertIcon = (event: string) => {
    if (event.toLowerCase().includes('tornado')) {
      return event.toLowerCase().includes('warning') 
        ? <Siren className="h-5 w-5 text-red-600 mt-1" /> 
        : <Tornado className="h-5 w-5 text-orange-600 mt-1" />;
    }
    return <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-weather-light animate-fade-in">
      <div className="container py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-4">Severe Weather Alerts</h1>
          <p className="text-muted-foreground mt-2">
            Detailed information about current weather alerts for your area
          </p>
        </div>

        {isLoading && (
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load weather alerts. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {alerts && alerts.length === 0 && (
          <Card>
            <CardContent className="p-6">
              <p className="text-center py-8 text-muted-foreground">
                No weather alerts are currently in effect for your area.
              </p>
            </CardContent>
          </Card>
        )}

        {alerts && alerts.length > 0 && (
          <div className="space-y-4">
            {/* Show tornado warnings first */}
            {alerts
              .filter(alert => alert.event.toLowerCase().includes('tornado') && alert.event.toLowerCase().includes('warning'))
              .map((alert, index) => (
                <Collapsible key={alert.id || `tornado-warning-${index}`} className={`border rounded-lg overflow-hidden ${getSeverityClass(alert.severity, alert.event)}`}>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <Siren className="h-5 w-5 text-red-600 animate-pulse mt-1" />
                        <div>
                          <h3 className="font-semibold text-red-800">{alert.event.toUpperCase()}</h3>
                          <p className="text-sm text-red-700">{alert.headline}</p>
                        </div>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    
                    <CollapsibleContent>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="whitespace-pre-line text-sm">{alert.description}</p>
                        
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="font-medium">Severity: </span>
                            {alert.severity}
                          </div>
                          <div>
                            <span className="font-medium">Urgency: </span>
                            {alert.urgency}
                          </div>
                          <div>
                            <span className="font-medium">Start: </span>
                            {new Date(alert.onset).toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">End: </span>
                            {new Date(alert.ends).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
              
            {/* Show tornado watches next */}
            {alerts
              .filter(alert => alert.event.toLowerCase().includes('tornado') && alert.event.toLowerCase().includes('watch'))
              .map((alert, index) => (
                <Collapsible key={alert.id || `tornado-watch-${index}`} className={`border rounded-lg overflow-hidden ${getSeverityClass(alert.severity, alert.event)}`}>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <Tornado className="h-5 w-5 text-orange-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-orange-800">{alert.event.toUpperCase()}</h3>
                          <p className="text-sm text-orange-700">{alert.headline}</p>
                        </div>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    
                    <CollapsibleContent>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="whitespace-pre-line text-sm">{alert.description}</p>
                        
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="font-medium">Severity: </span>
                            {alert.severity}
                          </div>
                          <div>
                            <span className="font-medium">Urgency: </span>
                            {alert.urgency}
                          </div>
                          <div>
                            <span className="font-medium">Start: </span>
                            {new Date(alert.onset).toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">End: </span>
                            {new Date(alert.ends).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
              
            {/* Show other alerts last */}
            {alerts
              .filter(alert => !(alert.event.toLowerCase().includes('tornado') && 
                (alert.event.toLowerCase().includes('warning') || alert.event.toLowerCase().includes('watch'))))
              .map((alert, index) => (
                <Collapsible key={alert.id || index} className={`border rounded-lg overflow-hidden ${getSeverityClass(alert.severity, alert.event)}`}>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {getAlertIcon(alert.event)}
                        <div>
                          <h3 className="font-semibold">{alert.event}</h3>
                          <p className="text-sm text-muted-foreground">{alert.headline}</p>
                        </div>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    
                    <CollapsibleContent>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="whitespace-pre-line text-sm">{alert.description}</p>
                        
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="font-medium">Severity: </span>
                            {alert.severity}
                          </div>
                          <div>
                            <span className="font-medium">Urgency: </span>
                            {alert.urgency}
                          </div>
                          <div>
                            <span className="font-medium">Start: </span>
                            {new Date(alert.onset).toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">End: </span>
                            {new Date(alert.ends).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SevereWeather;
