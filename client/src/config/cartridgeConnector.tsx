import { Connector } from "@starknet-react/core";
import { ControllerConnector } from "@cartridge/connector";
import { ColorMode, SessionPolicies, ControllerOptions, } from "@cartridge/controller";
import { constants } from "starknet";

const { VITE_PUBLIC_DEPLOY_TYPE } = import.meta.env;
const { VITE_PUBLIC_SLOT_ADDRESS } = import.meta.env;

const CONTRACT_ADDRESS_ACHIEVEMENTS = '0x76cbacea69adcb896523844858e52db782c079344d504578f0cbf2e3f4bb1e6'
const CONTRACT_ADDRESS_TAMAGOTCHI_SYSTEM = '0x2482225c547d9aad680bfac6ba926df6d4b6cc5109b00aa171daff5f4075bc4'
const CONTRACT_ADDRESS_PLAYER_SYSTEM = '0x6fabfbfe4c81b28f0e249b92944e19bb9dc76289566dde919a5dd00c4451137'

const policies: SessionPolicies = {
  contracts: {
    [CONTRACT_ADDRESS_TAMAGOTCHI_SYSTEM]: {
      methods: [
        { name: "awake", entrypoint: "awake" },
        { name: "clean", entrypoint: "clean" },
        { name: "feed", entrypoint: "feed" },
        { name: "get_beast_age", entrypoint: "get_beast_age" },
        { name: "get_beast_age_with_address", entrypoint: "get_beast_age_with_address" },
        { name: "get_timestamp_based_status", entrypoint: "get_timestamp_based_status" },
        { name: "get_timestamp_based_status_with_address", entrypoint: "get_timestamp_based_status_with_address" },
        { name: "pet", entrypoint: "pet" },
        { name: "play", entrypoint: "play" },
        { name: "revive", entrypoint: "revive" },
        { name: "sleep", entrypoint: "sleep" },
        { name: "spawn_beast", entrypoint: "spawn_beast" },
        { name: "update_beast", entrypoint: "update_beast" },
        { name: "update_food_amount", entrypoint: "update_food_amount" },
      ],
    },

    [CONTRACT_ADDRESS_PLAYER_SYSTEM]: {
      methods: [
        {
          name: "add_initial_food",
          entrypoint: "add_initial_food"
        },
        {
          name: "set_current_beast",
          entrypoint: "set_current_beast"
        },
        {
          name: "spawn_player",
          entrypoint: "spawn_player"
        },
        {
          name: "update_player_daily_streak",
          entrypoint: "update_player_daily_streak"
        },
        {
          name: "update_player_total_points",
          entrypoint: "update_player_total_points"
        },
        {
          name: "add_or_update_food_amount",
          entrypoint: "add_or_update_food_amount"
        },
        {
          name: "update_player_minigame_highest_score",
          entrypoint: "update_player_minigame_highest_score"
        },
        {
          name: "emit_player_push_token",
          entrypoint: "emit_player_push_token"
        },
      ],
    },

    [CONTRACT_ADDRESS_ACHIEVEMENTS]: {
      methods: [
        {
          name: "achieve_beast_chat",
          entrypoint: "achieve_beast_chat"
        },
        {
          name: "achieve_beast_clean",
          entrypoint: "achieve_beast_clean"
        },
        {
          name: "achieve_beast_feed",
          entrypoint: "achieve_beast_feed"
        },
        {
          name: "achieve_beast_pet",
          entrypoint: "achieve_beast_pet"
        },
        {
          name: "achieve_beast_sleep",
          entrypoint: "achieve_beast_sleep"
        },
        {
          name: "achieve_flappy_beast_highscore",
          entrypoint: "achieve_flappy_beast_highscore"
        },
        {
          name: "achieve_platform_highscore",
          entrypoint: "achieve_platform_highscore"
        },
        {
          name: "achieve_play_minigame",
          entrypoint: "achieve_play_minigame"
        },
        {
          name: "achieve_player_new_total_points",
          entrypoint: "achieve_player_new_total_points"
        },
        {
          name: "achieve_social_share",
          entrypoint: "achieve_social_share"
        },
      ],
    },
  },
}

// Controller basic configuration
const colorMode: ColorMode = "dark";
const theme = "bytebeasts-tamagotchi";
const namespace = "tamagotchi"; //ensure this is correct
const slot = `bytebeasts-tamagotchi-${VITE_PUBLIC_DEPLOY_TYPE || 'dev'}`; //ensure bytebeasts-tamagotchi this is correct

const getRpcUrl = () => {
  switch (VITE_PUBLIC_DEPLOY_TYPE) {
    case "mainnet":
      return "https://api.cartridge.gg/x/starknet/mainnet";
    case "sepolia":
      return "https://api.cartridge.gg/x/starknet/sepolia";
    default:
      return VITE_PUBLIC_SLOT_ADDRESS;
  }
};

const options: ControllerOptions = {
  // @ts-ignore
  chains: [
    {
      rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
    },
  ],
  defaultChainId: VITE_PUBLIC_DEPLOY_TYPE === 'mainnet' ?  constants.StarknetChainId.SN_MAIN : constants.StarknetChainId.SN_SEPOLIA,
  policies,
  theme,
  colorMode,
  namespace: "tamagotchi", 
  slot: "toriibytebeasts"
};

const cartridgeConnector = new ControllerConnector(
  options,
) as never as Connector;

export default cartridgeConnector;
