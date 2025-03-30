import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { sendAlertEmail as sendEmailAlert, sendTestEmail, sendPendingAlerts } from '@/utils/emailSender';

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
  sendTestEmailAlert: () => Promise<boolean>;
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
    
    sendPendingAlerts().then(count => {
      if (count > 0) {
        toast.success(`Sent ${count} pending weather alert(s)`, {
          description: 'Alerts that were stored while you were offline have been sent.'
        });
      }
    });
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      
      if (rememberMe) {
        localStorage.setItem('windowsworld_user', JSON.stringify(newUser));
        toast.success('Successfully logged in! Your session will be remembered.');
      } else {
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

    return await sendEmailAlert(alertInfo, user.email);
  };

  const sendTestEmailAlert = async (): Promise<boolean> => {
    if (!user) {
      console.log('No user logged in');
      return false;
    }
    
    return await sendTestEmail(user.email);
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
        sendAlertEmail,
        sendTestEmailAlert
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
