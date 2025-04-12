
import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { useAccount } from "@starknet-react/core";
import { useEffect, useMemo, useState } from "react";
import { AccountInterface, addAddressPadding } from "starknet";
import { ModelsMapping } from "../dojo/bindings";
import { dojoConfig } from "../dojo/dojoConfig";
import { lookupAddresses } from '@cartridge/controller';
const TORII_URL = dojoConfig.toriiUrl + "/graphql";

interface Beast {
  player: string;
  age: number;
  beast_type: string;
  birth_date: string;
  specie: string;
  beast_id: string;
}

interface BeastEdge {
  node: Beast;
}

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

  const [beastsData, setBeastsData] = useState([]);
  useEffect(() => {
    const fetchBeasts = async () => {
      try {
        const response = await fetch(TORII_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetBeast {
                tamagotchiBeastModels(first: 100) {
                  edges {
                    node {
                      player
                      beast_id
                      age
                      birth_date
                      specie
                      beast_type
                    }
                  }
                  totalCount
                }
              }
            `,
          }),
        });

        const result = await response.json();
        if (result.data && result.data.tamagotchiBeastModels) {
          const playerAddresses = result.data.tamagotchiBeastModels.edges
            .map((edge: BeastEdge) => edge.node.player)
            .filter((address: string, index: number, self: string[]) =>
              self.indexOf(address) === index
            );
          const addressMap = await lookupAddresses(playerAddresses);
          let playerData = result.data.tamagotchiBeastModels.edges.map((edge: BeastEdge) => {
            const beast = edge.node;
            return {
              ...beast,
              userName: addressMap.get(beast.player)
            };
          });
          setBeastsData(playerData);
        }
      } catch (error) {
        console.error("Error fetching beasts:", error);
      }
    };

    fetchBeasts();
  }, []);

  return {
    beasts,
    beastsData
  };
};
