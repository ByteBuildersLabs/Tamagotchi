import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { ShareProgress } from '../Twitter/ShareProgress';
import { saveHighScore } from '../../data/gamesMiniGamesRegistry';
import initialFoodItems from '../../data/food.tsx';
import Restart from '../../assets/img/restart.svg';
import Lock from '../../assets/img/lock.svg';
import Unlock from '../../assets/img/unlock.svg';
import './main.css';

import platformImg from '../../assets/SkyJump/platform.png';
import bgImage1 from '../../assets/SkyJump/sky-bg.gif';
import bgImage2 from '../../assets/SkyJump/sky-bg-2.gif';
import bgImage3 from '../../assets/SkyJump/night-bg.gif';
import bgImage4 from '../../assets/SkyJump/space-bg.gif';
import bgImage5 from '../../assets/SkyJump/space-bg-2.gif';

const HITBOX_MARGIN = 2;
const CAMERA_THRESHOLD = 150;
const GYRO_TILT_THRESHOLD = 5;
const GYRO_TILT_DIVISOR = 10;

const VISIBLE_PLATFORM_MARGIN = 1.5;
const PLATFORM_GENERATION_THRESHOLD = 2;
const PLATFORM_HORIZONTAL_MAX = 0.8;

const SCORE_MILESTONE_INCREMENT = 50;
const MAX_SCORE_ADJUSTMENT = 200;

const RESET_GAME_DELAY = 100;
const MILESTONE_TOAST_DURATION = 2000;
const HIGH_SCORE_TOAST_DURATION = 4000;
const GAME_OVER_TOAST_DURATION = 3000;

// Interface for the game reference
export interface DOMDoodleGameRefHandle {
  resetGame: () => void;
}

// Props interface for the component
interface DOMDoodleGameProps {
  className?: string;
  style?: React.CSSProperties;
  onScoreUpdate?: (score: number) => void;
  onGameEnd?: (score: number) => void;
  beastImageRight?: string;
  beastImageLeft?: string;
  onExitGame?: () => void;
  highScore: number;
  gameId: string;
  beastId: number;
  gameName: string;
}

