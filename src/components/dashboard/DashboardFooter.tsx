
import React from 'react';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="py-6 px-6 border-t text-center text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} WindowsWorld Weather. All rights reserved.</p>
      <p className="mt-2">Powered by the National Weather Service API.</p>
    </footer>
  );
};

export default DashboardFooter;
