
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
 * Simulates sending a weather alert email to the user
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
    // In browser environment, we'll simulate email sending
    // and store the alert data
    console.log(`[Email Alert] Would send to ${recipient}: ${data.event}`);
    
    // Store in localStorage for offline support
    storeOfflineAlert(emailPayload);
    
    // For a real implementation, you would need a backend service
    // to actually send the emails
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
 * Try to send any pending offline alerts
 */
export const sendPendingAlerts = async (): Promise<number> => {
  if (!navigator.onLine) {
    return 0;
  }
  
  const pendingAlerts = getPendingAlerts();
  if (pendingAlerts.length === 0) {
    return 0;
  }
  
  // In a real implementation, this would send the emails
  // For now, we'll just log and clear the queue
  console.log(`[Email Alert] Would send ${pendingAlerts.length} pending alerts:`);
  pendingAlerts.forEach((alert, index) => {
    console.log(`[Email Alert ${index + 1}] To: ${alert.recipient}, Subject: ${alert.subject}`);
  });
  
  // Clear the pending alerts
  localStorage.setItem('pending_weather_alerts', JSON.stringify([]));
  
  return pendingAlerts.length;
};

/**
 * Sends a test email to verify email alert configuration
 */
export const sendTestEmail = async (userEmail?: string): Promise<boolean> => {
  const recipient = userEmail || "windowsworldcartoon@gmail.com";
  
  try {
    // In browser environment, we'll simulate email sending
    console.log(`[Test Email] Would send to ${recipient}`);
    
    // For a real implementation, you would need a backend service
    return true;
  } catch (error) {
    console.error('Failed to send test email:', error);
    return false;
  }
};

// Listen for online status to send pending alerts
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    const sent = await sendPendingAlerts();
    if (sent > 0) {
      console.log(`Successfully processed ${sent} pending alert(s) that were queued offline.`);
    }
  });
}
