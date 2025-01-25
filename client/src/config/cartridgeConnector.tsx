import ControllerConnector from "@cartridge/connector";
import { Policy } from "@cartridge/controller";
import { Connector } from "@starknet-react/core";

const policies: Policy[] = [
  {
    target: '0x24de86673b3ac8c1637850dd1fb85b96c4085fbbb1b39ba90eddbf264e0f074',
    method: "spawn",
  },
  {
    target: '0x24de86673b3ac8c1637850dd1fb85b96c4085fbbb1b39ba90eddbf264e0f074',
    method: "decrease_stats",
  },
  {
    target: '0x24de86673b3ac8c1637850dd1fb85b96c4085fbbb1b39ba90eddbf264e0f074',
    method: "feed",
  },
  {
    target: '0x24de86673b3ac8c1637850dd1fb85b96c4085fbbb1b39ba90eddbf264e0f074',
    method: "sleep",
  },
  {
    target: '0x24de86673b3ac8c1637850dd1fb85b96c4085fbbb1b39ba90eddbf264e0f074',
    method: "awake",
  },
  {
    target: '0x24de86673b3ac8c1637850dd1fb85b96c4085fbbb1b39ba90eddbf264e0f074',
    method: "play",
  },
  {
    target: '0x24de86673b3ac8c1637850dd1fb85b96c4085fbbb1b39ba90eddbf264e0f074',
    method: "clean",
  },
  {
    target: '0x24de86673b3ac8c1637850dd1fb85b96c4085fbbb1b39ba90eddbf264e0f074',
    method: "revive",
  },
]

// Configuración básica del conector
const cartridgeConnector = new ControllerConnector({
  policies,
  rpc: "https://api.cartridge.gg/x/bbte/katana",
}) as never as Connector;

export default cartridgeConnector;
