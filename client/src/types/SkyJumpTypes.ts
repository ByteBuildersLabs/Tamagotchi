// Represents a generic game object with position and dimensions
export interface GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    worldY: number; 
}

// Specific properties of the player
export interface Player extends GameObject {
    imgRight: HTMLImageElement | null;
    imgLeft: HTMLImageElement | null;
    visualWidth: number; 
    visualHeight: number; 
    hitboxOffsetX: number;
    hitboxOffsetY: number;
    velocityX: number;
    velocityY: number;
    facingRight: boolean;
    onPlatform: boolean;
}

// Specific properties of a platform
export interface Platform extends GameObject {
    img: HTMLImageElement | null;
}

// Configuration for a background image and when it should appear
export interface BackgroundLayer {
    img: HTMLImageElement | null;
    scoreThreshold: number;
    path: string; 
}

// State of touch controls
export interface TouchControls {
    isPressed: boolean;
    direction: number; 
}

// State of gyroscope controls
export interface GyroControls {
    enabled: boolean;
    calibration: number; 
    sensitivity: number;
}

// General game state managed by the engine
export interface GameEngineState {
    boardWidth: number;
    boardHeight: number;
    cameraY: number;
    player: Player;
    platforms: Platform[];
    score: number;
    maxHeightReached: number; 
    gameOver: boolean;
    running: boolean;
    currentBackgroundIndex: number;
    initialVelocityY: number;
    gravity: number;
    touchControls: TouchControls;
    gyroControls: GyroControls;
    platformWidth: number;
    platformHeight: number;
    lastTimestamp: number;
    animationFrameId?: number;
}

// Props for the main React game component
export interface CanvasSkyJumpGameProps {
    className?: string;
    style?: React.CSSProperties;
    onScoreUpdate?: (score: number) => void;
    beastImageRight?: string; 
    beastImageLeft?: string; 
    onExitGame?: () => void;
    highScore: number;
    gameName: string;
    handleAction: (actionName: string, actionFn: () => Promise<any>, imagePath?: string) => Promise<any>;
    client?: any; 
    account?: any; 
}

// For the handle exposed by useImperativeHandle
export interface SkyJumpGameRefHandle {
    resetGame: () => void;
    isGameOver: () => boolean;
}

// Game ID types, if used in multiple places
export enum GameId {
    SKY_JUMP = "skyJump", 
    FLAPPY_BEASTS = "flappyBeasts"
}

// Food reward
export interface FoodItem {
    id: string;
    name: string;
    image: string;
}
export interface FoodReward {
    food: FoodItem;
    amount: number;
}
