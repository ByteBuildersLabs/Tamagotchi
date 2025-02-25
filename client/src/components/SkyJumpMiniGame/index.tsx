import React, { useEffect, useRef, useState } from 'react';
import platformImg from '../../assets/SkyJump/platform.png';
import bgImage1 from '../../assets/SkyJump/sky-bg.gif';
import bgImage2 from '../../assets/SkyJump/sky-bg-2.gif';
import bgImage3 from '../../assets/SkyJump/night-bg.gif';
import bgImage4 from '../../assets/SkyJump/space-bg.gif';
import bgImage5 from '../../assets/SkyJump/space-bg-2.gif';

// Container style for the game wrapper
const gameContainerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
};

// Container style for the canvas
const canvasContainerStyle: React.CSSProperties = {
  position: 'relative',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  borderRadius: '8px',
  overflow: 'hidden',
};

// Style for mobile control buttons
const controlButtonStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  borderRadius: '50%',
  width: '60px',
  height: '60px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '24px',
  touchAction: 'manipulation',
  userSelect: 'none',
  zIndex: 100,
};

// Props interface for the DoodleGame component
interface DoodleGameProps {
  className?: string;
  style?: React.CSSProperties;
  onScoreUpdate?: (score: number) => void;
  onGameEnd?: (score: number) => void;
  beastImageRight?: string;
  beastImageLeft?: string;
  onExitGame?: () => void;
}

