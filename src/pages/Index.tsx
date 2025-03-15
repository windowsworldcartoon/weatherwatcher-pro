
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sun, Cloud, CloudRain } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center border-b">
        <div className="flex items-center space-x-2">
          <Sun className="h-6 w-6 text-weather-blue" />
          <span className="font-bold text-xl">WindowsWorld Weather</span>
        </div>
        <div className="flex space-x-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
          <Button onClick={() => navigate('/signup')}>Sign Up</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="absolute opacity-10 -z-10">
          <div className="relative">
            <Cloud className="text-weather-blue w-64 h-64 absolute -top-32 -left-96" />
            <CloudRain className="text-weather-blue w-48 h-48 absolute top-32 left-64" />
            <Sun className="text-weather-blue w-72 h-72 absolute -top-48 -right-48" />
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Real-time weather at your fingertips
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get accurate weather forecasts, severe weather alerts, and personalized notifications 
            for any location, all in one beautifully designed app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" className="text-lg px-8" onClick={() => navigate('/signup')}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-weather-light animate-slide-up">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Weather data that works for you</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-lg text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Sun className="h-6 w-6 text-weather-blue" />
              </div>
              <h3 className="text-xl font-semibold">Real-time Forecasts</h3>
              <p className="text-muted-foreground">
                Access up-to-the-minute weather data from the National Weather Service.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-lg text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <CloudRain className="h-6 w-6 text-weather-blue" />
              </div>
              <h3 className="text-xl font-semibold">Severe Weather Alerts</h3>
              <p className="text-muted-foreground">
                Receive timely notifications about severe weather conditions in your area.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-lg text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Cloud className="h-6 w-6 text-weather-blue" />
              </div>
              <h3 className="text-xl font-semibold">Personalized Dashboard</h3>
              <p className="text-muted-foreground">
                Customize your weather dashboard to show the information that matters most to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} WindowsWorld Weather. All rights reserved.</p>
        <p className="mt-2">Powered by the National Weather Service API.</p>
      </footer>
    </div>
  );
};

export default Index;
