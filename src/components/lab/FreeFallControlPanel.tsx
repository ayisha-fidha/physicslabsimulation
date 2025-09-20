import React from 'react';
import { Card } from '@/components/ui/card';

export interface FreeFallParams {
  height: number;
  gravity: number;
}

interface FreeFallControlPanelProps {
  params: FreeFallParams;
  onParamsChange: (params: FreeFallParams) => void;
}

export const FreeFallControlPanel: React.FC<FreeFallControlPanelProps> = ({ params, onParamsChange }) => {
  return (
    <Card className="lab-panel p-4 border-primary/20 bg-background/95">
      <div className="mb-4 text-lg font-semibold text-primary">Free Fall Parameters</div>
      <div className="space-y-4">
        <div className="parameter-group">
          <label className="block mb-2 text-sm font-medium">Initial Height (m)</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={params.height}
              onChange={e => onParamsChange({ ...params, height: Number(e.target.value) })}
              className="flex-1"
            />
            <div className="w-20 px-2 py-1 text-center border border-primary/20 rounded bg-background/50">
              {params.height} m
            </div>
          </div>
        </div>

        <div className="parameter-group">
          <label className="block mb-2 text-sm font-medium">Gravity (m/s²)</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={20}
              step={0.1}
              value={params.gravity}
              onChange={e => onParamsChange({ ...params, gravity: Number(e.target.value) })}
              className="flex-1"
            />
            <div className="w-20 px-2 py-1 text-center border border-primary/20 rounded bg-background/50">
              {params.gravity.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded bg-primary/5 border border-primary/10">
          <div className="text-xs text-primary/80">
            Current Settings:
            <div className="mt-1 grid grid-cols-2 gap-2">
              <div>Height: {params.height} m</div>
              <div>Gravity: {params.gravity.toFixed(1)} m/s²</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
