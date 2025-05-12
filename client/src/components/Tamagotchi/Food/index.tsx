import { useEffect, useState } from 'react';
import { Account } from 'starknet';
import useSound from 'use-sound';

import useAppStore from '../../../context/store.ts';
import { useFood } from '../../../hooks/useFood.tsx';

import beastsDex from '../../../data/beastDex.tsx';
import initialFoodItems from '../../../data/food.tsx';

import buttonClick from '../../../assets/sounds/click.mp3';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './main.css';

const Food = ({ handleAction, beast, account, client, beastStatus, showAnimation }: {
  handleAction: any,
  beast: any,
  account: any,
  client: any,
  beastStatus: any,
  showAnimation: (gifPath: string) => void,
}) => {
  const { foods, loadingFood } = useFood();
  const { zfoods, setFoods } = useAppStore();
  const [loading, setLoadingFood] = useState(true);
  const [buttonSound] = useSound(buttonClick, { volume: 0.6, preload: true });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingFood(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loadingFood && foods.length > 0) {
      const updatedFoods = foods.map((food) => {
        const initialFood = initialFoodItems.find(item => item.id === food.id);
        return {
          ...food,
          name: initialFood?.name,
          img: initialFood?.img,
          count: food.amount,
        };
      });
      setFoods(updatedFoods);
    }
  }, [loadingFood, foods]);

  const feedTamagotchi = async (foodName: string) => {
    buttonSound();
    if (!beast) return;
    const eatAnimation = beastsDex[beast.specie - 1].eatPicture;
    showAnimation(eatAnimation);

    try {
      const selectedFood = zfoods.find((item: { name: string; }) => item.name === foodName);
      if (!selectedFood) return;
      
      await handleAction("Feed", async () => await client.game.feed(account, selectedFood.id), eatAnimation);
      await client.achieve.achieveBeastFeed(account as Account);
      
      const updatedFoods = zfoods.map((food: any) => {
        if (food.name === foodName) {
          return { ...food, count: food.count - 1 };
        }
        return food;
      });
      setFoods(updatedFoods);
    } catch (error) {
      console.error("Error feeding beast:", error);
    }

    setLoadingFood(true);
    setTimeout(() => {
      setLoadingFood(false);
    }, 1000);
  };

  return (
    <>
      <div className={`food-carousel-container ${loading ? 'loading-aura' : ''}`}>
        <div className='food-carousel'>
          {!beastStatus || beastStatus[1] == 0 ? <></> :
            zfoods.map(({ name, img, count }: { name: any, img: any, count: any }) => (
              <button
                key={name}
                className="button"
                onClick={() => feedTamagotchi(name)}
                disabled={loading || count === 0}
              >
                <span>
                  x{count}
                </span>
                <img alt="option" src={img} />
                <p>{name}</p>
              </button>
            ))
          }
        </div>
      </div>
    </>
  )
};

export default Food;
