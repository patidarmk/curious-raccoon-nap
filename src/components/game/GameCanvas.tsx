import React, { useState, useEffect, useRef, useCallback } from 'react';
import Player from './Player';
import Enemy from './Enemy';
import Bullet from './Bullet';
import Explosion from './Explosion';
import { Button } from '@/components/ui/button'; // Import shadcn button
import { cn } from '@/lib/utils'; // Import cn utility for conditional classes

export const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 30;
const PLAYER_SPEED = 5;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 30;
const ENEMY_ROWS = 3;
const ENEMIES_PER_ROW = 8;
const ENEMY_SPACING_X = 60;
const ENEMY_SPACING_Y = 50;
const ENEMY_START_Y = 70;
const ENEMY_MOVE_SPEED = 1; // Base horizontal move speed
const ENEMY_DROP_AMOUNT = 20;
const INITIAL_ENEMY_MOVE_INTERVAL = 500; // Base interval for enemy movement
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 15;
const BULLET_SPEED = 20;
const ENEMY_BULLET_SPEED = 5; // Speed for enemy bullets
const SHOOT_COOLDOWN = 300;
const EXPLOSION_DURATION = 300;
const PLAYER_INVULNERABILITY_DURATION = 2000; // 2 seconds of invulnerability after being hit
const SCREEN_FLASH_DURATION = 200; // 0.2 seconds for screen flash

// Constants for enemy shooting
const ENEMY_SHOOT_INTERVAL = 1000; // Enemies shoot every 1 second

// Define player Y position
const PLAYER_Y = GAME_HEIGHT - PLAYER_HEIGHT - 10;

// Define colors for each enemy row
const ENEMY_ROW_COLORS = [
  'text-red-500',
  'text-blue-400',
  'text-green-400',
];

// Define points for each enemy row (index corresponds to row number)
const ENEMY_ROW_POINTS = [
  30,
  20,
  10,
];

interface EnemyType {
  id: number;
  x: number;
  y: number;
  direction: 'left' | 'right';
  colorClass: string;
  row: number;
  initialFrame: number; // Added: initial animation frame for the sprite
}

interface BulletType {
  id: number;
  x: number;
  y: number;
}

interface EnemyBulletType extends BulletType {
  colorClass: string;
}

interface ExplosionType {
  id: number;
  x: number;
  y: number;
  size: number;
}

// Function to create initial enemies
const createInitialEnemies = () => {
  const initialEnemies: EnemyType[] = [];
  let idCounter = 0;
  for (let row = 0; row < ENEMY_ROWS; row++) {
    const colorClass = ENEMY_ROW_COLORS[row % ENEMY_ROW_COLORS.length];
    // Set initial frame: middle row (index 1) starts at frame 1, others at frame 0
    const initialFrame = row === 1 ? 1 : 0;
    for (let col = 0; col < ENEMIES_PER_ROW; col++) {
      initialEnemies.push({
        id: idCounter++,
        x: col * ENEMY_SPACING_X + (GAME_WIDTH - ENEMIES_PER_ROW * ENEMY_SPACING_X) / 2,
        y: row * ENEMY_SPACING_Y + ENEMY_START_Y,
        direction: 'right',
        colorClass: colorClass,
        row: row,
        initialFrame: initialFrame, // Pass the calculated initial frame
      });
    }
  }
  return initialEnemies;
};

