// import { getEntityIdFromKeys } from "@dojoengine/utils";
import { v4 as uuidv4 } from "uuid";
import { useAccount } from "@starknet-react/core";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { CallData } from "starknet";

const VRF_PROVIDER_ADDRESS = '0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f';
const GAME_CONTRACT = '0x51af5c277d07337a8ef50599173d4b0a10597f3c0b85acebfec4ce9b53a6509';


export const useSystemCalls = () => {
    const { useDojoStore, client } = useDojoSDK();
    const state = useDojoStore((state) => state);

    const { account } = useAccount();

    /**
     * Generates a unique entity ID based on the current account address.
     * @returns {string} The generated entity ID
     */
    // const generateEntityId = () => {
    //     return getEntityIdFromKeys([BigInt(account!.address)]);
    // };

    /**
     * Spawns a new entity with initial moves and handles optimistic updates.
     * @returns {Promise<void>}
     * @throws {Error} If the spawn action fails
     */
    const spawn = async (randomNumber: number) => {
        const transactionId = uuidv4();

        try {
            if (!account) return
            // Execute the spawn action from the client
            const spawnTx = await account.execute([
                // Prefix the multicall with the request_random call
                {
                    contractAddress: VRF_PROVIDER_ADDRESS,
                    entrypoint: 'request_random',
                    calldata: CallData.compile({
                        caller: GAME_CONTRACT,
                        source: { type: 0, address: account.address },
                    })
                },
                {
                    contractAddress: GAME_CONTRACT,
                    entrypoint: 'spawn_beast'
                }
            ]);

            client.game.spawnBeast(account!, randomNumber, randomNumber);

            return {
                spawnTx,
            };
        } catch (error) {
            // Revert the optimistic update if an error occurs
            state.revertOptimisticUpdate(transactionId);
            console.error("Error executing spawn:", error);
            throw error;
        } finally {
            // Confirm the transaction if successful
            state.confirmTransaction(transactionId);
        }
    };

    return {
        spawn,
    };
};
