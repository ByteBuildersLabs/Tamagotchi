import { DojoProvider } from "@dojoengine/core";
import { Account, AccountInterface } from "starknet";

export type IClient = Awaited<ReturnType<typeof client>>;

export function client(provider: DojoProvider) {

	const actions_spawnPlayer = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "spawn_player",
					calldata: [],
				},
				"babybeasts",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_setCurrentBeast = async (snAccount: Account | AccountInterface, beastId: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "set_current_beast",
					calldata: [beastId],
				},
				"babybeasts",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_addInitialFood = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "add_initial_food",
					calldata: [],
				},
				"babybeasts",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_spawn = async (snAccount: Account | AccountInterface, specie: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "spawn",
					calldata: [specie],
				},
				"babybeasts",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_decreaseStatus = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "decrease_status",
					calldata: [],
				},
				"babybeasts",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_feed = async (snAccount: Account | AccountInterface, foodId: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "feed",
					calldata: [foodId],
				},
				"babybeasts",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_sleep = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "sleep",
					calldata: [],
				},
				"babybeasts",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_awake = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "awake",
					calldata: [],
				},
				"babybeasts",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_play = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "play",
					calldata: [],
				},
				"babybeasts",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_clean = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "clean",
					calldata: [],
				},
				"babybeasts",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_revive = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "revive",
					calldata: [],
				},
				"babybeasts",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_initTapCounter = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "init_tap_counter",
					calldata: [],
				},
				"babybeasts",
			);
		} catch (error) {
			console.error(error);
		}
	};


	const actions_tap = async (snAccount: Account | AccountInterface, specie: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "tap",
					calldata: [specie],
				},
				"babybeasts",
			);
		} catch (error) {
			console.error(error);
		}
	};

	return {
		actions: {
			spawnPlayer: actions_spawnPlayer,
			setCurrentBeast: actions_setCurrentBeast,
			addInitialFood: actions_addInitialFood,
			spawn: actions_spawn,
			decreaseStatus: actions_decreaseStatus,
			feed: actions_feed,
			sleep: actions_sleep,
			awake: actions_awake,
			play: actions_play,
			clean: actions_clean,
			revive: actions_revive,
			initTapCounter: actions_initTapCounter,
			tap: actions_tap,
		},
	};
}