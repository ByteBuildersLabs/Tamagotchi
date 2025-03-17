import toast, { Toaster } from 'react-hot-toast';
import beastsDex from '../../../data/beastDex.tsx';
import { useNavigate } from 'react-router-dom';
import './main.css';

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
  const navigate = useNavigate();
  
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
          error: 'Cannot start the game.',
        }
      );
      
      // Si es el juego Doodle, redirigir a la página de pantalla completa
      if (gameId === 'doodleGame') {
        navigate('/fullscreen-game', {
          state: {
            beastId: beast.beast_id,
            specie: beast.specie
          }
        });
      }
    } catch (error) {
      console.error("Error starting the game:", error);
    }
  };

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
};

export default Play;