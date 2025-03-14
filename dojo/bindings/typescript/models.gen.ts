import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { BigNumberish } from 'starknet';

// Type definition for `tamagotchi::models::beast::Beast` struct
export interface Beast {
	player: string;
	beast_id: BigNumberish;
	age: BigNumberish;
	birth_date: BigNumberish;
	specie: BigNumberish;
	beast_type: BigNumberish;
}

// Type definition for `tamagotchi::models::beast::BeastValue` struct
export interface BeastValue {
	age: BigNumberish;
	birth_date: BigNumberish;
	specie: BigNumberish;
	beast_type: BigNumberish;
}

// Type definition for `tamagotchi::models::beast_status::BeastStatus` struct
export interface BeastStatus {
	beast_id: BigNumberish;
	is_alive: boolean;
	is_awake: boolean;
	hunger: BigNumberish;
	energy: BigNumberish;
	happiness: BigNumberish;
	hygiene: BigNumberish;
	clean_status: BigNumberish;
	last_timestamp: BigNumberish;
}

// Type definition for `tamagotchi::models::beast_status::BeastStatusValue` struct
export interface BeastStatusValue {
	is_alive: boolean;
	is_awake: boolean;
	hunger: BigNumberish;
	energy: BigNumberish;
	happiness: BigNumberish;
	hygiene: BigNumberish;
	clean_status: BigNumberish;
	last_timestamp: BigNumberish;
}

// Type definition for `tamagotchi::models::food::Food` struct
export interface Food {
	player: string;
	id: BigNumberish;
	amount: BigNumberish;
}

// Type definition for `tamagotchi::models::food::FoodValue` struct
export interface FoodValue {
	amount: BigNumberish;
}

// Type definition for `tamagotchi::models::player::Player` struct
export interface Player {
	address: string;
	current_beast_id: BigNumberish;
	daily_streak: BigNumberish;
	last_active_day: BigNumberish;
	creation_day: BigNumberish;
}

// Type definition for `tamagotchi::models::player::PlayerValue` struct
export interface PlayerValue {
	current_beast_id: BigNumberish;
	daily_streak: BigNumberish;
	last_active_day: BigNumberish;
	creation_day: BigNumberish;
}

export interface SchemaType extends ISchemaType {
	tamagotchi: {
		Beast: Beast,
		BeastValue: BeastValue,
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
			age: 0,
			birth_date: 0,
			specie: 0,
			beast_type: 0,
		},
		BeastValue: {
			age: 0,
			birth_date: 0,
			specie: 0,
			beast_type: 0,
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
			last_timestamp: 0,
		},
		BeastStatusValue: {
			is_alive: false,
			is_awake: false,
			hunger: 0,
			energy: 0,
			happiness: 0,
			hygiene: 0,
			clean_status: 0,
			last_timestamp: 0,
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
			daily_streak: 0,
			last_active_day: 0,
			creation_day: 0,
		},
		PlayerValue: {
			current_beast_id: 0,
			daily_streak: 0,
			last_active_day: 0,
			creation_day: 0,
		},
	},
};
export enum ModelsMapping {
	Beast = 'tamagotchi-Beast',
	BeastValue = 'tamagotchi-BeastValue',
	BeastStatus = 'tamagotchi-BeastStatus',
	BeastStatusValue = 'tamagotchi-BeastStatusValue',
	Food = 'tamagotchi-Food',
	FoodValue = 'tamagotchi-FoodValue',
	Player = 'tamagotchi-Player',
	PlayerValue = 'tamagotchi-PlayerValue',
}