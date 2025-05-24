import { BackgroundLayer } from '../../types/SkyJumpTypes'; 
import bgPlatform from '../../assets/SkyJump/bg-platform.png';
import sky1 from '../../assets/SkyJump/Sky1.png';

export const BACKGROUND_LAYERS_PATHS: Omit<BackgroundLayer, 'img'>[] = [
    { path: sky1, scoreThreshold: 0 },
    { path: sky1, scoreThreshold: 500 },
    { path: sky1, scoreThreshold: 1500 },
    { path: sky1, scoreThreshold: 3000 },
    { path: sky1, scoreThreshold: 6000 },
];

// Game constants 
export const PLATFORM_IMG_PATH = bgPlatform;
export const LOGICAL_GAME_WIDTH = 360; // Base width reference for game design
export const LOGICAL_GAME_HEIGHT = 576; // Base height reference

export const PLAYER_VISUAL_WIDTH = 65;
export const PLAYER_VISUAL_HEIGHT = 65;
export const PLAYER_HITBOX_WIDTH = 46; // Width for collisions
export const PLAYER_HITBOX_HEIGHT = 46; // Height for collisions
export const PLAYER_HITBOX_OFFSET_X = (PLAYER_VISUAL_WIDTH - PLAYER_HITBOX_WIDTH) / 2;
export const PLAYER_HITBOX_OFFSET_Y = (PLAYER_VISUAL_HEIGHT - PLAYER_HITBOX_HEIGHT) / 2;

export const PLATFORM_WIDTH = 60;
export const PLATFORM_HEIGHT = 18;
export const INITIAL_PLATFORM_COUNT = 8; // Number of platforms at the start
export const PLATFORM_MIN_Y_SEPARATION = 60; // Minimum vertical separation between platforms
export const PLATFORM_MAX_Y_SEPARATION = 100; // Maximum vertical separation
export const PLATFORM_HORIZONTAL_MAX_FACTOR = 0.8; // Factor to limit the X position of platforms
export const PLATFORM_GENERATION_BUFFER_FACTOR = 3.5; // Factor to determine when to generate new platforms

export const INITIAL_VELOCITY_Y_BASE = -8; // Base initial jump velocity
export const GRAVITY_BASE = 0.25;          // Base gravity
export const PLAYER_MAX_FALL_SPEED = 10;
export const PLAYER_HORIZONTAL_SPEED = 2.4;

export const CAMERA_FOLLOW_THRESHOLD_FACTOR = 0.3; // At what height of the screen (from the top) the camera starts following

export const HITBOX_MARGIN = 2; // Margin for collision detection (like in the original)

// Gyroscope
export const GYRO_TILT_THRESHOLD = 5;
export const GYRO_TILT_DIVISOR = 10; // Adjust for sensitivity
export const GYRO_SENSITIVITY = 2.5;

// Scoring
export const SCORE_PER_PIXEL_HEIGHT = 1 / 5; // 1 point for every 5 pixels of height
export const SCORE_MILESTONE_INCREMENT = 50;
export const MAX_SCORE_ADJUSTMENT_FOR_PLATFORM_GAP = 200; // For platform gap difficulty

// Others
export const RESET_GAME_DELAY = 100; // ms
export const ENERGY_TOAST_DURATION = 3000; // ms
export const VISIBLE_PLATFORM_MARGIN_FACTOR = 2.0; // How many "screen heights" of platforms to keep
export const PLATFORM_GENERATION_THRESHOLD_FACTOR = 2; // When to generate new platforms (based on screen height)
