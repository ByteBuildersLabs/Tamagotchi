// Importaciones para juegos
import DoodleGame  from '../components/SkyJumpMiniGame/index.tsx';
import doodleGameIcon from '../assets/img/doodle-game-icon.svg';

export interface GameData {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  icon: string;
}

// Registry for games
export const GAMES_REGISTRY: Record<string, GameData> = {
  'doodleGame': {
    id: 'doodleGame',
    name: 'Sky Jump',
    description: 'Jump as high as you can!',
    component: DoodleGame,
    icon: doodleGameIcon
  },
};

export const getAvailableGames = () => {
  return Object.values(GAMES_REGISTRY).map(game => ({
    id: game.id,
    name: game.name,
    description: game.description,
    icon: game.icon
  }));
};

export const getHighScore = (gameId: string, beastId: number): number => {
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

export const saveHighScore = (gameId: string, beastId: number, score: number): void => {
  const currentHighScore = getHighScore(gameId, beastId);
  if (score <= currentHighScore) return;
  
  const scoresStr = localStorage.getItem('gameHighScores');
  let scores: { [key: string]: number } = {};
  
  try {
    if (scoresStr) scores = JSON.parse(scoresStr);
    scores[`${gameId}_${beastId}`] = score;
    localStorage.setItem('gameHighScores', JSON.stringify(scores));
  } catch (e) {
    console.error('Error saving high score:', e);
  }
};
