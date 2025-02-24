interface ImportMetaEnv {
    readonly VITE_PUBLIC_DEPLOY_TYPE:
      | "sepolia"
      | "slot"
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }