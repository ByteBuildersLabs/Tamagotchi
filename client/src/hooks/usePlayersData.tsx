import { useEffect, useState } from "react";
import { dojoConfig } from "../dojo/dojoConfig";
import { lookupAddresses } from '@cartridge/controller';

// Types
interface Player {
  address: string;
  total_points: number;
  userName?: string;
}

interface PlayerEdge {
  node: Player;
}

// Constants
const TORII_URL = dojoConfig.toriiUrl + "/graphql";
const PLAYERS_QUERY = `
  query GetPlayer {
    tamagotchiPlayerModels(first: 100) {
      edges {
        node {
          address
          total_points
        }
      }
      totalCount
    }
  }
`;

// API Functions
const fetchPlayersData = async (): Promise<PlayerEdge[]> => {
  try {
    const response = await fetch(TORII_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: PLAYERS_QUERY }),
    });

    const result = await response.json();
    if (!result.data?.tamagotchiPlayerModels) {
      throw new Error('No players data found');
    }

    return result.data.tamagotchiPlayerModels.edges;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
};

const extractUniqueAddresses = (edges: PlayerEdge[]): string[] => {
  return edges
    .map((edge: PlayerEdge) => edge.node.address)
    .filter((address: string, index: number, self: string[]) =>
      self.indexOf(address) === index
    );
};

const enrichPlayersWithUsernames = async (
  edges: PlayerEdge[], 
  addressMap: Map<string, string>
): Promise<Player[]> => {
  return edges.map((edge: PlayerEdge) => ({
    ...edge.node,
    userName: addressMap.get(edge.node.address)
  }));
};

// Hook
export const usePlayerData = () => {
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setIsLoading(true);
        const playerEdges = await fetchPlayersData();
        const uniqueAddresses = extractUniqueAddresses(playerEdges);
        const addressMap = await lookupAddresses(uniqueAddresses);
        const enrichedPlayers = await enrichPlayersWithUsernames(playerEdges, addressMap);
        setPlayerData(enrichedPlayers);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    loadPlayers();
  }, []);
    
  return {
    playerData,
    isLoading,
    error
  };
};
  