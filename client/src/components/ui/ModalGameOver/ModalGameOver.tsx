import React from 'react';
import './styles.css';

interface GameOverModalProps {
  currentScreen: string;
  finalScore: number;
  currentHighScore: number;
  collectedFood?: number;
  selectedFood?: any;
  handlePlayAgain: () => void;
  restartIcon: string;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  currentScreen,
  finalScore,
  currentHighScore,
  collectedFood,
  selectedFood,
  handlePlayAgain,
  restartIcon
}) => {
  if (currentScreen !== 'gameover') return null;

  return (
    <div className="game-result-container">
      <h2 className="game-result-title">Game over!</h2>
      
      <p className="game-result-score">
        Food: {collectedFood} {selectedFood?.name || 'items'}
      </p>
      
      {finalScore > currentHighScore ? (
        <p className={`game-result-score high-score-animation`}>
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
            src={restartIcon}
            alt="Restart icon"
            className="restart-icon"
          />
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
