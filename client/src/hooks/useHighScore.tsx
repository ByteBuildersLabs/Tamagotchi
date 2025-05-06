import { useDojoSDK } from "@dojoengine/sdk/react";
import { useEffect, useState } from "react";
import { addAddressPadding } from "starknet";

export const useHighScores = (account?: any) => {
  const { useDojoStore } = useDojoSDK();
  const entities = useDojoStore((state) => state.entities);
  const [myScoreSkyJump, setMyScoreSkyJump] = useState<any[]>([]);
  const [myScoreFlappyBird, setMyScoreFlappyBird] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [loadingScores, setLoadingScores] = useState<any>(true);

  useEffect(() => {
    const scoreEntities = Object.values(entities)
      .filter(entity => entity.models && entity.models.tamagotchi && entity.models.tamagotchi.HighestScore)
      .map(entity => entity.models.tamagotchi.HighestScore);

    setScores(scoreEntities);

    const myScoreSkyJump = scoreEntities.filter(score => account && score?.player === addAddressPadding(account.address ?? '') && score?.minigame_id === 1);

    const myScoreFlappyBird = scoreEntities.filter(score => account && score?.player === addAddressPadding(account.address ?? '') && score?.minigame_id === 2);

    setMyScoreSkyJump(myScoreSkyJump);
    setMyScoreFlappyBird(myScoreFlappyBird);
    setLoadingScores(false);
  }, [entities]);

  return {
    myScoreFlappyBird,
    myScoreSkyJump,
    scores,
    loadingScores
  };
};