const GameCanvas: React.FC = () => {
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const playerXRef = useRef(playerX); // Keep ref for immediate playerX access in callbacks
  const [playerBullets, setPlayerBullets] = useState<BulletType[]>([]);
  const [enemyBullets, setEnemyBullets] = useState<EnemyBulletType[]>([]);
  const [explosions, setExplosions] = useState<ExplosionType[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3); // Changed initial lives to 3
  const [gameOver, setGameOver] = useState(false);
  const [isScreenFlashing, setIsScreenFlashing] = useState(false);
  const [enemySpeedMultiplier, setEnemySpeedMultiplier] = useState(1);

  // Use useRef for enemies for game logic, and a state for rendering
  const enemiesRef = useRef<EnemyType[]>([]);
  const [renderedEnemies, setRenderedEnemies] = useState<EnemyType[]>([]);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastEnemyMoveTime = useRef(0);
  const enemyMoveDirection = useRef<'left' | 'right'>('right');
  const lastPlayerShotTime = useRef(0);
  const lastEnemyShotTime = useRef(0); // Tracks when the last enemy shot occurred
  const isPlayerInvulnerable = useRef(false);

  // Initialize enemies once on mount and update ref/rendered state
  useEffect(() => {
    const initial = createInitialEnemies();
    enemiesRef.current = initial;
    setRenderedEnemies(initial);
  }, []);

  // Update playerXRef whenever playerX changes
  useEffect(() => {
    playerXRef.current = playerX;
  }, [playerX]);

  // Restart Game function
  const restartGame = useCallback(() => {
    setPlayerX(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
    setScore(0);
    setLives(3); // Changed initial lives to 3 on restart
    setGameOver(false);
    setPlayerBullets([]);
    setEnemyBullets([]); // Clear enemy bullets on restart
    setExplosions([]);
    lastEnemyMoveTime.current = 0;
    enemyMoveDirection.current = 'right';
    lastPlayerShotTime.current = 0;
    lastEnemyShotTime.current = 0; // Reset enemy shot time
    isPlayerInvulnerable.current = false;
    setIsScreenFlashing(false);
    setEnemySpeedMultiplier(1);
    const initial = createInitialEnemies();
    enemiesRef.current = initial; // Reset ref
    setRenderedEnemies(initial); // Reset rendered state
  }, []);

  // Handle keyboard input for player movement and shooting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.key === 'ArrowLeft') {
        setPlayerX((prevX) => Math.max(0, prevX - PLAYER_SPEED));
      } else if (e.key === 'ArrowRight') {
        setPlayerX((prevX) => Math.min(GAME_WIDTH - PLAYER_WIDTH, prevX + PLAYER_SPEED));
      } else if (e.key === ' ') {
        const currentTime = Date.now();
        if (currentTime - lastPlayerShotTime.current > SHOOT_COOLDOWN) {
          setPlayerBullets((prevBullets) => [
            ...prevBullets,
            {
              id: Date.now(),
              x: playerXRef.current + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
              y: PLAYER_Y - BULLET_HEIGHT,
            },
          ]);
          lastPlayerShotTime.current = currentTime;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver]);

  // Callback to remove an explosion once its animation is complete
  const handleExplosionComplete = useCallback((id: number) => {
    setExplosions((prev) => prev.filter((exp) => exp.id !== id));
  }, []);

  // Game loop
  const gameLoop = useCallback((timestamp: DOMHighResTimeStamp) => {
    if (gameOver) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    // Declare sets for items to remove in this frame
    const enemiesToRemove = new Set<number>();
    const bulletsToRemove = new Set<number>();
    const enemyBulletsToRemove = new Set<number>();

    // Use current state for calculations
    let currentEnemies = [...enemiesRef.current]; // Get latest enemies from ref
    let currentScore = score;
    let currentLives = lives;
    let currentEnemySpeedMultiplier = enemySpeedMultiplier;
    let currentIsScreenFlashing = isScreenFlashing;

    // Temporary array to hold new enemy bullets fired this frame
    const newEnemyBulletsThisFrame: EnemyBulletType[] = [];

    // --- 1. Calculate Enemy Movement ---
    let currentDirection = enemyMoveDirection.current;
    const horizontalMoveAmount = ENEMY_MOVE_SPEED * 10;
    const currentEnemyMoveInterval = INITIAL_ENEMY_MOVE_INTERVAL / currentEnemySpeedMultiplier;

    if (timestamp - lastEnemyMoveTime.current > currentEnemyMoveInterval) {
      lastEnemyMoveTime.current = timestamp;
      let willHitEdge = false;
      for (const enemy of currentEnemies) {
        if (currentDirection === 'right') {
          if (enemy.x + horizontalMoveAmount + ENEMY_WIDTH > GAME_WIDTH) {
            willHitEdge = true;
            break;
          }
        } else {
          if (enemy.x - horizontalMoveAmount < 0) {
            willHitEdge = true;
            break;
          }
        }
      }

      if (willHitEdge) {
        currentDirection = currentDirection === 'right' ? 'left' : 'right';
        enemyMoveDirection.current = currentDirection;
        // Increase speed by 75% when hitting the edge
        currentEnemySpeedMultiplier = Math.min(currentEnemySpeedMultiplier * 1.75, 5); // Changed from 1.5 to 1.75
        currentEnemies = currentEnemies.map((enemy) => ({
          ...enemy,
          y: enemy.y + ENEMY_DROP_AMOUNT,
        }));
      } else {
        currentEnemies = currentEnemies.map((enemy) => ({
          ...enemy,
          x: enemy.x + (currentDirection === 'right' ? horizontalMoveAmount : -horizontalMoveAmount),
        }));
      }
    }

    // --- 2. Player Bullet Movement & Collision Logic ---
    let currentPlayerBullets = playerBullets
      .map((bullet) => ({ ...bullet, y: bullet.y - BULLET_SPEED }))
      .filter((bullet) => bullet.y > 0);

    for (let i = 0; i < currentPlayerBullets.length; i++) {
      const bullet = currentPlayerBullets[i];
      if (bulletsToRemove.has(bullet.id)) continue;

      for (let j = 0; j < currentEnemies.length; j++) {
        const enemy = currentEnemies[j];
        if (enemiesToRemove.has(enemy.id)) continue;

        // Simple AABB collision detection
        if (
          bullet.x < enemy.x + ENEMY_WIDTH &&
          bullet.x + BULLET_WIDTH > enemy.x &&
          bullet.y < enemy.y + ENEMY_HEIGHT &&
          bullet.y + BULLET_HEIGHT > enemy.y
        ) {
          setExplosions((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              x: enemy.x + ENEMY_WIDTH / 2,
              y: enemy.y + ENEMY_HEIGHT / 2,
              size: ENEMY_WIDTH * 1.2,
            },
          ]);

          currentScore += ENEMY_ROW_POINTS[enemy.row]; // Update local score
          currentEnemySpeedMultiplier = Math.min(currentEnemySpeedMultiplier * 1.01, 5); // Cap speed increase

          enemiesToRemove.add(enemy.id);
          bulletsToRemove.add(bullet.id);
          break;
        }
      }
    }

    // --- 3. Enemy Bullet Firing Logic (and movement/collision) ---
    const currentTime = Date.now();

    if (currentTime - lastEnemyShotTime.current > ENEMY_SHOOT_INTERVAL && currentEnemies.length > 0) {
      lastEnemyShotTime.current = currentTime;
      // Select a random enemy to shoot
      const shootingEnemy = currentEnemies[Math.floor(Math.random() * currentEnemies.length)];
      if (shootingEnemy) {
        newEnemyBulletsThisFrame.push({ // Add to temporary array
          id: Date.now() + Math.random(),
          x: shootingEnemy.x + ENEMY_WIDTH / 2 - BULLET_WIDTH / 2,
          y: shootingEnemy.y + ENEMY_HEIGHT,
          colorClass: 'bg-red-500', // Red bullets as requested
        });
      }
    }

    // Move existing enemy bullets
    let updatedEnemyBullets = enemyBullets
      .map((bullet) => ({ ...bullet, y: bullet.y + ENEMY_BULLET_SPEED }))
      .filter((bullet) => bullet.y < GAME_HEIGHT);

    const playerLeft = playerXRef.current;
    const playerRight = playerXRef.current + PLAYER_WIDTH;
    const playerTop = PLAYER_Y;
    const playerBottom = PLAYER_Y + PLAYER_HEIGHT;

    for (let i = 0; i < updatedEnemyBullets.length; i++) { // Iterate over updatedEnemyBullets
      const bullet = updatedEnemyBullets[i];
      if (enemyBulletsToRemove.has(bullet.id)) continue;

      if (
        !isPlayerInvulnerable.current &&
        bullet.x < playerRight &&
        bullet.x + BULLET_WIDTH > playerLeft &&
        bullet.y < playerBottom &&
        bullet.y + BULLET_HEIGHT > playerTop
      ) {
        setExplosions((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: playerXRef.current + PLAYER_WIDTH / 2,
            y: PLAYER_Y + PLAYER_HEIGHT / 2,
            size: PLAYER_WIDTH * 1.5,
          },
        ]);

        currentLives -= 1; // Update local lives
        if (currentLives <= 0) {
          setGameOver(true);
        } else {
          isPlayerInvulnerable.current = true;
          setTimeout(() => {
            isPlayerInvulnerable.current = false;
          }, PLAYER_INVULNERABILITY_DURATION);

          currentIsScreenFlashing = true; // Update local flash state
          setTimeout(() => {
            setIsScreenFlashing(false);
          }, SCREEN_FLASH_DURATION);
        }
        enemyBulletsToRemove.add(bullet.id);
        break;
      }
    }

    // --- 4. Apply all calculated changes to state ---
    // Filter enemies
    const prevEnemiesCount = currentEnemies.length;
    currentEnemies = currentEnemies.filter(enemy => !enemiesToRemove.has(enemy.id));

    // Re-initialize enemies if all are destroyed
    if (prevEnemiesCount > 0 && currentEnemies.length === 0) {
      currentEnemies = createInitialEnemies();
      setPlayerBullets([]); // Clear player bullets for new wave
      setEnemyBullets([]); // Clear enemy bullets for new wave
      setExplosions([]); // Clear explosions for new wave
      currentEnemySpeedMultiplier = 1; // Reset speed
    }
    enemiesRef.current = currentEnemies; // Update ref with latest enemies
    setRenderedEnemies(currentEnemies); // Trigger re-render

    // Filter player bullets
    setPlayerBullets(currentPlayerBullets.filter(bullet => !bulletsToRemove.has(bullet.id)));

    // Filter enemy bullets and add new ones
    setEnemyBullets([
      ...updatedEnemyBullets.filter(bullet => !enemyBulletsToRemove.has(bullet.id)),
      ...newEnemyBulletsThisFrame // Add new bullets fired this frame
    ]);

    // Update other states
    setScore(currentScore);
    setLives(currentLives);
    setEnemySpeedMultiplier(currentEnemySpeedMultiplier);
    setIsScreenFlashing(currentIsScreenFlashing);

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [gameOver, handleExplosionComplete, restartGame, playerBullets, enemyBullets, score, lives, enemySpeedMultiplier, isScreenFlashing]);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameLoop]);

  return (
    <div
      ref={gameAreaRef}
      className="relative border-4 border-gray-800 bg-black overflow-hidden mx-auto"
      style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
    >
      {/* Galaxy Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.40]"
        style={{ backgroundImage: `url('/cosmic-background.jpg')` }}
      ></div>

      {/* Screen Flash Overlay */}
      {isScreenFlashing && (
        <div className="absolute inset-0 bg-green-500 opacity-50 z-30 animate-pulse-once"></div>
      )}

      <div className={cn(
        "absolute top-4 left-4 text-3xl font-bold font-cosmicAlien z-10",
        lives <= 2 ? "text-red-500 animate-pulse" : "text-green-500"
      )}>
        Lives: {lives}
      </div>
      <div className="absolute top-4 right-4 text-yellow-400 text-3xl font-bold font-cosmicAlien z-10">
        Score: {score}
      </div>
      <Player x={playerX} y={PLAYER_Y} width={PLAYER_WIDTH} height={PLAYER_HEIGHT} />
      {renderedEnemies.map((enemy) => (
        <Enemy key={enemy.id} x={enemy.x} y={enemy.y} width={ENEMY_WIDTH} height={ENEMY_HEIGHT} colorClass={enemy.colorClass} row={enemy.row} initialFrame={enemy.initialFrame} />
      ))}
      {playerBullets.map((bullet) => (
        <Bullet key={bullet.id} x={bullet.x} y={bullet.y} width={BULLET_WIDTH} height={BULLET_HEIGHT} />
      ))}
      {enemyBullets.map((bullet) => (
        <Bullet key={bullet.id} x={bullet.x} y={bullet.y} width={BULLET_WIDTH} height={BULLET_HEIGHT} colorClass={bullet.colorClass} />
      ))}
      {explosions.map((exp) => (
        <Explosion
          key={exp.id}
          id={exp.id}
          x={exp.x}
          y={exp.y}
          size={exp.size}
          onComplete={handleExplosionComplete}
          duration={EXPLOSION_DURATION}
        />
      ))}

      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
          <h3 className="text-6xl font-extrabold text-red-500 font-spaceInvaders mb-6 animate-pulse">GAME OVER</h3>
          <p className="text-3xl text-white font-cosmicAlien mb-8">Final Score: {score}</p>
          <Button
            onClick={restartGame}
            className="px-8 py-4 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Restart Game
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;