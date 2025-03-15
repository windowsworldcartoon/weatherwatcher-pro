
import React from 'react';
import { Card } from '@/components/ui/card';

interface DetailedInfoProps {
  detailedForecast: string;
}

const DetailedInfo: React.FC<DetailedInfoProps> = ({ detailedForecast }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
      <Card className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Detailed Forecast</h2>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {detailedForecast}
          </p>
        </div>
      </Card>

      <Card className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">About This Data</h2>
        <p className="text-muted-foreground">
          Weather data is provided by the National Weather Service API. It is updated regularly to provide
          the most accurate forecasts and conditions for your location.
        </p>
        <p className="text-muted-foreground mt-2">
          Last updated: {new Date().toLocaleString()}
        </p>
      </Card>
    </section>
  );
};

export default DetailedInfo;
