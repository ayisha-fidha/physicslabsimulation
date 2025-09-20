import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import { SimulationParams } from '../PhysicsLab';

interface PendulumSimulationProps {
  params: SimulationParams;
  isRunning: boolean;
  onMeasurement: (measurements: {
    period: number;
    frequency: number;
    velocity: number;
    acceleration: number;
    energy: number;
  }) => void;
}

export const PendulumSimulation: React.FC<PendulumSimulationProps> = ({
  params,
  isRunning,
  onMeasurement
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let angle = 0;
      let angleVelocity = 0;
      let angleAcceleration = 0;
      let origin = { x: 0, y: 0 };
      let bob = { x: 0, y: 0 };
      
      // Trail points for visual effect
      let trail: { x: number; y: number; alpha: number }[] = [];
      const maxTrailLength = 50;
      
      // Measurement tracking
      let lastTime = 0;
      let crossings = 0;
      let lastCrossing = 0;
      let periods: number[] = [];
      
      // Expose variables to parent scope for parameter updates
      (p as any).angle = angle;
      (p as any).angleVelocity = angleVelocity;
      (p as any).angleAcceleration = angleAcceleration;
      (p as any).trail = trail;
      (p as any).periods = periods;
      (p as any).crossings = crossings;
      
      p.setup = () => {
  // ...existing code...
        
        const canvas = p.createCanvas(
          containerRef.current!.clientWidth,
          containerRef.current!.clientHeight
        );
        canvas.parent(containerRef.current!);
        
        origin.x = p.width / 2;
        origin.y = 50;
        
        // Convert initial angle from degrees to radians
        angle = p.radians(params.angle);
        angleVelocity = 0;
        angleAcceleration = 0;
        
  // ...existing code...
        
        // Reset measurements
        trail = [];
        crossings = 0;
        periods = [];
        lastTime = p.millis();
        
        // Update references
        (p as any).angle = angle;
        (p as any).angleVelocity = angleVelocity;
        (p as any).angleAcceleration = angleAcceleration;
        (p as any).trail = trail;
        (p as any).periods = periods;
        (p as any).crossings = crossings;
      };

      p.draw = () => {
        // Dark lab background with subtle grid
        p.background(15, 18, 25);
        drawGrid();
        
        if (isRunning) {
          updatePhysics();
        }
        
        updateBobPosition();
        updateTrail();
        drawPendulum();
        drawMeasurements();
        drawUI();
        
        // ...existing code...
      };

      const updatePhysics = () => {
        // Pendulum physics equations
        const gravity = params.gravity;
        const length = params.length / 100; // Convert cm to meters for calculation
        const deltaTime = 1 / 60; // Fixed timestep for stable simulation
        
        // Angular acceleration = -(g/L) * sin(angle)
        angleAcceleration = -(gravity / length) * p.sin(angle);
        
        // Update velocity and position with fixed timestep
        angleVelocity += angleAcceleration * deltaTime;
        angleVelocity *= params.damping; // Apply damping
        angle += angleVelocity * deltaTime;
        
        // Update references for external access
        (p as any).angle = angle;
        (p as any).angleVelocity = angleVelocity;
        (p as any).angleAcceleration = angleAcceleration;
        
        // Track period measurements
        trackPeriod();
        
        // Calculate measurements
        const velocity = Math.abs(angleVelocity * params.length / 100);
        const acceleration = Math.abs(angleAcceleration * params.length / 100);
        const potentialEnergy = params.mass * gravity * (params.length / 100) * (1 - p.cos(angle));
        const kineticEnergy = 0.5 * params.mass * Math.pow(velocity, 2);
        const totalEnergy = potentialEnergy + kineticEnergy;
        
        const currentPeriod = periods.length > 0 ? 
          periods.slice(-3).reduce((a, b) => a + b, 0) / Math.min(periods.length, 3) : 0;
        
        onMeasurement({
          period: currentPeriod,
          frequency: currentPeriod > 0 ? 1 / currentPeriod : 0,
          velocity,
          acceleration,
          energy: totalEnergy
        });
      };

      const trackPeriod = () => {
        // Detect zero crossings to measure period
        if ((angle > 0 && angleVelocity < 0) || (angle < 0 && angleVelocity > 0)) {
          const currentTime = p.millis() / 1000;
          if (lastCrossing > 0) {
            const period = (currentTime - lastCrossing) * 2; // Half period * 2
            if (period > 0.1 && period < 10) { // Reasonable bounds
              periods.push(period);
              if (periods.length > 10) periods.shift(); // Keep last 10 measurements
            }
          }
          lastCrossing = currentTime;
        }
      };

      const updateBobPosition = () => {
        bob.x = origin.x + (params.length * 1.5) * p.sin(angle);
        bob.y = origin.y + (params.length * 1.5) * p.cos(angle);
      };

      const updateTrail = () => {
        if (isRunning) {
          trail.push({ x: bob.x, y: bob.y, alpha: 1.0 });
          if (trail.length > maxTrailLength) {
            trail.shift();
          }
        }
        
        // Fade trail points
        trail.forEach((point, index) => {
          point.alpha = (index / trail.length) * 0.6;
        });
      };

      const drawGrid = () => {
        p.stroke(30, 35, 45, 80);
        p.strokeWeight(0.5);
        
        const gridSize = 20;
        for (let x = 0; x < p.width; x += gridSize) {
          p.line(x, 0, x, p.height);
        }
        for (let y = 0; y < p.height; y += gridSize) {
          p.line(0, y, p.width, y);
        }
      };

      const drawPendulum = () => {
        // Draw trail
        for (let i = 1; i < trail.length; i++) {
          const point = trail[i];
          const prevPoint = trail[i - 1];
          
          p.stroke(0, 255, 255, point.alpha * 255);
          p.strokeWeight(2);
          p.line(prevPoint.x, prevPoint.y, point.x, point.y);
        }
        
        // Draw string
        p.stroke(100, 200, 255, 200);
        p.strokeWeight(2);
        p.line(origin.x, origin.y, bob.x, bob.y);
        
        // Draw pivot point
        p.fill(0, 255, 255);
        p.noStroke();
        p.circle(origin.x, origin.y, 12);
        
        // Add glow effect to pivot
        for (let r = 20; r > 0; r -= 4) {
          p.fill(0, 255, 255, (20 - r) * 2);
          p.circle(origin.x, origin.y, r);
        }
        
        // Draw bob
        const bobSize = Math.sqrt(params.mass) * 6 + 10;
        
        // Bob glow effect
        for (let r = bobSize + 15; r > bobSize; r -= 3) {
          p.fill(255, 100, 0, (bobSize + 15 - r) * 3);
          p.circle(bob.x, bob.y, r);
        }
        
        // Main bob
        p.fill(255, 150, 50);
        p.stroke(255, 200, 100);
        p.strokeWeight(2);
        p.circle(bob.x, bob.y, bobSize);
        
        // Bob highlight
        p.fill(255, 255, 200, 150);
        p.noStroke();
        p.circle(bob.x - bobSize * 0.2, bob.y - bobSize * 0.2, bobSize * 0.3);
      };

      const drawMeasurements = () => {
        // Angle indicator
        p.push();
        p.translate(origin.x, origin.y);
        
        // Draw angle arc
        p.noFill();
        p.stroke(255, 255, 0, 100);
        p.strokeWeight(2);
        const arcRadius = 40;
        p.arc(0, 0, arcRadius * 2, arcRadius * 2, 0, Math.abs(angle));
        
        // Angle text
        p.fill(255, 255, 0);
        p.noStroke();
        p.textAlign(p.CENTER);
        p.textSize(12);
        const angleText = `${p.degrees(angle).toFixed(1)}°`;
        p.text(angleText, arcRadius * 1.2 * p.sin(angle / 2), arcRadius * 1.2 * p.cos(angle / 2) - 5);
        
        p.pop();
      };

      const drawUI = () => {
        // Status indicator
        p.fill(isRunning ? 50 : 200, isRunning ? 255 : 50, 50);
        p.noStroke();
        p.circle(p.width - 30, 30, 16);
        
        // Status text
        p.fill(150, 200, 255);
        p.textAlign(p.RIGHT);
        p.textSize(12);
        p.text(isRunning ? 'RUNNING' : 'PAUSED', p.width - 50, 35);
        
        // Parameter display
        p.textAlign(p.LEFT);
        p.fill(100, 150, 200);
        p.textSize(10);
        const paramText = `L: ${params.length}cm | m: ${params.mass}kg | g: ${params.gravity}m/s²`;
        p.text(paramText, 10, p.height - 20);
      };

      p.windowResized = () => {
        p.resizeCanvas(
          containerRef.current!.clientWidth,
          containerRef.current!.clientHeight
        );
        origin.x = p.width / 2;
        origin.y = 50;
      };
    };

  // ...existing code...
    p5InstanceRef.current = new p5(sketch);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []);

  // Update simulation parameters - reset simulation when major params change
  useEffect(() => {
    if (p5InstanceRef.current) {
      // Reset the simulation when key parameters change
      const p5Instance = p5InstanceRef.current as any;
      if (p5Instance.setup) {
        // Reset angle and velocities
        p5Instance.angle = p5Instance.radians(params.angle);
        p5Instance.angleVelocity = 0;
        p5Instance.angleAcceleration = 0;
        p5Instance.trail = [];
        p5Instance.periods = [];
        p5Instance.crossings = 0;
      }
    }
  }, [params.angle, params.length, params.mass, params.gravity]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-background rounded border border-primary/10"
      style={{ minHeight: '400px' }}
    />
  );
};