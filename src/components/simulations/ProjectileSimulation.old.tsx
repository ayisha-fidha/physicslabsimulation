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
  const setupCompleted = useRef(false);
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
    currentParams: { ...params },
    trail: [] as { x: number; y: number }[]
  });

  // Function to reset the simulation
  const resetSimulation = () => {
    const state = animationState.current;
    state.time = 0;
    state.x = 50;
    state.y = state.canvasHeight - state.gridSize;
    state.isLaunched = false;
    state.lastFrameTime = 0;
    state.currentParams = { ...params };
    state.trail = [];
  };

  // Main simulation effect
  useEffect(() => {
    if (!containerRef.current || p5InstanceRef.current) return;

    const sketch = (p: p5) => {
      p.setup = () => {
        if (setupCompleted.current) return;
        
        p.pixelDensity(1);
        p.frameRate(60);
        const canvas = p.createCanvas(containerRef.current!.clientWidth, containerRef.current!.clientHeight);
        canvas.parent(containerRef.current!);
        
        const state = animationState.current;
        state.canvasWidth = p.width;
        state.canvasHeight = p.height;
        state.y = state.canvasHeight - state.gridSize; // Set initial y position
        resetSimulation();
        setupCompleted.current = true;
      };

      p.draw = () => {
        const state = animationState.current;
        const currentTime = p.millis();
        
        // Initialize lastFrameTime on first frame
        if (state.lastFrameTime === 0) {
          state.lastFrameTime = currentTime;
          return;
        }

        const deltaTime = Math.min((currentTime - state.lastFrameTime) / 1000, 0.1);
        state.lastFrameTime = currentTime;

        // Clear the canvas and draw background
        p.clear();
        p.background(15, 18, 25);
        p.push();

        // Draw grid
        p.stroke(100, 100, 255, 30);
        p.strokeWeight(1);
        
        // Draw ground first
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

        // Handle simulation state
        if (!isRunning && state.isLaunched) {
          // Pause but don't reset
          state.lastFrameTime = currentTime;
        }

        // Start new launch
        if (isRunning && !state.isLaunched) {
          state.isLaunched = true;
          state.time = 0;
          state.x = 50;
          state.y = state.canvasHeight - state.gridSize;
          state.lastFrameTime = currentTime;
          state.trail = []; // Clear trail for new launch
          state.currentParams = { ...params }; // Update parameters on new launch
        }

        // Update physics if running and launched
        if (isRunning && state.isLaunched) {
          const angleRad = (state.currentParams.angle * Math.PI) / 180;
          const speed = state.currentParams.length;
          const vx = speed * Math.cos(angleRad);
          const vy = -speed * Math.sin(angleRad);

          state.time += deltaTime;

          // Calculate new position with scaled physics
          const newX = Math.round(50 + vx * state.time * state.pixelsPerMeter);
          const newY = Math.round((state.canvasHeight - state.gridSize) + 
                      (vy * state.time + 0.5 * state.currentParams.gravity * state.time * state.time) * state.pixelsPerMeter);

          // Update position
          state.x = newX;
          state.y = newY;

          // Add point to trail
          state.trail.push({ x: newX, y: newY });

          // Limit trail length
          if (state.trail.length > 100) {
            state.trail.shift();
          }

          // Check ground collision
          if (state.y >= state.canvasHeight - state.gridSize) {
            state.y = state.canvasHeight - state.gridSize;
            state.isLaunched = false;
          }

          // Update measurements
          if (onMeasurement) {
            const currentVy = vy + state.currentParams.gravity * state.time;
            onMeasurement({
              time: state.time,
              x: (state.x - 50) / state.pixelsPerMeter,
              y: (state.canvasHeight - state.gridSize - state.y) / state.pixelsPerMeter,
              velocity: Math.sqrt(vx * vx + currentVy * currentVy),
              angle: state.currentParams.angle
            });
          }
        }

        // Draw trail
        if (state.trail.length > 1) {
          p.stroke(255, 150, 50, 100);
          p.strokeWeight(2);
          p.noFill();
          p.beginShape();
          state.trail.forEach(point => {
            p.vertex(point.x, point.y);
          });
          p.endShape();
        }

        // Draw trajectory prediction when not launched
        if (!state.isLaunched) {
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

        // Draw projectile with antialiasing
        p.push();
        p.fill(255, 150, 50);
        p.noStroke();
        p.circle(state.x, state.y, 16);
        p.pop();

        p.pop();
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

    // Create new p5 instance
    p5InstanceRef.current = new p5(sketch);

    // Cleanup function
    return () => {
      if (p5InstanceRef.current) {
        setupCompleted.current = false;
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array since we handle updates in the draw function

  // Handle parameter updates and simulation control
  useEffect(() => {
    const state = animationState.current;
    if (!isRunning) {
      state.currentParams = { ...params };
    }
  }, [params, isRunning]);

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