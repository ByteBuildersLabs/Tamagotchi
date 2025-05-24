import initialFoodItems from '../data/food';
import GAME_SCORE_RANGES from '../config/gameScoreRanges';
import { FoodReward, GameId } from '../types/minigames';

export const FoodRewardService = {
  getRandomFood() {
    const randomIndex = Math.floor(Math.random() * initialFoodItems.length);
    return initialFoodItems[randomIndex];
  },
  calculateRewardAmount(score: number, gameId: GameId): number {
    const scoreRanges = GAME_SCORE_RANGES[gameId];
    if (!scoreRanges) {
      console.warn(`[FoodRewardService] No ranges defined for gameId "${gameId}". Defaulting multiplier to 1.`);
      return 1;
    }
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
