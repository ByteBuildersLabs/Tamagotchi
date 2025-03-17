import { useState, useEffect } from 'react';
import DoodleGame from '../../SkyJumpMiniGame/index.tsx';
import './main.css';
import toast, { Toaster } from 'react-hot-toast';
import beastsDex from '../../../data/beastDex.tsx';
import { ShareProgress } from '../../Twitter/ShareProgress.tsx';
import { useNavigate, useLocation } from 'react-router-dom';

import doodleGameIcon from '../../../assets/img/doodle-game-icon.svg'; 

const availableGames = [
  { 
    id: 'doodleGame',
    name: 'Sky Jump',
    description: 'Jump as high as you can!',
    icon: doodleGameIcon 
  },
];

// Aux functions to manage high scores in localStorage
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

const Play = ({ 
  handleAction, 
  beast, 
  account, 
  client,
  showAnimation 
}: { 
  handleAction: any, 
  beast: any, 
  account: any, 
  client: any,
  showAnimation?: (gifPath: string) => void
}) => {

  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGameSelection, setShowGameSelection] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Update high score when the game or beast changes
  useEffect(() => {
    if (selectedGame && beast) {
      const savedHighScore = getHighScore(selectedGame, beast.beast_id);
      setHighScore(savedHighScore);
    }
  }, [selectedGame, beast]);

  const startGame = async (gameId: string) => {
    if (!beast) return;
    
    if (showAnimation) {
      const playAnimation = beastsDex[beast.specie - 1].playPicture;
      showAnimation(playAnimation);
    }

    try {
      await toast.promise(
        handleAction(
          "Play", 
          () => client.actions.play(account), 
          beastsDex[beast.specie - 1].playPicture
        ),
        {
          loading: 'Loading the game...',
          success: '¡Game started!',
          error: 'Can not start the games.',
        }
      );
      
      setSelectedGame(gameId);
      setCurrentScore(0);

      //setIsPlaying(true);
      setShowGameSelection(false);
      
      const savedHighScore = getHighScore(gameId, beast.beast_id);
      setHighScore(savedHighScore);

      if (gameId === 'doodleGame') {
        navigate('/fullscreen-game', {
          state: {
            beastId: beast.beast_id,
            specie: beast.specie
          }
        });
        return;
      }

    } catch (error) {
      console.error("Error starting the game:", error);
    }
  };

  const handleGameEnd = async (score: number) => {
    if (!beast || !selectedGame) return;
    
    setCurrentScore(score);
    setIsPlaying(false);
    
    if (score > highScore) {
      saveHighScore(selectedGame, beast.beast_id, score);
      setHighScore(score);
      
      toast.success(`¡New max score: ${score}!`, {
        icon: '🏆',
        duration: 4000
      });
    } else {
      toast.success(`¡Game over! Score: ${score}`, {
        duration: 3000
      });
    }

    setIsShareModalOpen(true);
  };

  const returnToGameSelection = () => {
    setSelectedGame(null);
    setShowGameSelection(true);
  };

    useEffect(() => {
        // When the game is active, add a class to the body and remove it when the game ends
        if (isPlaying) {
        document.body.classList.add('game-active');
        } else {
        document.body.classList.remove('game-active');
        }
        
        // Cleanup
        return () => {
        document.body.classList.remove('game-active');
        };
    }, [isPlaying]);

    useEffect(() => {
      if (location.state?.gameEnded && location.state?.score) {
        // El juego ha terminado y tenemos una puntuación
        setCurrentScore(location.state.score);
        setIsPlaying(false);
        setIsShareModalOpen(true);
      }
    }, [location]);

  if (showGameSelection) {
    // Render the game selection screen
    return (
      <div className="game-selection-container">
        <div className="game-selection-grid">
          {availableGames.map((game) => (
            <div
              key={game.id}
              className="game-card"
              onClick={() => startGame(game.id)}
            >
              <img src={game.icon} alt={game.name} className="game-icon" />
              <div className="game-card-content">
                <h3 className="game-name" style={{ fontSize: '18px' }}>{game.name}</h3>
                <p className="game-description" style={{ fontSize: '14px' }}>{game.description}</p>
                <div className="game-high-score" style={{ color: '#ECECDA', fontFamily: 'Kallisto', fontSize: '12px' }}>
                  Record: {getHighScore(game.id, beast?.beast_id || 0)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Toaster position="bottom-center" />
      </div>
    );
  }

  // Render the selected game
  if (selectedGame === 'doodleGame') {
    // Añadir una condición para cuando el juego está en modo de redirección a pantalla completa
    if (!isPlaying && !isShareModalOpen) {
      // En este estado, acabamos de seleccionar el juego y estamos esperando la redirección
      // o el juego está en curso en la otra página
      return (
        <div className="game-loading-container">
          <p>Launching game...</p>
          <Toaster position="bottom-center" />
        </div>
      );
    } else if (isShareModalOpen) {
      // Mostrar primero el ShareProgress antes del modal de resultados
      return (
        <ShareProgress
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          type="minigame"
          minigameData={{
            name: "Sky Jump",
            score: currentScore
          }}
        />
      );
    } else {
      // Una vez cerrado el ShareProgress, mostrar el modal de resultados del juego
      return (
        <div className="game-result-container">
          <h2 className="game-result-title">¡Game over!</h2>
          <p className="game-result-score">
          Score: {currentScore}
          </p>
          <div className="game-result-buttons">
            <button 
              className="play-again-button"
              onClick={() => startGame('doodleGame')}
            >
              Play again
            </button>
            <button 
              className="play-again-button"
              onClick={returnToGameSelection}
            >
              Exit
            </button>
          </div>
          <Toaster position="bottom-center" />
        </div>
      );
    }
  }

  // By default, show an error message if the game is not found
  return (
    <div className="game-error-container">
      <p>Something were wrong. Please, try again.</p>
      <button 
        className="return-button"
        onClick={returnToGameSelection}
      >
        Exit
      </button>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Play;
