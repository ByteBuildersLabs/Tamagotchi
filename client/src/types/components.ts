// React types
import { ReactNode } from 'react';
import { Connector } from "@starknet-react/core";

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
  userName: string;
  beast_type: number;
  age: number;
  name?: string;
  player: string;
  beast_id: string;
  birth_date: string;
  specie: string;
  is_alive: boolean;
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