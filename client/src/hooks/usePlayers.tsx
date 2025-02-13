import { useEffect, useState } from "react";
import { SDK } from "@dojoengine/sdk";
import { addAddressPadding } from "starknet";
import { SchemaType } from "../dojo/bindings.ts";
import { useAccount } from "@starknet-react/core";
import { useDojoStore } from "../main.tsx";

export const usePlayer = (sdk: SDK<SchemaType>) => {
  const { account } = useAccount();
  const state = useDojoStore((state) => state);

  const [player, setPlayer] = useState<any>({});
  const [players, setPlayers] = useState<any>([]);

  useEffect(() => {
    if (!account) return;
    let unsubscribe: (() => void) | undefined;

    const subscribe = async () => {
      const subscription = await sdk.subscribeEntityQuery(
        {
          babybeasts: {
            Player: {
              $: {
                where: {
                  address: {
                    $is: addAddressPadding(account.address),
                  },
                },
              },
            },
          },
        },
        (response) => {
          if (response.error) {
            console.error("Error setting up entity sync:", response.error);
          } else if (response.data && response.data[0].entityId !== "0x0") {
            const playersData = response.data.map((entity) => entity.models.babybeasts.Player);
            const player = playersData[0];
            setPlayer(player);
            console.log(player)
            state.updateEntity(response.data[0]);
          }
        },
        { logging: true }
      );

      unsubscribe = () => subscription.cancel();
    };

    subscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [sdk, account]);

  useEffect(() => {
    if (!account) return;
    const fetchEntities = async () => {
      try {
        await sdk.getEntities(
          {
            babybeasts: {
              Player: {
                $: {
                  where: {},
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
              const playersData = resp.data.map((entity) => entity.models.babybeasts.Player);
              setPlayers(playersData);
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
    player,
    players,
  };
};
