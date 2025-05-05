export interface ScoreRange {
    min: number;
    max: number;
    rewardMultiplier: number;
  }
  
  export interface FoodReward {
    food: any;
    amount: number;
  }
  
  export interface GameConfig {
    id: number;
    name: string;
    description?: string;
  }
  
  // Enumeración de IDs de juegos para evitar números mágicos
  export enum GameId {
    SKY_JUMP = 1,
    FLAPPY_BIRD = 2,
    // Agregar más juegos aquí a medida que se implementen
  }
