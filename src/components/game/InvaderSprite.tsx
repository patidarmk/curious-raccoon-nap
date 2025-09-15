import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils'; // Import cn utility for combining class names

interface InvaderSpriteProps {
  width: number;
  height: number;
  animationSpeed?: number; // Milliseconds per frame
  colorClass?: string; // New prop for Tailwind color class
  variant?: 'default' | 'circular'; // New prop for different sprite types
  initialFrame?: number; // New prop: starting animation frame (0 or 1)
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

// Pixel map for Frame 1 (original) - based on the attached image (11x8 pixels)
const invaderFrame1Pixels = [
  "  XX   XX  ", // Row 0
  " XXXXXXXXX ", // Row 1
  "XXXXXXXXXXX", // Row 2
  "XXX  XXX  X", // Row 3
  "XXXXXXXXXXX", // Row 4
  " XX     XX ", // Row 5
  "X X X X X X", // Row 6
  "X   X   X  ", // Row 7
];

// Pixel map for Frame 2 (horizontally reversed)
const invaderFrame2Pixels = [
  "  XX   XX  ", // Row 0 (symmetrical)
  " XXXXXXXXX ", // Row 1 (symmetrical)
  "XXXXXXXXXXX", // Row 2 (symmetrical)
  "X  XXX  XXX", // Row 3 (reversed)
  "XXXXXXXXXXX", // Row 4 (symmetrical)
  " XX     XX ", // Row 5 (symmetrical)
  "X X X X X X", // Row 6 (symmetrical)
  "  X   X   X", // Row 7 (reversed)
];

// Pixel map for a more circular/squid-like invader - Frame 1 (11x8)
const invaderSquidFrame1Pixels = [
  "   XX      ",
  "  XXXX     ",
  " XXXXXX    ",
  "XXXXXXXXX  ",
  "XXXXXXXXX  ",
  " X X X X   ",
  "X X X X X  ",
  "X       X  ",
];

// Pixel map for a more circular/squid-like invader - Frame 2 (11x8) - animated
const invaderSquidFrame2Pixels = [
  "   XX      ",
  "  XXXX     ",
  " XXXXXX    ",
  "XXXXXXXXX  ",
  "XXXXXXXXX  ",
  " X X X X   ",
  "X X X X X  ",
  " X     X   ",
];


const InvaderSprite: React.FC<InvaderSpriteProps> = ({ width, height, animationSpeed = 400, colorClass = 'text-green-400', variant = 'default', initialFrame = 0 }) => {
  const [frame, setFrame] = useState(initialFrame); // Initialize with initialFrame prop

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame === 0 ? 1 : 0));
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [animationSpeed]);

  let currentFrame1Pixels: string[];
  let currentFrame2Pixels: string[];

  if (variant === 'circular') {
    currentFrame1Pixels = invaderSquidFrame1Pixels;
    currentFrame2Pixels = invaderSquidFrame2Pixels;
  } else {
    currentFrame1Pixels = invaderFrame1Pixels;
    currentFrame2Pixels = invaderFrame2Pixels;
  }

  // Generate SVG path data for each frame
  const frame1Path = createPixelPath(currentFrame1Pixels);
  const frame2Path = createPixelPath(currentFrame2Pixels);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 11 8" // The pixel grid size of the invader
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(colorClass, "transition-colors duration-100")} // Apply dynamic color class
      shapeRendering="crispEdges" // Ensures sharp pixel edges
    >
      <path d={frame === 0 ? frame1Path : frame2Path} />
    </svg>
  );
};

export default InvaderSprite;