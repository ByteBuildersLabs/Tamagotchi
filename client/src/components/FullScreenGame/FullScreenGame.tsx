import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Spinner from '../ui/spinner.tsx';
import './main.css';

import { GAMES_REGISTRY, GameData, getHighScore } from '../../data/gamesMiniGamesRegistry.tsx';
import beastsDex from '../../data/beastDex.tsx';

interface GameState {
  beastId: number;
  specie: number;
  gameId: string;
}

interface GameTemp {
  handleAction: any;
  client: any;
  account: any;
}

declare global {
  interface Window {
    __gameTemp: GameTemp | null;
  }
}

const FullscreenGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [_currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentGameData, setCurrentGameData] = useState<GameData | null>(null);
  const [gameTemp, setGameTemp] = useState<GameTemp | null>(null);

  // Reference to the active game
  const gameRef = useRef<any>(null);

  useEffect(() => {
    const tempData = window.__gameTemp;
    
    if (!tempData) {
      console.error("Game data not found. Please start the game from the play screen.");
      navigate('/play');
      return;
    }
    
    setGameTemp(tempData);
    
    // Get game data from the location state
    if (location.state?.beastId && location.state?.specie && location.state?.gameId) {
      const gameId = location.state.gameId;
    
      // Verify if the game exists in the registry
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
      
      // Get high score
      const savedHighScore = getHighScore(gameId, state.beastId);
      setHighScore(savedHighScore);
    } else {
      navigate('/play');
    }

    // Apply full screen styles
    document.body.classList.add('fullscreen-game-mode');
    
    return () => {
      // Cleanup
      document.body.classList.remove('fullscreen-game-mode');
      window.__gameTemp = null;
    };
  }, [location.state, navigate]);

  const handleExitGame = () => {
    navigate('/play');
  };

  const handleScoreUpdate = (score: number) => {
    setCurrentScore(score);
  };

  // Show loader while game data is loading or if gameTemp is null
  if (!gameState || !currentGameData || !gameTemp) {
    return <Spinner message="Loading mini game..." />;
  }

  // Dynamically render the game component
  const GameComponent = currentGameData.component;

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
        onScoreUpdate={handleScoreUpdate}
        beastImageRight={beastsDex[gameState.specie - 1]?.idlePicture} 
        beastImageLeft={beastsDex[gameState.specie - 1]?.idlePicture}
        onExitGame={handleExitGame}
        highScore={highScore}
        gameId={gameState.gameId}
        beastId={gameState.beastId}
        gameName={currentGameData.name}
        handleAction={gameTemp.handleAction}
        client={gameTemp.client}
        account={gameTemp.account}
      />
      
      {/* Button to close the game */}
      <button 
        className="return-button"
        onClick={handleExitGame}
      >
        X
      </button>
    </div>
  );
};

export default FullscreenGame;
