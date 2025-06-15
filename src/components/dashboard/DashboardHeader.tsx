import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Bell } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface DashboardHeaderProps {
  userEmail?: string;
  onLogout: () => void;
  onProfileClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  userEmail, 
  onLogout,
  onProfileClick
}) => {
  const getInitials = (email?: string) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white dark:bg-background border-b shadow-sm animate-fade-in transition-colors">
      <div className="container flex justify-between items-center h-16 max-w-6xl">
        <Link to="/" className="flex items-center gap-2">
          <img src="/lovable-uploads/f8e2f98d-a4c1-4b36-aea7-5c7f8b9aef45.png" alt="Weather Icon" className="h-8 w-8" />
          <span className="font-semibold text-lg">Windows World Weather</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex space-x-1">
            <Link to="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link to="/severe-weather">
              <Button variant="ghost">
                <Bell className="mr-1 h-4 w-4" />
                Alerts
              </Button>
            </Link>
          </nav>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative rounded-full h-8 w-8 bg-primary/10">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {getInitials(userEmail)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {userEmail && (
                    <p className="text-sm font-medium">{userEmail}</p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={onProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
