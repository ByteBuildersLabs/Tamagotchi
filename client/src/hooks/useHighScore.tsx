import { useEffect, useState } from "react";
import { dojoConfig } from "../dojo/dojoConfig";
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";

const TORII_URL = dojoConfig.toriiUrl + "/graphql";

interface HighScore {
  minigame_id: number;
  player: string;
  score: number;
}

interface HighScoreEdge {
  node: HighScore;
}

export const useHighScores = () => {
  const [myScoreSkyJump, setMyScoreSkyJump] = useState<HighScore[]>([]);
  const [myScoreFlappyBird, setMyScoreFlappyBird] = useState<HighScore[]>([]);
  const [scores, setScores] = useState<HighScore[]>([]);
  const [loadingScores, setLoadingScores] = useState<boolean>(true);
  
  const { account } = useAccount();
  const userAddress = account ? addAddressPadding(account.address) : '';

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(TORII_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetHighScores {
                tamagotchiHighestScoreModels(first: 1000) {
                  edges {
                    node {
                      minigame_id
                      player
                      score
                    }
                  }
                  totalCount
                }
              }
            `,
          }),
        });

        const result = await response.json();
        if (result.data && result.data.tamagotchiHighestScoreModels) {
          const allScores = result.data.tamagotchiHighestScoreModels.edges.map(
            (edge: HighScoreEdge) => edge.node
          );

          // Establecer todos los scores
          setScores(allScores);

          if (userAddress) {
            // Filtrar scores para Sky Jump (minigame_id === 1)
            const skyJumpScores = allScores.filter(
              (score: HighScore) => 
                score.minigame_id === 1 && 
                addAddressPadding(score.player).toLowerCase() === userAddress.toLowerCase()
            );
            setMyScoreSkyJump(skyJumpScores);

            // Filtrar scores para Flappy Bird (minigame_id === 2)
            const flappyBirdScores = allScores.filter(
              (score: HighScore) => 
                score.minigame_id === 2 && 
                addAddressPadding(score.player).toLowerCase() === userAddress.toLowerCase()
            );
            setMyScoreFlappyBird(flappyBirdScores);
          }
        }
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setLoadingScores(false);
      }
    };

    fetchScores();
  }, [userAddress]);

  return {
    myScoreFlappyBird,
    myScoreSkyJump,
    scores,
    loadingScores
  };
};
