import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DoodleGame from '../SkyJumpMiniGame/index.tsx';
import beastsDex from '../../data/beastDex.tsx';
import toast, { Toaster } from 'react-hot-toast';
import { ShareProgress } from '../Twitter/ShareProgress.tsx';
import type { DoodleGameRefHandle } from '../SkyJumpMiniGame/index.tsx';
import './main.css';

// Para gestionar los puntajes altos
const getHighScore = (gameId: string, beastId: number): number => {
  const scoresStr = localStorage.getItem('gameHighScores');
  if (!scoresStr) return 0;
  
  try {
    const scores = JSON.parse(scoresStr);
    return scores[`${gameId}_${beastId}`] || 0;
  } catch (e) {
    console.error('Error parsing high scores:', e);
    return 0;
  }
};

const saveHighScore = (gameId: string, beastId: number, score: number): void => {
  const currentHighScore = getHighScore(gameId, beastId);
  if (score <= currentHighScore) return;
  
  const scoresStr = localStorage.getItem('gameHighScores');
  let scores: { [key: string]: number } = {};
  
  try {
    if (scoresStr) {
      scores = JSON.parse(scoresStr);
    }
    scores[`${gameId}_${beastId}`] = score;
    localStorage.setItem('gameHighScores', JSON.stringify(scores));
  } catch (e) {
    console.error('Error saving high score:', e);
  }
};

interface GameState {
  beastId: number;
  specie: number;
}

const FullscreenGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  //const [gameKey, setGameKey] = useState(Date.now());

  const gameRef = useRef<DoodleGameRefHandle>(null);

  useEffect(() => {
    // Recuperar los datos pasados a través del estado de navegación
    if (location.state?.beastId && location.state?.specie) {
      const state = {
        beastId: location.state.beastId,
        specie: location.state.specie,
      };
      
      setGameState(state);
      
      // Cargar el puntaje más alto
      const savedHighScore = getHighScore('doodleGame', state.beastId);
      setHighScore(savedHighScore);
    } else {
      // Si no hay datos, regresar a la página de juego
      navigate('/play');
    }

    // Añadir clase para el modo fullscreen
    document.body.classList.add('fullscreen-game-mode');
    
    return () => {
      // Limpiar al desmontar
      document.body.classList.remove('fullscreen-game-mode');
    };
  }, [location.state, navigate]);

  const handleExitGame = () => {
    // Regresar directamente a la selección de juegos
    navigate('/play');
  };

  const handleGameEnd = (score: number) => {
    setCurrentScore(score);
    setGameOver(true);
    
    // Verificar si es un nuevo récord
    if (gameState && score > highScore) {
      saveHighScore('doodleGame', gameState.beastId, score);
      setHighScore(score);
      
      toast.success(`¡New high score: ${score}!`, {
        icon: '🏆',
        duration: 4000
      });
    } else {
      toast.success(`¡Game over! Score: ${score}`, {
        duration: 3000
      });
    }
    
    // Primero mostrar el modal de compartir
    setIsShareModalOpen(true);
  };

  const handlePlayAgain = () => {
    setGameOver(false);
    setShowGameOverModal(false);
    setCurrentScore(0);
    //setGameKey(Date.now());
    
    if (gameRef.current) {
      gameRef.current.resetGame();
    }
  };

  // Si no tenemos datos del juego, mostramos un loader
  if (!gameState) {
    return (
      <div className="game-loading-container">
        <p>Loading Sky Jump...</p>
      </div>
    );
  }

  return (
    <div className="fullscreen-game-container">
      {/* El juego siempre se renderiza para mantener el fondo */}
      <DoodleGame 
        //key={gameKey}
        ref={gameRef}
        className="fullscreen-mode"
        style={{
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box'
        }}
        onScoreUpdate={setCurrentScore}
        onGameEnd={handleGameEnd}
        beastImageRight={beastsDex[gameState.specie - 1]?.idlePicture} 
        beastImageLeft={beastsDex[gameState.specie - 1]?.idlePicture}
        onExitGame={handleExitGame}
      />
      
      {/* Botón para salir siempre visible */}
      <button 
        className="return-button"
        onClick={handleExitGame}
      >
        X
      </button>
      
      {/* Modal de compartir */}
      {isShareModalOpen && (
        <div className="modal-overlay">
          <ShareProgress
            isOpen={isShareModalOpen}
            onClose={() => {
              setIsShareModalOpen(false);
              setShowGameOverModal(true);
            }}
            type="minigame"
            minigameData={{
              name: "Sky Jump",
              score: currentScore
            }}
          />
        </div>
      )}
      
      {/* Modal de Game Over */}
      {showGameOverModal && (
        <div className="game-result-container">
          <h2 className="game-result-title">¡Game over!</h2>
          <p className="game-result-score">
            Score: {currentScore}
          </p>
          {highScore > 0 && (
            <p className="game-result-score">
              High Score: {highScore}
            </p>
          )}
          <div className="game-result-buttons">
            <button 
              className="play-again-button"
              onClick={handlePlayAgain}
            >
              Play again
            </button>
            <button 
              className="play-again-button"
              onClick={handleExitGame}
            >
              Exit
            </button>
          </div>
        </div>
      )}
      
      <Toaster position="bottom-center" />
    </div>
  );
};

export default FullscreenGame;