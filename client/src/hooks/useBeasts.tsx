import { useEffect, useState } from "react";
import { SDK } from "@dojoengine/sdk";
import { addAddressPadding } from "starknet";
import { SchemaType } from "../dojo/bindings.ts";
import { useAccount } from "@starknet-react/core";
import { useDojoStore } from "../main.tsx";
import { usePlayer } from "./usePlayers.tsx";


export const useBeast = (sdk: SDK<SchemaType>) => {
  const { account } = useAccount();
  const { player } = usePlayer(sdk);
  const state = useDojoStore((state) => state);

  const [beast, setBeast] = useState<any>({});
  const [beasts, setBeasts] = useState<any>([]);

  useEffect(() => {
    if (!account) return;
    let unsubscribe: (() => void) | undefined;

    const subscribe = async () => {
      const subscription = await sdk.subscribeEntityQuery(
        {
          babybeasts: {
            Beast: {
              $: {
                where: {
                  beast_id: {
                    $is: player?.current_beast_id,
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
            const beastsData = response.data.map((entity) => entity.models.babybeasts.Beast);
            const beast = beastsData[0];
            setBeast(beast);
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
  }, [sdk, player]);

  useEffect(() => {
    if (!account) return;
    const fetchEntities = async () => {
      try {
        await sdk.getEntities(
          {
            babybeasts: {
              Beast: {
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
              const beastsData = resp.data.map((entity) => entity.models.babybeasts.Beast);
              setBeasts(beastsData);
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
    beast,
    beasts,
  };
};
