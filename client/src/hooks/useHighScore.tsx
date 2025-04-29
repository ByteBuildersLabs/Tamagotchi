import { useDojoSDK } from "@dojoengine/sdk/react";
import { useEffect, useState } from "react";
import { addAddressPadding } from "starknet";

export const useHighScores = (account:any) => {
  const { useDojoStore } = useDojoSDK();
  const entities = useDojoStore((state) => state.entities);
  const [ myScore, setMyScore ] = useState<any[]>([]);
  const [ loadingScores, setLoadingScores ] = useState<any>(true);

  useEffect(() => {
    const scoreEntities = Object.values(entities)
      .filter(entity => entity.models && entity.models.tamagotchi && entity.models.tamagotchi.HighestScore)
      .map(entity => entity.models.tamagotchi.HighestScore);

    const myScore = scoreEntities.filter(score => account && score?.player === addAddressPadding(account.address ?? ''));

    setMyScore(myScore);
    setLoadingScores(false);
  }, [entities]);

  return {
    myScore,
    loadingScores
  };
};
