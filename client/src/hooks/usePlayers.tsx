import { useEffect, useState } from "react";
import { dojoConfig } from "../dojo/dojoConfig";
import { lookupAddresses } from '@cartridge/controller';
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";

const TORII_URL = dojoConfig.toriiUrl + "/graphql";

interface Player {
  address: string;
  current_beast_id: string;
  daily_streak: number;
  total_points: number;
  last_active_day: string;
  creation_day: string;
}

interface PlayerEdge {
  node: Player;
}

export const usePlayer = () => {
  const [player, setPlayerData] = useState<Player | null>(null);
  const { account } = useAccount();
  const userAddress = account ? addAddressPadding(account.address) : '';

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!userAddress) return;

      try {
        const response = await fetch(TORII_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetPlayer {
                tamagotchiPlayerModels(first: 1000) {
                  edges {
                    node {
                      address
                      current_beast_id
                      daily_streak
                      total_points
                      last_active_day
                      creation_day
                    }
                  }
                  totalCount
                }
              }
            `,
          }),
        });

        const result = await response.json();
        if (result.data && result.data.tamagotchiPlayerModels) {
          const playerEdge = result.data.tamagotchiPlayerModels.edges
            .find((edge: PlayerEdge) => 
              addAddressPadding(edge.node.address) === userAddress
            );

          if (playerEdge) {
            const addressMap = await lookupAddresses([userAddress]);
            const player = {
              ...playerEdge.node,
              userName: addressMap.get(userAddress)
            };
            setPlayerData(player);
          }
        }
      } catch (error) {
        console.error("Error fetching player:", error);
      }
    };

    fetchPlayer();
  }, [userAddress]);

  return {
    player
  };
};
