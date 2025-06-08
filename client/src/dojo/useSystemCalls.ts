// import { getEntityIdFromKeys } from "@dojoengine/utils";
import { v4 as uuidv4 } from "uuid";
import { useAccount } from "@starknet-react/core";
import { useDojoSDK } from "@dojoengine/sdk/react";

const VRF_PROVIDER_ADDRESS = '0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f';
const GAME_CONTRACT = '0x58971d723d0100ae8393550f9166c9dad9b79799a48fc31f0d9684ef556dda9';

export const useSystemCalls = () => {
    const { useDojoStore, provider } = useDojoSDK();
    const state = useDojoStore((state) => state);
    const { account } = useAccount();

    const handleTransaction = async (
        action: () => Promise<{ transaction_hash: string }>,
        successMessage: string
    ) => {
        const transactionId = uuidv4();

        try {
            // Execute the transaction
            const { transaction_hash } = await action();
            console.log("transaction_hash", transaction_hash);

            // Wait for completion
            const transaction = await account?.waitForTransaction(transaction_hash, {
                retryInterval: 200,
            });

            // Confirm the transaction if successful
            state.confirmTransaction(transactionId);

            return transaction;
        } catch (error) {
            // Revert the optimistic update if an error occurs
            state.revertOptimisticUpdate(transactionId);
            console.error("Error executing transaction:", error);
            throw error;
        }
    };

    const spawn = async (randomNumber: number) => {
        if (!account || !provider) return;

        return await handleTransaction(
            async () => {
                const spawnTx = await provider.execute(
                    account as any,
                    [
                        {
                            contractAddress: VRF_PROVIDER_ADDRESS,
                            entrypoint: 'request_random',
                            calldata: [
                                GAME_CONTRACT, // caller
                                0, // type: 0 para Source::Nonce
                                account.address // address para Source::Nonce
                            ]
                        },
                        {
                            contractName: "game",
                            entrypoint: "spawn_beast",
                            calldata: [randomNumber, randomNumber] // El contrato usará consume_random internamente
                        }
                    ],
                    "tamagotchi", // namespace que ya tienes configurado
                    { maxFee: 1e15 }
                );
                console.info('spawnTx roloooo', spawnTx);

                return spawnTx;
            },
            "Beast spawned successfully!"
        );
    };

    return { spawn };
};
