import { useEffect, useState } from "react";
import { dojoConfig } from "../dojo/dojoConfig";
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";
import { HighScore, HighScoreEdge, GAME_IDS } from '../types/game';

// Constants
const TORII_URL = dojoConfig.toriiUrl + "/graphql";
const HIGH_SCORES_QUERY = `
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
`;

// API Functions
const fetchHighScores = async (): Promise<HighScoreEdge[]> => {
  try {
    const response = await fetch(TORII_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: HIGH_SCORES_QUERY }),
    });

    const result = await response.json();
    if (!result.data?.tamagotchiHighestScoreModels) {
      throw new Error('No high scores data found');
    }

    return result.data.tamagotchiHighestScoreModels.edges;
  } catch (error) {
    console.error("Error fetching high scores:", error);
    throw error;
  }
};

const processHighScores = (edges: HighScoreEdge[]): HighScore[] => {
  return edges.map((edge: HighScoreEdge) => edge.node);
};

const filterScoresByGameAndUser = (
  scores: HighScore[], 
  gameId: number, 
  userAddress: string
): HighScore[] => {
  return scores.filter(
    (score: HighScore) => 
      score.minigame_id === gameId && 
      addAddressPadding(score.player).toLowerCase() === userAddress.toLowerCase()
  );
};

// Hook
export const useHighScores = () => {
  const [myScoreSkyJump, setMyScoreSkyJump] = useState<HighScore[]>([]);
  const [myScoreFlappyBird, setMyScoreFlappyBird] = useState<HighScore[]>([]);
  const [scores, setScores] = useState<HighScore[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { account } = useAccount();
  const userAddress = account ? addAddressPadding(account.address) : '';

  useEffect(() => {
    const loadHighScores = async () => {
      try {
        setIsLoading(true);
        const scoreEdges = await fetchHighScores();
        const allScores = processHighScores(scoreEdges);
        setScores(allScores);

        if (userAddress) {
          const skyJumpScores = filterScoresByGameAndUser(
            allScores, 
            GAME_IDS.SKY_JUMP, 
            userAddress
          );
          setMyScoreSkyJump(skyJumpScores);

          const flappyBirdScores = filterScoresByGameAndUser(
            allScores, 
            GAME_IDS.FLAPPY_BIRD, 
            userAddress
          );
          setMyScoreFlappyBird(flappyBirdScores);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    loadHighScores();
  }, [userAddress]);

  return {
    myScoreFlappyBird,
    myScoreSkyJump,
    scores,
    isLoading,
    error
  };
};
