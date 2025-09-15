import React from 'react';
import PlayerSprite from './PlayerSprite'; // Import the new PlayerSprite component

interface PlayerProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

const Player: React.FC<PlayerProps> = ({ x, y, width, height }) => {
  return (
    <div
      className="absolute flex items-center justify-center" // Added flex for centering the SVG
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <PlayerSprite width={width} height={height} />
    </div>
  );
};

export default Player;