import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { useDojoSDK, useModel } from "@dojoengine/sdk/react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useAccount } from "@starknet-react/core";
import { useEffect, useMemo } from "react";
import { AccountInterface, addAddressPadding } from "starknet";
import { ModelsMapping } from "../dojo/bindings";

export const usePlayer = () => {
  const { useDojoStore, sdk } = useDojoSDK();
  const { account } = useAccount();
  const state = useDojoStore((state) => state);
  // const entities = useDojoStore((state) => state.entities);

  const entityId = useMemo(() => {
    if (account) {
      return getEntityIdFromKeys([BigInt(account.address)]);
    }
    return BigInt(0);
  }, [account]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const subscribe = async (account: AccountInterface) => {
      const [initialData, subscription] = await sdk.subscribeEntityQuery({
        query: new ToriiQueryBuilder()
          .withClause(
            // Querying Moves and Position models that has at least [account.address] as key
            KeysClause(
              [ModelsMapping.Player ],
              [addAddressPadding(account.address)],
              "VariableLen"
            ).build()
          )
          .includeHashedKeys(),
        callback: ({ error, data }) => {
          if (error) {
            console.error("Error setting up entity sync:", error);
          } else if (data && data[0].entityId !== "0x0") {
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
  }, [sdk, account]);

  const player = useModel(entityId as string, ModelsMapping.Player);
  
  return {
    player,
  };
};
