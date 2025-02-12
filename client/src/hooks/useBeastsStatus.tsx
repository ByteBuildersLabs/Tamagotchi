import { useEffect, useState } from "react";
import { SDK } from "@dojoengine/sdk";
import { SchemaType } from "../dojo/bindings.ts";
import { useAccount } from "@starknet-react/core";
import { useDojoStore } from "../main.tsx";
import { usePlayer } from "./usePlayers.tsx";

export const useBeastStatus = (sdk: SDK<SchemaType>) => {
  const { account } = useAccount();
  const { player } = usePlayer(sdk);
  const state = useDojoStore((state) => state);

  const [beastStatus, setBeastStatus] = useState<any>({});

  const [beastsStatus, setBeastsStatus] = useState<any>([]);

  useEffect(() => {
    if (!account) return;
    let unsubscribe: (() => void) | undefined;

    const subscribe = async () => {
      const subscription = await sdk.subscribeEntityQuery(
        {
          babybeasts: {
            BeastStatus: {
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
            const beastsStatusData = response.data.map((entity) => entity.models.babybeasts.BeastStatus);
            const beastStatusData = beastsStatusData[0];
            setBeastStatus(beastStatusData);
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
              BeastStatus: {
                $: {
                  where: {
                    beast_id: {},
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
              const beastsStatusData = resp.data.map((entity) => entity.models.babybeasts.BeastStatus);
              setBeastsStatus(beastsStatusData);
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
    beastStatus,
    beastsStatus,
  };
};
