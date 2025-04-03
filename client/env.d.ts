interface ImportMetaEnv {
    readonly VITE_PUBLIC_DEPLOY_TYPE: "mainnet" | "sepolia" | "slot";
    readonly VITE_PUBLIC_NODE_URL: string;
    readonly VITE_PUBLIC_TORII: string;
    readonly VITE_PUBLIC_MASTER_ADDRESS?: string;
    readonly VITE_PUBLIC_MASTER_PRIVATE_KEY?: string;
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
