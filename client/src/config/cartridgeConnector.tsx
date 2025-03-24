import { ControllerConnector}  from "@cartridge/connector";
import { SessionPolicies } from "@cartridge/controller";
import { Connector } from "@starknet-react/core";

const policies: SessionPolicies = {
  contracts: {
    ['0x5798bccde56917074519dfa444d51bd2d3b6d30428f8c87c43aaa28d5875c8d']: {
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
    ['0x32fbf1eb254356f52ccd7ce14d99a691caa22c188fc84952b533224d103346a']: {
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
      ],
    },
  },
}

// Configuración básica del conector
const cartridgeConnector = new ControllerConnector({
  policies,
  rpc: 'https://api.cartridge.gg/x/bbtimestamp/katana'
}) as never as Connector;

export default cartridgeConnector;
