import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Settings, Ruler, Gauge, ArrowUpRight, ArrowRight } from 'lucide-react';

export interface ProjectileParams {
  speed: number;
  angle: number;
  gravity: number;
}

interface ProjectileControlPanelProps {
  params: ProjectileParams;
  onParamsChange: (params: ProjectileParams) => void;
  isRunning: boolean;
}

export const ProjectileControlPanel: React.FC<ProjectileControlPanelProps> = ({
  params,
  onParamsChange,
  isRunning
}) => {
  const updateParam = (key: keyof ProjectileParams, value: number) => {
    onParamsChange({ ...params, [key]: value });
  };

  const controls = [
    {
      key: 'speed' as keyof ProjectileParams,
      label: 'Initial Speed',
      value: params.speed,
      min: 10,
      max: 100,
      step: 1,
      unit: 'm/s',
      icon: ArrowRight,
      color: 'text-lab-cyan'
    },
    {
      key: 'angle' as keyof ProjectileParams,
      label: 'Launch Angle',
      value: params.angle,
      min: 5,
      max: 85,
      step: 1,
      unit: '°',
      icon: ArrowUpRight,
      color: 'text-lab-yellow'
    },
    {
      key: 'gravity' as keyof ProjectileParams,
      label: 'Gravity',
      value: params.gravity,
      min: 1,
      max: 20,
      step: 0.1,
      unit: 'm/s²',
      icon: Gauge,
      color: 'text-lab-purple'
    }
  ];

  return (
    <Card className="lab-panel p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Settings className="w-4 h-4 text-primary" />
        Projectile Parameters
      </h3>
      <div className="space-y-6">
        {controls.map((control) => {
          const Icon = control.icon;
          return (
            <div key={control.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-foreground flex items-center gap-2">
                  <Icon className={`w-3 h-3 ${control.color}`} />
                  {control.label}
                </Label>
                <div className={`lab-display px-2 py-1 text-xs ${control.color}`}>
                  {control.value.toFixed(control.step < 0.1 ? 3 : control.step < 1 ? 1 : 0)}
                  {control.unit && ` ${control.unit}`}
                </div>
              </div>
              <Slider
                value={[control.value]}
                onValueChange={(values) => updateParam(control.key, values[0])}
                min={control.min}
                max={control.max}
                step={control.step}
                className="lab-control"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{control.min}{control.unit}</span>
                <span>{control.max}{control.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
