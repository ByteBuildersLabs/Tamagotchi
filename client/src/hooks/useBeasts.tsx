import { useEffect, useState } from "react";
import { dojoConfig } from "../dojo/dojoConfig";
import { lookupAddresses } from '@cartridge/controller';
import { Beast, BeastEdge, BeastStatusEdge, BeastStatuses } from '../types/game';
  
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

const MY_BEASTS = (address: string) => `
  query GetBeastsByContract() {
    tamagotchiBeastModels(where: { player: "${address}"}) {
      edges {
        node {
          beast_id
          birth_date
          player
          age
          specie
          beast_type
        }
      }
      totalCount
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

export const fetchMyBeastsData = async (contractAddress: string): Promise<any> => {
  try {
    const response = await fetch(TORII_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: MY_BEASTS(contractAddress) }),
    });

    const result = await response.json();
    if (!result.data?.tamagotchiBeastModels) {
      throw new Error('No beast data found');
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching my beasts:", error);
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
export const useBeasts = (userAddress?: string) => {
  const [beastsData, setBeastsData] = useState<Beast[]>([]);
  const [myBeastsData, setMyBeastsData] = useState<Beast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const loadBeasts = async () => {
      try {
        setIsLoading(true);
        const [allBeastsData, myBeasts] = await Promise.all([
          fetchBeastsData(),
          userAddress ? fetchMyBeastsData(userAddress) : Promise.resolve(null)
        ]);
        
        const processedAllBeasts = await processBeastData(allBeastsData);
        setBeastsData(processedAllBeasts);

        if (myBeasts) {
          const processedMyBeasts = await processBeastData(myBeasts);
          setMyBeastsData(processedMyBeasts);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    loadBeasts();
  }, [userAddress, trigger]);

  const refetch = () => {
    setTrigger(prev => prev + 1);
  };

  return {
    beastsData,
    myBeastsData,
    isLoading,
    error,
    refetch
  };
};
