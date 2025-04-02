import { ControllerConnector}  from "@cartridge/connector";
import {
  ColorMode,
  SessionPolicies,
  ControllerOptions,
} from "@cartridge/controller";
import { Connector } from "@starknet-react/core";
import { constants } from "starknet";

const CONTRACT_ADDRESS_TAMAGOTCHI_SYSTEM = '0x7c0dd42dd8e7e948453bb8540977f1da32963be8f7c03962cdb2838a52263da'
const CONTRACT_ADDRESS_PLAYER_SYSTEM = '0x5cb5588212364951995ef1006b64dd610a6f3ef6a264726dc5d4a2e6b57aa6e'

const policies: SessionPolicies = {
  contracts: {
    [CONTRACT_ADDRESS_TAMAGOTCHI_SYSTEM]: {
      methods: [
        {name: "awake",entrypoint: "awake"},
        {name: "clean", entrypoint: "clean"},
        {name: "feed",entrypoint: "feed"},
        {name: "get_beast_age",entrypoint: "get_beast_age"},
        {name: "get_beast_age_with_address",entrypoint: "get_beast_age_with_address"},
        {name: "get_timestamp_based_status",entrypoint: "get_timestamp_based_status"},
        {name: "get_timestamp_based_status_with_address",entrypoint: "get_timestamp_based_status_with_address"},
        {name: "pet",entrypoint: "pet"},
        {name: "play",entrypoint: "play"},
        {name: "revive",entrypoint: "revive"},
        {name: "sleep",entrypoint: "sleep"},
        {name: "spawn_beast",entrypoint: "spawn_beast"},
        {name: "update_beast",entrypoint: "update_beast"},
        {name: "update_food_amount",entrypoint: "update_food_amount"},
      ],
    },
    [CONTRACT_ADDRESS_PLAYER_SYSTEM]: {
      methods: [
        {name: "add_initial_food",entrypoint: "add_initial_food"},
        {name: "set_current_beast",entrypoint: "set_current_beast"},
        {name: "spawn_player",entrypoint: "spawn_player"},
        {name: "update_player_daily_streak",entrypoint: "update_player_daily_streak"},
        {name: "update_player_total_points",entrypoint: "update_player_total_points"},
      ],
    },
  },
}

// Controller basic configuration
const colorMode: ColorMode = "dark";
const theme = "bytebeasts-tamagotchi";
const namespace = "tamagotchi";
const slot = `bytebeasts-tamagotchi-${import.meta.env.VITE_PUBLIC_DEPLOY_TYPE}`;

// Define connector options
const options: ControllerOptions = {
  chains: [
    { rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia" },
    { rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet" },
    { rpcUrl: "https://api.cartridge.gg/x/bbslotfood/katana" }
  ],
  defaultChainId: constants.StarknetChainId.SN_SEPOLIA,
  namespace,
  slot,
  policies,
  theme,
  colorMode,
};

const cartridgeConnector = new ControllerConnector(
  options,
) as never as Connector;

export default cartridgeConnector;
