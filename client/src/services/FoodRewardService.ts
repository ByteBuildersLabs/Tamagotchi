import initialFoodItems from '../data/food';
import GAME_SCORE_RANGES from '../config/gameScoreRanges';
import { FoodReward, GameId } from '../types/GameRewards';

export const FoodRewardService = {
  getRandomFood() {
    const randomIndex = Math.floor(Math.random() * initialFoodItems.length);
    return initialFoodItems[randomIndex];
  },
  calculateRewardAmount(score: number, gameId: GameId): number {
    const scoreRanges = GAME_SCORE_RANGES[gameId];
    const applicableRange = scoreRanges.find(range =>
      score >= range.min && score <= range.max
    );

    return applicableRange ? applicableRange.rewardMultiplier : 1;
  },
  determineReward(score: number, gameId: GameId): FoodReward {
    const food = this.getRandomFood();
    const amount = this.calculateRewardAmount(score, gameId);

    return {
      food,
      amount
    };
  }
};

export default FoodRewardService;
