import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import './main.css';

// Importación de imágenes
import platformImg from '../../assets/SkyJump/platform.png';
import bgImage1 from '../../assets/SkyJump/sky-bg.gif';
import bgImage2 from '../../assets/SkyJump/sky-bg-2.gif';
import bgImage3 from '../../assets/SkyJump/night-bg.gif';
import bgImage4 from '../../assets/SkyJump/space-bg.gif';
import bgImage5 from '../../assets/SkyJump/space-bg-2.gif';

// Interface para la referencia del juego
export interface DOMDoodleGameRefHandle {
  resetGame: () => void;
}

// Props interface para el componente
interface DOMDoodleGameProps {
  className?: string;
  style?: React.CSSProperties;
  onScoreUpdate?: (score: number) => void;
  onGameEnd?: (score: number) => void;
  beastImageRight?: string;
  beastImageLeft?: string;
  onExitGame?: () => void;
}

const DOMDoodleGame = forwardRef<DOMDoodleGameRefHandle, DOMDoodleGameProps>(({
  className = '',
  style = {},
  onScoreUpdate,
  onGameEnd,
  beastImageRight,
  beastImageLeft,
  onExitGame,
}, ref) => {
  // Referencias y estados
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const doodlerRef = useRef<HTMLDivElement>(null);
  const platformsRef = useRef<HTMLDivElement>(null);
  const scoreCardRef = useRef<HTMLDivElement>(null);
  const currentScoreRef = useRef<number>(0);
  const maxHeightRef = useRef<number>(0);
  const lastMilestoneRef = useRef<number>(0);
  
  // Estados
  const [background, setBackground] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [gyroscopePermission, setGyroscopePermission] = useState<PermissionState | null>(null);
  const [usingGyroscope, setUsingGyroscope] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Configuración del juego
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
  
  // SISTEMA DE PUNTUACIÓN BASADO EN ALTURA
  const updateScoreByHeight = () => {
    const game = gameConfig.current;
      
    // Calcular la altura actual basada en la posición de la cámara (siempre positiva)
    const currentHeight = Math.max(0, -game.cameraY);
    
    // Solo actualizar la puntuación cuando se alcanza una nueva altura máxima
    if (currentHeight > maxHeightRef.current) {
      // Actualizar la altura máxima
      maxHeightRef.current = currentHeight;
      
      // Convertir altura a puntos (1 punto por cada 5 píxeles de altura)
      const heightScore = Math.floor(currentHeight / 5);
      
      // Siempre actualizar cuando hay un cambio, incluso si es el mismo valor
      if (heightScore !== currentScoreRef.current) {
        const oldScore = currentScoreRef.current;
        currentScoreRef.current = heightScore;
        
        // Log para depuración
        console.log(`Puntuación actualizada: ${oldScore} → ${heightScore}`);
        console.log(`Altura actual: ${currentHeight.toFixed(2)}, Cámara Y: ${game.cameraY.toFixed(2)}`);
        
        // Actualizar tanto el estado de React como el DOM directamente
        setScore(heightScore);
        
        if (scoreCardRef.current) {
          scoreCardRef.current.textContent = heightScore.toString();
        }
        
        // Notificar al componente padre
        if (onScoreUpdate) {
          onScoreUpdate(heightScore);
        }
        
        // Actualizar el fondo según la puntuación
        updateBackground(heightScore);
        
        // Verificar hitos de puntuación
        checkScoreMilestones(heightScore);
      }
    }
  };
  
  // Verificar hitos de puntuación y mostrar alertas
  const checkScoreMilestones = (currentScore: number) => {
    const milestone = Math.floor(currentScore / 50) * 50;
    
    if (milestone > 0 && milestone > lastMilestoneRef.current) {
      // Actualizar el último hito alcanzado
      lastMilestoneRef.current = milestone;
      
      // Mostrar toast con el hito alcanzado
      toast.success(`¡Increíble! Has alcanzado ${milestone} puntos`, {
        position: "top-center",
        duration: 2000
      });
    }
  };
  
  // Exponer la función resetGame al componente padre
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
  
  // Calibrar el giroscopio
  const calibrateGyroscope = (event: DeviceOrientationEvent) => {
    if (event.gamma !== null) {
      gameConfig.current.gyroControls.calibration = event.gamma;
    }
  };
  
  // Manejar la orientación del dispositivo
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    const game = gameConfig.current;
    if (!game.gyroControls.enabled || gameOver) return;
    
    if (event.gamma === null) return;
    const gamma = event.gamma;
    const tilt = gamma - game.gyroControls.calibration;
    
    if (tilt > 5) {
      game.velocityX = Math.min((tilt / 10) * game.gyroControls.sensitivity, 6);
      game.doodler.facingRight = true;
      if (doodlerRef.current) {
        doodlerRef.current.style.backgroundImage = `url(${beastImageRight})`;
      }
    } else if (tilt < -5) {
      game.velocityX = Math.max((tilt / 10) * game.gyroControls.sensitivity, -6);
      game.doodler.facingRight = false;
      if (doodlerRef.current) {
        doodlerRef.current.style.backgroundImage = `url(${beastImageLeft})`;
      }
    } else {
      game.velocityX = 0;
    }
  };
  
  // Manejar eventos táctiles para controles móviles
  const handleTouchStart = (direction: number) => {
    const game = gameConfig.current;
    game.touchControls.isPressed = true;
    game.touchControls.direction = direction;
    
    if (direction === 1) {
      game.velocityX = 4;
      game.doodler.facingRight = true;
      if (doodlerRef.current) {
        doodlerRef.current.style.backgroundImage = `url(${beastImageRight})`;
      }
    } else if (direction === -1) {
      game.velocityX = -4;
      game.doodler.facingRight = false;
      if (doodlerRef.current) {
        doodlerRef.current.style.backgroundImage = `url(${beastImageLeft})`;
      }
    }
  };
  
  // Detener el movimiento al soltar
  const handleTouchEnd = () => {
    const game = gameConfig.current;
    game.touchControls.isPressed = false;
    game.touchControls.direction = 0;
    game.velocityX = 0;
  };
  
  // Reiniciar el juego al tocar si es game over
  const handleRestartTouch = () => {
    if (gameOver) {
      resetGame();
    }
  };
  
  // Alternar el uso del giroscopio
  const toggleGyroscope = () => {
    if (usingGyroscope) {
      gameConfig.current.gyroControls.enabled = false;
      setUsingGyroscope(false);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    } else {
      requestOrientationPermission();
    }
  };
  
  // Crear plataformas iniciales
  const placePlatforms = () => {
    const game = gameConfig.current;
    const platformsContainer = platformsRef.current;
    if (!platformsContainer) return;
    
    // Limpiar plataformas existentes
    while (platformsContainer.firstChild) {
      platformsContainer.removeChild(platformsContainer.firstChild);
    }
    
    game.platforms = [];
    
    // Factor de altura de pantalla
    const screenHeightFactor = Math.max(1, game.boardHeight / 600);
    
    // Calculamos cuántas plataformas iniciales necesitamos
    // Para pantallas más grandes, necesitamos más plataformas iniciales
    const initialPlatformCount = Math.max(6, Math.ceil(8 * screenHeightFactor));
    
    // Agregar plataforma inicial (base)
    const initialPlatform = {
      x: game.boardWidth / 2 - game.platformWidth / 2,
      y: game.boardHeight - 50,
      worldY: game.boardHeight - 50,
      width: game.platformWidth,
      height: game.platformHeight,
      element: document.createElement('div')
    };
    
    game.platforms.push(initialPlatform);
    
    // Calculamos la distancia vertical entre plataformas iniciales
    // Usamos distancias más cercanas para pantallas grandes
    const baseDistance = 85 * Math.sqrt(screenHeightFactor); // Ajuste no lineal
    
    // Agregar plataformas adicionales distribuidas en altura
    for (let i = 0; i < initialPlatformCount; i++) {
      // Distribuir más ampliamente en pantallas anchas
      const maxX = game.boardWidth * 0.8;
      const randomX = Math.floor(Math.random() * maxX);
      
      // Distribuir en altura con espaciado adaptativo
      const worldY = game.boardHeight - baseDistance * i - 150;
      
      const platform = {
        x: randomX,
        y: worldY,
        worldY: worldY,
        width: game.platformWidth,
        height: game.platformHeight,
        element: document.createElement('div')
      };
      
      game.platforms.push(platform);
    }
    
    // Crear elementos DOM para las plataformas
    game.platforms.forEach(platform => {
      const platformElement = platform.element;
      platformElement.className = 'platform';
      platformElement.style.width = `${platform.width}px`;
      platformElement.style.height = `${platform.height}px`;
      platformElement.style.left = `${platform.x}px`;
      platformElement.style.top = `${platform.y}px`;
      platformElement.style.backgroundImage = `url(${platformImg})`;
      platformElement.style.backgroundSize = 'cover';
      platformsContainer.appendChild(platformElement);
    });
    
    console.log(`Plataformas iniciales colocadas: ${game.platforms.length}`);
  };
  
  // Crear una nueva plataforma cuando una sale de pantalla
  const newPlatform = () => {
    const game = gameConfig.current;
    const platformsContainer = platformsRef.current;
    if (!platformsContainer) return null;
    
    // Calculamos un ancho adaptativo para la posición X
    const maxX = game.boardWidth - game.platformWidth;
    const randomX = Math.floor(Math.random() * maxX);
    
    // Factor de altura de pantalla (base 600px)
    const screenHeightFactor = Math.max(1, game.boardHeight / 600);
    
    // Ajustamos la distancia vertical entre plataformas
    // Hacemos un ajuste no lineal para que en pantallas grandes la distancia 
    // no sea excesiva pero mantenga la jugabilidad
    const baseGap = 90; // Gap base más pequeño que antes (era 100)
    
    // Aplicamos una función raíz cuadrada para que el aumento no sea lineal con el tamaño
    // Esto hace que en pantallas grandes el aumento sea proporcionalmente menor
    const screenAdjustment = Math.sqrt(screenHeightFactor);
    
    // Calculamos la distancia usando el factor de dificultad y la puntuación
    const difficultyMultiplier = 1 + game.backgrounds.current * 0.15; // Reducido de 0.2 a 0.15
    const scoreAdjustment = Math.min(1, score / 200); // Limita el efecto de la puntuación
    
    // Gap combinado - más cercano en pantallas grandes para mantener la jugabilidad
    const adjustedGap = (baseGap * screenAdjustment) * (1 + scoreAdjustment * difficultyMultiplier);
    
    // Calculamos la posición vertical (worldY) de la nueva plataforma
    const worldY = game.platforms.length > 0 
      ? game.platforms[game.platforms.length - 1].worldY - adjustedGap
      : game.boardHeight - 150;
    
    // Creamos el elemento visual de la plataforma
    const platformElement = document.createElement('div');
    platformElement.className = 'platform';
    platformElement.style.width = `${game.platformWidth}px`;
    platformElement.style.height = `${game.platformHeight}px`;
    platformElement.style.backgroundImage = `url(${platformImg})`;
    platformElement.style.backgroundSize = 'cover';
    
    // Creamos el objeto de la plataforma
    const platform = {
      x: randomX,
      y: worldY - game.cameraY,
      worldY: worldY,
      width: game.platformWidth,
      height: game.platformHeight,
      element: platformElement
    };
    
    // Actualizamos la posición visual del elemento
    platformElement.style.left = `${platform.x}px`;
    platformElement.style.top = `${platform.y}px`;
    
    // Añadimos la plataforma al contenedor visual
    platformsContainer.appendChild(platformElement);
    
    return platform;
  };
  
  // Detectar colisión entre el doodler y una plataforma
  const detectCollision = (doodler: any, platform: any) => {
    // Solo detectar colisión si el doodler está cayendo
    if (gameConfig.current.velocityY < 0) return false;
    
    // Calcular hitbox con más precisión y un poco de margen adicional
    const hitboxMargin = 2; // Pequeño margen para hacer más fácil aterrizar
    
    const doodlerLeft = doodler.x + doodler.hitboxOffsetX;
    const doodlerRight = doodlerLeft + doodler.width;
    const doodlerTop = doodler.worldY + doodler.hitboxOffsetY;
    const doodlerBottom = doodlerTop + doodler.height + hitboxMargin;
    
    const platformLeft = platform.x;
    const platformRight = platform.x + platform.width;
    const platformTop = platform.worldY - hitboxMargin;
    
    // Mejorar la detección de colisiones para garantizar que se detecten correctamente
    const isColliding = 
    doodlerBottom >= platformTop && 
    doodlerBottom <= platformTop + platform.height/2 + hitboxMargin &&
    doodlerRight > platformLeft && 
    doodlerLeft < platformRight

    // Log para depuración de colisiones (descomenta si necesitas ver las colisiones)
    // if (isColliding) {
    //   console.log(`Colisión detectada! Doodler worldY: ${doodler.worldY.toFixed(2)}, Platform worldY: ${platform.worldY.toFixed(2)}`);
    // }

    return isColliding;
  };
  
  // Actualizar el fondo según la puntuación
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
  
  // Actualizar la posición de la cámara para seguir al doodler
  const updateCamera = () => {
    const game = gameConfig.current;
    const platformsContainer = platformsRef.current;
    const doodlerElement = doodlerRef.current;
    
    if (!platformsContainer || !doodlerElement) return;
    
    // Calcular la posición del doodler relativa a la cámara
    game.doodler.y = game.doodler.worldY - game.cameraY;
    
    // Si el doodler está por encima del umbral, mover la cámara hacia arriba
    const cameraThreshold = 150;
    if (game.doodler.y < cameraThreshold) {
      const diff = cameraThreshold - game.doodler.y;
      game.cameraY -= diff;
      
      // Log para depuración - ver movimiento de cámara
      console.log(`Cámara movida: ${game.cameraY.toFixed(2)}, Doodler worldY: ${game.doodler.worldY.toFixed(2)}`);
      
      // Actualizar score inmediatamente cuando la cámara se mueve hacia arriba
      updateScoreByHeight();
    }
    
    // Actualizar posiciones visuales de plataformas
    game.platforms.forEach(platform => {
      platform.y = platform.worldY - game.cameraY;
      platform.element.style.top = `${platform.y}px`;
    });
    
    // Actualizar posición visual del doodler
    doodlerElement.style.top = `${game.doodler.y}px`;
  };
  
  // Función principal de actualización del juego
  const update = (timestamp: number) => {
    const game = gameConfig.current;
    
    if (!game.running) return;
    
    if (!game.lastTimestamp) {
      game.lastTimestamp = timestamp;
    }
    
    const dt = (timestamp - game.lastTimestamp) / 1000;
    game.lastTimestamp = timestamp;
    const frameFactor = dt * 60;
    
    if (gameOver) {
      if (onScoreUpdate) {
        onScoreUpdate(currentScoreRef.current);
      }
      
      if (onGameEnd && !game.endNotified) {
        game.endNotified = true;
        console.log(`GAME OVER - Puntuación final: ${currentScoreRef.current}`);
        onGameEnd(currentScoreRef.current);
      }
      
      game.animationFrameId = requestAnimationFrame(update);
      return;
    }
    
    // Actualizar posición horizontal
    game.doodler.x += game.velocityX * frameFactor;
    
    // Wraparound horizontal
    if (game.doodler.x > game.boardWidth) {
      game.doodler.x = 0;
    } else if (game.doodler.x + game.doodler.width < 0) {
      game.doodler.x = game.boardWidth;
    }
    
    // Actualizar el elemento doodler
    if (doodlerRef.current) {
      doodlerRef.current.style.left = `${game.doodler.x}px`;
    }
    
    // Actualizar velocidad vertical con gravedad
    const difficultyMultiplier = 1 + game.backgrounds.current * 0.2;
    const currentGravity = game.gravity * difficultyMultiplier;
    game.velocityY = Math.min(
      game.velocityY + currentGravity * frameFactor,
      8 * frameFactor
    );
    
    // Actualizar posición vertical
    game.doodler.worldY += game.velocityY * frameFactor;
    
    // Actualizar cámara y posiciones
    updateCamera();
    
    // Actualizar puntuación basada en altura
    updateScoreByHeight();
    
    // Verificar si el doodler cayó fuera de la pantalla
    if (game.doodler.worldY > game.cameraY + game.boardHeight) {
      setGameOver(true);
      game.running = false;
    }
    
    // Comprobar colisiones con plataformas
    let collisionDetected = false;
    
    for (let i = 0; i < game.platforms.length && !collisionDetected; i++) {
      const platform = game.platforms[i];
      
      // Si la plataforma está fuera de la pantalla, ocultarla
      if (platform.y < -platform.height || platform.y > game.boardHeight) {
        platform.element.style.display = 'none';
      } else {
        platform.element.style.display = 'block';
      }
      
      // Detectar colisión y hacer que el doodler rebote
      if (detectCollision(game.doodler, platform)) {
        // Hacer que el doodler rebote
        game.velocityY = game.initialVelocityY;
        game.doodler.worldY = platform.worldY - game.doodler.height - game.doodler.hitboxOffsetY;
        collisionDetected = true;
      }
    }
    
    // --- INICIO CÓDIGO CORREGIDO DE GENERACIÓN DE PLATAFORMAS ---
    
    // Verificar si necesitamos agregar más plataformas
    const highestPlatform = game.platforms.length > 0 
      ? game.platforms[game.platforms.length - 1].worldY 
      : 0;
    const visibleTop = game.cameraY;
    const visibleHeight = game.boardHeight;
    
    // Generamos más plataformas si la plataforma más alta está a menos de 
    // 2 veces la altura visible por encima de la cámara
    const platformsNeeded = visibleTop - highestPlatform > -visibleHeight * 2;

    // Si necesitamos más plataformas, las añadimos
    if (platformsNeeded) {
      const newPlatformObj = newPlatform();
      if (newPlatformObj) {
        game.platforms.push(newPlatformObj);
        // console.log(`Plataforma añadida proactivamente. Total: ${game.platforms.length}`);
      }
    }

    // Eliminar plataformas que ya no son visibles para mejorar el rendimiento
    while (
      game.platforms.length > 0 &&
      game.platforms[0].worldY > game.cameraY + game.boardHeight * 1.5 // Margen para asegurar visibilidad
    ) {
      const removedPlatform = game.platforms.shift();
      if (removedPlatform && removedPlatform.element && removedPlatform.element.parentNode) {
        removedPlatform.element.parentNode.removeChild(removedPlatform.element);
        // console.log("Plataforma eliminada por debajo de la pantalla");
      }
    }
    
    // --- FIN CÓDIGO CORREGIDO DE GENERACIÓN DE PLATAFORMAS ---
    
    game.animationFrameId = requestAnimationFrame(update);
  };
  
  // Resetear el juego
  const resetGame = () => {
    const game = gameConfig.current;
    const gameContainer = gameContainerRef.current;
    
    if (!gameContainer) return;

    // Reiniciar explícitamente el estado de la cámara - esto es crucial
    game.cameraY = 0;
    
    // Resetear contadores de puntuación
    currentScoreRef.current = 0;
    maxHeightRef.current = 0;
    lastMilestoneRef.current = 0;
    
    // Resetear estados
    setScore(0);
    setGameOver(false);
    setBackground(0);
    
    // Actualizar el marcador directamente
    if (scoreCardRef.current) {
      scoreCardRef.current.textContent = "0";
    }
    
    game.maxScore = 0;
    game.backgrounds.current = 0;
    game.endNotified = false;
    gameContainer.style.backgroundImage = `url(${game.backgrounds.images[0].img})`;
    
    if (game.animationFrameId) {
      cancelAnimationFrame(game.animationFrameId);
    }
    
    // Resetear timestamp
    game.lastTimestamp = 0;
    
    // Resetear posición del doodler
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
    game.cameraY = 0;
    game.running = true;
    
    // Colocar nuevas plataformas
    placePlatforms();

    game.running = true;
    
    // Iniciar el bucle del juego
    game.animationFrameId = requestAnimationFrame(update);
  };
  
  // Efecto para ajustar el tamaño del juego y configurar controles
  // Efecto para ajustar el tamaño del juego y configurar controles
useEffect(() => {
  const game = gameConfig.current;
  const gameContainer = gameContainerRef.current;
  
  if (!gameContainer) return;
  
  // Inicializar el contador de referencia
  currentScoreRef.current = 0;
  maxHeightRef.current = 0;
  lastMilestoneRef.current = 0;
  
  // Actualizar el marcador visual inicial
  if (scoreCardRef.current) {
    scoreCardRef.current.textContent = "0";
  }
  
  // Función para ajustar el tamaño del juego según la ventana
  const adjustGameSize = () => {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Actualizar dimensiones lógicas
    game.boardWidth = viewportWidth;
    game.boardHeight = viewportHeight;
    
    // Actualizar dimensiones visuales del contenedor
    gameContainer.style.width = `${viewportWidth}px`;
    gameContainer.style.height = `${viewportHeight}px`;
    
    // Reposicionar el doodler al centro
    game.doodler.x = viewportWidth / 2 - game.doodlerWidth / 2;
    
    if (doodlerRef.current) {
      doodlerRef.current.style.left = `${game.doodler.x}px`;
    }
    
    // NUEVO: Ajustar parámetros de física según el tamaño de pantalla
    const screenSizeFactor = Math.max(1, viewportHeight / 600); // Base de 600px de altura
    
    // Ajuste dinámico de la velocidad de salto
    // Aumenta la potencia de salto para pantallas más grandes
    game.initialVelocityY = -8 * Math.sqrt(screenSizeFactor);
    
    // También ajustamos la gravedad para mantener la física consistente
    game.gravity = 0.25 * Math.sqrt(screenSizeFactor);
    
    console.log(`Ajustes para pantalla: altura=${viewportHeight}px, velocidadSalto=${game.initialVelocityY.toFixed(2)}, gravedad=${game.gravity.toFixed(2)}`);
    
    // Actualizar la velocidad inicial
    game.velocityY = game.initialVelocityY;
    
    // Redistribuir plataformas
    placePlatforms();
  };
  
  adjustGameSize();
  window.addEventListener('resize', adjustGameSize);
  window.addEventListener('orientationchange', adjustGameSize);
  
  if (isMobile) {
    document.body.classList.add('mobile-gameplay');
  }
  
  // Inicializar posición del doodler
  game.doodler.x = game.boardWidth / 2 - game.doodlerWidth / 2;
  game.doodler.y = (game.boardHeight * 7) / 8 - game.doodlerHeight;
  game.doodler.worldY = game.doodler.y;
  
  if (doodlerRef.current) {
    doodlerRef.current.style.left = `${game.doodler.x}px`;
    doodlerRef.current.style.top = `${game.doodler.y}px`;
    doodlerRef.current.style.backgroundImage = `url(${beastImageRight})`;
  }
  
  game.velocityY = game.initialVelocityY;
  
  // Colocar plataformas iniciales
  placePlatforms();
  
  // Iniciar el bucle del juego
  game.running = true;
  game.animationFrameId = requestAnimationFrame(update);
  
  // Controles de teclado: iniciar movimiento
  const moveDoodler = (e: KeyboardEvent) => {
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
    } else if (e.code === 'Space' && gameOver) {
      resetGame();
    }
  };
  
  // Controles de teclado: detener movimiento
  const stopDoodler = (e: KeyboardEvent) => {
    if ((e.code === 'ArrowRight' || e.code === 'KeyD') && game.velocityX > 0) {
      game.velocityX = 0;
    } else if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && game.velocityX < 0) {
      game.velocityX = 0;
    }
  };
  
  document.addEventListener('keydown', moveDoodler);
  document.addEventListener('keyup', stopDoodler);
  
  // Limpieza al desmontar
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
  
  // Manejar el giroscopio
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
      onClick={gameOver ? handleRestartTouch : undefined}
    >
      {/* Doodler (personaje del juego) */}
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
      
      {/* Contenedor para las plataformas */}
      <div ref={platformsRef} className="platforms-container" />
      
      {/* Marcador de puntuación */}
      <div className="score-card">
        <div ref={scoreCardRef} className="score-text">0</div>
      </div>
      
      {/* Controles táctiles para dispositivos móviles */}
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
      
      {/* Botón para salir */}
      {onExitGame && (
        <button 
          className="exit-button"
          onClick={onExitGame}
        >
          X
        </button>
      )}
      
      {/* Botón para alternar giroscopio en móviles */}
      {isMobile && (
        <div
          className={`gyro-button ${usingGyroscope ? 'active' : ''}`}
          onClick={toggleGyroscope}
        >
          {usingGyroscope ? '🔓' : '🔒'}
        </div>
      )}
      
      {/* Mensaje de Game Over */}
      {gameOver && (
        <div className="game-over-message">
          <div>Game Over</div>
          <div>Toca para reiniciar</div>
          <div>Puntuación: {score}</div>
        </div>
      )}
    </div>
  );
});

export default DOMDoodleGame;