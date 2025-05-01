import DoodleGame  from '../components/SkyJumpMiniGame/index.tsx';
import doodleGameIcon from '../assets/img/doodle-game-icon.svg';
import FlappyBirdMiniGame from '../components/FlappyBeasts/flappyBeasts.tsx';
import flappyBirdIcon from '../assets/FlappyBeasts/flappyIcon.svg';

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
  'flappyBirdGame': {
    id: 'flappyBirdGame',
    name: 'Flappy Beasts',
    description: 'Tap to fly through obstacles!',
    component: FlappyBirdMiniGame,
    icon: flappyBirdIcon
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
