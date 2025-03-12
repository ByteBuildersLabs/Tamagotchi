import { useAccount } from "@starknet-react/core";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { addAddressPadding } from "starknet";
import { useEffect, useState } from "react";

export const useFood = () => {
  const { useDojoStore } = useDojoSDK();
  const entities = useDojoStore((state) => state.entities);
  const { account } = useAccount();
  const [ foods, setFoods ] = useState<any[]>([]);

  useEffect(() => {
    if (!account) return;
    const foodEntities = Object.values(entities)
      .filter(entity => entity.models && entity.models.tamagotchi && entity.models.tamagotchi.Food)
      .map(entity => entity.models.tamagotchi.Food);

    const ownedFoods = foodEntities.filter(food => food?.player === addAddressPadding(account.address));
    setFoods(ownedFoods);
  }, [entities]);

  return {
    foods
  };
};
