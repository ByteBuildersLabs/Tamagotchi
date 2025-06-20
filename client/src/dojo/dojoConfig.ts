import { createDojoConfig } from "@dojoengine/core";

import { manifest } from "../config/manifest";

const {
    VITE_PUBLIC_NODE_URL,
    VITE_PUBLIC_TORII,
    VITE_PUBLIC_MASTER_ADDRESS,
    VITE_PUBLIC_MASTER_PRIVATE_KEY,
  } = import.meta.env;

export const dojoConfig = createDojoConfig({
    manifest,
    masterAddress: VITE_PUBLIC_MASTER_ADDRESS || '0x04CDA1a7c67aC385Cd0a399D65c405E6539Cc3730c37Cc2C4a62b2F719CD1C0A',
    masterPrivateKey: VITE_PUBLIC_MASTER_PRIVATE_KEY || '0x056ed1031da41a9746534ff13bfd6e86e2071635b3408e49698443f3758c862e',
    rpcUrl: VITE_PUBLIC_NODE_URL || 'https://api.cartridge.gg/x/starknet/sepolia',
    toriiUrl: VITE_PUBLIC_TORII || 'https://api.cartridge.gg/x/bbv2/torii',
});
