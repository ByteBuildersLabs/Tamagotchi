import { ControllerConnector}  from "@cartridge/connector";
import { SessionPolicies } from "@cartridge/controller";
import { Connector } from "@starknet-react/core";

const policies: SessionPolicies = {
  contracts: {
    ['0x64a20c916bae2736e2d12f323b2e002e48497554642aa388cbd08a8686e5b99']: {
      methods: [
        {
          name: "spawn",
          entrypoint: "spawn"
        },
        {
          name: "decrease_stats",
          entrypoint: "decrease_stats"
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
        }
      ],
    },
  },
}

// Configuración básica del conector
const cartridgeConnector = new ControllerConnector({
  policies,
  rpc: 'https://api.cartridge.gg/x/babybeastsod/katana'
}) as never as Connector;

export default cartridgeConnector;
