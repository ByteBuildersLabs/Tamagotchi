import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ShareProgress } from '../Twitter/ShareProgress';
import { saveHighScore } from '../../data/gamesMiniGamesRegistry';
import Restart from '../../assets/img/restart.svg';
import './syles.css';

// Importar los assets del juego
import skyBackground from '../../assets/FlappyBeasts/sky.png';
import landBackground from '../../assets/FlappyBeasts/land.png';
import ceilingBackground from '../../assets/FlappyBeasts/ceiling.png';
import pipeImage from '../../assets/FlappyBeasts/pipe.png';
import pipeUpImage from '../../assets/FlappyBeasts/pipe-up.png';
import pipeDownImage from '../../assets/FlappyBeasts/pipe-down.png';

// Configuración de assets
const gameAssets = {
  sky: skyBackground,
  land: landBackground,
  ceiling: ceilingBackground,
  pipe: pipeImage,
  pipeUp: pipeUpImage,
  pipeDown: pipeDownImage
};

// Constants
const PIPE_GAP = 160; // Espacio entre las tuberías
const PIPE_INTERVAL = 1700;
const GRAVITY = 9.8;
const JUMP_FORCE = -6;
const BIRD_WIDTH = 46;
const BIRD_HEIGHT = 46;
const PIPE_WIDTH = 52;
const ENERGY_TOAST_DURATION = 3000;

// Interfaces
export interface FlappyBirdRefHandle {
  resetGame: () => void;
}

interface FlappyBirdProps {
  className?: string;
  style?: React.CSSProperties;
  onScoreUpdate?: (score: number) => void;
  beastImageRight?: string;
  beastImageLeft?: string;
  onExitGame?: () => void;
  highScore: number;
  gameId: string;
  beastId: number;
  gameName: string;
  handleAction: (actionName: string, actionFn: () => Promise<any>) => Promise<any>;
  client: any;
  account: any;
}

