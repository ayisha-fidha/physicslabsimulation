import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Waves } from 'lucide-react';

export interface WaveInterferenceParams {
  freq1: number;
  freq2: number;
  amp1: number;
  amp2: number;
}

interface WaveInterferenceControlPanelProps {
  params: WaveInterferenceParams;
  onParamsChange: (params: WaveInterferenceParams) => void;
}

export const WaveInterferenceControlPanel: React.FC<WaveInterferenceControlPanelProps> = ({
  params,
  onParamsChange
}) => {
  const updateParam = (key: keyof WaveInterferenceParams, value: number) => {
    onParamsChange({ ...params, [key]: value });
  };

  const controls = [
    {
      key: 'freq1' as keyof WaveInterferenceParams,
      label: 'Frequency 1',
      value: params.freq1,
      min: 0.5,
      max: 3,
      step: 0.01,
      unit: 'Hz',
      icon: Waves,
      color: 'text-lab-cyan'
    },
    {
      key: 'freq2' as keyof WaveInterferenceParams,
      label: 'Frequency 2',
      value: params.freq2,
      min: 0.5,
      max: 3,
      step: 0.01,
      unit: 'Hz',
      icon: Waves,
      color: 'text-lab-green'
    },
    {
      key: 'amp1' as keyof WaveInterferenceParams,
      label: 'Amplitude 1',
      value: params.amp1,
      min: 20,
      max: 100,
      step: 1,
      unit: '',
      icon: Waves,
      color: 'text-lab-yellow'
    },
    {
      key: 'amp2' as keyof WaveInterferenceParams,
      label: 'Amplitude 2',
      value: params.amp2,
      min: 20,
      max: 100,
      step: 1,
      unit: '',
      icon: Waves,
      color: 'text-lab-purple'
    }
  ];

  return (
    <Card className="lab-panel p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Waves className="w-4 h-4 text-primary" />
        Wave Interference Parameters
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
                  {control.value.toFixed(control.step < 1 ? 2 : 0)}
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
