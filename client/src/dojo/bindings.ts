import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

// import { BigNumberish } from 'starknet';

// Type definition for `tamagotchi::models::beast::Beast` struct
export interface Beast {
	player: string;
	beast_id: number;
	specie: number;
	beast_type: number;
	evolved: boolean;
	vaulted: boolean;
}

// Type definition for `tamagotchi::models::beast::BeastValue` struct
export interface BeastValue {
	specie: number;
	beast_type: number;
	evolved: boolean;
	vaulted: boolean;
}

// Type definition for `tamagotchi::models::beast_stats::BeastStats` struct
export interface BeastStats {
	beast_id: number;
	attack: number;
	defense: number;
	speed: number;
	level: number;
	experience: number;
	next_level_experience: number;
}

// Type definition for `tamagotchi::models::beast_stats::BeastStatsValue` struct
export interface BeastStatsValue {
	attack: number;
	defense: number;
	speed: number;
	level: number;
	experience: number;
	next_level_experience: number;
}

// Type definition for `tamagotchi::models::beast_status::BeastStatus` struct
export interface BeastStatus {
	beast_id: number;
	is_alive: boolean;
	is_awake: boolean;
	hunger: number;
	energy: number;
	happiness: number;
	hygiene: number;
	clean_status: number;
}

// Type definition for `tamagotchi::models::beast_status::BeastStatusValue` struct
export interface BeastStatusValue {
	is_alive: boolean;
	is_awake: boolean;
	hunger: number;
	energy: number;
	happiness: number;
	hygiene: number;
	clean_status: number;
}

// Type definition for `tamagotchi::models::food::Food` struct
export interface Food {
	player: string;
	id: number;
	amount: number;
}

// Type definition for `tamagotchi::models::food::FoodValue` struct
export interface FoodValue {
	amount: number;
}

// Type definition for `tamagotchi::models::player::Player` struct
export interface Player {
	address: string;
	current_beast_id: number;
}

// Type definition for `tamagotchi::models::player::PlayerValue` struct
export interface PlayerValue {
	current_beast_id: number;
}

export interface SchemaType extends ISchemaType {
	tamagotchi: {
		Beast: Beast,
		BeastValue: BeastValue,
		BeastStats: BeastStats,
		BeastStatsValue: BeastStatsValue,
		BeastStatus: BeastStatus,
		BeastStatusValue: BeastStatusValue,
		Food: Food,
		FoodValue: FoodValue,
		Player: Player,
		PlayerValue: PlayerValue,
	},
}
export const schema: SchemaType = {
	tamagotchi: {
		Beast: {
			player: "",
			beast_id: 0,
			specie: 0,
			beast_type: 0,
			evolved: false,
			vaulted: false,
		},
		BeastValue: {
			specie: 0,
			beast_type: 0,
			evolved: false,
			vaulted: false,
		},
		BeastStats: {
			beast_id: 0,
			attack: 0,
			defense: 0,
			speed: 0,
			level: 0,
			experience: 0,
			next_level_experience: 0,
		},
		BeastStatsValue: {
			attack: 0,
			defense: 0,
			speed: 0,
			level: 0,
			experience: 0,
			next_level_experience: 0,
		},
		BeastStatus: {
			beast_id: 0,
			is_alive: false,
			is_awake: false,
			hunger: 0,
			energy: 0,
			happiness: 0,
			hygiene: 0,
			clean_status: 0,
		},
		BeastStatusValue: {
			is_alive: false,
			is_awake: false,
			hunger: 0,
			energy: 0,
			happiness: 0,
			hygiene: 0,
			clean_status: 0,
		},
		Food: {
			player: "",
			id: 0,
			amount: 0,
		},
		FoodValue: {
			amount: 0,
		},
		Player: {
			address: "",
			current_beast_id: 0,
		},
		PlayerValue: {
			current_beast_id: 0,
		},
	},
};
export enum ModelsMapping {
	Beast = 'tamagotchi-Beast',
	BeastValue = 'tamagotchi-BeastValue',
	BeastStats = 'tamagotchi-BeastStats',
	BeastStatsValue = 'tamagotchi-BeastStatsValue',
	BeastStatus = 'tamagotchi-BeastStatus',
	BeastStatusValue = 'tamagotchi-BeastStatusValue',
	Food = 'tamagotchi-Food',
	FoodValue = 'tamagotchi-FoodValue',
	Player = 'tamagotchi-Player',
	PlayerValue = 'tamagotchi-PlayerValue',
}
