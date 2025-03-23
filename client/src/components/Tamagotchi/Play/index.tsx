import toast, { Toaster } from 'react-hot-toast';
import beastsDex from '../../../data/beastDex.tsx';
import { useNavigate } from 'react-router-dom';
import { getAvailableGames, getHighScore } from '../../../data/gamesMiniGamesRegistry.tsx';
import './main.css';

const availableGames = getAvailableGames();
interface PlayProps {
  handleAction: any;
  beast: any;
  account: any;
  client: any;
  showAnimation?: (gifPath: string) => void;
}

const Play: React.FC<PlayProps> = ({ 
  handleAction, 
  beast, 
  account, 
  client,
  showAnimation 
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
          () => client.game.play(account), 
          beastsDex[beast.specie - 1].playPicture
        ),
        {
          loading: 'Loading the game...',
          success: '¡Game started!',
          error: 'Cannot start the game.',
        }
      );

      window.__gameTemp = {
        handleAction,
        client,
        account
      };
      
      navigate('/fullscreen-game', {
        state: {
          beastId: beast.beast_id,
          specie: beast.specie,
          gameId: gameId
        }
      });
    } catch (error) {
      console.error("Error starting the game:", error);
    }
  };

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
              <h3 className="game-name">{game.name}</h3>
              <p className="game-description" >{game.description}</p>
              <div className="game-high-score" >
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
