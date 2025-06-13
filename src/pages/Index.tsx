
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Thermometer, Wind, CloudRain, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/f8e2f98d-a4c1-4b36-aea7-5c7f8b9aef45.png" alt="Weather Icon" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900">WindowsWorld Weather</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <img src="/lovable-uploads/f8e2f98d-a4c1-4b36-aea7-5c7f8b9aef45.png" alt="Weather Icon" className="h-20 w-20 mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Your Personal Weather Dashboard
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get accurate, real-time weather updates with beautiful visualizations and personalized alerts.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="flex items-center gap-2">
                  Start Tracking Weather
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <Card className="text-center">
            <CardHeader>
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Location-Based</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automatic location detection or search for any city worldwide
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Thermometer className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Detailed Forecasts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                7-day forecasts with hourly breakdowns and temperature trends
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Wind className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Wind & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Real-time wind speed, direction, humidity, and atmospheric pressure
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CloudRain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Weather Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Severe weather warnings and personalized notifications
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-blue-600 text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-6">Join thousands of users who trust WindowsWorld Weather for accurate forecasts.</p>
          <Link to="/auth">
            <Button variant="secondary" size="lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
