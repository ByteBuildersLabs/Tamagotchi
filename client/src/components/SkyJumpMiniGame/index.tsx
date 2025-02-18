import React, { useEffect, useRef, useState } from 'react';
import platformImg from '../../assets/SkyJump/platform.png';
import bgImage1 from '../../assets/SkyJump/sky-bg.gif';
import bgImage2 from '../../assets/SkyJump/sky-bg-2.gif';
import bgImage3 from '../../assets/SkyJump/night-bg.gif';
import bgImage4 from '../../assets/SkyJump/space-bg.gif';
import bgImage5 from '../../assets/SkyJump/space-bg-2.gif';

// Styles for the game container
const gameContainerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
};

// Styles for the canvas container
const canvasContainerStyle: React.CSSProperties = {
  position: 'relative',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  borderRadius: '8px',
  overflow: 'hidden',
};

// Control button styles
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

const DoodleGame = ({ 
  className = '', 
  style = {}, 
  onScoreUpdate, 
  onGameEnd,
  beastImageRight,
  beastImageLeft
}: { 
  className?: string, 
  style?: React.CSSProperties, 
  onScoreUpdate?: (score: number) => void,
  onGameEnd?: (score: number) => void,
  beastImageRight?: string,
  beastImageLeft?: string
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [gyroscopePermission, setGyroscopePermission] = useState<PermissionState | null>(null);
  const [usingGyroscope, setUsingGyroscope] = useState(false);

  const gameRef = useRef({
    // Canvas dimensions
    boardWidth: 360,
    boardHeight: 576,

    // Camera position
    cameraY: 0,

    // Doodler properties
    doodlerWidth: 46,
    doodlerHeight: 46,
    doodler: {
      img: null as HTMLImageElement | null,
      x: 0,
      y: 0,
      worldY: 0,
      width: 60,
      height: 60,
    },

    // Platform properties
    platformWidth: 60,
    platformHeight: 18,
    platforms: [] as any[],

    // Physics
    velocityX: 0,
    velocityY: 0,
    initialVelocityY: -3.5,
    gravity: 0.05,

    // Game State
    score: 0,
    maxScore: 0,
    gameOver: false,
    endNotified: false, // flag to prevent multiple game end notifications
    animationFrameId: 0,

    // Img sources
    doodlerRightImg: new Image(),
    doodlerLeftImg: new Image(),
    platformImg: new Image(),

    // Score tracking for platforms
    touchedPlatforms: new Set() as Set<string>,

    // Background images and score thresholds for each
    backgrounds: {
      current: 0,
      images: [
        { img: bgImage1, scoreThreshold: 0 },
        { img: bgImage2, scoreThreshold: 50 },
        { img: bgImage3, scoreThreshold: 150},
        { img: bgImage4, scoreThreshold: 300 },
        { img: bgImage5, scoreThreshold: 450 },
      ],
    },
    
    // Mobile controls
    touchControls: {
      isPressed: false,
      direction: 0, // -1 for left, 0 for none, 1 for right
    },
    
    // Gyroscope controls
    gyroControls: {
      enabled: false,
      calibration: 0, // Initial device orientation
      sensitivity: 2.5, // Sensitivity factor for tilt control
    },
  });

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
  }, []);

  // Request and check device orientation permission
  const requestOrientationPermission = async () => {
    try {
      // For iOS 13+ devices
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        setGyroscopePermission(permissionState);
        
        if (permissionState === 'granted') {
          gameRef.current.gyroControls.enabled = true;
          setUsingGyroscope(true);
          
          // Calibrate the gyroscope based on current orientation
          window.addEventListener('deviceorientation', calibrateGyroscope, { once: true });
        }
      } else {
        // For other devices that don't require permission
        setGyroscopePermission('granted');
        gameRef.current.gyroControls.enabled = true;
        setUsingGyroscope(true);
        
        // Calibrate the gyroscope based on current orientation
        window.addEventListener('deviceorientation', calibrateGyroscope, { once: true });
      }
    } catch (error) {
      console.error('Error requesting device orientation permission:', error);
      setGyroscopePermission('denied');
    }
  };

  // Calibrate gyroscope based on initial orientation
  const calibrateGyroscope = (event: DeviceOrientationEvent) => {
    if (event.gamma !== null) {
      gameRef.current.gyroControls.calibration = event.gamma;
    }
  };

  // Handle gyroscope input
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    if (!gameRef.current.gyroControls.enabled || gameRef.current.gameOver) return;
    
    const game = gameRef.current;
    if (event.gamma === null) return;
    
    // Get the gamma value (rotation around Y-axis, left-to-right tilt)
    const gamma = event.gamma;
    
    // Calculate the tilt relative to calibration
    const tilt = gamma - game.gyroControls.calibration;
    
    // Apply tilt-based movement
    if (tilt > 5) {
      // Tilting right
      game.velocityX = Math.min(tilt / 10 * game.gyroControls.sensitivity, 6);
      game.doodler.img = game.doodlerRightImg;
    } else if (tilt < -5) {
      // Tilting left
      game.velocityX = Math.max(tilt / 10 * game.gyroControls.sensitivity, -6);
      game.doodler.img = game.doodlerLeftImg;
    } else {
      // Almost flat
      game.velocityX = 0;
    }
  };

  // Handle touch controls
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

  const handleTouchEnd = () => {
    const game = gameRef.current;
    game.touchControls.isPressed = false;
    game.touchControls.direction = 0;
    game.velocityX = 0;
  };

  const handleRestartTouch = () => {
    if (gameRef.current.gameOver) {
      resetGame();
    }
  };

  // Reset game state
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

    game.doodler = {
      img: game.doodlerRightImg,
      x: game.boardWidth / 2 - game.doodlerWidth / 2,
      y: (game.boardHeight * 7) / 8 - game.doodlerHeight,
      worldY: (game.boardHeight * 7) / 8 - game.doodlerHeight,
      width: game.doodlerWidth,
      height: game.doodlerHeight,
    };

    game.velocityX = 0;
    game.velocityY = game.initialVelocityY;
    game.gameOver = false;
    game.cameraY = 0;
    placePlatforms(game);

    game.animationFrameId = requestAnimationFrame(() => update(canvas, game));
  };

  useEffect(() => {
    const game = gameRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Function to adjust the game size to the viewport
    const adjustGameSize = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Keep the original aspect ratio but adjust to the viewport
      const aspectRatio = game.boardWidth / game.boardHeight;
      
      if (viewportWidth / viewportHeight > aspectRatio) {
          // Viewport more wide than tall - adjust by height
          const scaleFactor = viewportHeight * 0.8 / game.boardHeight;
          canvas.style.height = `${game.boardHeight * scaleFactor}px`;
          canvas.style.width = `${game.boardWidth * scaleFactor}px`;
      } else {
          // Viewport more tall than wide - adjust by width
          const scaleFactor = viewportWidth * 0.8 / game.boardWidth;
          canvas.style.width = `${game.boardWidth * scaleFactor}px`;
          canvas.style.height = `${game.boardHeight * scaleFactor}px`;
      }
    };

    // Adjust size initially
    adjustGameSize();
      
    // Adjust when window size changes
    window.addEventListener('resize', adjustGameSize);
    
    // Add class for mobile gameplay if needed
    if (isMobile) {
      document.body.classList.add('mobile-gameplay');
    }

    // Doodler initialization
    game.doodler.x = game.boardWidth / 2 - game.doodlerWidth / 2;
    game.doodler.y = (game.boardHeight * 7) / 8 - game.doodlerHeight;
    game.doodler.worldY = game.doodler.y;

    // Update images
    game.doodlerRightImg.src = beastImageRight || '';
    game.doodlerLeftImg.src = beastImageLeft || '';
    game.platformImg.src = platformImg;
    game.doodler.img = game.doodlerRightImg;
    game.velocityY = game.initialVelocityY;
    
    // Place initial platforms
    placePlatforms(game);
    
    // Start the game loop
    game.animationFrameId = requestAnimationFrame(() => update(canvas, game));

    // Set up keyboard event listeners
    const moveDoodler = (e: KeyboardEvent) => {
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        game.velocityX = 4;
        game.doodler.img = game.doodlerRightImg;
      } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        game.velocityX = -4;
        game.doodler.img = game.doodlerLeftImg;
      } else if (e.code === "Space" && game.gameOver) {
        resetGame();
      }
    };

    const stopDoodler = (e: KeyboardEvent) => {
      if ((e.code === "ArrowRight" || e.code === "KeyD") && game.velocityX > 0) {
        game.velocityX = 0;
      } else if ((e.code === "ArrowLeft" || e.code === "KeyA") && game.velocityX < 0) {
        game.velocityX = 0;
      }
    };

    document.addEventListener("keydown", moveDoodler);
    document.addEventListener("keyup", stopDoodler);

    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener("keydown", moveDoodler);
      document.removeEventListener("keyup", stopDoodler);
      window.removeEventListener('resize', adjustGameSize);
      
      if (game.gyroControls.enabled) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
      
      if (game.animationFrameId) {
        cancelAnimationFrame(game.animationFrameId);
      }
      
      // Remove mobile-specific classes
      if (isMobile) {
        document.body.classList.remove('mobile-gameplay');
      }
    };
  }, [beastImageRight, beastImageLeft]);

  // Set up gyroscope controls if enabled
  useEffect(() => {
    if (usingGyroscope && gyroscopePermission === 'granted') {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      
      return () => {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      };
    }
  }, [usingGyroscope, gyroscopePermission]);

  // Helper Functions
  const placePlatforms = (game: any) => {
    game.platforms = [];
    // Initial platform
    game.platforms.push({
      img: game.platformImg,
      x: game.boardWidth / 2 - game.platformWidth / 2,
      y: game.boardHeight - 50,
      worldY: game.boardHeight - 50,
      width: game.platformWidth,
      height: game.platformHeight,
    });
    // Additional platforms
    for (let i = 0; i < 6; i++) {
      let randomX = Math.floor(Math.random() * (game.boardWidth * 0.75));
      let worldY = game.boardHeight - 75 * i - 150;
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

  const newPlatform = (game: any) => {
    let randomX = Math.floor(Math.random() * (game.boardWidth * 0.75));
    const baseGap = 75;
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

  const detectCollision = (a: any, b: any) => {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.worldY < b.worldY + b.height &&
      a.worldY + a.height > b.worldY
    );
  };

  const updateScore = (game: any, platform: any) => {
    const platformId = `${platform.worldY}`;
    if (!game.touchedPlatforms.has(platformId)) {
      game.score += 1;
      game.maxScore = Math.max(game.score, game.maxScore);
      game.touchedPlatforms.add(platformId);
      updateBackground(game);
      
      // Notify parent component about score update
      if (onScoreUpdate) {
        onScoreUpdate(game.score);
      }
    }
  };

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

  // Helper function to draw a rounded rectangle
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
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  };

  // Draw the scorecard on the canvas
  const drawScoreCard = (ctx: CanvasRenderingContext2D, game: any) => {
    const cardX = 5;
    const cardY = 5;
    const cardWidth = 60;
    const cardHeight = 30;
    const radius = 10;

    // Semi-transparent card background
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, radius, true, false);

    // Card border
    ctx.strokeStyle = "black";
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, radius, false, true);

    // Centered score text
    ctx.fillStyle = "black";
    ctx.font = "16px sans-serif";
    const text = game.score.toString();
    const textWidth = ctx.measureText(text).width;
    const textX = cardX + (cardWidth - textWidth) / 2;
    const textY = cardY + cardHeight / 2 + 6; 
    ctx.fillText(text, textX, textY);
  };

  // Main game update function
  const update = (canvas: HTMLCanvasElement, game: any) => {
    const context = canvas.getContext("2d");
    if (!context) return;

    if (game.gameOver) {
      context.fillStyle = "black";
      context.font = "16px sans-serif";
      context.fillText(
        isMobile ? "Game Over: Tap to Reset" : "Game Over: Press 'Space' to Reset",
        game.boardWidth / 7,
        (game.boardHeight * 7) / 8
      );

      // Notify parent component about final score
      if (onScoreUpdate) {
        onScoreUpdate(game.score);
      }
      
      // Notify that the game has ended if onGameEnd is defined and has not yet been notified
      if (onGameEnd && !game.endNotified) {
        game.endNotified = true;
        onGameEnd(game.score);
      }

      game.animationFrameId = requestAnimationFrame(() => update(canvas, game));
      return;
    }

    context.clearRect(0, 0, game.boardWidth, game.boardHeight);

    // Update the horizontal position of the doodler
    game.doodler.x += game.velocityX;
    if (game.doodler.x > game.boardWidth) {
      game.doodler.x = 0;
    } else if (game.doodler.x + game.doodler.width < 0) {
      game.doodler.x = game.boardWidth;
    }

    // Adjust vertical physics
    const difficultyMultiplier = 1 + game.backgrounds.current * 0.2;
    const currentGravity = game.gravity * difficultyMultiplier;
    game.velocityY = Math.min(game.velocityY + currentGravity, 8);
    game.doodler.worldY += game.velocityY;

    updateCamera(game);

    // Check if Game Over occurred
    if (game.doodler.worldY > game.cameraY + game.boardHeight) {
      game.gameOver = true;
    }

    // Draw and check collisions with each platform
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

    // Draw the doodler
    context.drawImage(
      game.doodler.img!,
      game.doodler.x,
      game.doodler.y,
      game.doodler.width,
      game.doodler.height
    );

    // Replenishes platforms that go out of sight
    while (
      game.platforms.length > 0 &&
      game.platforms[0].worldY > game.cameraY + game.boardHeight
    ) {
      game.platforms.shift();
      game.platforms.push(newPlatform(game));
    }

    // Draw the score card on the canvas
    drawScoreCard(context, game);

    game.animationFrameId = requestAnimationFrame(() => update(canvas, game));
  };

  // We mix custom styles with default styles
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
          position: 'relative'
        }}
      >
        <canvas
          ref={canvasRef}
          width={gameRef.current.boardWidth}
          height={gameRef.current.boardHeight}
          style={{
            backgroundImage: `url(${bgImage1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "block",
            maxHeight: "95vh",
            objectFit: "contain"
          }}
          onClick={gameRef.current.gameOver ? handleRestartTouch : undefined}
        />
        
        {/* Mobile touch controls */}
        {isMobile && !usingGyroscope && (
          <>
            <div 
              style={{
                ...controlButtonStyle,
                left: '20px'
              }}
              onTouchStart={() => handleTouchStart(-1)}
              onTouchEnd={handleTouchEnd}
            >
              ←
            </div>
            <div 
              style={{
                ...controlButtonStyle,
                right: '20px'
              }}
              onTouchStart={() => handleTouchStart(1)}
              onTouchEnd={handleTouchEnd}
            >
              →
            </div>
          </>
        )}
        
        {/* Gyroscope toggle button for mobile */}
        {isMobile && (
          <div 
            style={{
              position: 'absolute',
              top: '50px', // Adjusted to be below the possible score display
              right: '10px',
              backgroundColor: usingGyroscope ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '14px',
              zIndex: 100,
              cursor: 'pointer',
              backdropFilter: 'blur(4px)'
            }}
            onClick={requestOrientationPermission}
          >
            {usingGyroscope ? '🔄 Tilt activated' : '📱 Activate tilt'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoodleGame;