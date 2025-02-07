import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import type { BigNumberish } from 'starknet';

type RemoveFieldOrder<T> = T extends object
  ? Omit<
      {
        [K in keyof T]: T[K] extends object ? RemoveFieldOrder<T[K]> : T[K];
      },
      'fieldOrder'
    >
  : T;
// Type definition for `babybeasts::models::beast::BeastValue` struct
export interface BeastValue {
	fieldOrder: string[];
	specie: BigNumberish;
	evolved: boolean;
	vaulted: boolean;
}
export type InputBeastValue = RemoveFieldOrder<BeastValue>;

// Type definition for `babybeasts::models::beast::Beast` struct
export interface Beast {
	fieldOrder: string[];
	player: string;
	beast_id: BigNumberish;
	specie: BigNumberish;
	evolved: boolean;
	vaulted: boolean;
}
export type InputBeast = RemoveFieldOrder<Beast>;

// Type definition for `babybeasts::models::beast_stats::BeastStatsValue` struct
export interface BeastStatsValue {
	fieldOrder: string[];
	attack: BigNumberish;
	defense: BigNumberish;
	speed: BigNumberish;
	level: BigNumberish;
	experience: BigNumberish;
	next_level_experience: BigNumberish;
}
export type InputBeastStatsValue = RemoveFieldOrder<BeastStatsValue>;

// Type definition for `babybeasts::models::beast_stats::BeastStats` struct
export interface BeastStats {
	fieldOrder: string[];
	beast_id: BigNumberish;
	attack: BigNumberish;
	defense: BigNumberish;
	speed: BigNumberish;
	level: BigNumberish;
	experience: BigNumberish;
	next_level_experience: BigNumberish;
}
export type InputBeastStats = RemoveFieldOrder<BeastStats>;

// Type definition for `babybeasts::models::beast_status::BeastStatus` struct
export interface BeastStatus {
	fieldOrder: string[];
	beast_id: BigNumberish;
	is_alive: boolean;
	is_awake: boolean;
	hunger: BigNumberish;
	energy: BigNumberish;
	happiness: BigNumberish;
	hygiene: BigNumberish;
}
export type InputBeastStatus = RemoveFieldOrder<BeastStatus>;

// Type definition for `babybeasts::models::beast_status::BeastStatusValue` struct
export interface BeastStatusValue {
	fieldOrder: string[];
	is_alive: boolean;
	is_awake: boolean;
	hunger: BigNumberish;
	energy: BigNumberish;
	happiness: BigNumberish;
	hygiene: BigNumberish;
}
export type InputBeastStatusValue = RemoveFieldOrder<BeastStatusValue>;

// Type definition for `babybeasts::models::food::Food` struct
export interface Food {
	fieldOrder: string[];
	player: string;
	id: BigNumberish;
	name: BigNumberish;
	amount: BigNumberish;
}
export type InputFood = RemoveFieldOrder<Food>;

// Type definition for `babybeasts::models::food::FoodValue` struct
export interface FoodValue {
	fieldOrder: string[];
	name: BigNumberish;
	amount: BigNumberish;
}
export type InputFoodValue = RemoveFieldOrder<FoodValue>;

// Type definition for `babybeasts::models::player::PlayerValue` struct
export interface PlayerValue {
	fieldOrder: string[];
	current_beast_id: BigNumberish;
}
export type InputPlayerValue = RemoveFieldOrder<PlayerValue>;

// Type definition for `babybeasts::models::player::Player` struct
export interface Player {
	fieldOrder: string[];
	address: string;
	current_beast_id: BigNumberish;
}
export type InputPlayer = RemoveFieldOrder<Player>;

export interface SchemaType extends ISchemaType {
	babybeasts: {
		BeastValue: BeastValue,
		Beast: Beast,
		BeastStatsValue: BeastStatsValue,
		BeastStats: BeastStats,
		BeastStatus: BeastStatus,
		BeastStatusValue: BeastStatusValue,
		Food: Food,
		FoodValue: FoodValue,
		PlayerValue: PlayerValue,
		Player: Player,
	},
}
export const schema: SchemaType = {
	babybeasts: {
		BeastValue: {
			fieldOrder: ['specie', 'evolved', 'vaulted'],
			specie: 0,
			evolved: false,
			vaulted: false,
		},
		Beast: {
			fieldOrder: ['player', 'beast_id', 'specie', 'evolved', 'vaulted'],
			player: "",
			beast_id: 0,
			specie: 0,
			evolved: false,
			vaulted: false,
		},
		BeastStatsValue: {
			fieldOrder: ['attack', 'defense', 'speed', 'level', 'experience', 'next_level_experience'],
			attack: 0,
			defense: 0,
			speed: 0,
			level: 0,
			experience: 0,
			next_level_experience: 0,
		},
		BeastStats: {
			fieldOrder: ['beast_id', 'attack', 'defense', 'speed', 'level', 'experience', 'next_level_experience'],
			beast_id: 0,
			attack: 0,
			defense: 0,
			speed: 0,
			level: 0,
			experience: 0,
			next_level_experience: 0,
		},
		BeastStatus: {
			fieldOrder: ['beast_id', 'is_alive', 'is_awake', 'hunger', 'energy', 'happiness', 'hygiene'],
			beast_id: 0,
			is_alive: false,
			is_awake: false,
			hunger: 0,
			energy: 0,
			happiness: 0,
			hygiene: 0,
		},
		BeastStatusValue: {
			fieldOrder: ['is_alive', 'is_awake', 'hunger', 'energy', 'happiness', 'hygiene'],
			is_alive: false,
			is_awake: false,
			hunger: 0,
			energy: 0,
			happiness: 0,
			hygiene: 0,
		},
		Food: {
			fieldOrder: ['player', 'id', 'name', 'amount'],
			player: "",
			id: 0,
			name: 0,
			amount: 0,
		},
		FoodValue: {
			fieldOrder: ['name', 'amount'],
			name: 0,
			amount: 0,
		},
		PlayerValue: {
			fieldOrder: ['current_beast_id'],
			current_beast_id: 0,
		},
		Player: {
			fieldOrder: ['address', 'current_beast_id'],
			address: "",
			current_beast_id: 0,
		},
	},
};
// Type definition for ERC__Balance struct
export type ERC__Type = 'ERC20' | 'ERC721';
export interface ERC__Balance {
    fieldOrder: string[];
    balance: string;
    type: string;
    tokenMetadata: ERC__Token;
}
export interface ERC__Token {
    fieldOrder: string[];
    name: string;
    symbol: string;
    tokenId: string;
    decimals: string;
    contractAddress: string;
}
export interface ERC__Transfer {
    fieldOrder: string[];
    from: string;
    to: string;
    amount: string;
    type: string;
    executedAt: string;
    tokenMetadata: ERC__Token;
    transactionHash: string;
}