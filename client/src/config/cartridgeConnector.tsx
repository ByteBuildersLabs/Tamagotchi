import { ControllerConnector}  from "@cartridge/connector";
import {
  ColorMode,
  SessionPolicies,
} from "@cartridge/controller";
import { Connector } from "@starknet-react/core";

const colorMode: ColorMode = "dark";
const theme = "bytebeasts-tamagotchi";

const policies: SessionPolicies = {
  contracts: {
    ['0x79f55c679bb76b18e8e12f0b0f490de3079101eea8b5785171bd76f1af12e24']: {
      methods: [
        {
          name: "awake",
          entrypoint: "awake"
        },
        {
          name: "clean",
          entrypoint: "clean"
        },
        {
          name: "feed",
          entrypoint: "feed"
        },
        {
          name: "get_beast_age",
          entrypoint: "get_beast_age"
        },
        {
          name: "get_beast_age_with_address",
          entrypoint: "get_beast_age_with_address"
        },
        {
          name: "get_timestamp_based_status",
          entrypoint: "get_timestamp_based_status"
        },
        {
          name: "get_timestamp_based_status_with_address",
          entrypoint: "get_timestamp_based_status_with_address"
        },
        {
          name: "pet",
          entrypoint: "pet"
        },
        {
          name: "play",
          entrypoint: "play"
        },
        {
          name: "revive",
          entrypoint: "revive"
        },
        {
          name: "sleep",
          entrypoint: "sleep"
        },
        {
          name: "spawn_beast",
          entrypoint: "spawn_beast"
        },
        {
          name: "update_beast",
          entrypoint: "update_beast"
        },
        {
          name: "update_food_amount",
          entrypoint: "update_food_amount"
        },
      ],
    },
    ['0x5cb5588212364951995ef1006b64dd610a6f3ef6a264726dc5d4a2e6b57aa6e']: {
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
      ],
    },
  },
}

// Configuración básica del conector
const cartridgeConnector = new ControllerConnector({
  policies,
  theme,
  colorMode,
  rpc: 'https://api.cartridge.gg/x/bbslotfood/katana'
}) as never as Connector;

export default cartridgeConnector;
