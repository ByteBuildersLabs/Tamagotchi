import { useEffect, useState } from "react";
import { dojoConfig } from "../dojo/dojoConfig";
import { lookupAddresses } from '@cartridge/controller';
import { Beast, BeastEdge, BeastStatus, BeastStatusEdge, BeastStatuses } from '../types/game';

// Constants
const TORII_URL = dojoConfig.toriiUrl + "/graphql";
const BEASTS_QUERY = `
  query GetBeast {
    tamagotchiBeastModels(first: 1000) {
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
    tamagotchiBeastStatusModels(first: 1000) {
      edges {
        node {
          beast_id
          is_alive
        }
      }
    }
  }
`;

// API Functions
export const fetchBeastsData = async (): Promise<any> => {
  try {
    const response = await fetch(TORII_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: BEASTS_QUERY }),
    });

    const result = await response.json();
    if (!result.data?.tamagotchiBeastModels) {
      throw new Error('No beast data found');
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching beasts:", error);
    throw error;
  }
};

export const processBeastData = async (data: any): Promise<Beast[]> => {
  const playerAddresses = data.tamagotchiBeastModels.edges
    .map((edge: BeastEdge) => edge.node.player)
    .filter((address: string, index: number, self: string[]) =>
      self.indexOf(address) === index
    );

  const addressMap = await lookupAddresses(playerAddresses);
  const beastStatuses = extractBeastStatuses(data.tamagotchiBeastStatusModels);

  return data.tamagotchiBeastModels.edges.map((edge: BeastEdge) => ({
    ...edge.node,
    userName: addressMap.get(edge.node.player),
    is_alive: typeof beastStatuses[edge.node.beast_id] === 'boolean' 
      ? beastStatuses[edge.node.beast_id] 
      : true
  }));
};

const extractBeastStatuses = (statusModels: any): BeastStatuses => {
  const beastStatuses: BeastStatuses = {};
  
  if (statusModels?.edges) {
    statusModels.edges.forEach((edge: BeastStatusEdge) => {
      const status = edge.node;
      beastStatuses[status.beast_id] = status.is_alive;
    });
  }

  return beastStatuses;
};

// Hook
export const useBeasts = () => {
  const [beastsData, setBeastsData] = useState<Beast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadBeasts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBeastsData();
        const processedData = await processBeastData(data);
        setBeastsData(processedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    loadBeasts();
  }, []);

  return {
    beastsData,
    isLoading,
    error
  };
};
