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
    ['0x7015bd014ba692dcb31fa80ff8b515ab9f767d1445111896415debb07aec0c4']: {
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
      ],
    },
    ['0x46c402a1a4ef204a135e08b81ad3c741e355ef6a3eaae8fcc01a3ef22594eb7']: {
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
      ],
    },
  },
}

// Configuración básica del conector
const cartridgeConnector = new ControllerConnector({
  policies,
  theme,
  colorMode,
  rpc: 'https://api.cartridge.gg/x/bbslotr/katana'
}) as never as Connector;

export default cartridgeConnector;
