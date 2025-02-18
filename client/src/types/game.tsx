export interface Doodler {
    img: HTMLImageElement | null;
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export interface Platform {
    img: HTMLImageElement | null;
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export interface GameState {
    score: number;
    maxScore: number;
    gameOver: boolean;
  }