import { useEffect, useState } from "react";
import { dojoConfig } from "../dojo/dojoConfig";
import { lookupAddresses } from '@cartridge/controller';
const TORII_URL = dojoConfig.toriiUrl + "/graphql";

interface Player {
  address: string;
  total_points: number;
}
interface PlayerEdge {
  node: Player;
}

export const usePlayerData = () => {
  const [playerData, setPlayerData] = useState([]);
    useEffect(() => {
      const fetchPlayers = async () => {
        try {
          const response = await fetch(TORII_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
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
              `,
            }),
          });
  
          const result = await response.json();
          if (result.data && result.data.tamagotchiPlayerModels) {
            const playerAddresses = result.data.tamagotchiPlayerModels.edges
              .map((edge: PlayerEdge) => edge.node.address)
              .filter((address: string, index: number, self: string[]) =>
                self.indexOf(address) === index
              );
            const addressMap = await lookupAddresses(playerAddresses);
            let playerData = result.data.tamagotchiPlayerModels.edges.map((edge: PlayerEdge) => {
              const player = edge.node;
              return {
                ...player,
                userName: addressMap.get(player.address)
              };
            });
            setPlayerData(playerData);
          }
        } catch (error) {
          console.error("Error fetching players:", error);
        }
      };
  
      fetchPlayers();
    }, []);
    
    return {
      playerData,
    };
  };
  