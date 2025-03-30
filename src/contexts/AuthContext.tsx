
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  email: string;
  name?: string;
  location?: string;
  isSubscribed?: boolean;
  alertPreferences?: {
    email: boolean;
    emailAddress?: string;
  };
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUserLocation: (location: string) => void;
  toggleSubscription: () => void;
  updateAlertPreferences: (preferences: User['alertPreferences']) => void;
  sendAlertEmail: (alertInfo: { event: string; description: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved auth in localStorage
    const savedUser = localStorage.getItem('windowsworld_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user:', e);
        localStorage.removeItem('windowsworld_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate authentication API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just create a user with the email
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        location: 'New York, NY',
        isSubscribed: false,
        alertPreferences: {
          email: false
        }
      };
      
      setUser(newUser);
      
      // Store with appropriate persistence
      if (rememberMe) {
        localStorage.setItem('windowsworld_user', JSON.stringify(newUser));
        toast.success('Successfully logged in! Your session will be remembered.');
      } else {
        // Use sessionStorage for non-persistent sessions
        sessionStorage.setItem('windowsworld_user', JSON.stringify(newUser));
        toast.success('Successfully logged in!');
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to log in. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate authentication API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a new user
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name,
        location: 'New York, NY',
        isSubscribed: false,
        alertPreferences: {
          email: false
        }
      };
      
      setUser(newUser);
      // Always persist signup sessions by default
      localStorage.setItem('windowsworld_user', JSON.stringify(newUser));
      toast.success('Account created successfully!');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('windowsworld_user');
    sessionStorage.removeItem('windowsworld_user');
    toast.info('You have been logged out');
  };

  const updateUserLocation = (location: string) => {
    if (user) {
      const updatedUser = { ...user, location };
      setUser(updatedUser);
      
      // Update in both storage locations to be safe
      if (localStorage.getItem('windowsworld_user')) {
        localStorage.setItem('windowsworld_user', JSON.stringify(updatedUser));
      }
      if (sessionStorage.getItem('windowsworld_user')) {
        sessionStorage.setItem('windowsworld_user', JSON.stringify(updatedUser));
      }
    }
  };

  const toggleSubscription = () => {
    if (user) {
      const updatedUser = { 
        ...user, 
        isSubscribed: !user.isSubscribed 
      };
      setUser(updatedUser);
      
      // Update in both storage locations
      if (localStorage.getItem('windowsworld_user')) {
        localStorage.setItem('windowsworld_user', JSON.stringify(updatedUser));
      }
      if (sessionStorage.getItem('windowsworld_user')) {
        sessionStorage.setItem('windowsworld_user', JSON.stringify(updatedUser));
      }
      
      toast.success(updatedUser.isSubscribed 
        ? 'You are now subscribed to weather updates!' 
        : 'You have unsubscribed from weather updates.');
    }
  };

  const updateAlertPreferences = (preferences: User['alertPreferences']) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        alertPreferences: {
          ...user.alertPreferences,
          ...preferences
        }
      };
      setUser(updatedUser);
      
      // Update in both storage locations
      if (localStorage.getItem('windowsworld_user')) {
        localStorage.setItem('windowsworld_user', JSON.stringify(updatedUser));
      }
      if (sessionStorage.getItem('windowsworld_user')) {
        sessionStorage.setItem('windowsworld_user', JSON.stringify(updatedUser));
      }
      
      toast.success('Alert preferences updated successfully!');
    }
  };

  const sendAlertEmail = async (alertInfo: { event: string; description: string }): Promise<boolean> => {
    if (!user || !user.alertPreferences?.email) {
      console.log('Email alerts not enabled for this user');
      return false;
    }

    try {
      // In a real app, this would be an API call to a backend service
      console.log(`SIMULATED EMAIL ALERT to ${user.email || 'windowsworldcartoon@gmail.com'}`);
      console.log(`Subject: WEATHER ALERT: ${alertInfo.event}`);
      console.log(`Body: ${alertInfo.description}`);
      
      // Simulate offline functionality by storing in localStorage
      const alertsToSend = JSON.parse(localStorage.getItem('pending_weather_alerts') || '[]');
      alertsToSend.push({
        recipient: user.email,
        event: alertInfo.event,
        description: alertInfo.description,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('pending_weather_alerts', JSON.stringify(alertsToSend));
      
      return true;
    } catch (error) {
      console.error('Failed to send alert email:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUserLocation,
        toggleSubscription,
        updateAlertPreferences,
        sendAlertEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