const FlappyBirdMiniGame = forwardRef<FlappyBirdRefHandle, FlappyBirdProps>(({
  className = '',
  style = {},
  onScoreUpdate,
  beastImageRight,
  onExitGame,
  highScore,
  gameId,
  beastId,
  gameName,
  handleAction,
  client,
  account
}, ref) => {
  // Game state
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [currentHighScore, setCurrentHighScore] = useState(highScore);
  const [showEnergyToast, setShowEnergyToast] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  
  type GameScreenState = 'playing' | 'sharing' | 'gameover';
  const [currentScreen, setCurrentScreen] = useState<GameScreenState>('playing');

  // Refs
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const beastRef = useRef<HTMLDivElement>(null);
  const pipesRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);
  const lastPipeTime = useRef<number>(0);
  const currentScoreRef = useRef<number>(0);

  // Game variables
  const gameConfig = useRef({
    birdX: 60,
    birdY: 0,
    velocity: 0,
    pipes: [] as Array<{
      x: number;
      topHeight: number;
      bottomY: number;
      scored: boolean;
      element: HTMLDivElement;
      topElement: HTMLDivElement;
      bottomElement: HTMLDivElement;
    }>,
    gravity: GRAVITY,
    jumpForce: JUMP_FORCE,
    gameWidth: 360,
    gameHeight: 576,
    running: false,
    lastTimestamp: 0
  });

  // Expose resetGame to parent component
  useImperativeHandle(ref, () => ({
    resetGame: () => {
      resetGame();
    }
  }));

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
  }, []);

  // Save game results to Dojo
  const saveGameResultsToDojo = async (score: number) => {
    try {
      if (handleAction && client && account) {
        await handleAction(
          "SaveGameResults", 
          async () => {
            await client.player.updatePlayerTotalPoints(
              account,
              score
            );
            await client.player.updatePlayerMinigameHighestScore(
              account,
              score,
              0 // Usar ID apropiado para FlappyBird
            );
          }
        );
        return true;
      } else {
        console.warn("Cannot save game results - missing required props");
        return false;
      }
    } catch (error) {
      console.error("Error saving game results:", error);
      return false;
    }
  };

  // Function to fetch beast energy from Dojo
  const fetchBeastEnergy = async () => {
    try {
      // Implementación real requerirá actualización según tu estructura
      if (client && account) {
        // Esto es un placeholder - actualizar con la función real
        const statusResponse = await client.game.getStatus(account);
        return statusResponse ? statusResponse[4] || 0 : 0;
      }
      return 100; // Valor predeterminado para desarrollo
    } catch (error) {
      console.error("Error fetching beast energy:", error);
      return null;
    }
  };

  // Handle game over
  const handleGameEnd = () => {
    const score = currentScoreRef.current;
    setFinalScore(score);
  
    // Check if it's a new high score
    if (score > currentHighScore) {
      saveHighScore(gameId, beastId, score);
      setCurrentHighScore(score);
    }
    
    saveGameResultsToDojo(score);
  
    setCurrentScreen('sharing');
    setIsShareModalOpen(true);
  };

  // Handle play again
  const handlePlayAgain = async () => {
    // Get the energy refreshed before playing again
    const currentEnergy = await fetchBeastEnergy();

    // Check if there is enough energy
    if (currentEnergy === null || currentEnergy < 30) {
      console.log("Not enough energy to play again");
      setShowEnergyToast(true);

      setTimeout(() => {
        setShowEnergyToast(false);
      }, ENERGY_TOAST_DURATION);
      
      return;
    }
    
    try {
      if (handleAction && client && account) {
        await handleAction(
          "Play",
          async () => await client.game.play(account),
        );
      }

      setShowGameOverModal(false);
      setCurrentScreen('playing'); 
      resetGame();
    }
    catch (error) {
      console.error("Error playing again:", error);
    }
  };

  // Create a new pipe
  const createPipe = () => {
    if (!pipesRef.current || !gameContainerRef.current) {
      console.log("Refs para tuberías o contenedor no disponibles");
      return;
    }
    
    const game = gameConfig.current;
    const gameHeight = game.gameHeight;
    
    console.log("Creando nueva tubería, altura del juego:", gameHeight);
    
    // Calcula alturas aleatorias para las tuberías
    const minHeight = Math.floor(gameHeight * 0.1);
    const maxHeight = Math.floor(gameHeight * 0.6);
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
    const bottomY = topHeight + PIPE_GAP;
    
    console.log("Alturas de tuberías:", { topHeight, bottomY });
    
    // Crear elementos de tuberías
    const pipeContainer = document.createElement('div');
    pipeContainer.className = 'pipe';
    pipeContainer.style.width = `${PIPE_WIDTH}px`;
    pipeContainer.style.left = `${game.gameWidth}px`;
    pipeContainer.style.height = '100%';
    pipeContainer.style.position = 'absolute';
    pipeContainer.style.zIndex = '10';
    
    const topPipe = document.createElement('div');
    topPipe.className = 'pipe_upper';
    topPipe.style.height = `${topHeight}px`;
    topPipe.style.width = `${PIPE_WIDTH}px`;
    topPipe.style.position = 'absolute';
    topPipe.style.top = '0';
    topPipe.style.backgroundImage = `url(${gameAssets.pipe})`;
    topPipe.style.backgroundRepeat = 'repeat-y';
    topPipe.style.backgroundPosition = 'center';
    
    const topPipeEnd = document.createElement('div');
    topPipeEnd.className = 'pipe_upper_end';
    topPipeEnd.style.position = 'absolute';
    topPipeEnd.style.bottom = '0';
    topPipeEnd.style.width = `${PIPE_WIDTH}px`;
    topPipeEnd.style.height = '26px';
    topPipeEnd.style.backgroundImage = `url(${gameAssets.pipeDown})`;
    topPipe.appendChild(topPipeEnd);
    
    const bottomPipe = document.createElement('div');
    bottomPipe.className = 'pipe_lower';
    bottomPipe.style.height = `${gameHeight - bottomY}px`;
    bottomPipe.style.width = `${PIPE_WIDTH}px`;
    bottomPipe.style.position = 'absolute';
    bottomPipe.style.bottom = '0';
    bottomPipe.style.top = `${bottomY}px`;
    bottomPipe.style.backgroundImage = `url(${gameAssets.pipe})`;
    bottomPipe.style.backgroundRepeat = 'repeat-y';
    bottomPipe.style.backgroundPosition = 'center';
    
    const bottomPipeEnd = document.createElement('div');
    bottomPipeEnd.className = 'pipe_lower_end';
    bottomPipeEnd.style.position = 'absolute';
    bottomPipeEnd.style.top = '0';
    bottomPipeEnd.style.width = `${PIPE_WIDTH}px`;
    bottomPipeEnd.style.height = '26px';
    bottomPipeEnd.style.backgroundImage = `url(${gameAssets.pipeUp})`;
    bottomPipe.appendChild(bottomPipeEnd);
    
    pipeContainer.appendChild(topPipe);
    pipeContainer.appendChild(bottomPipe);
    
    console.log("Añadiendo tubería al DOM");
    pipesRef.current.appendChild(pipeContainer);
    
    // Añadir tubería al estado del juego
    game.pipes.push({
      x: game.gameWidth,
      topHeight,
      bottomY,
      scored: false,
      element: pipeContainer,
      topElement: topPipe,
      bottomElement: bottomPipe
    });
  
    console.log(`Tubería creada. Total tuberías: ${game.pipes.length}`);
  };

  // Remove pipes that are off screen
  const removePipes = () => {
    const game = gameConfig.current;
    
    game.pipes = game.pipes.filter(pipe => {
      if (pipe.x + PIPE_WIDTH < 0) {
        if (pipe.element.parentNode) {
          pipe.element.parentNode.removeChild(pipe.element);
        }
        return false;
      }
      return true;
    });
  };

  // Update bird position
  const updateBird = (dt: number) => {
    const game = gameConfig.current;
    
    // Log para depuración
    console.log(`Antes de actualizar: velocidad=${game.velocity}, posY=${game.birdY}`);
    
    // Aplicar gravedad, ajustada por delta time (en segundos)
    game.velocity += game.gravity * dt;
    
    // Limitar la velocidad máxima de caída
    const MAX_FALL_SPEED = 15;
    if (game.velocity > MAX_FALL_SPEED) {
      game.velocity = MAX_FALL_SPEED;
    }
    
    // Actualizar posición, ajustada por delta time
    // Factor 60 para escalar adecuadamente el movimiento
    game.birdY += game.velocity * dt * 60;
    
    console.log(`Después de actualizar: velocidad=${game.velocity}, posY=${game.birdY}, dt=${dt}, movimiento=${game.velocity * dt * 60}px`);
    
    // Actualizar posición visual del personaje
    if (beastRef.current) {
      beastRef.current.style.transform = `translateY(${game.birdY}px) rotate(${Math.min(Math.max(game.velocity * 3, -30), 90)}deg)`;
    }
    
    // Comprobar colisiones con los límites
    if (game.birdY < 0) {
      game.birdY = 0;
      game.velocity = 0;
    } else if (game.birdY > game.gameHeight - BIRD_HEIGHT) {
      console.log("Colisión con el suelo");
      endGame();
    }
  };

  // Update pipes position
  const updatePipes = (dt: number) => {
    const game = gameConfig.current;
  
    // Define la velocidad en PÍXELES POR SEGUNDO (no por frame)
    // El Flappy Bird original usa aproximadamente 60-80 píxeles por segundo
    const PIPE_SPEED_PPS = 180; // Píxeles por segundo - AJUSTA ESTE VALOR
    
    // La velocidad aplicada será píxeles/segundo * segundos = píxeles a mover
    const pipeSpeed = PIPE_SPEED_PPS * dt;
    
    console.log(`Velocidad de tubos: ${pipeSpeed.toFixed(2)}px este frame, ${PIPE_SPEED_PPS}px/s`);
    
    game.pipes.forEach(pipe => {
      // Mover tubería
      pipe.x -= pipeSpeed;
      pipe.element.style.left = `${pipe.x}px`;
      
      // Check if bird passed the pipe
      if (!pipe.scored && pipe.x + PIPE_WIDTH < game.birdX) {
        pipe.scored = true;
        currentScoreRef.current += 1;
        setScore(currentScoreRef.current);
        if (scoreRef.current) {
          scoreRef.current.textContent = `${currentScoreRef.current}`;
        }
        if (onScoreUpdate) {
          onScoreUpdate(currentScoreRef.current);
        }
      }
      
      // Check collision with pipe
      if (
        // Bird is within pipe's horizontal bounds
        game.birdX + BIRD_WIDTH > pipe.x && 
        game.birdX < pipe.x + PIPE_WIDTH &&
        // Bird is within pipe's vertical bounds (colliding with top or bottom pipe)
        (game.birdY < pipe.topHeight || game.birdY + BIRD_HEIGHT > pipe.bottomY)
      ) {
        endGame();
      }
    });
  };

  // Game update loop
  const update = (timestamp: number) => {
    const game = gameConfig.current;
    
    if (!game.running) {
      console.log("El juego no está corriendo, cancelando loop");
      return;
    }
    
    if (!game.lastTimestamp) {
      game.lastTimestamp = timestamp;
      animationFrameId.current = requestAnimationFrame(update);
      return;
    }
    
    // Calcular delta time en SEGUNDOS
    let dt = (timestamp - game.lastTimestamp) / 1000;
    
    // Limitar dt para evitar saltos grandes
    const MAX_DT = 0.1; // máximo 100ms
    if (dt > MAX_DT) dt = MAX_DT;
    
    game.lastTimestamp = timestamp;
    
    // Log cada segundo aproximadamente
    if (Math.floor(timestamp / 1000) > Math.floor((timestamp - dt * 1000) / 1000)) {
      console.log(`Tiempo: ${timestamp}, Último tubo: ${lastPipeTime.current}, Diferencia: ${timestamp - lastPipeTime.current}ms`);
    }
    
    // Verificar si crear nuevo tubo
    if (timestamp - lastPipeTime.current > PIPE_INTERVAL) {
      console.log("¡Creando nuevo tubo!");
      createPipe();
      lastPipeTime.current = timestamp;
    }
    
    // Usar la función updateBird para actualizar la física del personaje
    updateBird(dt);
    
    // Actualizar tuberías
    updatePipes(dt);
    removePipes();
    
    // Continuar ciclo
    animationFrameId.current = requestAnimationFrame(update);
  };

  // Start the game
  const startGame = () => {
    if (gameConfig.current.running) {
      console.log("El juego ya está en ejecución");
      return;
    }
    
    console.log("Iniciando el juego");
    const game = gameConfig.current;
    game.running = true;
    game.birdY = game.gameHeight / 2 - BIRD_HEIGHT / 2;
    game.velocity = 0;
    
    if (beastRef.current) {
      beastRef.current.style.transform = `translateY(${game.birdY}px) rotate(0deg)`;
    }
    
    setGameActive(true);
    setGameOver(false);
    
    // Crear primera tubería inmediatamente
    console.log("Creando tubería inicial");
    createPipe();
    
    lastPipeTime.current = performance.now();
    console.log(`Timestamp inicial para tubos: ${lastPipeTime.current}`);
    
    // Iniciar loop
    animationFrameId.current = requestAnimationFrame(update);
    console.log("Juego iniciado, animation frame:", animationFrameId.current);
    
    // Opcional: aplicar un pequeño salto automático al inicio para feedback
    setTimeout(() => {
      if (game.running) {
        jump();
      }
    }, 150);
  };

  // End the game
  const endGame = () => {
    if (!gameConfig.current.running) return;
    
    gameConfig.current.running = false;
    setGameActive(false);
    setGameOver(true);
    
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    handleGameEnd();
  };

  // Reset the game
  const resetGame = () => {
    const game = gameConfig.current;
    
    // Stop the current game loop
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    // Reset game state
    game.running = false;
    game.birdY = game.gameHeight / 2 - BIRD_HEIGHT / 2;
    game.velocity = 0;
    game.lastTimestamp = 0;
    
    // Reset pipes
    if (pipesRef.current) {
      while (pipesRef.current.firstChild) {
        pipesRef.current.removeChild(pipesRef.current.firstChild);
      }
    }
    game.pipes = [];
    
    // Reset score
    currentScoreRef.current = 0;
    setScore(0);
    if (scoreRef.current) {
      scoreRef.current.textContent = "0";
    }
    
    // Reset UI state
    setGameOver(false);
    setGameActive(false);
    setIsShareModalOpen(false);
    setShowGameOverModal(false);
    setCurrentScreen('playing');
    
    if (beastRef.current) {
      beastRef.current.style.transform = `translateY(${game.birdY}px) rotate(0deg)`;
    }
  };

  // Jump action
  const jump = () => {
    console.log("Función de salto llamada. Estado:", gameActive ? "activo" : "inactivo", gameOver ? "game over" : "jugando");
    
    if (!gameActive && !gameOver) {
      console.log("Iniciando juego desde salto");
      startGame();
    } else if (gameActive) {
      // Aplicar una fuerza de salto inmediata y significativa
      gameConfig.current.velocity = gameConfig.current.jumpForce;
      console.log(`Aplicando fuerza de salto: ${gameConfig.current.jumpForce}, nueva velocidad: ${gameConfig.current.velocity}`);
      
      // Opcional: pequeño impulso inmediato para feedback visual
      gameConfig.current.birdY -= 5;
      
      // Actualizar visual inmediatamente
      if (beastRef.current) {
        beastRef.current.style.transform = `translateY(${gameConfig.current.birdY}px) rotate(-20deg)`;
      }
    }
  };

  useEffect(() => {
    if (!gameActive) return;
    
    const safetyCheck = setInterval(() => {
      const now = performance.now();
      
      console.log(`Comprobación de seguridad: ${gameConfig.current.pipes.length} tubos activos`);
      console.log(`Último tubo creado hace ${now - lastPipeTime.current}ms`);
      
      // Si no se ha creado un tubo en el doble del intervalo esperado, forzamos la creación
      if (gameActive && gameConfig.current.running && now - lastPipeTime.current > PIPE_INTERVAL * 2) {
        console.log("¡Alerta! No se han creado tubos recientemente. Forzando creación.");
        createPipe();
        lastPipeTime.current = now;
      }
    }, 5000); // Comprobar cada 5 segundos
    
    return () => clearInterval(safetyCheck);
  }, [gameActive]);

  // Keyboard handler
  useEffect(() => {
    const gameContainer = gameContainerRef.current;
    if (!gameContainer) return;
    
    const handleClick = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      console.log("Click detectado");
      jump();
    };
    
    const handleTouch = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      console.log("Toque detectado");
      jump();
    };
    
    const handleKeyDown = (e: { code: string; preventDefault: () => void; }) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        console.log("Tecla detectada:", e.code);
        jump();
      }
    };
    
    // Agregar manejadores de eventos explícitamente al contenedor del juego
    gameContainer.addEventListener('click', handleClick);
    gameContainer.addEventListener('touchstart', handleTouch);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      gameContainer.removeEventListener('click', handleClick);
      gameContainer.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameActive, gameOver]);

  // Adjust game size based on container
  useEffect(() => {
    const adjustGameSize = () => {
      if (!gameContainerRef.current) return;
      
      const container = gameContainerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      gameConfig.current.gameWidth = containerWidth;
      gameConfig.current.gameHeight = containerHeight;
      
      // Reset bird position on resize
      gameConfig.current.birdY = containerHeight / 2 - BIRD_HEIGHT / 2;
      if (beastRef.current) {
        beastRef.current.style.transform = `translateY(${gameConfig.current.birdY}px) rotate(0deg)`;
      }
      
      // Remove any existing pipes when resizing
      if (pipesRef.current) {
        while (pipesRef.current.firstChild) {
          pipesRef.current.removeChild(pipesRef.current.firstChild);
        }
      }
      gameConfig.current.pipes = [];
    };
    
    adjustGameSize();
    window.addEventListener('resize', adjustGameSize);
    window.addEventListener('orientationchange', adjustGameSize);
    
    // Setup mobile-specific behaviors
    if (isMobile) {
      document.body.classList.add('mobile-gameplay');
      
      // Prevent scrolling during gameplay
      const preventScroll = (e: TouchEvent) => {
        if (gameActive) {
          e.preventDefault();
        }
      };
      
      document.addEventListener('touchmove', preventScroll, { passive: false });
      
      return () => {
        window.removeEventListener('resize', adjustGameSize);
        window.removeEventListener('orientationchange', adjustGameSize);
        document.body.classList.remove('mobile-gameplay');
        document.removeEventListener('touchmove', preventScroll);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }
    
    return () => {
      window.removeEventListener('resize', adjustGameSize);
      window.removeEventListener('orientationchange', adjustGameSize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
}, [gameActive, isMobile]);

return (
    <div
      ref={gameContainerRef}
      className={`flappy-bird-game ${className} ${isMobile ? 'mobile-game' : ''}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        backgroundColor: '#4ec0ca',
        ...style
      }}
      onClick={() => {
        console.log("Click en el contenedor del juego");
        jump();
      }}
      onTouchStart={(e) => {
        console.log("Touch en el contenedor del juego");
        e.preventDefault();
        jump();
      }}
    >
    {/* Sky background */}
    <div className="sky" style={{ backgroundImage: `url(${gameAssets.sky})` }}>
      <div className="fly-area">
        {/* Beast character */}
        <div
          ref={beastRef}
          className="bird"
          style={{
            width: `${BIRD_WIDTH}px`,
            height: `${BIRD_HEIGHT}px`,
            backgroundImage: `url(${beastImageRight})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            position: 'absolute',
            left: `${gameConfig.current.birdX}px`,
            transition: 'transform 0.1s',
            transform: `translateY(${gameConfig.current.birdY}px) rotate(0deg)`,
            zIndex: 100
          }}
        />
        
        {/* Pipes container */}
        <div ref={pipesRef} style={{ position: 'relative' }} />
        
        {/* Score display */}
        <div className="score-card">
          <div ref={scoreRef} className="score-text">0</div>
        </div>
        
        {/* Land background */}
        <div 
          className="land animated" 
          style={{ backgroundImage: `url(${gameAssets.land})` }}
        />
        
        {/* Ceiling */}
        <div 
          className="ceiling animated" 
          style={{ backgroundImage: `url(${gameAssets.ceiling})` }}
        />
      </div>
    </div>
    
    {/* Exit button */}
    {onExitGame && (
      <button
        className="return-button"
        onClick={onExitGame}
      >
        X
      </button>
    )}
    
    {/* Game instructions */}
    {!gameActive && !gameOver && (
      <div className="game-instructions">
        <h2>FLAPPY BEAST</h2>
        <p>Tap or click to fly</p>
        <p>Avoid obstacles</p>
        <button 
          className="start-button"
          onClick={startGame}
        >
          START
        </button>
      </div>
    )}
    
    {/* Share Modal */}
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
    
    {/* Game Over Modal */}
    {currentScreen === 'gameover' && (
      <div className="game-result-container">
        <h2 className="game-result-title">Game over!</h2>
        
        {finalScore > currentHighScore ? (
          <p className="game-result-score high-score-animation">
            <span role="img" aria-label="trophy" style={{ marginRight: '5px' }}>🏆</span>
            New High Score: {finalScore}!
          </p>
        ) : (
          <p className="game-result-score">
            Score: {finalScore}
          </p>
        )}
        
        {currentHighScore > 0 && finalScore <= currentHighScore && (
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
    
    {/* Energy Toast */}
    {showEnergyToast && (
      <div className="energy-toast">
        <span className="toast-icon">⚠️</span>
        <span className="toast-message">Your beast's energy is under 30%, it's time to rest.</span>
      </div>
    )}
  </div>
);
});

export default FlappyBirdMiniGame;