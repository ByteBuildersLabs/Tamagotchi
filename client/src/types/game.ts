// Audio Types
export interface UseAudioReturn {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  play: (audioBase64: string) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  error: Error | null;
}

export interface AudioError extends Error {
  code: string;
}

// Beast Chat Types
export interface Message {
  user: string;
  text: string;
  isSystem?: boolean;
}

export interface UseBeastChatProps {
  beast: Beast | null;
  baseUrl?: string;
  setBotMessage?: (message: Message) => void;
}

export interface ChatResponse {
  user: string;
  text: string;
}

// Local Storage Types
export type StorageValue<T> = T | null;

export interface StorageError extends Error {
  code: string;
}

// Player Types
export interface Player {
  address: string;
  current_beast_id: string;
  daily_streak: number;
  total_points: number;
  last_active_day: string;
  creation_day: string;
  userName?: string;
}

export interface PlayerEdge {
  node: Player;
}

// High Score Types
export interface HighScore {
  minigame_id: number;
  player: string;
  score: number;
}

export interface HighScoreEdge {
  node: HighScore;
}

// Food Types
export interface Food {
  player: string;
  id: number;
  amount: number;
}

export interface FoodEdge {
  node: Food;
}

// Beast Types
export interface Beast {
  name: undefined;
  player: string;
  age: number;
  beast_type: string;
  birth_date: string;
  specie: string;
  beast_id: string;
  is_alive?: boolean;
  userName?: string;
}

export interface BeastEdge {
  node: Beast;
}

export interface BeastStatus {
  beast_id: string;
  is_alive: boolean;
}

export interface BeastStatusEdge {
  node: BeastStatus;
}

export interface BeastStatuses {
  [key: string]: boolean;
}

// Constants
export const AUDIO_ERROR_CODES = {
  NOT_SUPPORTED: 'MEDIA_ERR_NOT_SUPPORTED',
  ABORTED: 'MEDIA_ERR_ABORTED',
  NETWORK: 'MEDIA_ERR_NETWORK',
  DECODE: 'MEDIA_ERR_DECODE',
  SRC_NOT_SUPPORTED: 'MEDIA_ERR_SRC_NOT_SUPPORTED'
} as const;

export const STORAGE_ERROR_CODES = {
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED_ERR',
  INVALID_VALUE: 'INVALID_VALUE_ERR'
} as const;

export const GAME_IDS = {
  SKY_JUMP: 1,
  FLAPPY_BIRD: 2
} as const; 