import React from 'react';
import GameCanvas from '@/components/game/GameCanvas';
import HeartbeatLine from '@/components/game/HeartbeatLine'; // Import the new HeartbeatLine component

// Import GAME_WIDTH from GameCanvas to ensure consistent sizing
import { GAME_WIDTH } from '@/components/game/GameCanvas'; 

const SpaceInvaders: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] py-8">
      {/* Title Banner */}
      <div 
        className="relative text-center mb-8 bg-black py-4 rounded-lg shadow-xl overflow-hidden" // Added relative and overflow-hidden
        style={{ width: GAME_WIDTH, perspective: '500px' }}
      >
        <HeartbeatLine 
          className="z-0 opacity-75 drop-shadow-[0_0_10px_rgba(34,197,94,0.9)]" // Changed glow color to green-500 (34,197,94)
          color="#22C55E" // Heartbeat line color changed to green-500
        />
        <h2 
          className="relative z-10 text-6xl font-extrabold tracking-widest font-spaceInvaders whitespace-nowrap
                     text-white text-shadow-green-outline" // Changed text to white and kept green outline
          style={{
            transform: 'rotateX(20deg)',
            transformOrigin: 'bottom center',
          }}
        >
          APPLAA INVADERS!
        </h2>
      </div>

      <GameCanvas />
      <p className="mt-4 text-gray-700 dark:text-gray-300">
        Use <span className="font-bold text-blue-500">Arrow Left/Right</span> to move. Press <span className="font-bold text-yellow-500">Spacebar</span> to shoot!
      </p>
    </div>
  );
};

export default SpaceInvaders;