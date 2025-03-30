
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Bell, User, BellOff } from 'lucide-react';
import { toast } from 'sonner';

const UserProfile = () => {
  const { user, toggleSubscription, updateAlertPreferences, sendTestEmailAlert } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return null;
  }

  const handleToggleEmailAlerts = (checked: boolean) => {
    updateAlertPreferences({
      email: checked,
      emailAddress: user.email
    });
  };

  const handleTestEmail = async () => {
    setIsSubmitting(true);
    try {
      const success = await sendTestEmailAlert();
      if (success) {
        toast.success('Test email sent!', {
          description: `A test email has been sent to ${user.email || 'windowsworldcartoon@gmail.com'}`
        });
      } else {
        toast.error('Failed to send test email');
      }
    } catch (error) {
      toast.error('Failed to send test email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Profile
        </CardTitle>
        <CardDescription>Manage your subscription and alert preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <p className="text-sm font-medium">Email:</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Weather Updates Subscription</h3>
              <p className="text-sm text-muted-foreground">
                {user.isSubscribed 
                  ? 'You are currently subscribed to weather updates' 
                  : 'Subscribe to receive regular weather updates'}
              </p>
            </div>
            <Switch 
              checked={user.isSubscribed} 
              onCheckedChange={toggleSubscription} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for severe weather alerts
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Switch 
                checked={user.alertPreferences?.email || false} 
                onCheckedChange={handleToggleEmailAlerts} 
                id="email-alerts"
              />
              {user.alertPreferences?.email && (
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleTestEmail}
                    disabled={isSubmitting}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Test Email
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-md mt-4">
            <div className="flex items-start gap-3">
              {user.alertPreferences?.email ? (
                <Bell className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <BellOff className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className="font-medium">Alert Status</h3>
                <p className="text-sm mt-1">
                  {user.alertPreferences?.email 
                    ? `Email alerts are enabled and will be sent to ${user.email || 'windowsworldcartoon@gmail.com'}.` 
                    : 'Email alerts are currently disabled. Enable them to receive critical weather updates.'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: Even if you're offline, we'll queue alerts to be sent when connectivity is restored.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
