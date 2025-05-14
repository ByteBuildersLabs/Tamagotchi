import { GameId, ScoreRange } from '../types/minigames';

const GAME_SCORE_RANGES: Record<number, ScoreRange[]> = {
  // SkyJump
  [GameId.SKY_JUMP]: [
    { min: 0, max: 50, rewardMultiplier: 1 },
    { min: 51, max: 100, rewardMultiplier: 2 },
    { min: 101, max: 200, rewardMultiplier: 3 },
    { min: 201, max: 500, rewardMultiplier: 5 },
    { min: 501, max: Infinity, rewardMultiplier: 10 }
  ],
  
  // FlappyBird
  [GameId.FLAPPY_BIRD]: [
    { min: 0, max: 10, rewardMultiplier: 1 },
    { min: 11, max: 20, rewardMultiplier: 2 },
    { min: 21, max: 30, rewardMultiplier: 3 },
    { min: 31, max: 50, rewardMultiplier: 5 },
    { min: 51, max: Infinity, rewardMultiplier: 10 }
  ]
};

export default GAME_SCORE_RANGES;
