import { FreeFallControlPanel, FreeFallParams } from './lab/FreeFallControlPanel';

import { WaveInterferenceSimulation } from './simulations/WaveInterferenceSimulation';
import { WaveInterferenceControlPanel, WaveInterferenceParams } from './lab/WaveInterferenceControlPanel';
import { FreeFallSimulation } from './simulations/FreeFallSimulation';
import { OhmsLawSimulation } from './simulations/OhmsLawSimulation';
import { OhmsLawControlPanel, OhmsLawParams } from './lab/OhmsLawControlPanel';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PendulumSimulation } from './simulations/PendulumSimulation';
import { ProjectileSimulation } from './simulations/ProjectileSimulation';
import { ControlPanel } from './lab/ControlPanel';
import { ProjectileControlPanel, ProjectileParams } from './lab/ProjectileControlPanel';
import { DataDisplay } from './lab/DataDisplay';
import { ExperimentSelector } from './lab/ExperimentSelector';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';

export interface SimulationParams {
  length: number;
  mass: number;
  angle: number;
  gravity: number;
  damping: number;
}

export const PhysicsLab: React.FC = () => {
  const defaultFreeFallParams: FreeFallParams = {
    height: 50,
    gravity: 9.81
  };
  const [freeFallParams, setFreeFallParams] = useState<FreeFallParams>(defaultFreeFallParams);
  // ...existing code...
  const defaultOhmsLawParams: OhmsLawParams = {
    voltage: 10,
    resistance: 10
  };
  const [ohmsLawParams, setOhmsLawParams] = useState<OhmsLawParams>(defaultOhmsLawParams);
  // Track launches for projectile
  const [projectileLaunchKey, setProjectileLaunchKey] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentExperiment, setCurrentExperiment] = useState('pendulum');
  const [freeFallResetKey, setFreeFallResetKey] = useState(0);
  const defaultParams: SimulationParams = {
    length: 200,
    mass: 10,
    angle: 45,
    gravity: 9.81,
    damping: 0.995
  };
  const defaultProjectileParams: ProjectileParams = {
    speed: 50,
    angle: 45,
    gravity: 9.81
  };
  const [params, setParams] = useState<SimulationParams>(defaultParams);
  const [projectileParams, setProjectileParams] = useState<ProjectileParams>(defaultProjectileParams);
  
  // ...existing code...
  
  const [measurements, setMeasurements] = useState({
    period: 0,
    frequency: 0,
    velocity: 0,
    acceleration: 0,
    energy: 0
  });

  // Add a reset counter to force re-mount
  const [resetCount, setResetCount] = useState(0);

  const defaultWaveParams: WaveInterferenceParams = {
    freq1: 1,
    freq2: 1.2,
    amp1: 60,
    amp2: 60
  };
  const [waveParams, setWaveParams] = useState<WaveInterferenceParams>(defaultWaveParams);
  const handleStart = () => {
    setIsRunning(true);
  };
  const handlePause = () => {
    setIsRunning(false);
  };
  const handleReset = () => {
  setParams(defaultParams);
  setProjectileParams(defaultProjectileParams);
    setMeasurements({
      period: 0,
      frequency: 0,
      velocity: 0,
      acceleration: 0,
      energy: 0
    });
    setIsRunning(true);
    setResetCount((c) => c + 1);
    setProjectileLaunchKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-background lab-grid">
      {/* Lab Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary neon-text" />
                <h1 className="text-2xl font-bold text-foreground">
                  Physics Lab <span className="text-primary neon-text">Emulator</span>
                </h1>
              </div>
              <Badge variant="secondary" className="text-accent border-accent/30">
                v1.0 Beta
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="lab-display px-3 py-1 text-sm text-primary">
                STATUS: {isRunning ? 'RUNNING' : 'STANDBY'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Experiment Selection & Controls */}
        <div className="lg:col-span-1 space-y-6">
          <ExperimentSelector 
            currentExperiment={currentExperiment}
            onExperimentChange={(exp) => {
              console.log('Switching to experiment:', exp);
              setCurrentExperiment(exp);
            }}
          />
          
          {/* Control Panels */}
          {currentExperiment === 'free-fall' && (
            <FreeFallControlPanel 
              params={freeFallParams} 
              onParamsChange={setFreeFallParams} 
            />
          )}
          
          {currentExperiment === 'pendulum' && (
            <ControlPanel 
              params={params}
              onParamsChange={setParams}
              isRunning={isRunning}
            />
          )}
          {currentExperiment === 'waves' && (
            <WaveInterferenceControlPanel
              params={waveParams}
              onParamsChange={setWaveParams}
            />
          )}
          {currentExperiment === 'projectile' && (
            <ProjectileControlPanel
              params={projectileParams}
              onParamsChange={setProjectileParams}
              isRunning={isRunning}
            />
          )}
          {currentExperiment === 'ohms-law' && (
            <OhmsLawControlPanel
              params={ohmsLawParams}
              onParamsChange={setOhmsLawParams}
            />
          )}

          {/* Control Buttons */}
          <Card className="lab-panel p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Simulation Control
            </h3>
            <div className="flex flex-col gap-2">
              <Button 
                onClick={isRunning ? handlePause : handleStart}
                className="lab-control bg-primary hover:bg-primary/80 text-primary-foreground"
                size="sm"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button 
                onClick={handleReset}
                variant="outline"
                className="lab-control border-border hover:border-accent hover:text-accent"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </Card>
        </div>

        {/* Center - Simulation Canvas */}
        <div className="lg:col-span-2">
          <Card className="lab-panel p-4 h-[600px]">
            <div className="w-full h-full border border-primary/20 rounded bg-background/50">
              {currentExperiment === 'free-fall' && (
                <FreeFallSimulation 
                  key={`freefall-${freeFallResetKey}`}
                  params={freeFallParams} 
                  isRunning={isRunning}
                />
              )}
              {currentExperiment === 'pendulum' && (
                <PendulumSimulation 
                  key={resetCount + '-' + JSON.stringify(params)}
                  params={params}
                  isRunning={isRunning}
                  onMeasurement={setMeasurements}
                />
              )}
              {currentExperiment === 'projectile' && (
                <ProjectileSimulation
                  key={`projectile-${resetCount}`}
                  params={{
                    length: projectileParams.speed,
                    mass: 1,
                    angle: projectileParams.angle,
                    gravity: projectileParams.gravity,
                    damping: 1
                  }}
                  isRunning={isRunning}
                  onMeasurement={(m) => setMeasurements({
                    period: m.time,
                    frequency: m.x,
                    velocity: m.velocity,
                    acceleration: m.y,
                    energy: m.angle
                  })}
                />
              )}
              {currentExperiment === 'waves' && (
                <WaveInterferenceSimulation params={waveParams} />
              )}
              {currentExperiment === 'ohms-law' && (
                <OhmsLawSimulation
                  params={ohmsLawParams}
                  onParamsChange={setOhmsLawParams}
                />
              )}
            </div>
          </Card>
        </div>

        {/* Right Panel - Data & Measurements */}
        <div className="lg:col-span-1">
          <DataDisplay measurements={measurements} />
        </div>
      </div>
    </div>
  );
};