const DOMDoodleGame = forwardRef<DOMDoodleGameRefHandle, DOMDoodleGameProps>(({
  className = '',
  style = {},
  onScoreUpdate,
  beastImageRight,
  beastImageLeft,
  onExitGame,
  highScore,
  gameId,
  beastId,
  gameName,
}, ref) => {

  // References and states
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const doodlerRef = useRef<HTMLDivElement>(null);
  const platformsRef = useRef<HTMLDivElement>(null);
  const scoreCardRef = useRef<HTMLDivElement>(null);
  const currentScoreRef = useRef<number>(0);
  const maxHeightRef = useRef<number>(0);
  const lastMilestoneRef = useRef<number>(0);

  // States
  const [background, setBackground] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [gyroscopePermission, setGyroscopePermission] = useState<PermissionState | null>(null);
  const [usingGyroscope, setUsingGyroscope] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // States for modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [currentHighScore, setCurrentHighScore] = useState(highScore);

  const [collectedFood, setCollectedFood] = useState(0);
  const [selectedFood, setSelectedFood] = useState<any>(null);

  type GameScreenState = 'playing' | 'sharing' | 'gameover';
  const [currentScreen, setCurrentScreen] = useState<GameScreenState>('playing');

  // Game configuration
  const gameConfig = useRef({
    boardWidth: 360,
    boardHeight: 576,
    cameraY: 0,

    doodlerVisualWidth: 65,
    doodlerVisualHeight: 65,

    doodlerWidth: 46,
    doodlerHeight: 46,
    doodler: {
      img: beastImageRight,
      x: 0,
      y: 0,
      worldY: 0,
      width: 15,
      height: 25,
      hitboxOffsetX: 10,
      hitboxOffsetY: 10,
      facingRight: true,
    },

    platformWidth: 60,
    platformHeight: 18,
    platforms: [] as any[],

    velocityX: 0,
    velocityY: 0,
    initialVelocityY: -8,
    gravity: 0.25,

    maxScore: 0,
    endNotified: false,
    animationFrameId: 0,
    lastTimestamp: 0,
    running: false,

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

    touchControls: {
      isPressed: false,
      direction: 0,
    },

    gyroControls: {
      enabled: false,
      calibration: 0,
      sensitivity: 2.5,
    },
  });

  // Function to handle game end
  const handleGameEnd = () => {
    const score = currentScoreRef.current;
    setFinalScore(score);

    // Check if it's a new high score
    if (score > currentHighScore) {
      saveHighScore(gameId, beastId, score);
      setCurrentHighScore(score);

      toast.success(`New high score: ${score}!`, {
        icon: '🏆',
        duration: HIGH_SCORE_TOAST_DURATION
      });
    } else {
      toast.success(`Game over! Score: ${score}`, {
        duration: GAME_OVER_TOAST_DURATION
      });
    }

    console.log(`Game ended with ${collectedFood} ${selectedFood?.name || 'foods'} collected`);

    // Transition to sharing state
    setCurrentScreen('sharing');
    setIsShareModalOpen(true);
  };

  // Function to handle "play again"
  const handlePlayAgain = () => {
    setShowGameOverModal(false);
    setCurrentScreen('playing');  // Change screen state first
    resetGame();
  };

  // HEIGHT-BASED SCORING SYSTEM
  const updateScoreByHeight = () => {
    const game = gameConfig.current;

    // Calculate current height based on camera position (always positive)
    const currentHeight = Math.max(0, -game.cameraY);

    // Only update score when a new maximum height is reached
    if (currentHeight > maxHeightRef.current) {
      // Update maximum height
      maxHeightRef.current = currentHeight;

      // Convert height to points (1 point for every 5 pixels of height)
      const heightScore = Math.floor(currentHeight / 5);

      // Always update when there is a change, even if it's the same value
      if (heightScore !== currentScoreRef.current) {
        currentScoreRef.current = heightScore;

        // Update both React state and DOM directly
        setScore(heightScore);

        if (scoreCardRef.current) scoreCardRef.current.textContent = heightScore.toString();

        // Notify parent component
        if (onScoreUpdate) onScoreUpdate(heightScore);

        // Update background based on score
        updateBackground(heightScore);

        // Check score milestones
        checkScoreMilestones(heightScore);
      }
    }
  };

  // Check score milestones and show alerts
  const checkScoreMilestones = (currentScore: number) => {
    const milestone = Math.floor(currentScore / SCORE_MILESTONE_INCREMENT) * SCORE_MILESTONE_INCREMENT;

    if (milestone > 0 && milestone > lastMilestoneRef.current) {
      // Update last milestone reached
      lastMilestoneRef.current = milestone;

      // Show toast with milestone reached
      toast.success(`Amazing! You've reached ${milestone} points`, {
        position: "top-center",
        duration: MILESTONE_TOAST_DURATION
      });
    }
  };

  // Expose resetGame function to parent component
  useImperativeHandle(ref, () => ({
    resetGame: () => {
      resetGame();
    }
  }));

  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
  }, []);

  // Request access to device orientation
  const requestOrientationPermission = async () => {
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        setGyroscopePermission(permissionState);
        if (permissionState === 'granted') {
          gameConfig.current.gyroControls.enabled = true;
          setUsingGyroscope(true);
          window.addEventListener('deviceorientation', calibrateGyroscope, { once: true });
        }
      } else {
        setGyroscopePermission('granted');
        gameConfig.current.gyroControls.enabled = true;
        setUsingGyroscope(true);
        window.addEventListener('deviceorientation', calibrateGyroscope, { once: true });
      }
    } catch (error) {
      console.error('Error requesting orientation permission:', error);
      setGyroscopePermission('denied');
    }
  };

  // Calibrate the gyroscope
  const calibrateGyroscope = (event: DeviceOrientationEvent) => {
    if (event.gamma !== null) {
      gameConfig.current.gyroControls.calibration = event.gamma;
    }
  };

  // Handle device orientation
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    const game = gameConfig.current;
    if (!game.gyroControls.enabled || gameOver) return;

    if (event.gamma === null) return;
    const gamma = event.gamma;
    const tilt = gamma - game.gyroControls.calibration;

    if (tilt > GYRO_TILT_THRESHOLD) {
      game.velocityX = Math.min((tilt / GYRO_TILT_DIVISOR) * game.gyroControls.sensitivity, 6);
      game.doodler.facingRight = true;
      if (doodlerRef.current) {
        doodlerRef.current.style.backgroundImage = `url(${beastImageRight})`;
      }
    } else if (tilt < -GYRO_TILT_THRESHOLD) {
      game.velocityX = Math.max((tilt / GYRO_TILT_DIVISOR) * game.gyroControls.sensitivity, -6);
      game.doodler.facingRight = false;
      if (doodlerRef.current) doodlerRef.current.style.backgroundImage = `url(${beastImageLeft})`;
    } else {
      game.velocityX = 0;
    }
  };

  // Handle touch events for mobile controls
  const handleTouchStart = (direction: number) => {
    const game = gameConfig.current;
    game.touchControls.isPressed = true;
    game.touchControls.direction = direction;

    if (direction === 1) {
      game.velocityX = 4;
      game.doodler.facingRight = true;
      if (doodlerRef.current) doodlerRef.current.style.backgroundImage = `url(${beastImageRight})`;
    } else if (direction === -1) {
      game.velocityX = -4;
      game.doodler.facingRight = false;
      if (doodlerRef.current) doodlerRef.current.style.backgroundImage = `url(${beastImageLeft})`;
    }
  };

  // Stop movement on touch end
  const handleTouchEnd = () => {
    const game = gameConfig.current;
    game.touchControls.isPressed = false;
    game.touchControls.direction = 0;
    game.velocityX = 0;
  };

  // Toggle the use of the gyroscope
  const toggleGyroscope = () => {
    if (usingGyroscope) {
      gameConfig.current.gyroControls.enabled = false;
      setUsingGyroscope(false);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    } else {
      requestOrientationPermission();
    }
  };

  const getRandomFood = () => {
    if (!selectedFood) {
      const randomIndex = Math.floor(Math.random() * initialFoodItems.length);
      setSelectedFood(initialFoodItems[randomIndex]);
      console.log(`Food selected: ${initialFoodItems[randomIndex].name}`);
      return initialFoodItems[randomIndex];
    }
    return selectedFood;
  };

  // Añadir esta función
  const collectFood = (platform: any) => {
    if (platform.hasFood && !platform.foodCollected && platform.foodElement) {
      // Marcar como recolectada
      platform.foodCollected = true;
      console.log(`Collecting food from platform at ${platform.x}, ${platform.worldY}`);

      // Aumentar contador
      setCollectedFood(prev => {
        console.log(`Food count increased: ${prev} -> ${prev + 1}`);
        return prev + 1;
      });

      // Animación de desvanecimiento
      if (platform.foodElement) {
        platform.foodElement.style.opacity = '0';
        platform.foodElement.style.transform = 'translateY(-20px)';
        platform.foodElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      }

      // Notificar con toast
      toast.success(`¡Has recolectado ${selectedFood.name}!`, {
        icon: '🍔',
        duration: 2000
      });

      console.log(`Food collected: ${selectedFood.name}`);

      // Eliminar el elemento después de la animación
      setTimeout(() => {
        if (platform.foodElement && platform.foodElement.parentNode) {
          platform.foodElement.parentNode.removeChild(platform.foodElement);
        }
      }, 300);
    }
  };

  // Create initial platforms
  const placePlatforms = () => {
    const game = gameConfig.current;
    const platformsContainer = platformsRef.current;
    if (!platformsContainer) return;

    // Clear existing platforms
    while (platformsContainer.firstChild) {
      platformsContainer.removeChild(platformsContainer.firstChild);
    }

    game.platforms = [];

    // Screen height factor
    const screenHeightFactor = Math.max(1, game.boardHeight / 600);

    // Calculate how many initial platforms we need
    const initialPlatformCount = Math.max(6, Math.ceil(8 * screenHeightFactor));

    // Add initial platform (base)
    const initialPlatform = {
      x: game.boardWidth / PLATFORM_GENERATION_THRESHOLD - game.platformWidth / PLATFORM_GENERATION_THRESHOLD,
      y: game.boardHeight - 50,
      worldY: game.boardHeight - 50,
      width: game.platformWidth,
      height: game.platformHeight,
      element: document.createElement('div'),
      hasFood: false,
      foodCollected: false,
      foodElement: null as HTMLDivElement | null
    };

    game.platforms.push(initialPlatform);

    // Calculate the vertical distance between initial platforms
    const baseDistance = 85 * Math.sqrt(screenHeightFactor);

    // Add additional platforms distributed in height
    for (let i = 0; i < initialPlatformCount; i++) {
      // Distribute more widely on wide screens
      const maxX = game.boardWidth * PLATFORM_HORIZONTAL_MAX;
      const randomX = Math.floor(Math.random() * maxX);

      // Distribute in height with adaptive spacing
      const worldY = game.boardHeight - baseDistance * i - 150;

      const platform = {
        x: randomX,
        y: worldY,
        worldY: worldY,
        width: game.platformWidth,
        height: game.platformHeight,
        element: document.createElement('div'),
        hasFood: Math.random() < 0.3, // 30% de probabilidad de tener comida
        foodCollected: false,
        foodElement: null as HTMLDivElement | null
      };

      game.platforms.push(platform);
    }

    // Create DOM elements for the platforms
    game.platforms.forEach(platform => {
      const platformElement = platform.element;
      platformElement.className = 'platform';
      platformElement.style.width = `${platform.width}px`;
      platformElement.style.height = `${platform.height}px`;
      platformElement.style.left = `${platform.x}px`;
      platformElement.style.top = `${platform.y}px`;
      platformElement.style.backgroundImage = `url(${platformImg})`;
      platformElement.style.backgroundSize = 'cover';

      // Añadir comida a la plataforma si corresponde
      if (platform.hasFood && !platform.foodCollected) {
        const randomFood = initialFoodItems[Math.floor(Math.random() * initialFoodItems.length)];
        if (!selectedFood) {
          setSelectedFood(randomFood);
          console.log(`Selected food: ${randomFood.name}`);
        }

        const foodElement = document.createElement('div');
        foodElement.className = 'platform-food';
        foodElement.style.width = '40px';
        foodElement.style.height = '40px';
        foodElement.style.position = 'absolute';
        foodElement.style.left = `${(platform.width / 2) - 20}px`;
        foodElement.style.top = '-40px';
        foodElement.style.zIndex = '10';
        foodElement.style.backgroundImage = `url(${selectedFood ? selectedFood.img : randomFood.img})`;
        foodElement.style.backgroundSize = 'contain';
        foodElement.style.backgroundRepeat = 'no-repeat';
        foodElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        foodElement.style.animation = 'float 2s infinite ease-in-out';

        console.log(`Creating food on platform at ${platform.x}, ${platform.worldY}`);

        // IMPORTANTE: Guardar referencia y añadir a la plataforma
        platform.foodElement = foodElement;
        platformElement.appendChild(foodElement);
      }

      platformsContainer.appendChild(platformElement);
    });
  };

  // Create a new platform when one goes off-screen
  const newPlatform = () => {
    const game = gameConfig.current;
    const platformsContainer = platformsRef.current;
    if (!platformsContainer) return null;

    // Calculate an adaptive width for the X position
    const maxX = game.boardWidth - game.platformWidth;
    const randomX = Math.floor(Math.random() * maxX);

    // Screen height factor (base 600px)
    const screenHeightFactor = Math.max(1, game.boardHeight / 600);

    // Adjust the vertical distance between platforms
    // Make a non-linear adjustment so that on large screens the distance 
    // is not excessive but maintains playability
    const baseGap = 90; // Smaller base gap than before (was 100)

    // Apply a square root function so that the increase is not linear with size
    // This makes the increase proportionally smaller on large screens
    const screenAdjustment = Math.sqrt(screenHeightFactor);

    // Calculate the distance using the difficulty factor and score
    const difficultyMultiplier = 1 + game.backgrounds.current * 0.15; // Reduced from 0.2 to 0.15
    const scoreAdjustment = Math.min(1, score / MAX_SCORE_ADJUSTMENT); // Limits the effect of the score

    // Combined gap - closer on large screens to maintain playability
    const adjustedGap = (baseGap * screenAdjustment) * (1 + scoreAdjustment * difficultyMultiplier);

    // Calculate the vertical position (worldY) of the new platform
    const worldY = game.platforms.length > 0
      ? game.platforms[game.platforms.length - 1].worldY - adjustedGap
      : game.boardHeight - 150;

    // Create the visual element of the platform
    const platformElement = document.createElement('div');
    platformElement.className = 'platform';
    platformElement.style.width = `${game.platformWidth}px`;
    platformElement.style.height = `${game.platformHeight}px`;
    platformElement.style.backgroundImage = `url(${platformImg})`;
    platformElement.style.backgroundSize = 'cover';

    // Create the platform object
    const platform = {
      x: randomX,
      y: worldY - game.cameraY,
      worldY: worldY,
      width: game.platformWidth,
      height: game.platformHeight,
      element: platformElement,
      hasFood: Math.random() < 0.3, // 30% de probabilidad de tener comida
      foodCollected: false,
      foodElement: null as HTMLDivElement | null,
    };

    // Update the visual position of the element
    platformElement.style.left = `${platform.x}px`;
    platformElement.style.top = `${platform.y}px`;

    if (platform.hasFood) {
      // Si no hay una comida seleccionada, seleccionar una aleatoria
      if (!selectedFood) {
        const randomIndex = Math.floor(Math.random() * initialFoodItems.length);
        setSelectedFood(initialFoodItems[randomIndex]);
        console.log(`Food selected: ${initialFoodItems[randomIndex].name}`);
      }

      // Crear el elemento visual de la comida
      const foodElement = document.createElement('div');
      foodElement.className = 'platform-food';
      foodElement.style.width = '40px'; // Hacerlo más grande
      foodElement.style.height = '40px';
      foodElement.style.position = 'absolute';
      foodElement.style.left = `${(platform.width / 2) - 20}px`; // Centrar
      foodElement.style.top = '-35px'; // Un poco más arriba de la plataforma
      foodElement.style.zIndex = '10'; // Asegurar que esté por encima
      foodElement.style.backgroundImage = `url(${selectedFood.img})`;
      foodElement.style.backgroundSize = 'contain';
      foodElement.style.backgroundRepeat = 'no-repeat';
      foodElement.style.transition = 'opacity 0.3s ease'; // Para la animación de desvanecimiento

      // Guardar referencia al elemento de comida en la plataforma
      platform.foodElement = foodElement;

      // Añadir el elemento de comida a la plataforma
      platformElement.appendChild(foodElement);

      console.log(`Platform with food created at position: ${platform.x}, ${platform.worldY}`);
    }

    return platform;
  };

  // Detect collision between the doodler and a platform
  const detectCollision = (doodler: any, platform: any) => {
    // Only detect collision if the doodler is falling
    if (gameConfig.current.velocityY < 0) return false;

    // Calculate hitbox more precisely with a bit of extra margin
    const hitboxMargin = HITBOX_MARGIN; // Small margin to make landing easier

    const doodlerLeft = doodler.x + doodler.hitboxOffsetX;
    const doodlerRight = doodlerLeft + doodler.width;
    const doodlerTop = doodler.worldY + doodler.hitboxOffsetY;
    const doodlerBottom = doodlerTop + doodler.height + hitboxMargin;

    const platformLeft = platform.x;
    const platformRight = platform.x + platform.width;
    const platformTop = platform.worldY - hitboxMargin;

    // Improve collision detection to ensure they are detected correctly
    const isColliding =
      doodlerBottom >= platformTop &&
      doodlerBottom <= platformTop + platform.height / PLATFORM_GENERATION_THRESHOLD + hitboxMargin &&
      doodlerRight > platformLeft &&
      doodlerLeft < platformRight

    return isColliding;
  };

  // Añade esta función cerca de donde tienes detectCollision
  const detectFoodCollision = (doodler: any, platform: any) => {
    if (!platform.hasFood || platform.foodCollected) {
      return false;
    }

    // Usamos dimensiones similares a las de la detección de plataforma
    const doodlerLeft = doodler.x + doodler.hitboxOffsetX;
    const doodlerRight = doodlerLeft + doodler.width;
    const doodlerTop = doodler.worldY + doodler.hitboxOffsetY;
    const doodlerBottom = doodlerTop + doodler.height;

    // Posición de la comida (relativa a la plataforma)
    const foodLeft = platform.x + platform.width / 2 - 20;
    const foodRight = platform.x + platform.width / 2 + 20;
    const foodTop = platform.worldY - 35;
    const foodBottom = platform.worldY;

    // Verificar colisión
    const isColliding =
      doodlerRight > foodLeft &&
      doodlerLeft < foodRight &&
      doodlerBottom > foodTop &&
      doodlerTop < foodBottom;

    return isColliding;
  };
  // Update the background based on the score
  const updateBackground = (currentScore: number) => {
    const game = gameConfig.current;
    const gameContainer = gameContainerRef.current;
    if (!gameContainer) return;

    let newBackgroundIndex = 0;
    for (let i = game.backgrounds.images.length - 1; i >= 0; i--) {
      if (currentScore >= game.backgrounds.images[i].scoreThreshold) {
        newBackgroundIndex = i;
        break;
      }
    }

    if (background !== newBackgroundIndex) {
      setBackground(newBackgroundIndex);
      gameContainer.style.backgroundImage = `url(${game.backgrounds.images[newBackgroundIndex].img})`;
    }
  };

  // Update the camera position to follow the doodler
  const updateCamera = () => {
    const game = gameConfig.current;
    const platformsContainer = platformsRef.current;
    const doodlerElement = doodlerRef.current;

    if (!platformsContainer || !doodlerElement) return;

    // Calculate the doodler's position relative to the camera
    game.doodler.y = game.doodler.worldY - game.cameraY;

    // If the doodler is above the threshold, move the camera up
    if (game.doodler.y < CAMERA_THRESHOLD) {
      const diff = CAMERA_THRESHOLD - game.doodler.y;
      game.cameraY -= diff;

      // Update score immediately when the camera moves up
      updateScoreByHeight();
    }

    // Update visual positions of platforms
    game.platforms.forEach(platform => {
      platform.y = platform.worldY - game.cameraY;
      platform.element.style.top = `${platform.y}px`;
    });

    // Update visual position of the doodler
    doodlerElement.style.top = `${game.doodler.y}px`;
  };

  // Main game update function
  const update = (timestamp: number) => {
    const game = gameConfig.current;

    if (!game.running) return;

    if (!game.lastTimestamp) {
      game.lastTimestamp = timestamp;
    }

    const dt = (timestamp - game.lastTimestamp) / 1000;
    game.lastTimestamp = timestamp;
    const frameFactor = dt * 60;

    // If the game is already over, update the score but do not continue with game logic
    if (gameOver) {
      if (onScoreUpdate) {
        onScoreUpdate(currentScoreRef.current);
      }

      // Keep the animation loop
      game.animationFrameId = requestAnimationFrame(update);
      return;
    }

    // Update horizontal position
    game.doodler.x += game.velocityX * frameFactor;

    // Horizontal wraparound
    if (game.doodler.x > game.boardWidth) {
      game.doodler.x = 0;
    } else if (game.doodler.x + game.doodler.width < 0) {
      game.doodler.x = game.boardWidth;
    }

    // Update the doodler element
    if (doodlerRef.current) {
      doodlerRef.current.style.left = `${game.doodler.x}px`;
    }

    // Update vertical velocity with gravity
    const difficultyMultiplier = 1 + game.backgrounds.current * 0.2;
    const currentGravity = game.gravity * difficultyMultiplier;
    game.velocityY = Math.min(
      game.velocityY + currentGravity * frameFactor,
      8 * frameFactor
    );

    // Update vertical position
    game.doodler.worldY += game.velocityY * frameFactor;

    // Update camera and positions
    updateCamera();

    // Update score based on height
    updateScoreByHeight();

    // Check if the doodler fell off the screen
    if (game.doodler.worldY > game.cameraY + game.boardHeight) {
      // Only set gameOver if it's not already in that state
      if (!gameOver) {
        setGameOver(true);
        game.running = false;

        // Handle game end internally
        handleGameEnd();
      }
      return; // Exit the update loop immediately
    }

    // Check for collisions with platforms
    let collisionDetected = false;

    for (let i = 0; i < game.platforms.length && !collisionDetected; i++) {
      const platform = game.platforms[i];

      // If the platform is off-screen, hide it
      if (platform.y < -platform.height || platform.y > game.boardHeight) {
        platform.element.style.display = 'none';
        // La comida debe permanecer visible si la plataforma está justo fuera de la pantalla
        if (platform.foodElement && platform.y > -100 && platform.y < game.boardHeight + 100) {
          platform.foodElement.style.display = 'block';
        } else if (platform.foodElement) {
          platform.foodElement.style.display = 'none';
        }
      } else {
        platform.element.style.display = 'block';
      }

      // Detect collision and make the doodler bounce
      if (detectCollision(game.doodler, platform)) {
        // Make the doodler bounce
        game.velocityY = game.initialVelocityY;
        game.doodler.worldY = platform.worldY - game.doodler.height - game.doodler.hitboxOffsetY;
        collisionDetected = true;
        collectFood(platform);
      }
    }

    // Comprobar colisiones con comida
    for (let i = 0; i < game.platforms.length; i++) {
      const platform = game.platforms[i];

      if (platform.hasFood && !platform.foodCollected) {
        // Verificar colisión con comida
        if (detectFoodCollision(game.doodler, platform)) {
          console.log(`Food collision detected at position: ${platform.x}, ${platform.worldY}`);
          collectFood(platform);
        }
      }
    }

    // --- START CORRECTED PLATFORM GENERATION CODE ---

    // Check if we need to add more platforms
    const highestPlatform = game.platforms.length > 0
      ? game.platforms[game.platforms.length - 1].worldY
      : 0;
    const visibleTop = game.cameraY;
    const visibleHeight = game.boardHeight;

    // Generate more platforms if the highest platform is less than 
    // 2 times the visible height above the camera
    const platformsNeeded = visibleTop - highestPlatform > -visibleHeight * PLATFORM_GENERATION_THRESHOLD;

    // If we need more platforms, add them
    if (platformsNeeded) {
      const newPlatformObj = newPlatform();
      if (newPlatformObj) game.platforms.push(newPlatformObj);
    }

    // Remove platforms that are no longer visible to improve performance
    while (
      game.platforms.length > 0 &&
      game.platforms[0].worldY > game.cameraY + game.boardHeight * VISIBLE_PLATFORM_MARGIN // Margin to ensure visibility
    ) {
      const removedPlatform = game.platforms.shift();
      if (removedPlatform && removedPlatform.element && removedPlatform.element.parentNode) {
        removedPlatform.element.parentNode.removeChild(removedPlatform.element);
      }
    }

    // --- END CORRECTED PLATFORM GENERATION CODE ---
    game.animationFrameId = requestAnimationFrame(update);
  };

  // Reset the game
  const resetGame = () => {
    const game = gameConfig.current;
    const gameContainer = gameContainerRef.current;

    if (!gameContainer) return;

    // Stop the current game loop
    if (game.animationFrameId) {
      cancelAnimationFrame(game.animationFrameId);
      game.animationFrameId = 0;
    }

    // Ensure running is false before restarting
    game.running = false;

    // Explicitly reset the camera state
    game.cameraY = 0;

    // Reset score counters
    currentScoreRef.current = 0;
    maxHeightRef.current = 0;
    lastMilestoneRef.current = 0;

    // Reset states
    setScore(0);
    setGameOver(false);
    setBackground(0);
    setCollectedFood(0);
    setIsShareModalOpen(false);
    setCurrentScreen('playing');
    setShowGameOverModal(false);

    const newFood = initialFoodItems[Math.floor(Math.random() * initialFoodItems.length)];
    setSelectedFood(newFood);
    console.log(`New game with food: ${newFood.name}`);

    // Reset game over notification flag
    game.endNotified = false;

    // Update the scorecard directly
    if (scoreCardRef.current) {
      scoreCardRef.current.textContent = "0";
    }

    game.maxScore = 0;
    game.backgrounds.current = 0;
    gameContainer.style.backgroundImage = `url(${game.backgrounds.images[0].img})`;

    // Reset timestamp
    game.lastTimestamp = 0;

    // Reset doodler position
    game.doodler = {
      img: beastImageRight,
      x: game.boardWidth / 2 - game.doodlerWidth / 2,
      y: (game.boardHeight * 7) / 8 - game.doodlerHeight,
      worldY: (game.boardHeight * 7) / 8 - game.doodlerHeight,
      width: 15,
      height: 25,
      hitboxOffsetX: 10,
      hitboxOffsetY: 10,
      facingRight: true,
    };

    if (doodlerRef.current) {
      doodlerRef.current.style.left = `${game.doodler.x}px`;
      doodlerRef.current.style.top = `${game.doodler.y}px`;
      doodlerRef.current.style.backgroundImage = `url(${beastImageRight})`;
    }

    game.velocityX = 0;
    game.velocityY = game.initialVelocityY;

    // Place new platforms
    placePlatforms();

    // Use a small delay to restart the game
    // This gives time for React to update states
    setTimeout(() => {
      game.running = true;
      game.animationFrameId = requestAnimationFrame(update);
    }, RESET_GAME_DELAY);
  };

  // Effect to adjust game size and set up controls
  useEffect(() => {
    const game = gameConfig.current;
    const gameContainer = gameContainerRef.current;

    if (!gameContainer) return;

    // Seleccionar una comida aleatoria al iniciar
    const randomIndex = Math.floor(Math.random() * initialFoodItems.length);
    setSelectedFood(initialFoodItems[randomIndex]);
    console.log(`Initial food selected: ${initialFoodItems[randomIndex].name}`);

    // Initialize the reference counter
    currentScoreRef.current = 0;
    maxHeightRef.current = 0;
    lastMilestoneRef.current = 0;

    // Update the initial visual scorecard
    if (scoreCardRef.current) {
      scoreCardRef.current.textContent = "0";
    }

    // Function to adjust game size based on the window
    const adjustGameSize = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Update logical dimensions
      game.boardWidth = viewportWidth;
      game.boardHeight = viewportHeight;

      // Update visual dimensions of the container
      gameContainer.style.width = `${viewportWidth}px`;
      gameContainer.style.height = `${viewportHeight}px`;

      // Reposition the doodler to the center
      game.doodler.x = viewportWidth / 2 - game.doodlerWidth / 2;

      if (doodlerRef.current) {
        doodlerRef.current.style.left = `${game.doodler.x}px`;
      }

      // NEW: Adjust physics parameters based on screen size
      const screenSizeFactor = Math.max(1, viewportHeight / 600); // Base of 600px height

      // Dynamic adjustment of jump velocity
      // Increase jump power for larger screens
      game.initialVelocityY = -8 * Math.sqrt(screenSizeFactor);

      // Also adjust gravity to keep physics consistent
      game.gravity = 0.25 * Math.sqrt(screenSizeFactor);

      // Update initial velocity
      game.velocityY = game.initialVelocityY;

      // Redistribute platforms
      placePlatforms();
    };

    adjustGameSize();
    window.addEventListener('resize', adjustGameSize);
    window.addEventListener('orientationchange', adjustGameSize);

    if (isMobile) {
      document.body.classList.add('mobile-gameplay');
    }

    // Initialize doodler position
    game.doodler.x = game.boardWidth / 2 - game.doodlerWidth / 2;
    game.doodler.y = (game.boardHeight * 7) / 8 - game.doodlerHeight;
    game.doodler.worldY = game.doodler.y;

    if (doodlerRef.current) {
      doodlerRef.current.style.left = `${game.doodler.x}px`;
      doodlerRef.current.style.top = `${game.doodler.y}px`;
      doodlerRef.current.style.backgroundImage = `url(${beastImageRight})`;
    }

    game.velocityY = game.initialVelocityY;

    // Place initial platforms
    placePlatforms();

    // Start the game loop
    game.running = true;
    game.animationFrameId = requestAnimationFrame(update);

    // Keyboard controls: start movement
    const moveDoodler = (e: KeyboardEvent) => {
      // If any modal is open, do not process keyboard events
      if (isShareModalOpen || showGameOverModal) return;

      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        game.velocityX = 4;
        game.doodler.facingRight = true;
        if (doodlerRef.current) {
          doodlerRef.current.style.backgroundImage = `url(${beastImageRight})`;
        }
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        game.velocityX = -4;
        game.doodler.facingRight = false;
        if (doodlerRef.current) {
          doodlerRef.current.style.backgroundImage = `url(${beastImageLeft})`;
        }
      }

      // Remove the possibility of restarting with the space key
      // as we want it to be explicit through the buttons
    };

    // Keyboard controls: stop movement
    const stopDoodler = (e: KeyboardEvent) => {
      // If any modal is open, do not process keyboard events
      if (isShareModalOpen || showGameOverModal) return;

      if ((e.code === 'ArrowRight' || e.code === 'KeyD') && game.velocityX > 0) {
        game.velocityX = 0;
      } else if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && game.velocityX < 0) {
        game.velocityX = 0;
      }
    };

    document.addEventListener('keydown', moveDoodler);
    document.addEventListener('keyup', stopDoodler);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('keydown', moveDoodler);
      document.removeEventListener('keyup', stopDoodler);
      window.removeEventListener('resize', adjustGameSize);
      window.removeEventListener('orientationchange', adjustGameSize);

      if (game.gyroControls.enabled) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }

      if (game.animationFrameId) {
        cancelAnimationFrame(game.animationFrameId);
      }

      if (isMobile) {
        document.body.classList.remove('mobile-gameplay');
      }

      game.running = false;
    };
  }, [beastImageRight, beastImageLeft, isMobile, gameOver]);

  // Handle the gyroscope
  useEffect(() => {
    if (usingGyroscope && gyroscopePermission === 'granted') {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      return () => {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      };
    }
  }, [usingGyroscope, gyroscopePermission]);

  return (
    <div
      ref={gameContainerRef}
      className={`dom-doodle-game ${className} ${isMobile ? 'mobile-game' : ''}`}
      style={{
        backgroundImage: `url(${gameConfig.current.backgrounds.images[background].img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...style
      }}
    >
      {/* Doodler (game character) */}
      <div
        ref={doodlerRef}
        className="doodler"
        style={{
          width: `${gameConfig.current.doodlerVisualWidth}px`,
          height: `${gameConfig.current.doodlerVisualHeight}px`,
          backgroundImage: `url(${beastImageRight})`,
          left: `${gameConfig.current.doodler.x}px`,
          top: `${gameConfig.current.doodler.y}px`
        }}
      />

      {/* Container for platforms */}
      <div ref={platformsRef} className="platforms-container" />

      {/* Scoreboard */}
      <div className="score-card">
        <div ref={scoreCardRef} className="score-text">0</div>
      </div>

      <div className="food-counter">
        {selectedFood && (
          <>
            <img
              src={selectedFood.img}
              alt={selectedFood.name}
              style={{ width: '24px', height: '24px', marginRight: '5px' }}
            />
            <span>{collectedFood}</span>
          </>
        )}
      </div>

      {/* Touch controls for mobile devices */}
      {isMobile && !usingGyroscope && (
        <>
          <div
            className="control-button left-button"
            onTouchStart={() => handleTouchStart(-1)}
            onTouchEnd={handleTouchEnd}
          >
            ←
          </div>
          <div
            className="control-button right-button"
            onTouchStart={() => handleTouchStart(1)}
            onTouchEnd={handleTouchEnd}
          >
            →
          </div>
        </>
      )}

      {/* Exit button */}
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
          className={`gyro-button ${usingGyroscope ? 'active' : ''}`}
          onClick={toggleGyroscope}
        >
          <img
            src={usingGyroscope ? Unlock : Lock}
            alt={usingGyroscope ? "open" : "close"}
            className="lock-icon"
          />
        </div>
      )}

      {/* Modal to share on X */}
      {currentScreen === 'sharing' && (
        <div className="modal-overlay">
          <ShareProgress
            isOpen={isShareModalOpen}
            onClose={() => {
              setIsShareModalOpen(false);
              setCurrentScreen('gameover');
              setShowGameOverModal(true);
            }}
            type="minigame"
            minigameData={{
              name: gameName,
              score: finalScore
            }}
          />
        </div>
      )}

      {/* Game Over modal */}
      {currentScreen === 'gameover' && (
        <div className="game-result-container">
          <h2 className="game-result-title">Game over!</h2>
          <p className="game-result-score">
            Score: {finalScore}
          </p>
          <p className="game-result-score">
            Food collected: {collectedFood} {selectedFood?.name || 'items'}
          </p>
          {currentHighScore > 0 && (
            <p className="game-result-score">
              High Score: {currentHighScore}
            </p>
          )}
          <div className="game-result-buttons">
            <button
              className="play-again-button"
              onClick={handlePlayAgain}
            >
              <img
                src={Restart}
                alt="Restart icon"
                className="restart-icon"
              />
            </button>
          </div>
        </div>
      )}

      <Toaster position="bottom-center" />
    </div>
  );
});

export default DOMDoodleGame;