import { useEffect, useState } from "react";
import { dojoConfig } from "../dojo/dojoConfig";
import { lookupAddresses } from '@cartridge/controller';
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";
import { Player, PlayerEdge } from '../types/game';

// Constants
const TORII_URL = dojoConfig.toriiUrl + "/graphql";
const PLAYER_QUERY = `
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
`;

// API Functions
export const fetchPlayerData = async (): Promise<PlayerEdge[]> => {
  try {
    const response = await fetch(TORII_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: PLAYER_QUERY }),
    });

    const result = await response.json();
    if (!result.data?.tamagotchiPlayerModels) {
      throw new Error('No player data found');
    }

    return result.data.tamagotchiPlayerModels.edges;
  } catch (error) {
    console.error("Error fetching player:", error);
    throw error;
  }
};

export const findPlayerByAddress = (
  playerEdges: PlayerEdge[], 
  userAddress: string
): PlayerEdge | undefined => {
  return playerEdges.find((edge: PlayerEdge) => 
    addAddressPadding(edge.node.address) === userAddress
  );
};

const enrichPlayerWithUsername = async (
  player: Player, 
  userAddress: string
): Promise<Player> => {
  const addressMap = await lookupAddresses([userAddress]);
  return {
    ...player,
    userName: addressMap.get(userAddress)
  };
};

// Hook
export const usePlayer = () => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { account } = useAccount();
  const userAddress = account ? addAddressPadding(account.address) : '';

  useEffect(() => {
    const loadPlayer = async () => {
      if (!userAddress) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const playerEdges = await fetchPlayerData();
        const playerEdge = findPlayerByAddress(playerEdges, userAddress);

        if (playerEdge) {
          const enrichedPlayer = await enrichPlayerWithUsername(
            playerEdge.node, 
            userAddress
          );
          setPlayer(enrichedPlayer);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    loadPlayer();
  }, [userAddress]);

  return {
    player,
    isLoading,
    error
  };
};
