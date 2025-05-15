// React types
import { ReactNode } from 'react';
import { Connector } from "@starknet-react/core";
import { Voice } from './textToSpeech';

// Header Types
export interface TamagotchiStats {
  age?: number;
  energy?: number;
  hunger?: number;
  happiness?: number;
  clean?: number;
}

export interface HeaderProps {
  tamagotchiStats?: TamagotchiStats;
}

export interface MenuItem {
  to?: string;
  icon?: string;
  alt?: string;
  label?: string;
  onClick?: () => void;
  component?: ReactNode;
}

// DeveloperCode Types
export interface InputEvent {
  target: {
    value: string;
  };
}

// Controller Types
export interface ConnectorButtonProps {
  connector: Connector;
  isConnected: boolean;
  onConnect: (connector: Connector) => void;
  onDisconnect: () => void;
}

// Hints Types
export interface HintsProps {
  className?: string;
}

// Leaderboard Types
export interface Beast {
  is_alive: any;
  id: any;
  beast_type: string;
  player: string;
  name?: string;
  userName?: string;
  age?: number;
  birth_date?: string;
}

export interface Player {
  address: string;
  total_points: number;
  userName?: string;
}

export interface Score {
  player: string;
  score: number;
  minigame_id: number;
}

export type LeaderboardType = 'age' | 'minigames';

// SpawnBeast Types
export interface SpawnBeastProps {
  className?: string;
}

export interface SpawnButtonProps {
  loading: boolean;
  onSpawn: () => Promise<void>;
  disabled?: boolean;
}

export interface BeastInfo {
  player: string;
  beast_id: string;
  [key: string]: any;
}

export interface SpawnBeastState {
  loading: boolean;
  error: string | null;
  spawned: boolean;
}

// Tamagotchi Types
export interface BeastDisplayProps {
  beast: Beast;
  currentImage: string;
  isLoading: boolean;
  onCuddle: () => void;
  onNewEgg: () => void;
  showBirthday: () => void;
  setCurrentView: (view: string) => void;
}

export interface PlayProps {
  beast: Beast;
  onPlay: () => void;
}

export interface CleanlinessIndicatorProps {
  cleanlinessLevel: number;
}

export interface CountdownProps {
  seconds: number;
  onComplete: () => void;
}

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// NewCover Types
export type View = 'universe' | 'game' | 'cover';
export type CircleType = 'play' | 'raise' | 'evolve';

export interface Gradient {
  start: string;
  end: string;
  angle: number;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export interface Twinkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
}

export interface Circle {
  type: CircleType;
  gradient: Gradient;
  icon: string;
  label: string;
}

// FlappyBeasts Types
export interface FlappyBirdRefHandle {
  resetGame: () => void;
}

export interface FlappyBirdProps {
  className?: string;
  style?: React.CSSProperties;
  onScoreUpdate?: (score: number) => void;
  beastImageRight?: string;
  beastImageLeft?: string;
  onExitGame?: () => void;
  highScore: number;
  gameId: string;
  beastId: number;
  gameName: string;
  handleAction: (actionName: string, actionFn: () => Promise<any>) => Promise<any>;
  client: any;
  account: any;
  onGameOver: (score: number) => void;
  onShare: () => void;
}

export type GameScreenState = 'playing' | 'sharing' | 'gameover';

// TextToSpeech Types
export interface TextToSpeechProps {
  text: string;
  onSpeak?: () => void;
  onEnd?: () => void;
}

export interface VoiceSelectorProps {
  onSelect: (voice: Voice) => void;
  selectedVoice?: Voice;
}

// FullScreenGame Types
export interface GameState {
  beastId: number;
  specie: number;
  gameId: string;
}

export interface GameTemp {
  handleAction: any;
  client: any;
  account: any;
}

declare global {
  interface Window {
    __gameTemp: GameTemp | null;
  }
}

// Leaderboard Component Types
export interface BeastRowProps {
  beast: Beast;
  isUserRow: boolean;
}

export interface ScoreRowProps {
  score: Score;
  beast: Beast;
  isUserRow: boolean;
}

export interface AgeLeaderboardProps {
  beasts: Beast[];
  currentBeast: Beast | null;
  account: string;
}

export interface MinigamesLeaderboardProps {
  scores: Score[];
  beasts: Beast[];
  players: Player[];
  currentBeast: Beast | null;
  account: string;
}

export interface ColumnHeadersProps {
  type: LeaderboardType;
}

export interface SpawnBeastContentProps {
  loading: boolean;
  error: string | null;
  spawned: boolean;
  onSpawn: () => Promise<void>;
  beastInfo?: BeastInfo;
}

// Main Types
export interface RouteConfig {
  path: string;
  element: ReactNode;
}

// Music Context Types
export interface MusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

// BeastDex Types
export interface iBeastDex {
  id: number;
  name: string;
  description: string;
  idlePicture: string;
  eatPicture: string;
  sleepPicture: string;
  cleanPicture: string;
  playPicture: string;
  cuddlePicture: string;
  BeastsType?: string;
}

// Game Data Types
export interface GameData {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
}

// Actions Types
export type PictureKey = 'eatPicture' | 'sleepPicture' | 'cleanPicture' | 'playPicture' | 'idlePicture' | 'cuddlePicture';

export interface ActionButton {
  label: string;
  img: string | null;
  action: string;
  pictureKey: PictureKey;
  isRevive?: boolean;
}

// Food Types
export interface FoodItem {
  id: number;
  name: string;
  img: string;
  count: number;
}

// Whispers Types
export interface WhisperProps {
  beast: Beast;
  expanded: boolean;
  beastStatus: number[];
  botMessage: Message;
  setBotMessage: (message: Message) => void;
}

export interface Message {
  user: string;
  text: string;
}