const DoodleGame: React.FC<DoodleGameProps> = ({
  className = '',
  style = {},
  onScoreUpdate,
  onGameEnd,
  beastImageRight,
  beastImageLeft,
  onExitGame,
}) => {
  // Reference to the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // State to determine if device is mobile
  const [isMobile, setIsMobile] = useState(false);
  // State to store gyroscope permission status
  const [gyroscopePermission, setGyroscopePermission] = useState<PermissionState | null>(null);
  // State to indicate if gyroscope is currently used
  const [usingGyroscope, setUsingGyroscope] = useState(false);

  // Game state and configuration stored in a ref
  const gameRef = useRef<any>({
    boardWidth: 360, // Canvas width
    boardHeight: 576, // Canvas height
    cameraY: 0, // Camera vertical position
    
    // Visual beasts size 
    doodlerVisualWidth: 65, 
    doodlerVisualHeight: 65, 

    // Ajustes para centrar visualmente (offset visual)
    doodlerVisualOffsetX: -13, // Adjust to center the beast collider horizontally.
    doodlerVisualOffsetY: -24, // Adjust to center the beast collider vertically.

    // Doodler properties
    doodlerWidth: 46,
    doodlerHeight: 46,
    doodler: {
      img: null as HTMLImageElement | null,
      x: 0,
      y: 0,
      worldY: 0,
      width: 15,
      height: 25,
      hitboxOffsetX: 10,
      hitboxOffsetY: 10,
    },

    // Platform properties
    platformWidth: 60,
    platformHeight: 18,
    platforms: [] as any[],

    // Physics properties
    velocityX: 0,
    velocityY: 0,
    initialVelocityY: -8,
    gravity: 0.25,

    // Game state variables
    score: 0,
    maxScore: 0,
    gameOver: false,
    endNotified: false,
    animationFrameId: 0,
    lastTimestamp: 0, // For delta time calculation

    // Image objects for doodler and platform
    doodlerRightImg: new Image(),
    doodlerLeftImg: new Image(),
    platformImg: new Image(),

    // Set to track platforms already scored
    touchedPlatforms: new Set() as Set<string>,

    // Background images with score thresholds
    backgrounds: {
      current: 0,
      images: [
        { img: bgImage1, scoreThreshold: 0 },
        { img: bgImage2, scoreThreshold: 50 },
        { img: bgImage3, scoreThreshold: 150 },
        { img: bgImage4, scoreThreshold: 300 },
        { img: bgImage5, scoreThreshold: 450 },
      ],
    },

    // Mobile touch controls state
    touchControls: {
      isPressed: false,
      direction: 0, // -1 for left, 0 for none, 1 for right
    },

    // Gyroscope control configuration
    gyroControls: {
      enabled: false,
      calibration: 0,
      sensitivity: 2.5,
    },
  });

  // Check if the current device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
  }, []);

  // Request permission to use device orientation (gyroscope)
  const requestOrientationPermission = async () => {
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        setGyroscopePermission(permissionState);
        if (permissionState === 'granted') {
          gameRef.current.gyroControls.enabled = true;
          setUsingGyroscope(true);
          // Calibrate once on permission grant
          window.addEventListener('deviceorientation', calibrateGyroscope, { once: true });
        }
      } else {
        setGyroscopePermission('granted');
        gameRef.current.gyroControls.enabled = true;
        setUsingGyroscope(true);
        window.addEventListener('deviceorientation', calibrateGyroscope, { once: true });
      }
    } catch (error) {
      console.error('Error requesting orientation permission:', error);
      setGyroscopePermission('denied');
    }
  };

  // Calibrate the gyroscope by setting a baseline gamma value
  const calibrateGyroscope = (event: DeviceOrientationEvent) => {
    if (event.gamma !== null) {
      gameRef.current.gyroControls.calibration = event.gamma;
    }
  };

  // Handle device orientation event to update horizontal velocity
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    if (!gameRef.current.gyroControls.enabled || gameRef.current.gameOver) return;
    const game = gameRef.current;
    if (event.gamma === null) return;
    const gamma = event.gamma;
    const tilt = gamma - game.gyroControls.calibration;
    if (tilt > 5) {
      game.velocityX = Math.min((tilt / 10) * game.gyroControls.sensitivity, 6);
      game.doodler.img = game.doodlerRightImg;
    } else if (tilt < -5) {
      game.velocityX = Math.max((tilt / 10) * game.gyroControls.sensitivity, -6);
      game.doodler.img = game.doodlerLeftImg;
    } else {
      game.velocityX = 0;
    }
  };

  // Handle touch start event for mobile controls
  const handleTouchStart = (direction: number) => {
    const game = gameRef.current;
    game.touchControls.isPressed = true;
    game.touchControls.direction = direction;
    if (direction === 1) {
      game.velocityX = 4;
      game.doodler.img = game.doodlerRightImg;
    } else if (direction === -1) {
      game.velocityX = -4;
      game.doodler.img = game.doodlerLeftImg;
    }
  };

  // Handle touch end event to stop mobile control movement
  const handleTouchEnd = () => {
    const game = gameRef.current;
    game.touchControls.isPressed = false;
    game.touchControls.direction = 0;
    game.velocityX = 0;
  };

  // Handle canvas click to restart game if game is over
  const handleRestartTouch = () => {
    if (gameRef.current.gameOver) {
      resetGame();
    }
  };

  // Reset game state and restart the game loop
  const resetGame = () => {
    const game = gameRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    game.score = 0;
    game.maxScore = 0;
    game.touchedPlatforms.clear();
    game.backgrounds.current = 0;
    game.endNotified = false;
    canvas.style.backgroundImage = `url(${game.backgrounds.images[0].img})`;

    if (game.animationFrameId) {
      cancelAnimationFrame(game.animationFrameId);
    }
    // Reset timestamp to avoid large delta values
    game.lastTimestamp = 0;

    // Reset doodler position and image
    game.doodler = {
      img: game.doodlerRightImg,
      x: game.boardWidth / 2 - game.doodlerWidth / 2,
      y: (game.boardHeight * 7) / 8 - game.doodlerHeight,
      worldY: (game.boardHeight * 7) / 8 - game.doodlerHeight,
      width: 15,         
      height: 25,        
      hitboxOffsetX: 10, 
      hitboxOffsetY: 10, 
    };

    game.velocityX = 0;
    game.velocityY = game.initialVelocityY;
    game.gameOver = false;
    game.cameraY = 0;
    placePlatforms(game);

    game.animationFrameId = requestAnimationFrame((ts) =>
      update(ts, canvas, game)
    );
  };

  // Adjust canvas size on window resize and initialize game images
  useEffect(() => {
    const game = gameRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Function to adjust the canvas size based on viewport
    const adjustGameSize = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const aspectRatio = game.boardWidth / game.boardHeight;
      if (viewportWidth / viewportHeight > aspectRatio) {
        const scaleFactor = (viewportHeight * 0.8) / game.boardHeight;
        canvas.style.height = `${game.boardHeight * scaleFactor}px`;
        canvas.style.width = `${game.boardWidth * scaleFactor}px`;
      } else {
        const scaleFactor = (viewportWidth * 0.8) / game.boardWidth;
        canvas.style.width = `${game.boardWidth * scaleFactor}px`;
        canvas.style.height = `${game.boardHeight * scaleFactor}px`;
      }
    };

    adjustGameSize();
    window.addEventListener('resize', adjustGameSize);

    if (isMobile) {
      document.body.classList.add('mobile-gameplay');
    }

    // Initialize doodler position and image sources
    game.doodler.x = game.boardWidth / 2 - game.doodlerWidth / 2;
    game.doodler.y = (game.boardHeight * 7) / 8 - game.doodlerHeight;
    game.doodler.worldY = game.doodler.y;

    game.doodlerRightImg.src = beastImageRight || '';
    game.doodlerLeftImg.src = beastImageLeft || '';
    game.platformImg.src = platformImg;
    game.doodler.img = game.doodlerRightImg;
    game.velocityY = game.initialVelocityY;

    placePlatforms(game);

    game.animationFrameId = requestAnimationFrame((ts) =>
      update(ts, canvas, game)
    );

    // Keyboard controls: start moving doodler
    const moveDoodler = (e: KeyboardEvent) => {
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        game.velocityX = 4;
        game.doodler.img = game.doodlerRightImg;
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        game.velocityX = -4;
        game.doodler.img = game.doodlerLeftImg;
      } else if (e.code === 'Space' && game.gameOver) {
        resetGame();
      }
    };

    // Keyboard controls: stop moving doodler
    const stopDoodler = (e: KeyboardEvent) => {
      if ((e.code === 'ArrowRight' || e.code === 'KeyD') && game.velocityX > 0) {
        game.velocityX = 0;
      } else if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && game.velocityX < 0) {
        game.velocityX = 0;
      }
    };

    document.addEventListener('keydown', moveDoodler);
    document.addEventListener('keyup', stopDoodler);

    return () => {
      document.removeEventListener('keydown', moveDoodler);
      document.removeEventListener('keyup', stopDoodler);
      window.removeEventListener('resize', adjustGameSize);

      if (game.gyroControls.enabled) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }

      if (game.animationFrameId) {
        cancelAnimationFrame(game.animationFrameId);
      }

      if (isMobile) {
        document.body.classList.remove('mobile-gameplay');
      }
    };
  }, [beastImageRight, beastImageLeft, isMobile]);

  // Add/remove device orientation event listener based on gyroscope usage
  useEffect(() => {
    if (usingGyroscope && gyroscopePermission === 'granted') {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      return () => {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      };
    }
  }, [usingGyroscope, gyroscopePermission]);

  // Toggle gyroscope control on or off
  const toggleGyroscope = () => {
    if (usingGyroscope) {
      // Disable gyroscope: remove event listener and update state
      gameRef.current.gyroControls.enabled = false;
      setUsingGyroscope(false);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    } else {
      // Enable gyroscope by requesting permission
      requestOrientationPermission();
    }
  };

  // Initialize platforms for the game
  const placePlatforms = (game: any) => {
    game.platforms = [];
    // Add initial platform
    game.platforms.push({
      img: game.platformImg,
      x: game.boardWidth / 2 - game.platformWidth / 2,
      y: game.boardHeight - 50,
      worldY: game.boardHeight - 50,
      width: game.platformWidth,
      height: game.platformHeight,
    });
    // Add additional platforms
    for (let i = 0; i < 6; i++) {
      let randomX = Math.floor(Math.random() * (game.boardWidth * 0.75));
      let worldY = game.boardHeight - 100 * i - 150;
      game.platforms.push({
        img: game.platformImg,
        x: randomX,
        y: worldY,
        worldY: worldY,
        width: game.platformWidth,
        height: game.platformHeight,
      });
    }
  };

  // Create a new platform when one goes off-screen
  const newPlatform = (game: any) => {
    let randomX = Math.floor(Math.random() * (game.boardWidth * 0.75));
    const baseGap = 100;
    const difficultyMultiplier = 1 + game.backgrounds.current * 0.2;
    const gapIncrement = game.score * 0.2 * difficultyMultiplier;
    let worldY =
      game.platforms[game.platforms.length - 1].worldY -
      (baseGap + gapIncrement);
    return {
      img: game.platformImg,
      x: randomX,
      y: worldY - game.cameraY,
      worldY: worldY,
      width: game.platformWidth,
      height: game.platformHeight,
    };
  };

  // Detect collision between doodler and a platform
  const detectCollision = (a: any, b: any) => {
    return (
      (a.x + a.hitboxOffsetX) < b.x + b.width &&
      (a.x + a.hitboxOffsetX + a.width) > b.x &&
      (a.worldY + a.hitboxOffsetY) < b.worldY + b.height &&
      (a.worldY + a.hitboxOffsetY + a.height) > b.worldY
    );
  };

  // Update game score when doodler lands on a platform
  const updateScore = (game: any, platform: any) => {
    const platformId = `${platform.worldY}`;
    if (!game.touchedPlatforms.has(platformId)) {
      game.score += 1;
      game.maxScore = Math.max(game.score, game.maxScore);
      game.touchedPlatforms.add(platformId);
      updateBackground(game);
      if (onScoreUpdate) {
        onScoreUpdate(game.score);
      }
    }
  };

  // Update canvas background based on current score threshold
  const updateBackground = (game: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let newBackgroundIndex = 0;
    for (let i = game.backgrounds.images.length - 1; i >= 0; i--) {
      if (game.score >= game.backgrounds.images[i].scoreThreshold) {
        newBackgroundIndex = i;
        break;
      }
    }
    if (game.backgrounds.current !== newBackgroundIndex) {
      game.backgrounds.current = newBackgroundIndex;
      canvas.style.backgroundImage = `url(${game.backgrounds.images[newBackgroundIndex].img})`;
    }
  };

  // Update camera position to follow the doodler
  const updateCamera = (game: any) => {
    const cameraThreshold = 150;
    game.doodler.y = game.doodler.worldY - game.cameraY;
    if (game.doodler.y < cameraThreshold) {
      const diff = cameraThreshold - game.doodler.y;
      game.cameraY -= diff;
    }
    game.platforms.forEach((platform: any) => {
      platform.y = platform.worldY - game.cameraY;
    });
    game.doodler.y = game.doodler.worldY - game.cameraY;
  };

  // Draw a rounded rectangle on the canvas
  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fill: boolean,
    stroke: boolean
  ) => {
    ctx.beginPath(); // Start path
    ctx.moveTo(x + radius, y); // Move to starting point
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath(); // Close path
    if (fill) ctx.fill(); // Fill if needed
    if (stroke) ctx.stroke(); // Stroke if needed
  };

  // Draw the score card on the canvas
  const drawScoreCard = (ctx: CanvasRenderingContext2D, game: any) => {
    const cardX = 5;
    const cardY = 5;
    const cardWidth = 60;
    const cardHeight = 30;
    const radius = 10;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, radius, true, false);
    ctx.strokeStyle = 'black';
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, radius, false, true);
    ctx.fillStyle = 'black';
    ctx.font = '16px sans-serif';
    const text = game.score.toString();
    const textWidth = ctx.measureText(text).width;
    const textX = cardX + (cardWidth - textWidth) / 2;
    const textY = cardY + cardHeight / 2 + 6;
    ctx.fillText(text, textX, textY);
  };

  // Main game loop function using delta time for consistent movement
  const update = (timestamp: number, canvas: HTMLCanvasElement, game: any) => {
    const context = canvas.getContext('2d');
    if (!context) return;

    if (!game.lastTimestamp) {
      game.lastTimestamp = timestamp; // Initialize lastTimestamp on first frame
    }
    const dt = (timestamp - game.lastTimestamp) / 1000; // Calculate delta time in seconds
    game.lastTimestamp = timestamp;
    const frameFactor = dt * 60; // Scale factor based on 60 FPS

    if (game.gameOver) {
      context.fillStyle = 'black';
      context.font = '16px sans-serif';
      context.fillText(
        isMobile ? 'Game Over: Tap to Reset' : "Game Over: Press 'Space' to Reset",
        game.boardWidth / 7,
        (game.boardHeight * 7) / 8
      );

      if (onScoreUpdate) {
        onScoreUpdate(game.score);
      }
      if (onGameEnd && !game.endNotified) {
        game.endNotified = true;
        onGameEnd(game.score);
      }

      game.animationFrameId = requestAnimationFrame((ts) =>
        update(ts, canvas, game)
      );
      return;
    }

    context.clearRect(0, 0, game.boardWidth, game.boardHeight);

    // Update horizontal position using frameFactor
    game.doodler.x += game.velocityX * frameFactor;
    if (game.doodler.x > game.boardWidth) {
      game.doodler.x = 0;
    } else if (game.doodler.x + game.doodler.width < 0) {
      game.doodler.x = game.boardWidth;
    }

    const difficultyMultiplier = 1 + game.backgrounds.current * 0.2;
    const currentGravity = game.gravity * difficultyMultiplier;
    game.velocityY = Math.min(
      game.velocityY + currentGravity * frameFactor,
      8 * frameFactor
    );
    game.doodler.worldY += game.velocityY * frameFactor;

    updateCamera(game);

    if (game.doodler.worldY > game.cameraY + game.boardHeight) {
      game.gameOver = true;
    }

    // Draw each platform and check for collisions
    for (let i = 0; i < game.platforms.length; i++) {
      let platform = game.platforms[i];
      if (platform.y >= -platform.height && platform.y <= game.boardHeight) {
        context.drawImage(
          platform.img,
          platform.x,
          platform.y,
          platform.width,
          platform.height
        );
      }
      if (detectCollision(game.doodler, platform) && game.velocityY >= 0) {
        game.velocityY = game.initialVelocityY;
        game.doodler.worldY = platform.worldY - game.doodler.height;
        updateScore(game, platform);
      }
    }

    // Draw the doodler image on the canvas
    context.drawImage(
      game.doodler.img!,
      game.doodler.x + game.doodlerVisualOffsetX, 
      game.doodler.y + game.doodlerVisualOffsetY, 
      game.doodlerVisualWidth,
      game.doodlerVisualHeight
    );

    // Hitbox/collider display (for debugging) keep commented out in production
    //context.strokeStyle = 'red';
    //context.strokeRect(
    //  game.doodler.x + game.doodler.hitboxOffsetX,
    //  game.doodler.y + game.doodler.hitboxOffsetY,
    //  game.doodler.width,
    //  game.doodler.height
    //);

    // Replenish platforms that move off-screen
    while (
      game.platforms.length > 0 &&
      game.platforms[0].worldY > game.cameraY + game.boardHeight
    ) {
      game.platforms.shift();
      game.platforms.push(newPlatform(game));
    }

    drawScoreCard(context, game);

    game.animationFrameId = requestAnimationFrame((ts) =>
      update(ts, canvas, game)
    );
  };

  // Merge external and internal container styles
  const containerMergedStyle = { ...gameContainerStyle, ...style };

  return (
    <div className={`doodle-game-container ${className} ${isMobile ? 'mobile-game' : ''}`} style={containerMergedStyle}>
      <div
        style={{
          ...canvasContainerStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <canvas
          ref={canvasRef}
          width={gameRef.current.boardWidth}
          height={gameRef.current.boardHeight}
          style={{
            backgroundImage: `url(${bgImage1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'block',
            maxHeight: '100hv',
            objectFit: 'contain',
          }}
          onClick={gameRef.current.gameOver ? handleRestartTouch : undefined}
        />

        {/* Touch controls for mobile devices */}
        {isMobile && !usingGyroscope && (
          <>
            <div
              style={{
                ...controlButtonStyle,
                left: '20px',
              }}
              onTouchStart={() => handleTouchStart(-1)}
              onTouchEnd={handleTouchEnd}
            >
              ←
            </div>
            <div
              style={{
                ...controlButtonStyle,
                right: '20px',
              }}
              onTouchStart={() => handleTouchStart(1)}
              onTouchEnd={handleTouchEnd}
            >
              →
            </div>
          </>
        )}

        {/* Button to Exit */}
        {onExitGame && (
          <button 
            className="return-button"
            onClick={onExitGame}
          >
            X
          </button>
        )}

        {/* Button to toggle gyroscope on mobile */}
        {isMobile && (
          <div
            style={{
              position: 'absolute',
              top: '50px',
              right: '10px',
              backgroundColor: usingGyroscope ? 'rgba(0,0,0,0.3)' : 'rgba(255, 255, 255, 0.5)',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '14px',
              zIndex: 100,
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
            }}
            onClick={toggleGyroscope}
          >
            {usingGyroscope ? '🔓' : '🔒'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoodleGame;
