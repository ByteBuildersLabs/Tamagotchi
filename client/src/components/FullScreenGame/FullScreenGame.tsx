import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ShareProgress } from '../Twitter/ShareProgress.tsx';
import './main.css';

import { GAMES_REGISTRY, GameData, getHighScore, saveHighScore } from '../../data/gamesMiniGamesRegistry.tsx';
import beastsDex from '../../data/beastDex.tsx';
interface GameState {
  beastId: number;
  specie: number;
  gameId: string;
}

const FullscreenGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setGameOver] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [currentGameData, setCurrentGameData] = useState<GameData | null>(null);

  // Generic reference to the active game
  const gameRef = useRef<any>(null);

  useEffect(() => {
    // Get game data from location state
    if (location.state?.beastId && location.state?.specie && location.state?.gameId) {
      const gameId = location.state.gameId;
    
        // Check if the game exists in the registry
      if (!GAMES_REGISTRY[gameId]) {
        console.error(`Game with ID ${gameId} not found in registry`);
        navigate('/play');
        return;
      }
      
      const state = {
        beastId: location.state.beastId,
        specie: location.state.specie,
        gameId: gameId
      };
      
      setGameState(state);
      setCurrentGameData(GAMES_REGISTRY[gameId]);
      
      // get high score
      const savedHighScore = getHighScore(gameId, state.beastId);
      setHighScore(savedHighScore);
    } else {
      navigate('/play');
    }

    // Class to apply fullscreen styles
    document.body.classList.add('fullscreen-game-mode');
    
    return () => {
      // Cleanup
      document.body.classList.remove('fullscreen-game-mode');
    };
  }, [location.state, navigate]);

  const handleExitGame = () => {
    navigate('/play');
  };

  const handleGameEnd = (score: number) => {
    if (!gameState) return;
    
    setCurrentScore(score);
    setGameOver(true);
    
    // Check if it's a new high score
    if (score > highScore) {
      saveHighScore(gameState.gameId, gameState.beastId, score);
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
    // First, show the game over modal
    setIsShareModalOpen(true);
  };

  const handlePlayAgain = () => {
    setGameOver(false);
    setShowGameOverModal(false);
    setCurrentScore(0);
    
    // Reset the game
    if (gameRef.current && typeof gameRef.current.resetGame === 'function') {
      gameRef.current.resetGame();
    }
  };

  // Show loader while game data is being fetched
  if (!gameState || !currentGameData) {
    return (
      <div className="game-loading-container">
        <p>Loading game...</p>
      </div>
    );
  }

  // Render the game component dynamically
  const GameComponent = currentGameData.component;
  const gameName = currentGameData.name;

  return (
    <div className="fullscreen-game-container">
      <GameComponent
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
      
      {/* Button to close the game */}
      <button 
        className="return-button"
        onClick={handleExitGame}
      >
        X
      </button>
      
      {/* Share on X Modal*/}
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
              name: gameName,
              score: currentScore
            }}
          />
        </div>
      )}
      
      {/* Game Over Modal */}
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