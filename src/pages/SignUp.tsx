
import React from 'react';
import AuthForm from '@/components/ui/auth-form';
import { Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-weather-light">
      <div className="flex items-center justify-center p-6 cursor-pointer" onClick={() => navigate('/')}>
        <Sun className="h-6 w-6 text-weather-blue mr-2" />
        <span className="font-bold text-xl">WindowsWorld Weather</span>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
};

export default SignUp;
