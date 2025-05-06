import React from 'react';
import beastsDex from '../../../data/beastDex.tsx';
import { useNavigate } from 'react-router-dom';
import { getAvailableGames } from '../../../data/gamesMiniGamesRegistry.tsx';
import { useHighScores } from '../../../hooks/useHighScore.tsx';
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
  const { myScoreFlappyBird, myScoreSkyJump } = useHighScores(account);

  const GAME_ID_MAPPING: Record<string, number> = {
    'doodleGame': 1,     // SkyJump
    'flappyBirdGame': 2  // FlappyBird
  };

  const startGame = async (gameId: string) => {
    if (!beast) return;

    if (showAnimation) {
      const playAnimation = beastsDex[beast.specie - 1].playPicture;
      showAnimation(playAnimation);
    }

    try {
      handleAction(
        "Play",
        async () => {
          return await client.game.play(account);
        },
        beastsDex[beast.specie - 1].playPicture
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
          gameId
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
              <p className="game-description">{game.description}</p>
              <div className="game-high-score">
                Record: {(() => {
                  const gameId = game.id as string;
                  const dojoGameId = GAME_ID_MAPPING[gameId] || 0; 
                  
                  switch (dojoGameId) {
                    case 1: return myScoreSkyJump[0]?.score || '0';
                    case 2: return myScoreFlappyBird[0]?.score || '0';
                    default: return '0';
                  }
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Play;
