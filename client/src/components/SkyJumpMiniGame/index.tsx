import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback } from 'react';
import { useAccount } from '@starknet-react/core'; 

// Componentes UI (los mismos que antes)
import { ShareProgress } from '../Twitter/ShareProgress'; 
import GameOverModal from '../ui/ModalGameOver/ModalGameOver'; 

// Hooks y Servicios (los mismos que antes)
import { useHighScores } from '../../hooks/useHighScore'; 
import fetchStatus from "../Tamagotchi/utils/fetchStatus"; 
import FoodRewardService from '../../utils/foodRewardService'; 

// Tipos y Configuración del juego
import {
  CanvasSkyJumpGameProps,
  SkyJumpGameRefHandle,
  GameId,
  FoodReward
} from '../../types/SkyJumpTypes'; 
import {
  PLATFORM_IMG_PATH,
  RESET_GAME_DELAY,
  ENERGY_TOAST_DURATION,
} from './gameConfig'; // Ajusta la ruta

// Motor y Manejador de Entradas
import { GameEngine } from './gameEngine'; // Ajusta la ruta
import { InputHandler } from './inputHandler'; // Ajusta la ruta

// Assets para UI (los mismos que antes)
import RestartIcon from '../../assets/img/icon-restart.svg'; // Ajusta la ruta
import LockIcon from '../../assets/img/icon-lock.svg'; // Ajusta la ruta
import UnlockIcon from '../../assets/img/icon-unlock.svg'; // Ajusta la ruta

// Estilos (puedes necesitar un nuevo archivo o modificar el existente)
import './main.css'; 

