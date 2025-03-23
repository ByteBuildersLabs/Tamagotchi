// import { getEntityIdFromKeys } from "@dojoengine/utils";
import { v4 as uuidv4 } from "uuid";
import { useAccount } from "@starknet-react/core";
import { useDojoSDK } from "@dojoengine/sdk/react";

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
    const spawn = async (randomNumber:number) => {

        const transactionId = uuidv4();

        try {
            // Execute the spawn action from the client
            await client.game.spawnBeast(account!, randomNumber, randomNumber);
            await client.player.setCurrentBeast(account!, randomNumber, randomNumber);

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
