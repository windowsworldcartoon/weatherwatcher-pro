import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Github } from 'lucide-react';
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { signIn, signUp, signInWithGoogle, signInWithGitHub, isLoading, user } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add a handler to catch location select event, 
  // Here, you might want to store the selected location to user preferences or just display it.
  // For demonstration, we'll just log it.
  const handleLocationSelect = (latLon: { lat: number; lon: number; name: string }) => {
    console.log("Selected location:", latLon);
    // You may want to set this to state and use it later, e.g. on signup.
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      variant: "destructive",
      title: "Authentication Disabled",
      description: "This website has moved. Please visit our new site for access.",
    });
  };

  const handleGoogleSignIn = async () => {
    toast({
      variant: "destructive",
      title: "Authentication Disabled",
      description: "This website has moved. Please visit our new site for access.",
    });
  };

  const handleGitHubSignIn = async () => {
    toast({
      variant: "destructive",
      title: "Authentication Disabled",
      description: "This website has moved. Please visit our new site for access.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-weather-light dark:from-background dark:to-gray-900 relative">
      {/* Theme toggle button */}
      <ThemeToggle />

      <div className="flex items-center justify-center p-6 cursor-pointer" onClick={() => navigate('/')}>
        <img src="/lovable-uploads/f8e2f98d-a4c1-4b36-aea7-5c7f8b9aef45.png" alt="Weather Icon" className="h-8 w-8 mr-2" />
        <span className="font-bold text-xl">WindowsWorld Weather</span>
      </div>

      {/* Location input removed here */}
      
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md mx-auto glass-card animate-blur-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? 'Enter your credentials to access your weather dashboard' 
                : 'Join WindowsWorld Weather to get personalized forecasts'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Social Login Buttons */}
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleSignIn}
                  disabled={true}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGitHubSignIn}
                  disabled={true}
                >
                  <Github className="w-4 h-4 mr-2" />
                  Continue with GitHub
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName"
                      placeholder="Enter your full name" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="m@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  {!isLogin && (
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters long
                    </p>
                  )}
                </div>
                
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </Button>
              </form>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Button 
                variant="link" 
                className="pl-1 pr-0" 
                onClick={() => setIsLogin(!isLogin)}
                type="button"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
