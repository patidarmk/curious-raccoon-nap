import React from 'react';
import { cn } from '@/lib/utils';

interface BulletProps {
  x: number;
  y: number;
  width: number;
  height: number;
  colorClass?: string; // New prop for dynamic color
}

const Bullet: React.FC<BulletProps> = ({ x, y, width, height, colorClass }) => {
  return (
    <div
      className={cn("absolute rounded-full shadow-md", colorClass || "bg-white")} // Use colorClass or default to bg-white
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    ></div>
  );
};

export default Bullet;