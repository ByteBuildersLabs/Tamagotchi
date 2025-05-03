import slot from "../../../dojo/manifest_dev.json";
import sepolia from "../../../dojo/manifest_sepolia.json";
import mainnet from "../../../dojo/manifest_mainnet.json"; // Ensure this points to the right file

// Define valid deploy types
type DeployType = keyof typeof manifests;

// Create the manifests object
const manifests = {
  mainnet,
  sepolia,
  slot,
};

// Get deployment type from environment with fallback
const deployType = import.meta.env.VITE_PUBLIC_DEPLOY_TYPE as string;

// Export the appropriate manifest with a fallback to slot (dev)
export const manifest = deployType in manifests 
  ? manifests[deployType as DeployType] 
  : slot;

export type Manifest = typeof manifest;
