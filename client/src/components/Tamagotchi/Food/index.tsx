import { Account } from 'starknet';
import { useEffect } from 'react';
import useAppStore from '../../../context/store.ts';
import { useFood } from '../../../hooks/useFood.tsx';
import toast, { Toaster } from 'react-hot-toast';
import beastsDex from '../../../data/beastDex.tsx';
import initialFoodItems from '../../../data/food.tsx';
import Blueberry from '../../../assets/img/food/fruit_blueberry.svg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './main.css';

const Food = ({ handleAction, beast, account, client, showAnimation }: {
  handleAction: any,
  beast: any,
  account: any,
  client: any,
  showAnimation: (gifPath: string) => void,
}) => {

  const { foods } = useFood(account);
  const { zfoods, setFoods } = useAppStore();

  async function spawnFood() {
    await client.actions.addInitialFood(account as Account);
    
  }

  useEffect(() => {
    if (foods.length > 0) {
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
      console.info("Updating food items:", updatedFoods);
    }
  }, [foods]);

  // Mark the function as async so we can await the promise
  const feedTamagotchi = async (foodName: string) => {
    if (!beast) return;

    // Get the appropriate eating animation for the beast
    const eatAnimation = beastsDex[beast.specie - 1].eatPicture;
    showAnimation(eatAnimation);

    // Execute the feed action wrapped in a toast.promise to show notifications
    try {
      const selectedFood = zfoods.find((item: { name: string; }) => item.name === foodName);
      if (!selectedFood) return;

      await toast.promise(
        handleAction("Feed", () => client.actions.feed(account, selectedFood.id), eatAnimation),
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
      <div className="food-carousel">
        {foods.length === 0 ? (
            <button className="button spawn-food" onClick={spawnFood}>
              <img alt="option" src={Blueberry} />
              Claim food!
            </button>
        ) : 
        zfoods.map(({ name, img, count }: { name:any, img:any, count:any }) => (
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
            {name}
          </button>
        ))}
      </div>
      <Toaster position="bottom-center" />
    </>
  )
};

export default Food;
