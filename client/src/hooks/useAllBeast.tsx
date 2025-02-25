import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { useAccount } from "@starknet-react/core";
import { useEffect, useMemo } from "react";
import { ModelsMapping } from "../dojo/bindings";
import { AccountInterface, addAddressPadding } from "starknet";

export const useBeasts = () => {
  const { useDojoStore, sdk } = useDojoSDK();
  const { account } = useAccount();
  const state = useDojoStore((state) => state);
  const entities = useDojoStore((state) => state.entities);

  const beasts = useMemo(() => {
    return Object.values(entities)
      .filter(entity => entity.models && entity.models.tamagotchi && entity.models.tamagotchi.Beast)
      .map(entity => entity.models.tamagotchi.Beast);
  }, [entities]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const subscribe = async (account: AccountInterface) => {
      const [initialData, subscription] = await sdk.subscribeEntityQuery({
        query: new ToriiQueryBuilder()
          .withClause(
            // Querying Moves and Position models that has at least [account.address] as key
            KeysClause(
              [ModelsMapping.Beast ],
              [addAddressPadding(account.address)],
              "VariableLen"
            ).build()
          )
          .includeHashedKeys(),
        callback: ({ error, data }) => {
          if (error) {
            console.error("Error setting up entity sync:", error);
          } else if (data && data[0].entityId !== "0x0") {
            console.log('Rolitoooo')
            state.updateEntity(data[0]);
          }
        },
      });

      state.setEntities(initialData);

      unsubscribe = () => subscription.cancel();
    };

    if (account) {
      subscribe(account);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [sdk, account, state]);

  return {
    beasts
  };
};
