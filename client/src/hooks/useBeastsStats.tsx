import { useEffect, useState } from "react";
import { SDK } from "@dojoengine/sdk";
import { SchemaType } from "../dojo/bindings.ts";
import { useAccount } from "@starknet-react/core";
import { useDojoStore } from "../main.tsx";
import { usePlayer } from "./usePlayers.tsx";

export const useBeastsStats = (sdk: SDK<SchemaType>) => {
  const { account } = useAccount();
  const { player } = usePlayer(sdk);
  const state = useDojoStore((state) => state);

  const [beastStats, setBeastStats] = useState<any>({});
  const [beastsStats, setBeastsStats] = useState<any>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const subscribe = async () => {
      const subscription = await sdk.subscribeEntityQuery(
        {
          babybeasts: {
            BeastStats: {
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
            const beastsStatsData = response.data.map((entity) => entity.models.babybeasts.BeastStats);
            const beastStatsData = beastsStatsData[0];
            setBeastStats(beastStatsData);
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
              BeastStats: {
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
              const beastsStatsData = resp.data.map((entity) => entity.models.babybeasts.BeastStats);
              setBeastsStats(beastsStatsData);
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
    beastStats,
    beastsStats,
  };
};
