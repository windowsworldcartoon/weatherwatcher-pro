
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Sun, User } from 'lucide-react';

interface DashboardHeaderProps {
  userEmail?: string;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userEmail, onLogout }) => {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center border-b">
      <div className="flex items-center space-x-2">
        <Sun className="h-6 w-6 text-weather-blue" />
        <span className="font-bold text-xl">WindowsWorld Weather</span>
      </div>
      <div className="flex items-center space-x-4">
        {userEmail && (
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground hidden sm:inline">{userEmail}</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
