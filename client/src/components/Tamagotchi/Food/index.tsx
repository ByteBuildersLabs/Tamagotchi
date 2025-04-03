import { useEffect, useState } from 'react';
import useAppStore from '../../../context/store.ts';
import { useFood } from '../../../hooks/useFood.tsx';
import toast, { Toaster } from 'react-hot-toast';
import beastsDex from '../../../data/beastDex.tsx';
import initialFoodItems from '../../../data/food.tsx';
import buttonClick from '../../../assets/sounds/click.mp3';
import useSound from 'use-sound';
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

  const { foods, loadingFood } = useFood(account);
  const { zfoods, setFoods } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [buttonSound] = useSound(buttonClick, { volume: 0.7, preload: true });

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
      setLoading(false);
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

      await toast.promise(
        handleAction("Feed", () => client.game.feed(account, selectedFood.id), eatAnimation),
        {
          loading: 'Feeding your beast...',
          success: 'Beast fed successfully!',
          error: 'Failed to feed beast.',
        }
      );
    } catch (error) {
      console.error("Error feeding beast:", error);
    }
  };

  return (
    <>
      <div className="food-carousel-container">
        <div className='food-carousel'>
          {!beastStatus || beastStatus[1] == 0 ? <></> :
            loading ? 'Loading Food' :
              zfoods.map(({ name, img, count }: { name: any, img: any, count: any }) => (
                <button
                  key={name}
                  className="button"
                  onClick={() => feedTamagotchi(name)}
                  disabled={count === 0}
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
      <Toaster position="bottom-center" />
    </>
  )
};

export default Food;
