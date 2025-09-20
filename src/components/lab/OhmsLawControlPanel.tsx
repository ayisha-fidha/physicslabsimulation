import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Zap, Battery } from 'lucide-react';

export interface OhmsLawParams {
  voltage: number;
  resistance: number;
}

interface OhmsLawControlPanelProps {
  params: OhmsLawParams;
  onParamsChange: (params: OhmsLawParams) => void;
}

export const OhmsLawControlPanel: React.FC<OhmsLawControlPanelProps> = ({
  params,
  onParamsChange
}) => {
  const updateParam = (key: keyof OhmsLawParams, value: number) => {
    onParamsChange({ ...params, [key]: value });
  };

  const controls = [
    {
      key: 'voltage' as keyof OhmsLawParams,
      label: 'Voltage (V)',
      value: params.voltage,
      min: 0,
      max: 20,
      step: 0.1,
      unit: 'V',
      icon: Battery,
      color: 'text-lab-cyan'
    },
    {
      key: 'resistance' as keyof OhmsLawParams,
      label: 'Resistance (Ω)',
      value: params.resistance,
      min: 1,
      max: 100,
      step: 1,
      unit: 'Ω',
      icon: Zap,
      color: 'text-lab-yellow'
    }
  ];

  return (
    <Card className="lab-panel p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary" />
        Ohm's Law Parameters
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
