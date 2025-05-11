import { useEffect, useState } from "react";
import { dojoConfig } from "../dojo/dojoConfig";
import { lookupAddresses } from '@cartridge/controller';
const TORII_URL = dojoConfig.toriiUrl + "/graphql";

interface Beast {
  player: string;
  age: number;
  beast_type: string;
  birth_date: string;
  specie: string;
  beast_id: string;
  is_alive?: boolean;
}

interface BeastEdge {
  node: Beast;
}

interface BeastStatus {
  beast_id: string;
  is_alive: boolean;
}

interface BeastStatusEdge {
  node: BeastStatus;
}

interface BeastStatuses {
  [key: string]: boolean;
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
            `,
          }),
        });

        const result = await response.json();
        if (result.data && result.data.tamagotchiBeastModels) {
          const playerAddresses = result.data.tamagotchiBeastModels.edges
            .map((edge: BeastEdge) => edge.node.player)
            .filter((address: string, index: number, self: string[]) =>
              self.indexOf(address) === index
            );
          const addressMap = await lookupAddresses(playerAddresses);

          // Extract beast statuses in a similar way to tamagotchiBeastModels
          const beastStatuses: BeastStatuses = {};

          if (result.data.tamagotchiBeastStatusModels) {
            result.data.tamagotchiBeastStatusModels.edges.forEach((edge: BeastStatusEdge) => {
              const status = edge.node;
              beastStatuses[status.beast_id] = status.is_alive;
            });
          }

          let playerData = result.data.tamagotchiBeastModels.edges.map((edge: BeastEdge) => {
            const beast = edge.node;
            const beastStatus = beastStatuses[beast.beast_id];
            
            return {
              ...beast,
              userName: addressMap.get(beast.player),
              is_alive: typeof beastStatus === 'boolean' ? beastStatus : true
            };
          });
          setBeastsData(playerData);
        }
      } catch (error) {
        console.error("Error fetching beasts:", error);
      }
    };

    fetchBeasts();
  }, []);

  console.info('beastsData', beastsData);

  return {
    beastsData
  };
};
