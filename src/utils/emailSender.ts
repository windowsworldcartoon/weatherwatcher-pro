
/**
 * Email Sender Utility
 * 
 * Handles all email operations for the weather app, including
 * alert emails, notifications, and offline support.
 */
import nodemailer from 'nodemailer';

type AlertEmailData = {
  event: string;
  description: string;
  recipient?: string;
  timestamp?: string;
};

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'windowsworldcartoon@gmail.com',
    pass: 'app-password-here' // You'll need to use an app password for Gmail
  }
});

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
    // Check if we're online
    if (navigator.onLine) {
      // Send the actual email
      await transporter.sendMail({
        from: '"Weather Alert Service" <windowsworldcartoon@gmail.com>',
        to: recipient,
        subject: `WEATHER ALERT: ${data.event}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #d32f2f;">${data.event}</h2>
            <p><strong>Time:</strong> ${new Date(emailPayload.timestamp).toLocaleString()}</p>
            <div style="margin: 20px 0; padding: 15px; background-color: #fafafa; border-left: 4px solid #d32f2f; border-radius: 4px;">
              ${data.description}
            </div>
            <p style="font-size: 12px; color: #757575; margin-top: 30px;">
              This is an automated alert from the Weather App. Please do not reply to this email.
            </p>
          </div>
        `
      });
      
      console.log(`Email alert sent to ${recipient}`);
    } else {
      console.log('Currently offline. Storing email for later sending.');
    }
    
    // Always store in localStorage for offline support
    storeOfflineAlert(emailPayload);
    
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
  
  let sentCount = 0;
  const remainingAlerts = [];
  
  for (const alert of pendingAlerts) {
    try {
      await transporter.sendMail({
        from: '"Weather Alert Service" <windowsworldcartoon@gmail.com>',
        to: alert.recipient,
        subject: alert.subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #d32f2f;">${alert.event}</h2>
            <p><strong>Time:</strong> ${new Date(alert.timestamp || '').toLocaleString()}</p>
            <div style="margin: 20px 0; padding: 15px; background-color: #fafafa; border-left: 4px solid #d32f2f; border-radius: 4px;">
              ${alert.description}
            </div>
            <p style="font-size: 12px; color: #757575; margin-top: 30px;">
              This is an automated alert from the Weather App. Please do not reply to this email.
            </p>
          </div>
        `
      });
      sentCount++;
    } catch (error) {
      console.error('Failed to send pending alert:', error);
      remainingAlerts.push(alert);
    }
  }
  
  localStorage.setItem('pending_weather_alerts', JSON.stringify(remainingAlerts));
  return sentCount;
};

/**
 * Sends a test email to verify email alert configuration
 */
export const sendTestEmail = async (userEmail?: string): Promise<boolean> => {
  const recipient = userEmail || "windowsworldcartoon@gmail.com";
  
  try {
    if (navigator.onLine) {
      await transporter.sendMail({
        from: '"Weather Alert Service" <windowsworldcartoon@gmail.com>',
        to: recipient,
        subject: 'Test Weather Alert',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #2196f3;">Test Weather Alert</h2>
            <p>This is a test email to verify your weather alert configuration is working correctly.</p>
            <p>If you received this email, your weather alerts are properly configured.</p>
            <p style="font-size: 12px; color: #757575; margin-top: 30px;">
              This is an automated test from the Weather App. Please do not reply to this email.
            </p>
          </div>
        `
      });
      
      console.log(`Test email sent to ${recipient}`);
    } else {
      console.log('Currently offline. Test email could not be sent.');
      return false;
    }
    
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
      console.log(`Successfully sent ${sent} pending alert(s) that were queued offline.`);
    }
  });
}