const CanvasSkyJumpGame = forwardRef<SkyJumpGameRefHandle, CanvasSkyJumpGameProps>(({
  className = '',
  style = {},
  onScoreUpdate, // Este callback será llamado por el motor a través del componente
  beastImageRight,
  beastImageLeft,
  onExitGame,
  highScore: initialHighScore, // Renombrado para claridad
  gameName,
  handleAction,
  client,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const inputHandlerRef = useRef<InputHandler | null>(null);
  const gameOverRef    = useRef<(score: number) => void>();
  const scoreUpdateRef = useRef<(score: number) => void>();

  // Estados para la UI de React (modales, toasts, etc.)
  const [currentScore, setCurrentScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [isGameOverState, setIsGameOverState] = useState(false); // Estado de React para game over
  const [currentHighScore, setCurrentHighScore] = useState(initialHighScore);

  const [showEnergyToast, setShowEnergyToast] = useState(false);
  const [selectedFoodReward, setSelectedFoodReward] = useState<FoodReward | null>(null);


  type GameScreenState = 'playing' | 'sharing' | 'gameover';
  const [currentScreen, setCurrentScreen] = useState<GameScreenState>('playing');

  const [isMobile, setIsMobile] = useState(false);
  const [usingGyroscope, setUsingGyroscope] = useState(false);
  
  // Refs para botones táctiles (si decides crearlos dinámicamente o pasarlos)
  const touchLeftButtonRef = useRef<HTMLDivElement>(null);
  const touchRightButtonRef = useRef<HTMLDivElement>(null);


  const { myScoreSkyJump } = useHighScores(); // Hook para obtener puntuaciones de Dojo
  const { account } = useAccount();

  // Callback para que el motor actualice la puntuación en React
  const handleEngineScoreUpdate = useCallback((engineScore: number) => {
    setCurrentScore(engineScore);
    if (onScoreUpdate) {
      onScoreUpdate(engineScore);
    }
  }, [onScoreUpdate]);

  // Callback para cuando el motor del juego indica Game Over
  const handleEngineGameOver = useCallback((engineFinalScore: number) => {
    setFinalScore(engineFinalScore);
    setIsGameOverState(true);

    const dojoHighScore = myScoreSkyJump.length > 0 ? myScoreSkyJump[0]?.score : 0;
    const actualHighScore = Math.max(dojoHighScore, currentHighScore, engineFinalScore);

    if (engineFinalScore > actualHighScore) {
      setCurrentHighScore(engineFinalScore);
    } else {
      setCurrentHighScore(actualHighScore);
    }

    const reward = FoodRewardService
      .determineReward(engineFinalScore, GameId.SKY_JUMP as any);
    setSelectedFoodReward(reward);

    saveGameResultsToDojo({
      score: engineFinalScore,
      foodId: reward.food.id || "",
      foodCollected: reward.amount,
    });

    setCurrentScreen('sharing');
  }, [ myScoreSkyJump, currentHighScore, gameName, client, account, handleAction ]);

  // 2) Sincroniza el ref con la última versión de tu callback
  useEffect(() => {
    gameOverRef.current = handleEngineGameOver;
  }, [handleEngineGameOver]);

  useEffect(() => {
    scoreUpdateRef.current = handleEngineScoreUpdate;
  }, [handleEngineScoreUpdate]);


  // Efecto para inicializar y limpiar el motor del juego y los inputs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Determinar si es móvil para la lógica de inputs
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    // Rutas de imágenes del jugador, usando props o defaults
    const playerImgRight = beastImageRight || 'default-right-image-path';
    const playerImgLeft = beastImageLeft || 'default-left-image-path';

    // Crear instancia del motor del juego
    const engine = new GameEngine(
      canvas,
      playerImgRight,
      playerImgLeft,
      PLATFORM_IMG_PATH,
      score => scoreUpdateRef.current?.(score),
      score => gameOverRef.current?.(score)
    );
    gameEngineRef.current = engine;
    
    // Crear y configurar manejador de entradas
    const inputs = new InputHandler(engine, setUsingGyroscope);
    inputHandlerRef.current = inputs;
    // Pasar los refs de los botones táctiles al input handler para que añada listeners
    inputs.setupEventListeners(
        checkMobile, 
        false, // initialUsingGyro, podrías obtenerlo de un estado si es persistente
        null, // gyroButton si es un elemento HTML fuera de React
        touchLeftButtonRef.current,
        touchRightButtonRef.current
    );


    // Ajustar tamaño inicial y en resize
    const handleResize = () => {
      if (gameEngineRef.current && canvasRef.current) {
        // Dar al canvas el tamaño de su contenedor (o viewport)
        const container = canvasRef.current.parentElement;
        if(container){
            canvasRef.current.width = container.clientWidth;
            canvasRef.current.height = container.clientHeight;
        } else {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
        gameEngineRef.current.adjustGameSizeAndPhysics(canvasRef.current.width, canvasRef.current.height);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    handleResize(); // Llamada inicial

    // Iniciar el juego
    // engine.resetGame(); // El motor se resetea internamente después de cargar assets

    return () => {
      // Limpieza al desmontar
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (inputHandlerRef.current) {
        inputHandlerRef.current.cleanupEventListeners();
      }
      if (gameEngineRef.current) {
        gameEngineRef.current.stopGame();
      }
      if (checkMobile) {
        document.body.classList.remove('mobile-gameplay'); // Si usabas esta clase
      }
    };
  }, [beastImageRight, beastImageLeft]);


  const saveGameResultsToDojo = async (gameData: {
    score: number;
    foodId: string;
    foodCollected: number;
  }) => {
    const { score, foodId, foodCollected } = gameData;
    try {
      if (handleAction && client && account) {
        await handleAction(
          "SaveGameResults",
          async () => {
            // Asumiendo que estos métodos existen en tu 'client'
            await client.player.updatePlayerTotalPoints(account, score);
            await client.player.updatePlayerMinigameHighestScore(account, score, GameId.SKY_JUMP as any); // Usa el ID numérico/string correcto
            await client.player.addOrUpdateFoodAmount(account, foodId, foodCollected);
          }
        );
        return true;
      } else {
        console.warn("Cannot save game results - missing required props for Dojo interaction");
        return false;
      }
    } catch (error) {
      console.error("Error saving game results to Dojo:", error);
      return false;
    }
  };

  const fetchBeastEnergy = async () => {
    if (!account) return null;
    try {
      const statusResponse = await fetchStatus(account); // Asumiendo que fetchStatus toma Account
      if (statusResponse && statusResponse.length > 0) {
        const energy = statusResponse[4] || 0; // Confirma el índice de energía
        return energy;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching beast energy:", error);
      return null;
    }
  };

  const handlePlayAgain = async () => {
    const currentEnergy = await fetchBeastEnergy();
    if (currentEnergy === null || currentEnergy < 30) {
      setShowEnergyToast(true);
      setTimeout(() => setShowEnergyToast(false), ENERGY_TOAST_DURATION);
      return;
    }

    try {
      if (handleAction && client && account) {
        await handleAction("Play", async () => await client.game.play(account));
      }

      setCurrentScreen('playing');       
      setIsGameOverState(false);
      setSelectedFoodReward(null);
      setCurrentScore(0);
      gameEngineRef.current?.resetGame();
      
      // Pequeño delay para asegurar que los estados de React se actualicen antes de que el motor reinicie
      setTimeout(() => {
        if (gameEngineRef.current) {
          gameEngineRef.current.resetGame();
        }
      }, RESET_GAME_DELAY);

    } catch (error) {
      console.error("Error on Play Again:", error);
    }
  };
  
  const internalToggleGyroscope = () => {
    if (inputHandlerRef.current) {
      inputHandlerRef.current.toggleGyroscopeManually();
      // setUsingGyroscope es llamado por el callback del InputHandler
    }
  };

  // Exponer el método resetGame al componente padre
  useImperativeHandle(ref, () => ({
    resetGame: () => {
      // Similar a handlePlayAgain pero sin la lógica de energía/Dojo, solo resetea el motor
      setIsGameOverState(false);
      setCurrentScreen('playing');
      setSelectedFoodReward(null);
      setCurrentScore(0); // Resetea score en UI de React
      if (gameEngineRef.current) {
        setTimeout(() => { // Delay para que React actualice UI
             gameEngineRef.current?.resetGame();
        }, RESET_GAME_DELAY);
      }
    },
    isGameOver: () => gameEngineRef.current?.isGameOver() ?? true,
  }));

  return (
    <div
      className={`skyjump-game-container ${className} ${isMobile ? 'mobile-game' : ''}`}
      style={style} // El fondo se maneja dentro del canvas
    >
      <canvas
        ref={canvasRef}
        className="skyjump-canvas"
        // El tamaño se establece en JS para controlar la resolución del canvas
        // CSS se usa para el tamaño de display: width: 100%, height: 100%
      />

      {/* --- UI Superpuesta de React --- */}
      <div className="skyjump-ui-overlay">
        {/* Score (opcional si ya está en canvas, pero puede ser más estilizable aquí) */}
        <div className="skyjump-score">Score: {currentScore}</div>

        {/* Botones táctiles (si se renderizan con React) */}
        {isMobile && !usingGyroscope && (
          <>
            <div
              ref={touchLeftButtonRef}
              className="skyjump-control-button skyjump-left-button"
              aria-label="Mover izquierda"
            >
              ←
            </div>
            <div
              ref={touchRightButtonRef}
              className="skyjump-control-button skyjump-right-button"
              aria-label="Mover derecha"
            >
              →
            </div>
          </>
        )}

        {/* Botón de Salir */}
        {onExitGame && (
          <button
            className="skyjump-return-button"
            onClick={onExitGame}
            aria-label="Salir del juego"
          >
            X
          </button>
        )}

        {/* Botón de Giroscopio */}
        {isMobile && (
          <div
            className={`skyjump-gyro-button ${usingGyroscope ? 'active' : ''}`}
            onClick={internalToggleGyroscope}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') internalToggleGyroscope();}}
            aria-pressed={usingGyroscope}
            aria-label={usingGyroscope ? "Desactivar giroscopio" : "Activar giroscopio"}
          >
            <img
              src={usingGyroscope ? UnlockIcon : LockIcon}
              alt={usingGyroscope ? "Giroscopio activado" : "Giroscopio desactivado"}
              className="skyjump-lock-icon"
            />
          </div>
        )}

        {/* Modal de Compartir */}
        {currentScreen === 'sharing' && selectedFoodReward && (
          <div className="skyjump-modal-overlay">
            <ShareProgress
              isOpen={true}
              onClose={() => setCurrentScreen('gameover')}
              type="minigame"
              minigameData={{ name: gameName, score: finalScore }}
            />
          </div>
        )}
        
        <GameOverModal
          currentScreen={currentScreen}
          finalScore={finalScore}
          currentHighScore={currentHighScore}
          collectedFood={selectedFoodReward?.amount}
          selectedFood={selectedFoodReward?.food}
          handlePlayAgain={handlePlayAgain}
          restartIcon={RestartIcon}
        />

        {/* Toast de Energía */}
        {showEnergyToast && (
          <div className="skyjump-energy-toast">
            <span className="skyjump-toast-icon">⚠️</span>
            <span className="skyjump-toast-message">La energía de tu bestia es inferior al 30%, es hora de descansar.</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default CanvasSkyJumpGame;

