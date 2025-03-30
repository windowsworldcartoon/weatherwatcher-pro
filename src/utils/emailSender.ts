
/**
 * Email Sender Utility
 * 
 * Handles all email operations for the weather app, including
 * alert emails, notifications, and offline support.
 */

type AlertEmailData = {
  event: string;
  description: string;
  recipient?: string;
  timestamp?: string;
};

/**
 * Sends a weather alert email to the user
 * If offline, stores the alert in localStorage for later sending
 */
export const sendAlertEmail = async (
  data: AlertEmailData,
  userEmail?: string
): Promise<boolean> => {
  // Default recipient email if user email is not provided
  const defaultEmail = "windowsworldcartoon@gmail.com";
  const recipient = userEmail || defaultEmail;
  
  // Create the email data payload
  const emailPayload = {
    ...data,
    recipient,
    timestamp: data.timestamp || new Date().toISOString(),
    subject: `WEATHER ALERT: ${data.event}`
  };

  try {
    // In a real app, this would make an API call to a backend service
    console.log(`SENDING EMAIL ALERT to ${recipient}`);
    console.log(`Subject: WEATHER ALERT: ${data.event}`);
    console.log(`Body: ${data.description}`);
    
    // Always store in localStorage for offline support
    storeOfflineAlert(emailPayload);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return true;
  } catch (error) {
    console.error('Failed to send alert email:', error);
    
    // Store the alert in localStorage for offline sending
    storeOfflineAlert(emailPayload);
    
    return false;
  }
};

/**
 * Stores an alert in localStorage for offline sending
 */
const storeOfflineAlert = (alertData: AlertEmailData & { subject?: string }): void => {
  try {
    const pendingAlerts = getPendingAlerts();
    pendingAlerts.push(alertData);
    localStorage.setItem('pending_weather_alerts', JSON.stringify(pendingAlerts));
  } catch (error) {
    console.error('Failed to store alert for offline sending:', error);
  }
};

/**
 * Gets all pending alerts from localStorage
 */
export const getPendingAlerts = (): (AlertEmailData & { subject?: string })[] => {
  try {
    return JSON.parse(localStorage.getItem('pending_weather_alerts') || '[]');
  } catch (error) {
    console.error('Failed to retrieve pending alerts:', error);
    return [];
  }
};

/**
 * Sends a test email to verify email alert configuration
 */
export const sendTestEmail = async (userEmail?: string): Promise<boolean> => {
  const recipient = userEmail || "windowsworldcartoon@gmail.com";
  
  try {
    // Simulate API call
    console.log(`SENDING TEST EMAIL to ${recipient}`);
    console.log('Subject: Test Weather Alert');
    console.log('Body: This is a test email to verify your weather alert configuration is working correctly.');
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return true;
  } catch (error) {
    console.error('Failed to send test email:', error);
    return false;
  }
};
