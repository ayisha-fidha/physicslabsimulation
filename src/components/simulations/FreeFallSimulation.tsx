import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import { Card } from '@/components/ui/card';
import { FreeFallParams } from '../lab/FreeFallControlPanel';


export const FreeFallSimulation: React.FC<{ params: FreeFallParams; isRunning: boolean; onComplete?: () => void }> = ({ params, isRunning, onComplete }) => {
  console.log('[FreeFall] Rendering with params:', params, 'isRunning:', isRunning);
  console.log('FreeFallSimulation render - params:', params, 'isRunning:', isRunning);
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const [localLaunchKey, setLocalLaunchKey] = useState(0);

  useEffect(() => {
    console.log('FreeFall - Component mounted/updated with params:', params);
    if (!containerRef.current) return;
    let y = 0;
    let v = 0;
    let t = 0;
    let finished = false;
    const sketch = (p: p5) => {
      p.setup = () => {
        console.log('FreeFall p5.js setup');
        const canvasHeight = containerRef.current!.clientHeight;
        p.createCanvas(containerRef.current!.clientWidth, canvasHeight).parent(containerRef.current!);
        // Start from the top with proper scaling
        y = 30; // Start near the top (accounting for ball radius)
        v = 0;
        t = 0;
        finished = false;
      };
      p.draw = () => {
        // Clear and setup background
        p.background(15, 18, 25);
        
        // Calculate scale factor (pixels per meter)
        const scale = (p.height - 60) / params.height;
        
        // Draw vertical guide line
        p.stroke(200, 200, 255, 80);
        p.line(p.width / 2, 0, p.width / 2, p.height);
        
        // Draw grid lines
        p.stroke(100, 100, 255, 30);
        for (let i = 0; i <= params.height; i += 5) {
          const yPos = 30 + i * scale;
          p.line(0, yPos, p.width, yPos);
          // Draw height markers
          if (i % 10 === 0) {
            p.noStroke();
            p.fill(200, 200, 255, 80);
            p.textAlign(p.LEFT);
            p.textSize(12);
            p.text(`${params.height - i}m`, 10, yPos);
          }
        }
        
        // Draw ball
        p.noStroke();
        p.fill(255, 180, 80);
        const ballY = y + (v * 0.016 * scale);
        p.ellipse(p.width / 2, ballY, 32, 32);
        
        // Draw ground
        p.fill(80, 200, 120);
        p.rect(0, p.height - 20, p.width, 20);
        // Draw measurements panel
        p.noStroke();
        p.fill(0, 0, 0, 150);
        p.rect(p.width - 200, 10, 190, 100, 5);
        
        // Physics calculations
        if (!finished && isRunning) {
          const dt = 0.016; // 60 FPS
          v += params.gravity * dt; // Acceleration due to gravity
          const dy = v * dt;
          y += dy * scale; // Scale the movement
          t += dt;
          
          // Check if we've hit the ground
          if (y >= p.height - 50) {
            y = p.height - 50;
            finished = true;
            if (onComplete) onComplete();
          }
        }
        
        // Display real-time measurements
        p.fill(255);
        p.noStroke();
        p.textAlign(p.LEFT);
        p.textSize(14);
        const currentHeight = params.height - (y - 30) / scale;
        
        // Draw measurements
        p.fill(200, 200, 255);
        p.text(`Height: ${currentHeight.toFixed(1)} m`, p.width - 190, 35);
        p.text(`Velocity: ${v.toFixed(1)} m/s`, p.width - 190, 60);
        p.text(`Time: ${t.toFixed(2)} s`, p.width - 190, 85);
        
        // Draw status
        p.fill(220);
        p.textSize(16);
        p.text(`Height: ${params.height} m`, 20, 30);
        p.text(`Gravity: ${params.gravity.toFixed(2)} m/s²`, 20, 55);
        p.text(`Time: ${t.toFixed(2)} s`, 20, 80);
      };
      p.windowResized = () => {
        if (!containerRef.current) return;
        p.resizeCanvas(containerRef.current.clientWidth, containerRef.current.clientHeight);
      };
      (p as any).resetFall = () => {
        y = 0;
        v = 0;
        t = 0;
        finished = false;
      };
    };
    p5InstanceRef.current = new p5(sketch);
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [params]);

  return (
    <div className="w-full h-full relative" style={{ minHeight: '400px' }}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
