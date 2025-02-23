import { getEntityIdFromKeys } from "@dojoengine/utils";
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
    const generateEntityId = () => {
        return getEntityIdFromKeys([BigInt(account!.address)]);
    };

    /**
     * Spawns a new entity with initial moves and handles optimistic updates.
     * @returns {Promise<void>}
     * @throws {Error} If the spawn action fails
     */
    const spawn = async (randomNumber:number) => {
        // Generate a unique entity ID
        // const entityId = generateEntityId();

        // Generate a unique transaction ID
        const transactionId = uuidv4();

        // The value to update the Moves model with
        // const remainingMoves = 100;

        // Apply an optimistic update to the state
        // this uses immer drafts to update the state
        // state.applyOptimisticUpdate(transactionId, (draft) => {
        //     if (draft.entities[entityId]?.models?.tamagotchi?.Moves) {
        //         draft.entities[entityId].models.tamagotchi.Moves.remaining =
        //             remainingMoves;
        //     }
        // });

        try {
            // Execute the spawn action from the client
            await client.actions.spawn(account!, randomNumber, randomNumber);

            // Wait for the entity to be updated with the new state
            // await state.waitForEntityChange(entityId, (entity) => {
            //     return (
            //         entity?.models?.tamagotchi?.Moves?.remaining ===
            //         remainingMoves
            //     );
            // });
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
