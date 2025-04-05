import { useDojoSDK } from "@dojoengine/sdk/react";
import { addAddressPadding } from "starknet";
import { useEffect, useState } from "react";

export const useFood = (account:any) => {
  const { useDojoStore } = useDojoSDK();
  const entities = useDojoStore((state) => state.entities);
  const [ foods, setFoods ] = useState<any[]>([]);
  const [ loadingFood, setLoadingFood ] = useState<any>(true);

  useEffect(() => {
    const foodEntities = Object.values(entities)
      .filter(entity => entity.models && entity.models.tamagotchi && entity.models.tamagotchi.Food)
      .map(entity => entity.models.tamagotchi.Food);


    console.info(foodEntities, 'foodEntities');

    const ownedFoods = foodEntities.filter(food => account && food?.player === addAddressPadding(account.address ?? ''));
    setFoods(ownedFoods);
    setLoadingFood(false);
  }, [entities]);

  return {
    foods,
    loadingFood
  };
};
