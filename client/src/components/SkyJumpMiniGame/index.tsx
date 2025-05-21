import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback } from 'react';
import { useAccount } from '@starknet-react/core'; 

import { ShareProgress } from '../Twitter/ShareProgress'; 
import GameOverModal from '../ui/ModalGameOver/ModalGameOver'; 

import { useHighScores } from '../../hooks/useHighScore'; 
import fetchStatus from "../Tamagotchi/utils/fetchStatus"; 
import FoodRewardService from '../../utils/foodRewardService'; 

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
} from './gameConfig';

import { GameEngine } from './gameEngine'; 
import { InputHandler } from './inputHandler'; 

import RestartIcon from '../../assets/img/icon-restart.svg'; 

import './main.css'; 
import { Account } from 'starknet';

const CanvasSkyJumpGame = forwardRef<SkyJumpGameRefHandle, CanvasSkyJumpGameProps>(({
  className = '',
  style = {},
  onScoreUpdate, 
  beastImageRight,
  beastImageLeft,
  onExitGame,
  highScore: initialHighScore,
  gameName,
  handleAction,
  client,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const inputHandlerRef = useRef<InputHandler | null>(null);
  const gameOverRef    = useRef<(score: number) => void>();
  const scoreUpdateRef = useRef<(score: number) => void>();

  const [currentScore, setCurrentScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [_isGameOverState, setIsGameOverState] = useState(false);
  const [currentHighScore, setCurrentHighScore] = useState(0);

  const [showEnergyToast, setShowEnergyToast] = useState(false);
  const [selectedFoodReward, setSelectedFoodReward] = useState<FoodReward | null>(null);

  type GameScreenState = 'playing' | 'sharing' | 'gameover';
  const [currentScreen, setCurrentScreen] = useState<GameScreenState>('playing');

  const [isMobile, setIsMobile] = useState(false);
  const [usingGyroscope, setUsingGyroscope] = useState(false);
  
  const touchLeftButtonRef = useRef<HTMLDivElement>(null);
  const touchRightButtonRef = useRef<HTMLDivElement>(null);

  const { myScoreSkyJump } = useHighScores(); 
  const { account } = useAccount();

  // Initialize high score from Dojo
  useEffect(() => {
    if (myScoreSkyJump && myScoreSkyJump.length > 0) {
      const dojoHighScore = myScoreSkyJump[0]?.score || 0;
      setCurrentHighScore(dojoHighScore);
    } else {
      setCurrentHighScore(0);
    }
  }, [myScoreSkyJump]);

  // Callback when the game engine updates the score
  const handleEngineScoreUpdate = useCallback((engineScore: number) => {
    setCurrentScore(engineScore);
    if (onScoreUpdate) {
      onScoreUpdate(engineScore);
    }
  }, [onScoreUpdate]);

  // Callback when the game engine signals game over
  const handleEngineGameOver = useCallback(async (engineFinalScore: number) => {
    setFinalScore(engineFinalScore);
    setIsGameOverState(true);

    const dojoHighScore = myScoreSkyJump.length > 0 ? myScoreSkyJump[0]?.score : 0;
    
    if (engineFinalScore > dojoHighScore) {
      setCurrentHighScore(engineFinalScore);
      const tx = await client.achieve.achievePlatformHighscore(account as Account, engineFinalScore);
      console.info('tx', tx);
    } else {
      setCurrentHighScore(dojoHighScore);
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
  }, [myScoreSkyJump, gameName, client, account, handleAction]);

  // Sync the game over and score update callbacks with the refs
  useEffect(() => {
    gameOverRef.current = handleEngineGameOver;
  }, [handleEngineGameOver]);

  useEffect(() => {
    scoreUpdateRef.current = handleEngineScoreUpdate;
  }, [handleEngineScoreUpdate]);


  // UseEffect to initialize the game engine and input handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    const playerImgRight = beastImageRight || 'default-right-image-path';
    const playerImgLeft = beastImageLeft || 'default-left-image-path';

    const engine = new GameEngine(
      canvas,
      playerImgRight,
      playerImgLeft,
      PLATFORM_IMG_PATH,
      score => scoreUpdateRef.current?.(score),
      score => gameOverRef.current?.(score)
    );
    gameEngineRef.current = engine;
    
    const inputs = new InputHandler(engine, setUsingGyroscope);
    inputHandlerRef.current = inputs;
    inputs.setupEventListeners(
        checkMobile, 
        false,
        null, 
        touchLeftButtonRef.current,
        touchRightButtonRef.current
    );

    const handleResize = () => {
      if (gameEngineRef.current && canvasRef.current) {
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
    handleResize(); 

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (inputHandlerRef.current) {
        inputHandlerRef.current.cleanupEventListeners();
      }
      if (gameEngineRef.current) {
        gameEngineRef.current.stopGame();
      }
      if (checkMobile) {
        document.body.classList.remove('mobile-gameplay'); 
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
            const updatePlayerTotalPoints = await client.player.updatePlayerTotalPoints(account, score);
            console.info('updatePlayerTotalPoints', updatePlayerTotalPoints);
              
            const updatePlayerMinigameHighestScore = await client.player.updatePlayerMinigameHighestScore(account, score, GameId.SKY_JUMP);
            console.info('updatePlayerMinigameHighestScore', updatePlayerMinigameHighestScore);
            
            const addOrUpdateFoodAmount = await client.player.addOrUpdateFoodAmount(account, foodId, foodCollected);
            console.info('addOrUpdateFoodAmount', addOrUpdateFoodAmount);

            const achievePlayerNewTotalPoints = await client.achieve.achievePlayerNewTotalPoints(account);
            console.info('achievePlayerNewTotalPoints', achievePlayerNewTotalPoints);
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
      const statusResponse = await fetchStatus(account); 
      if (statusResponse && statusResponse.length > 0) {
        const energy = statusResponse[4] || 0; 
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
      
      // Little delay to ensure the game engine is reset properly
      setTimeout(() => {
        if (gameEngineRef.current) {
          gameEngineRef.current.resetGame();
        }
      }, RESET_GAME_DELAY);

    } catch (error) {
      console.error("Error on Play Again:", error);
    }
  };

  // Expose the resetGame and isGameOver methods to the parent component
  useImperativeHandle(ref, () => ({
    resetGame: () => {
      setIsGameOverState(false);
      setCurrentScreen('playing');
      setSelectedFoodReward(null);
      setCurrentScore(0); 
      if (gameEngineRef.current) {
        setTimeout(() => { // Delay to ensure the game engine is reset properly
             gameEngineRef.current?.resetGame();
        }, RESET_GAME_DELAY);
      }
    },
    isGameOver: () => gameEngineRef.current?.isGameOver() ?? true,
  }));

  return (
    <div
      className={`skyjump-game-container ${className} ${
        isMobile ? 'mobile-game' : ''
      }`}
      style={style}
    >
      {/* Principal Canvas */}
      <canvas
        ref={canvasRef}
        className="skyjump-canvas"
        width={canvasRef.current?.parentElement?.clientWidth || 800} // Default width
        height={canvasRef.current?.parentElement?.clientHeight || 600} // Default height
      />
  
      {/* --- UI --- */}
      <div className="skyjump-ui-overlay">
        {/* Marcador */}
        <div className="skyjump-score">Score: {currentScore}</div>
  
        {/* Buttons*/}
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
  
        {/* Button to Exit*/}
        {onExitGame && (
          <button
            className="skyjump-return-button"
            onClick={onExitGame}
            aria-label="Salir del juego"
          >
            X
          </button>
        )}
  
        {/* Share On X Modal */}
        {currentScreen === 'sharing' && selectedFoodReward && (
          <div className="skyjump-modal-overlay">
            <ShareProgress
              account={account}
              client={client}
              isOpen={true}
              onClose={() => setCurrentScreen('gameover')}
              type="minigame"
              minigameData={{ name: gameName, score: finalScore }}
            />
          </div>
        )}
  
        {/* Game Over Modal */}
        {currentScreen === 'gameover' && (
          <GameOverModal
            currentScreen={currentScreen}
            finalScore={finalScore}
            currentHighScore={currentHighScore}
            collectedFood={selectedFoodReward?.amount}
            selectedFood={selectedFoodReward?.food}
            handlePlayAgain={handlePlayAgain}
            restartIcon={RestartIcon}
          />
        )}
  
        {/* Energy toast */}
        {showEnergyToast && (
          <div className="skyjump-energy-toast">
            <span className="skyjump-toast-icon">⚠️</span>
            <span className="skyjump-toast-message">
              Your beast's energy is below 30%, it's time to rest.
            </span>
          </div>
        )}
      </div>
    </div>
  );
  
});

export default CanvasSkyJumpGame;
