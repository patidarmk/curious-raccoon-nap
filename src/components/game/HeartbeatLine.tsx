import React from 'react';
import { cn } from '@/lib/utils';
import { GAME_WIDTH } from './GameCanvas'; // Import GAME_WIDTH for dynamic sizing

interface HeartbeatLineProps {
  color?: string;
  className?: string;
}

const HeartbeatLine: React.FC<HeartbeatLineProps> = ({ color = '#FF0000', className }) => { // Default color changed to red
  const segmentWidth = 100; // Width of one heartbeat pattern segment in SVG units
  const svgViewBoxHeight = 100; // Height of the SVG viewBox, allowing for spikes

  // Path for a single blocky heartbeat segment:
  // M0,50 (start at left middle)
  // L25,20 (line up to peak)
  // L50,80 (line down to trough)
  // L75,50 (line back to middle)
  // L100,50 (flat line to end of pattern)
  const heartbeatPath = "M0,50 L25,20 L50,80 L75,50 L100,50"; // Changed to blocky path

  // Calculate how many segments are needed to cover the visible width plus extra for seamless looping.
  // We add 2 segments to ensure a smooth transition when the animation loops.
  const numVisibleSegments = Math.ceil(GAME_WIDTH / segmentWidth);
  const totalSegmentsForSeamlessLoop = numVisibleSegments + 2; 

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      <svg
        className="absolute h-full animate-heartbeat-scroll"
        style={{
          width: `${totalSegmentsForSeamlessLoop * segmentWidth}px`, // SVG is wider than its container
          left: 0, // Initial position
          top: '50%', // Center vertically
          transform: 'translateY(-50%)', // Adjust for vertical centering
        }}
        viewBox={`0 0 ${totalSegmentsForSeamlessLoop * segmentWidth} ${svgViewBoxHeight}`}
        preserveAspectRatio="none" // Allow stretching vertically to fill height
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke={color} strokeWidth="2" fill="none">
          {Array.from({ length: totalSegmentsForSeamlessLoop }).map((_, i) => (
            <path key={i} d={heartbeatPath} transform={`translate(${i * segmentWidth}, 0)`} />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default HeartbeatLine;