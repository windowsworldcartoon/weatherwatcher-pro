
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    
    if (mode === 'login') {
      success = await login(email, password, rememberMe);
    } else {
      success = await signup(email, password, name);
    }
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-card animate-blur-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {mode === 'login' ? 'Welcome back' : 'Create an account'}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === 'login' 
            ? 'Enter your credentials to access your account' 
            : 'Enter your information to create an account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                placeholder="Enter your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === 'login' && (
                <Button variant="link" className="px-0 font-normal h-auto" type="button">
                  Forgot password?
                </Button>
              )}
            </div>
            <Input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {mode === 'login' && (
            <div className="flex items-center space-x-2">
              <Switch 
                id="remember-me" 
                checked={rememberMe} 
                onCheckedChange={setRememberMe} 
              />
              <Label htmlFor="remember-me" className="cursor-pointer">Stay logged in</Label>
            </div>
          )}
          
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : mode === 'login' ? 'Sign in' : 'Sign up'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <Button 
            variant="link" 
            className="pl-1 pr-0" 
            onClick={() => navigate(mode === 'login' ? '/signup' : '/login')}
            type="button"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
