import React from 'react';
import InvaderSprite from './InvaderSprite';

interface EnemyProps {
  x: number;
  y: number;
  width: number;
  height: number;
  colorClass: string; // New prop for color
  row: number; // Added row prop to determine sprite variant
  initialFrame: number; // New prop: initial animation frame
}

const Enemy: React.FC<EnemyProps> = ({ x, y, width, height, colorClass, row, initialFrame }) => {
  // All enemies will now use the default sprite variant
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <InvaderSprite width={width} height={height} colorClass={colorClass} variant="default" initialFrame={initialFrame} />
    </div>
  );
};

export default Enemy;