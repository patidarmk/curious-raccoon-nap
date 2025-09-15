import React from 'react';
import { cn } from '@/lib/utils';

interface PlayerSpriteProps {
  width: number;
  height: number;
  colorClass?: string;
}

// Helper function to create SVG path data from a pixel map
const createPixelPath = (pixelMap: string[]): string => {
  let path = '';
  pixelMap.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === 'X') {
        path += `M${x},${y}h1v1h-1z`; // Draw a 1x1 square for each 'X'
      }
    }
  });
  return path;
};

// Pixel map for the player's spaceship (7x5 grid)
const playerSpritePixels = [
  "   X   ", // Top of the ship
  "  XXX  ",
  " XXXXX ",
  "XXXXXXX", // Main body
  "X X X X", // Guns/wings
];

const PlayerSprite: React.FC<PlayerSpriteProps> = ({ width, height, colorClass = 'text-yellow-400' }) => { // Changed default color to text-yellow-400
  const playerPath = createPixelPath(playerSpritePixels);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 7 5" // The pixel grid size of the player ship
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(colorClass, "transition-colors duration-100")}
      shapeRendering="crispEdges" // Ensures sharp pixel edges
    >
      <path d={playerPath} />
    </svg>
  );
};

export default PlayerSprite;