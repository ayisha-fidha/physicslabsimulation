import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import { SimulationParams } from '../PhysicsLab';

interface ProjectileSimulationProps {
  params: SimulationParams;
  isRunning: boolean;
  onMeasurement?: (measurements: {
    time: number;
    x: number;
    y: number;
    velocity: number;
    angle: number;
  }) => void;
}

export const ProjectileSimulation: React.FC<ProjectileSimulationProps> = ({
  params,
  isRunning,
  onMeasurement
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const animationState = useRef({
    x: 50,
    y: 0,
    time: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    gridSize: 40,
    pixelsPerMeter: 30,
    isLaunched: false,
    lastFrameTime: 0,
    wasRunning: false,
    trail: [] as { x: number; y: number }[]
  });

  const resetSimulation = () => {
    const state = animationState.current;
    state.time = 0;
    state.x = 50;
    state.y = state.canvasHeight - state.gridSize;
    state.isLaunched = false;
    state.lastFrameTime = 0;
    state.trail = [];
    state.wasRunning = false;
  };

  useEffect(() => {
    if (!containerRef.current || p5InstanceRef.current) return;

    const sketch = (p: p5) => {
      p.setup = () => {
        p.pixelDensity(1);
        p.frameRate(60);
        const canvas = p.createCanvas(containerRef.current!.clientWidth, containerRef.current!.clientHeight);
        canvas.parent(containerRef.current!);
        
        const state = animationState.current;
        state.canvasWidth = p.width;
        state.canvasHeight = p.height;
        state.y = state.canvasHeight - state.gridSize;
        resetSimulation();
      };

      p.draw = () => {
        const state = animationState.current;
        const currentTime = p.millis();

        // Handle start/stop transitions
        if (isRunning && !state.wasRunning) {
          // Just started running
          state.lastFrameTime = currentTime;
          if (!state.isLaunched) {
            state.isLaunched = true;
            state.time = 0;
            state.x = 50;
            state.y = state.canvasHeight - state.gridSize;
            state.trail = [];
          }
        }
        state.wasRunning = isRunning;
        
        // Initialize lastFrameTime on first frame
        if (state.lastFrameTime === 0) {
          state.lastFrameTime = currentTime;
          return;
        }

        const deltaTime = Math.min((currentTime - state.lastFrameTime) / 1000, 0.1);
        state.lastFrameTime = currentTime;

        // Clear and set background
        p.clear();
        p.background(15, 18, 25);
        
        // Draw grid
        p.stroke(100, 100, 255, 30);
        p.strokeWeight(1);
        
        // Draw ground
        p.noStroke();
        p.fill(80, 200, 120);
        p.rect(0, state.canvasHeight - state.gridSize, state.canvasWidth, state.gridSize);

        // Grid lines with labels
        for (let x = 0; x <= state.canvasWidth; x += state.gridSize) {
          p.stroke(100, 100, 255, 30);
          p.line(x, 0, x, state.canvasHeight - state.gridSize);
          if (x % (state.gridSize * 2) === 0) {
            p.fill(200, 200, 255, 80);
            p.noStroke();
            p.textAlign(p.CENTER);
            p.text(`${Math.floor(x / state.pixelsPerMeter)}m`, x, state.canvasHeight - 10);
          }
        }

        for (let y = 0; y <= state.canvasHeight - state.gridSize; y += state.gridSize) {
          p.stroke(100, 100, 255, 30);
          p.line(0, y, state.canvasWidth, y);
          if (y % (state.gridSize * 2) === 0) {
            p.fill(200, 200, 255, 80);
            p.noStroke();
            p.textAlign(p.RIGHT);
            p.text(`${Math.floor((state.canvasHeight - state.gridSize - y) / state.pixelsPerMeter)}m`, 30, y + 4);
          }
        }

        // Update physics if running and launched
        if (isRunning && state.isLaunched) {
          const angleRad = (params.angle * Math.PI) / 180;
          const speed = params.length;
          const vx = speed * Math.cos(angleRad);
          const vy = -speed * Math.sin(angleRad);

          state.time += deltaTime;

          // Calculate new position
          const newX = Math.round(50 + vx * state.time * state.pixelsPerMeter);
          const newY = Math.round((state.canvasHeight - state.gridSize) + 
                      (vy * state.time + 0.5 * params.gravity * state.time * state.time) * state.pixelsPerMeter);

          // Update position
          state.x = newX;
          state.y = newY;
          
          // Add to trail
          state.trail.push({ x: state.x, y: state.y });
          if (state.trail.length > 50) {
            state.trail.shift();
          }

          // Check ground collision
          if (state.y >= state.canvasHeight - state.gridSize) {
            state.y = state.canvasHeight - state.gridSize;
            state.isLaunched = false;
          }

          // Update measurements
          if (onMeasurement) {
            const currentVy = vy + params.gravity * state.time;
            onMeasurement({
              time: state.time,
              x: (state.x - 50) / state.pixelsPerMeter,
              y: (state.canvasHeight - state.gridSize - state.y) / state.pixelsPerMeter,
              velocity: Math.sqrt(vx * vx + currentVy * currentVy),
              angle: params.angle
            });
          }
        }

        // Draw trail if it exists
        if (state.trail.length > 1) {
          p.stroke(255, 150, 50, 150);
          p.strokeWeight(2);
          p.noFill();
          p.beginShape();
          state.trail.forEach(point => {
            p.vertex(point.x, point.y);
          });
          p.endShape();
        }

        // Draw trajectory prediction
        if (!state.isLaunched || !isRunning) {
          p.stroke(255, 150, 50, 80);
          p.strokeWeight(2);
          p.noFill();
          p.beginShape();
          
          const angleRad = (params.angle * Math.PI) / 180;
          const speed = params.length;
          const vx = speed * Math.cos(angleRad);
          const vy = -speed * Math.sin(angleRad);

          for (let t = 0; t <= 3; t += 0.1) {
            const px = Math.round(50 + vx * t * state.pixelsPerMeter);
            const py = Math.round((state.canvasHeight - state.gridSize) + 
                      (vy * t + 0.5 * params.gravity * t * t) * state.pixelsPerMeter);
            if (py <= state.canvasHeight - state.gridSize) {
              p.vertex(px, py);
            }
          }
          p.endShape();
        }

        // Draw projectile
        p.fill(255, 150, 50);
        p.noStroke();
        p.circle(state.x, state.y, 16);
      };

      p.windowResized = () => {
        if (!containerRef.current) return;
        const state = animationState.current;
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        
        if (newWidth === state.canvasWidth && newHeight === state.canvasHeight) return;
        
        p.resizeCanvas(newWidth, newHeight);
        state.canvasWidth = newWidth;
        state.canvasHeight = newHeight;
        
        if (!state.isLaunched) {
          resetSimulation();
        }
      };
    };

    p5InstanceRef.current = new p5(sketch);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []);

  // Handle resets
  useEffect(() => {
    const state = animationState.current;
    if (!state.isLaunched) {
      resetSimulation();
    }
  }, [params]);

  return (
    <div className="w-full h-full relative" style={{ minHeight: '400px' }}>
      <div
        ref={containerRef}
        className="w-full h-full bg-background/50 rounded"
        style={{ cursor: 'default' }}
      />
    </div>
  );
};