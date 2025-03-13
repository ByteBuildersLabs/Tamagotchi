import { useEffect, useState } from "react";
import { dojoConfig } from "../dojo/dojoConfig";
const TORII_URL = dojoConfig.toriiUrl+"/graphql";

interface Beast {
  player: string;
  age: number;
  beast_type: string;
  birth_date: string;
  specie: string;
  beast_id: string;
}

interface BeastEdge {
  node: Beast;
}

export const useBeasts = () => {
  const [beastsData, setBeastsData] = useState([]);
  useEffect(() => {
    const fetchBeasts = async () => {
      try {
        const response = await fetch(TORII_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetBeast {
                tamagotchiBeastModels(first: 100) {
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
              }
            `,
          }),
        });

        const result = await response.json();
        if (result.data && result.data.tamagotchiBeastModels) {
          setBeastsData(result.data.tamagotchiBeastModels.edges.map((edge: BeastEdge) => edge.node));
        }
      } catch (error) {
        console.error("Error fetching beasts:", error);
      }
    };

    fetchBeasts();
  }, []);

  return {
    beastsData
  };
};
