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

// Type definition for `tamagotchi::models::highest_score::HighestScore` struct
export interface HighestScore {
	minigame_id: BigNumberish;
	player: string;
	score: BigNumberish;
}

// Type definition for `tamagotchi::models::highest_score::HighestScoreValue` struct
export interface HighestScoreValue {
	score: BigNumberish;
}

// Type definition for `tamagotchi::models::player::Player` struct
export interface Player {
	address: string;
	current_beast_id: BigNumberish;
	daily_streak: BigNumberish;
	total_points: BigNumberish;
	last_active_day: BigNumberish;
	creation_day: BigNumberish;
}

// Type definition for `tamagotchi::models::player::PlayerValue` struct
export interface PlayerValue {
	current_beast_id: BigNumberish;
	daily_streak: BigNumberish;
	total_points: BigNumberish;
	last_active_day: BigNumberish;
	creation_day: BigNumberish;
}

// Type definition for `achievement::events::index::TrophyCreation` struct
export interface TrophyCreation {
	id: BigNumberish;
	hidden: boolean;
	index: BigNumberish;
	points: BigNumberish;
	start: BigNumberish;
	end: BigNumberish;
	group: BigNumberish;
	icon: BigNumberish;
	title: BigNumberish;
	description: string;
	tasks: Array<Task>;
	data: string;
}

// Type definition for `achievement::events::index::TrophyCreationValue` struct
export interface TrophyCreationValue {
	hidden: boolean;
	index: BigNumberish;
	points: BigNumberish;
	start: BigNumberish;
	end: BigNumberish;
	group: BigNumberish;
	icon: BigNumberish;
	title: BigNumberish;
	description: string;
	tasks: Array<Task>;
	data: string;
}

// Type definition for `achievement::events::index::TrophyProgression` struct
export interface TrophyProgression {
	player_id: BigNumberish;
	task_id: BigNumberish;
	count: BigNumberish;
	time: BigNumberish;
}

// Type definition for `achievement::events::index::TrophyProgressionValue` struct
export interface TrophyProgressionValue {
	count: BigNumberish;
	time: BigNumberish;
}

// Type definition for `achievement::types::index::Task` struct
export interface Task {
	id: BigNumberish;
	total: BigNumberish;
	description: string;
}

// Type definition for `tamagotchi::events::push::PushToken` struct
export interface PushToken {
	player_address: string;
	token: string;
}

// Type definition for `tamagotchi::events::push::PushTokenValue` struct
export interface PushTokenValue {
	token: string;
}

export interface SchemaType extends ISchemaType {
	tamagotchi: {
		Beast: Beast,
		BeastValue: BeastValue,
		BeastStatus: BeastStatus,
		BeastStatusValue: BeastStatusValue,
		Food: Food,
		FoodValue: FoodValue,
		HighestScore: HighestScore,
		HighestScoreValue: HighestScoreValue,
		Player: Player,
		PlayerValue: PlayerValue,
	},
	achievement: {
		TrophyCreation: TrophyCreation,
		TrophyCreationValue: TrophyCreationValue,
		TrophyProgression: TrophyProgression,
		TrophyProgressionValue: TrophyProgressionValue,
		Task: Task,
		PushToken: PushToken,
		PushTokenValue: PushTokenValue,
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
		HighestScore: {
			minigame_id: 0,
			player: "",
			score: 0,
		},
		HighestScoreValue: {
			score: 0,
		},
		Player: {
			address: "",
			current_beast_id: 0,
			daily_streak: 0,
			total_points: 0,
			last_active_day: 0,
			creation_day: 0,
		},
		PlayerValue: {
			current_beast_id: 0,
			daily_streak: 0,
			total_points: 0,
			last_active_day: 0,
			creation_day: 0,
		},
		TrophyCreation: {
			id: 0,
			hidden: false,
			index: 0,
			points: 0,
			start: 0,
			end: 0,
			group: 0,
			icon: 0,
			title: 0,
		description: "",
			tasks: [{ id: 0, total: 0, description: "", }],
		data: "",
		},
		TrophyCreationValue: {
			hidden: false,
			index: 0,
			points: 0,
			start: 0,
			end: 0,
			group: 0,
			icon: 0,
			title: 0,
		description: "",
			tasks: [{ id: 0, total: 0, description: "", }],
		data: "",
		},
		TrophyProgression: {
			player_id: 0,
			task_id: 0,
			count: 0,
			time: 0,
		},
		TrophyProgressionValue: {
			count: 0,
			time: 0,
		},
		Task: {
			id: 0,
			total: 0,
		description: "",
		},
		PushToken: {
			player_address: "",
		token: "",
		},
		PushTokenValue: {
		token: "",
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
	HighestScore = 'tamagotchi-HighestScore',
	HighestScoreValue = 'tamagotchi-HighestScoreValue',
	Player = 'tamagotchi-Player',
	PlayerValue = 'tamagotchi-PlayerValue',
	TrophyCreation = 'achievement-TrophyCreation',
	TrophyCreationValue = 'achievement-TrophyCreationValue',
	TrophyProgression = 'achievement-TrophyProgression',
	TrophyProgressionValue = 'achievement-TrophyProgressionValue',
	Task = 'achievement-Task',
	PushToken = 'tamagotchi-PushToken',
	PushTokenValue = 'tamagotchi-PushTokenValue',
}