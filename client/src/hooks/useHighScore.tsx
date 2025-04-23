import { useDojoSDK } from "@dojoengine/sdk/react";
import { useEffect, useState } from "react";

export const useHighScores = () => {
  const { useDojoStore } = useDojoSDK();
  const entities = useDojoStore((state) => state.entities);
  const [ scores, setScores ] = useState<any[]>([]);
  const [ loadingScores, setLoadingScores ] = useState<any>(true);

  useEffect(() => {
    const scoreEntities = Object.values(entities)
      .filter(entity => entity.models && entity.models.tamagotchi && entity.models.tamagotchi.HighestScore)
      .map(entity => entity.models.tamagotchi.HighestScore);

    setScores(scoreEntities);
    setLoadingScores(false);
  }, [entities]);

  return {
    scores,
    loadingScores
  };
};
