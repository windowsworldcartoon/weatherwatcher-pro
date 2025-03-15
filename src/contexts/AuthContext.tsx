
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  email: string;
  name?: string;
  location?: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUserLocation: (location: string) => void;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate authentication API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just create a user with the email
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        location: 'New York, NY'
      };
      
      setUser(newUser);
      localStorage.setItem('windowsworld_user', JSON.stringify(newUser));
      toast.success('Successfully logged in!');
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
        location: 'New York, NY'
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
    toast.info('You have been logged out');
  };

  const updateUserLocation = (location: string) => {
    if (user) {
      const updatedUser = { ...user, location };
      setUser(updatedUser);
      localStorage.setItem('windowsworld_user', JSON.stringify(updatedUser));
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
        updateUserLocation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
