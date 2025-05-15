/* ==========================================================================
   Game Types
   ========================================================================== */

/**
 * Represents the player character in the game
 */
export interface Doodler {
  img: HTMLImageElement | null;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Represents a platform in the game
 */
export interface Platform {
  img: HTMLImageElement | null;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Represents the current state of the game
 */
export interface GameState {
  score: number;
  maxScore: number;
  gameOver: boolean;
}

/* ==========================================================================
   Game Configuration Types
   ========================================================================== */

/**
 * Represents a range of scores and its corresponding reward multiplier
 */
export interface ScoreRange {
  min: number;
  max: number;
  rewardMultiplier: number;
}

/**
 * Represents a food reward given to the player
 */
export interface FoodReward {
  food: any; // TODO: Replace with proper food type
  amount: number;
}

/**
 * Represents the configuration of a game
 */
export interface GameConfig {
  id: number;
  name: string;
  description?: string;
}

/**
 * Enum representing the different game types
 */
export enum GameId {
  SKY_JUMP = 1,
  FLAPPY_BIRD = 2,
}