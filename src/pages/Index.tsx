
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, MapPin, Bell, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-weather-light">
      {/* Header */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/f8e2f98d-a4c1-4b36-aea7-5c7f8b9aef45.png" alt="Weather Icon" className="h-8 w-8" />
          <span className="text-xl font-bold">WindowsWorld Weather</span>
        </div>
        <div className="flex gap-2">
          {user ? (
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/f8e2f98d-a4c1-4b36-aea7-5c7f8b9aef45.png" 
              alt="WindowsWorld Weather" 
              className="h-20 w-20 animate-bounce"
            />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Personal Weather Dashboard
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get accurate weather forecasts, severe weather alerts, and personalized insights 
            all in one beautiful interface.
          </p>
          {!user && (
            <Button size="lg" onClick={() => navigate('/auth')} className="animate-pulse">
              Start Tracking Weather
            </Button>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="glass-card hover:shadow-lg transition-shadow animate-slide-up">
            <CardHeader>
              <Cloud className="h-10 w-10 text-weather-blue mb-2" />
              <CardTitle>Real-time Weather</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get up-to-the-minute weather conditions and forecasts for your location.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-shadow animate-slide-up" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <MapPin className="h-10 w-10 text-weather-blue mb-2" />
              <CardTitle>Multiple Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track weather for multiple cities and locations that matter to you.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-shadow animate-slide-up" style={{animationDelay: '0.2s'}}>
            <CardHeader>
              <Bell className="h-10 w-10 text-weather-blue mb-2" />
              <CardTitle>Weather Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Receive instant notifications about severe weather conditions and warnings.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-shadow animate-slide-up" style={{animationDelay: '0.3s'}}>
            <CardHeader>
              <Shield className="h-10 w-10 text-weather-blue mb-2" />
              <CardTitle>Reliable Data</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Powered by trusted weather services for accurate and dependable forecasts.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        {!user && (
          <div className="text-center bg-white/50 backdrop-blur-sm rounded-lg p-8 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of users who trust WindowsWorld Weather for their daily forecasts.
            </p>
            <Button size="lg" onClick={() => navigate('/auth')}>
              Create Your Account
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
