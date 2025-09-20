import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Clock, 
  Zap, 
  TrendingUp, 
  Activity,
  Battery
} from 'lucide-react';

interface Measurements {
  period: number;
  frequency: number;
  velocity: number;
  acceleration: number;
  energy: number;
}

interface DataDisplayProps {
  measurements: Measurements;
}

export const DataDisplay: React.FC<DataDisplayProps> = ({ measurements }) => {
  const dataPoints = [
    {
      label: 'Period',
      value: measurements.period,
      unit: 's',
      icon: Clock,
      color: 'text-lab-cyan',
      description: 'Time for one complete oscillation'
    },
    {
      label: 'Frequency',
      value: measurements.frequency,
      unit: 'Hz',
      icon: Activity,
      color: 'text-lab-green',
      description: 'Oscillations per second'
    },
    {
      label: 'Velocity',
      value: measurements.velocity,
      unit: 'm/s',
      icon: TrendingUp,
      color: 'text-lab-orange',
      description: 'Current velocity magnitude'
    },
    {
      label: 'Acceleration',
      value: measurements.acceleration,
      unit: 'm/s²',
      icon: Zap,
      color: 'text-lab-yellow',
      description: 'Current acceleration magnitude'
    },
    {
      label: 'Total Energy',
      value: measurements.energy,
      unit: 'J',
      icon: Battery,
      color: 'text-lab-purple',
      description: 'Kinetic + Potential energy'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Real-time Measurements */}
      <Card className="lab-panel p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Live Measurements
        </h3>
        
        <div className="space-y-4">
          {dataPoints.map((point, index) => {
            const Icon = point.icon;
            const isActive = Math.abs(point.value) > 0.01;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${point.color}`} />
                    <span className="text-sm font-medium text-foreground">
                      {point.label}
                    </span>
                  </div>
                  <Badge 
                    variant={isActive ? "default" : "secondary"}
                    className={`lab-display font-mono text-xs ${
                      isActive ? point.color : 'text-muted-foreground'
                    }`}
                  >
                    {point.value.toFixed(2)} {point.unit}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {point.description}
                </p>
                
                {/* Visual indicator bar */}
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      isActive ? 'bg-gradient-to-r from-primary to-accent' : 'bg-muted'
                    }`}
                    style={{ 
                      width: isActive ? `${Math.min(Math.abs(point.value / 10) * 100, 100)}%` : '0%' 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Performance Monitor */}
      <Card className="lab-panel p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          System Status
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Simulation</span>
            <Badge 
              variant="secondary" 
              className="text-accent border-accent/30 animate-glow-pulse"
            >
              Real-time
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Physics Engine</span>
            <Badge variant="secondary" className="text-lab-green border-lab-green/30">
              Stable
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Data Quality</span>
            <Badge variant="secondary" className="text-primary border-primary/30">
              High Precision
            </Badge>
          </div>
        </div>
      </Card>

      {/* Quick Tips */}
      <Card className="lab-panel p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          💡 Lab Tips
        </h3>
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>• Adjust the angle to see how it affects the period</p>
          <p>• Try different masses - does it change the frequency?</p>
          <p>• Observe energy conservation during oscillation</p>
          <p>• Add damping to simulate real-world conditions</p>
        </div>
      </Card>
    </div>
  );
};