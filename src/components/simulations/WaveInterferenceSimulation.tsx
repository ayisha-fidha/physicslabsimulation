import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import { Card } from '@/components/ui/card';
import { WaveInterferenceParams } from '../lab/WaveInterferenceControlPanel';

export const WaveInterferenceSimulation: React.FC<{ params: WaveInterferenceParams }> = ({ params }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const sketch = (p: p5) => {
      let t = 0;
      p.setup = () => {
        p.createCanvas(containerRef.current!.clientWidth, 200).parent(containerRef.current!);
      };
      p.draw = () => {
        p.background(15, 18, 25);
        p.stroke(100, 200, 255, 200);
        p.strokeWeight(2);
        // Draw two interfering sine waves with adjustable frequency and amplitude
        for (let x = 0; x < p.width; x += 2) {
          const y1 = params.amp1 * Math.sin(params.freq1 * (x / 40) + t) + 60;
          const y2 = params.amp2 * Math.sin(params.freq2 * (x / 40) - t) + 120;
          const y = (y1 + y2) / 2;
          p.point(x, y + 20);
        }
        t += 0.03;
        // Draw labels
        p.noStroke();
        p.fill(220);
        p.textSize(16);
        p.text('Wave Interference', 20, 30);
      };
    };
    p5InstanceRef.current = new p5(sketch);
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [params]);

  return (
    <Card className="w-full h-full flex flex-col items-center justify-center bg-background rounded border border-primary/10" style={{ minHeight: '250px' }}>
      <div ref={containerRef} className="w-full" />
    </Card>
  );
};
