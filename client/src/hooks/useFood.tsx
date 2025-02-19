import { useEffect, useState } from "react";
import { SDK } from "@dojoengine/sdk";
import { SchemaType } from "../dojo/bindings.ts";
import { useAccount } from "@starknet-react/core";
import { useDojoStore } from "../main.tsx";
import { addAddressPadding } from "starknet";

export const useFood = (sdk: SDK<SchemaType>) => {
  const { account } = useAccount();
  const state = useDojoStore((state) => state);

  const [foods, setFoods] = useState<any>([]);

  useEffect(() => {
    if (!account) return;
    const fetchEntities = async () => {
      try {
        await sdk.getEntities(
          {
            babybeasts: {
              Food: {
                $: {
                  where: {
                    player: {
                      $eq: addAddressPadding(account.address),
                    },
                  },
                },
              },
            },
          },
          (resp) => {
            if (resp.error) {
              console.error("resp.error.message:", resp.error.message);
              return;
            }
            if (resp.data) {
              const foodsData = resp.data.map((entity) => entity.models.babybeasts.Food);
              setFoods(foodsData);
              state.setEntities(resp.data);
            }
          }
        );
      } catch (error) {
        console.error("Error querying entities:", error);
      }
    };

    fetchEntities();
  }, [sdk, account]);

  return {
    foods,
  };
};
