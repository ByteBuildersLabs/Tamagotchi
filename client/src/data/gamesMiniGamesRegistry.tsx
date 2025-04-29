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
