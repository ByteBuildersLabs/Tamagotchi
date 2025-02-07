import { ControllerConnector}  from "@cartridge/connector";
import { SessionPolicies } from "@cartridge/controller";
import { Connector } from "@starknet-react/core";

const policies: SessionPolicies = {
  contracts: {
    ['0x7e6b1928b66896b6d2369f544d810ad3a2caad740b4e2bd0071daf4c6e4dab9']: {
      methods: [
        {
          name: "spawn_player",
          entrypoint: "spawn_player"
        },
        {
          name: "set_current_beast",
          entrypoint: "set_current_beast"
        },
        {
          name: "add_initial_food",
          entrypoint: "add_initial_food"
        },
        {
          name: "spawn",
          entrypoint: "spawn"
        },
        {
          name: "decrease_status",
          entrypoint: "decrease_status"
        },
        {
          name: "feed",
          entrypoint: "feed"
        },
        {
          name: "sleep",
          entrypoint: "sleep"
        },
        {
          name: "awake",
          entrypoint: "awake"
        },
        {
          name: "play",
          entrypoint: "play"
        },
        {
          name: "clean",
          entrypoint: "clean"
        },
        {
          name: "revive",
          entrypoint: "revive"
        },
        {
          name: "tap",
          entrypoint: "tap"
        }
      ],
    },
  },
}

// Configuración básica del conector
const cartridgeConnector = new ControllerConnector({
  policies,
  rpc: 'https://api.cartridge.gg/x/slotito/katana'
}) as never as Connector;

export default cartridgeConnector;
