import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Settings, Ruler, Weight, RotateCcw, Gauge, Waves } from 'lucide-react';
import { SimulationParams } from '../PhysicsLab';

interface ControlPanelProps {
  params: SimulationParams;
  onParamsChange: (params: SimulationParams) => void;
  isRunning: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  params,
  onParamsChange,
  isRunning
}) => {
  const updateParam = (key: keyof SimulationParams, value: number) => {
    onParamsChange({ ...params, [key]: value });
  };

  const controls = [
    {
      key: 'length' as keyof SimulationParams,
      label: 'Pendulum Length',
      value: params.length,
      min: 50,
      max: 300,
      step: 10,
      unit: 'cm',
      icon: Ruler,
      color: 'text-lab-cyan'
    },
    {
      key: 'mass' as keyof SimulationParams,
      label: 'Bob Mass',
      value: params.mass,
      min: 1,
      max: 50,
      step: 1,
      unit: 'kg',
      icon: Weight,
      color: 'text-lab-orange'
    },
    {
      key: 'angle' as keyof SimulationParams,
      label: 'Initial Angle',
      value: params.angle,
      min: 5,
      max: 89,
      step: 1,
      unit: '°',
      icon: RotateCcw,
      color: 'text-lab-yellow'
    },
    {
      key: 'gravity' as keyof SimulationParams,
      label: 'Gravity',
      value: params.gravity,
      min: 1,
      max: 20,
      step: 0.1,
      unit: 'm/s²',
      icon: Gauge,
      color: 'text-lab-purple'
    },
    {
      key: 'damping' as keyof SimulationParams,
      label: 'Air Resistance',
      value: params.damping,
      min: 0.98,
      max: 1.0,
      step: 0.001,
      unit: '',
      icon: Waves,
      color: 'text-lab-green'
    }
  ];

  return (
    <Card className="lab-panel p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Settings className="w-4 h-4 text-primary" />
        Parameters
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