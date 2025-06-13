
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import DashboardContent from '@/components/dashboard/DashboardContent';
import UserProfile from '@/components/dashboard/UserProfile';
import { useState } from 'react';

const Dashboard = () => {
  const { user, profile, signOut } = useSupabaseAuth();
  const navigate = useNavigate();
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-weather-light animate-fade-in">
      <DashboardHeader 
        userEmail={user?.email} 
        onLogout={handleLogout} 
        onProfileClick={toggleUserProfile}
      />

      <main className="flex-1 container py-8 max-w-6xl">
        <div className="space-y-8">
          <section className="animate-slide-down">
            <h1 className="text-3xl font-bold mb-4">Your Weather Dashboard</h1>
            
            {showUserProfile ? (
              <div className="mb-8">
                <UserProfile />
                <button 
                  onClick={toggleUserProfile} 
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Back to Weather
                </button>
              </div>
            ) : (
              <DashboardContent 
                userLocation={profile?.location || 'New York, NY'} 
              />
            )}
          </section>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
