import type { PropsWithChildren } from "react";
import { sepolia } from "@starknet-react/chains";
import {
    jsonRpcProvider,
    StarknetConfig,
    starkscan,
} from "@starknet-react/core";
import { dojoConfig } from "./dojoConfig";
import cartridgeConnector from "../config/cartridgeConnector.tsx";

export default function StarknetProvider({ children }: PropsWithChildren) {
    const provider = jsonRpcProvider({
        rpc: () => ({ nodeUrl: dojoConfig.rpcUrl as string }),
    });

    return (
        <StarknetConfig
            autoConnect
            chains={[sepolia]}
            connectors={[cartridgeConnector]}
            explorer={starkscan}
            provider={provider}
        >
            {children}
        </StarknetConfig>
    );
}
