import { useEffect, useState } from "react";
import { dojoConfig } from "../dojo/dojoConfig";
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";
import { Food, FoodEdge } from '../types/game';

// Constants
const TORII_URL = dojoConfig.toriiUrl + "/graphql";
const FOOD_QUERY = `
  query GetFood {
    tamagotchiFoodModels(first: 1000) {
      edges {
        node {
          player
          id
          amount
        }
      }
      totalCount
    }
  }
`;

// API Functions
const fetchFoodData = async (): Promise<FoodEdge[]> => {
  try {
    const response = await fetch(TORII_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: FOOD_QUERY }),
    });

    const result = await response.json();
    if (!result.data?.tamagotchiFoodModels) {
      throw new Error('No food data found');
    }

    return result.data.tamagotchiFoodModels.edges;
  } catch (error) {
    console.error("Error fetching foods:", error);
    throw error;
  }
};

const filterUserFoods = (foodEdges: FoodEdge[], userAddress: string): Food[] => {
  return foodEdges
    .filter((edge: FoodEdge) => 
      addAddressPadding(edge.node.player).toLowerCase() === userAddress.toLowerCase()
    )
    .map((edge: FoodEdge) => edge.node);
};

// Hook
export const useFood = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { account } = useAccount();
  const userAddress = account ? addAddressPadding(account.address) : '';

  useEffect(() => {
    const loadFoods = async () => {
      if (!userAddress) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const foodEdges = await fetchFoodData();
        const userFoods = filterUserFoods(foodEdges, userAddress);
        setFoods(userFoods);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    loadFoods();
  }, [userAddress]);

  return {
    foods,
    isLoading,
    error
  };
};
