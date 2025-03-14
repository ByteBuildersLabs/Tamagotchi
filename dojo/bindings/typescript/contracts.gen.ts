import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_actions_addInitialFood_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "add_initial_food",
			calldata: [],
		};
	};

	const actions_addInitialFood = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_addInitialFood_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_awake_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "awake",
			calldata: [],
		};
	};

	const actions_awake = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_awake_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_clean_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "clean",
			calldata: [],
		};
	};

	const actions_clean = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_clean_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_feed_calldata = (foodId: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "feed",
			calldata: [foodId],
		};
	};

	const actions_feed = async (snAccount: Account | AccountInterface, foodId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_feed_calldata(foodId),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_getBeastAge_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "get_beast_age",
			calldata: [],
		};
	};

	const actions_getBeastAge = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_getBeastAge_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_getBeastAgeWithAddress_calldata = (address: string): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "get_beast_age_with_address",
			calldata: [address],
		};
	};

	const actions_getBeastAgeWithAddress = async (snAccount: Account | AccountInterface, address: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_getBeastAgeWithAddress_calldata(address),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_getTimestampBasedStatus_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "get_timestamp_based_status",
			calldata: [],
		};
	};

	const actions_getTimestampBasedStatus = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_getTimestampBasedStatus_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_getTimestampBasedStatusWithAddress_calldata = (address: string): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "get_timestamp_based_status_with_address",
			calldata: [address],
		};
	};

	const actions_getTimestampBasedStatusWithAddress = async (snAccount: Account | AccountInterface, address: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_getTimestampBasedStatusWithAddress_calldata(address),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_initTapCounter_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "init_tap_counter",
			calldata: [],
		};
	};

	const actions_initTapCounter = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_initTapCounter_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_pet_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "pet",
			calldata: [],
		};
	};

	const actions_pet = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_pet_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_play_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "play",
			calldata: [],
		};
	};

	const actions_play = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_play_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_revive_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "revive",
			calldata: [],
		};
	};

	const actions_revive = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_revive_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_setCurrentBeast_calldata = (beastId: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "set_current_beast",
			calldata: [beastId],
		};
	};

	const actions_setCurrentBeast = async (snAccount: Account | AccountInterface, beastId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_setCurrentBeast_calldata(beastId),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_sleep_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "sleep",
			calldata: [],
		};
	};

	const actions_sleep = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_sleep_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_spawnBeast_calldata = (specie: BigNumberish, beastType: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "spawn_beast",
			calldata: [specie, beastType],
		};
	};

	const actions_spawnBeast = async (snAccount: Account | AccountInterface, specie: BigNumberish, beastType: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_spawnBeast_calldata(specie, beastType),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_spawnPlayer_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "spawn_player",
			calldata: [],
		};
	};

	const actions_spawnPlayer = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_spawnPlayer_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_tap_calldata = (specie: BigNumberish, beastType: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "tap",
			calldata: [specie, beastType],
		};
	};

	const actions_tap = async (snAccount: Account | AccountInterface, specie: BigNumberish, beastType: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_tap_calldata(specie, beastType),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_updateBeast_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "update_beast",
			calldata: [],
		};
	};

	const actions_updateBeast = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_updateBeast_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_updatePlayerDailyStreak_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "update_player_daily_streak",
			calldata: [],
		};
	};

	const actions_updatePlayerDailyStreak = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_updatePlayerDailyStreak_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		actions: {
			addInitialFood: actions_addInitialFood,
			buildAddInitialFoodCalldata: build_actions_addInitialFood_calldata,
			awake: actions_awake,
			buildAwakeCalldata: build_actions_awake_calldata,
			clean: actions_clean,
			buildCleanCalldata: build_actions_clean_calldata,
			feed: actions_feed,
			buildFeedCalldata: build_actions_feed_calldata,
			getBeastAge: actions_getBeastAge,
			buildGetBeastAgeCalldata: build_actions_getBeastAge_calldata,
			getBeastAgeWithAddress: actions_getBeastAgeWithAddress,
			buildGetBeastAgeWithAddressCalldata: build_actions_getBeastAgeWithAddress_calldata,
			getTimestampBasedStatus: actions_getTimestampBasedStatus,
			buildGetTimestampBasedStatusCalldata: build_actions_getTimestampBasedStatus_calldata,
			getTimestampBasedStatusWithAddress: actions_getTimestampBasedStatusWithAddress,
			buildGetTimestampBasedStatusWithAddressCalldata: build_actions_getTimestampBasedStatusWithAddress_calldata,
			initTapCounter: actions_initTapCounter,
			buildInitTapCounterCalldata: build_actions_initTapCounter_calldata,
			pet: actions_pet,
			buildPetCalldata: build_actions_pet_calldata,
			play: actions_play,
			buildPlayCalldata: build_actions_play_calldata,
			revive: actions_revive,
			buildReviveCalldata: build_actions_revive_calldata,
			setCurrentBeast: actions_setCurrentBeast,
			buildSetCurrentBeastCalldata: build_actions_setCurrentBeast_calldata,
			sleep: actions_sleep,
			buildSleepCalldata: build_actions_sleep_calldata,
			spawnBeast: actions_spawnBeast,
			buildSpawnBeastCalldata: build_actions_spawnBeast_calldata,
			spawnPlayer: actions_spawnPlayer,
			buildSpawnPlayerCalldata: build_actions_spawnPlayer_calldata,
			tap: actions_tap,
			buildTapCalldata: build_actions_tap_calldata,
			updateBeast: actions_updateBeast,
			buildUpdateBeastCalldata: build_actions_updateBeast_calldata,
			updatePlayerDailyStreak: actions_updatePlayerDailyStreak,
			buildUpdatePlayerDailyStreakCalldata: build_actions_updatePlayerDailyStreak_calldata,
		},
	};
}