import slot from "../../../dojo/manifest_dev.json";
import sepolia from "../../../dojo/manifest_dev.json";
import mainnet from "../../../dojo/manifest_dev.json";

const deployType = import.meta.env.VITE_PUBLIC_DEPLOY_TYPE;

const manifests = {
  mainnet,
  sepolia,
  slot,
};

export const manifest = deployType in manifests ? manifests[deployType] : slot;

export type Manifest = typeof manifest;