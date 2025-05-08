import { useEffect, useState } from "react";
import { dojoConfig } from "../dojo/dojoConfig";
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";

const TORII_URL = dojoConfig.toriiUrl + "/graphql";

interface Food {
  player: string;
  id: number;
  amount: number;
}

interface FoodEdge {
  node: Food;
}

export const useFood = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loadingFood, setLoadingFood] = useState<boolean>(true);
  const { account } = useAccount();
  const userAddress = account ? addAddressPadding(account.address) : '';

  useEffect(() => {
    const fetchFoods = async () => {
      if (!userAddress) {
        setLoadingFood(false);
        return;
      }

      try {
        const response = await fetch(TORII_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
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
            `,
          }),
        });

        const result = await response.json();
        if (result.data && result.data.tamagotchiFoodModels) {
          const userFoods = result.data.tamagotchiFoodModels.edges
            .filter((edge: FoodEdge) => 
              addAddressPadding(edge.node.player).toLowerCase() === userAddress.toLowerCase()
            )
            .map((edge: FoodEdge) => edge.node);

          setFoods(userFoods);
        }
      } catch (error) {
        console.error("Error fetching foods:", error);
      } finally {
        setLoadingFood(false);
      }
    };

    fetchFoods();
  }, [userAddress]);

  return {
    foods,
    loadingFood
  };
};
