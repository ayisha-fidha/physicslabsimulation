import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import { Card } from '@/components/ui/card';
import { OhmsLawParams } from '../lab/OhmsLawControlPanel';

export const OhmsLawSimulation: React.FC<{
  params: OhmsLawParams;
  onParamsChange: (params: OhmsLawParams) => void;
}> = ({ params, onParamsChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const sketch = (p: p5) => {
      let dotPositions: number[] = [];
      let lastCurrent = 0;
      p.setup = () => {
        p.createCanvas(containerRef.current!.clientWidth, 200).parent(containerRef.current!);
        dotPositions = [80, 110, 140]; // initial positions along the wire
      };
      p.draw = () => {
        // Dark theme background
        p.background(15, 18, 25);
        // Animate battery (V) glow based on voltage
        const batteryGlow = Math.min(80, params.voltage * 4);
        for (let r = batteryGlow; r > 0; r -= 8) {
          p.fill(255, 0, 0, 30 + r * 0.5);
          p.rect(30 - r/8, 80 - r/8, 40 + r/4, 40 + r/4, 5 + r/12);
        }
        p.fill(200, 0, 0);
        p.rect(30, 80, 40, 40, 5);
        p.fill(220);
        p.textSize(14);
        p.text('V', 50, 105);

        // Animate resistor (R) glow based on resistance (lower R = more glow)
        const maxGlow = 80;
        const minR = 1, maxR = 100;
        const normR = Math.max(minR, Math.min(maxR, params.resistance));
        const resistorGlow = maxGlow * (1 - (normR - minR) / (maxR - minR));
        for (let r = resistorGlow; r > 0; r -= 8) {
          p.fill(255, 255, 0, 20 + r * 0.5);
          p.rect(180 - r/8, 90 - r/16, 60 + r/4, 20 + r/8, 5 + r/12);
        }
        p.fill(180, 180, 80);
        p.rect(180, 90, 60, 20, 5);
        p.fill(220);
        p.text('R', 210, 105);
        // Draw wires
        p.stroke(100, 200, 255, 200);
        p.strokeWeight(3);
        p.line(70, 100, 180, 100);
        p.line(240, 100, 320, 100);
        // Draw current arrow
        p.stroke(0, 200, 255);
        p.strokeWeight(4);
        p.line(120, 90, 160, 90);
        p.line(160, 90, 155, 85);
        p.line(160, 90, 155, 95);

        // Calculate current
        const currentVal = params.resistance !== 0 ? (params.voltage / params.resistance) : 0;
        setCurrent(currentVal);

        // Animate current as moving dots along the wire
        const wireStart = 70;
        const wireEnd = 320;
        const wireY = 100;
        const speed = Math.max(1, Math.abs(currentVal) * 4); // speed proportional to current
        if (dotPositions.length === 0 || lastCurrent !== currentVal) {
          // Reset dots if current changes
          dotPositions = [80, 110, 140];
        }
        lastCurrent = currentVal;
        p.noStroke();
        p.fill(0, 200, 255);
        for (let i = 0; i < dotPositions.length; i++) {
          p.circle(dotPositions[i], wireY, 10);
          dotPositions[i] += speed;
          if (dotPositions[i] > wireEnd) {
            dotPositions[i] = wireStart;
          }
        }

        // Display values
        p.noStroke();
        p.fill(220);
        p.textSize(16);
        p.text(`Voltage (V): ${params.voltage} V`, 30, 30);
        p.text(`Resistance (R): ${params.resistance} Ω`, 180, 30);
        p.text(`Current (I): ${currentVal.toFixed(2)} A`, 30, 170);
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
