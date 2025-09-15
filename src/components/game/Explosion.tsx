import React, { useEffect } from 'react';

interface ExplosionProps {
  id: number;
  x: number;
  y: number;
  size: number; // Size of the explosion in pixels
  onComplete: (id: number) => void;
  duration?: number; // Duration of the animation in milliseconds
}

const Explosion: React.FC<ExplosionProps> = ({ id, x, y, size, onComplete, duration = 300 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, onComplete, duration]);

  return (
    <div
      className="absolute bg-yellow-300 rounded-full animate-explosion-fade-scale"
      style={{
        left: `${x - size / 2}px`, // Center the explosion on the given x coordinate
        top: `${y - size / 2}px`,  // Center the explosion on the given y coordinate
        width: `${size}px`,
        height: `${size}px`,
      }}
    ></div>
  );
};

export default Explosion;