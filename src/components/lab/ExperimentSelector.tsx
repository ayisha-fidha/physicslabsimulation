import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Target, 
  Zap, 
  Waves, 
  ArrowDown,
  Clock
} from 'lucide-react';

interface ExperimentSelectorProps {
  currentExperiment: string;
  onExperimentChange: (experiment: string) => void;
}

const experiments = [
  {
    id: 'pendulum',
    name: 'Simple Pendulum',
    icon: Clock,
    description: 'Study periodic motion and energy conservation',
    status: 'active',
    difficulty: 'Beginner'
  },
  {
    id: 'projectile',
    name: 'Projectile Motion',
    icon: Target,
    description: 'Analyze trajectory and range calculations',
    status: 'active',
    difficulty: 'Intermediate'
  },
  {
    id: 'ohms-law',
    name: "Ohm's Law",
    icon: Zap,
    description: 'Explore voltage, current, and resistance',
    status: 'active',  
    difficulty: 'Beginner'
  },
  {
    id: 'free-fall',
    name: 'Free Fall',
    icon: ArrowDown,
    description: 'Study gravity and constant acceleration',
    status: 'active',
    difficulty: 'Beginner'
  },
  {
    id: 'waves',
    name: 'Wave Interference',
    icon: Waves,
    description: 'Visualize wave superposition effects',
    status: 'active',
    difficulty: 'Advanced'
  }
];

export const ExperimentSelector: React.FC<ExperimentSelectorProps> = ({
  currentExperiment,
  onExperimentChange
}) => {
  return (
    <Card className="lab-panel p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary" />
        Experiments
      </h3>
      
      <div className="space-y-2">
        {experiments.map((experiment) => {
          const Icon = experiment.icon;
          const isActive = experiment.id === currentExperiment;
          const isAvailable = experiment.status === 'active';
          
          return (
            <Button
              key={experiment.id}
              onClick={() => isAvailable && onExperimentChange(experiment.id)}
              variant={isActive ? "default" : "ghost"}
              className={`
                w-full justify-start p-3 h-auto lab-control
                ${isActive ? 'bg-primary text-primary-foreground' : ''}
                ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={!isAvailable}
            >
              <div className="flex items-start gap-3 w-full">
                <Icon className={`w-5 h-5 mt-0.5 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{experiment.name}</span>
                    {experiment.status === 'coming-soon' && (
                      <Badge variant="outline" className="text-xs px-1 py-0 text-muted-foreground">
                        Soon
                      </Badge>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed ${
                    isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {experiment.description}
                  </p>
                  <div className="mt-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        experiment.difficulty === 'Beginner' ? 'text-lab-green' :
                        experiment.difficulty === 'Intermediate' ? 'text-lab-orange' :
                        'text-lab-purple'
                      }`}
                    >
                      {experiment.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};