import { useEffect } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage.tsx';
import { useFood } from '../../../hooks/useFood.tsx';
import toast, { Toaster } from 'react-hot-toast';
import beastsDex from '../../../data/beastDex.tsx';
import initialFoodItems from '../../../data/food.tsx';
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

  const [foodItems, setFoodItems] = useLocalStorage('food', initialFoodItems);
  const { foods } = useFood();

  useEffect(() => {
    if (foods.length > 0) {
      const updatedFoodItems = initialFoodItems.map(item => {
        const foodFromAPI = foods.find(food => food.id === item.id);
        return foodFromAPI ? { ...item, count: foodFromAPI.amount } : item;
      });
      setFoodItems(updatedFoodItems);
    }
  }, [foods]);

  // Mark the function as async so we can await the promise
  const feedTamagotchi = async (foodName: string) => {
    if (!beast) return;

    // Reduce the food count in state
    setFoodItems((prevFoodItems: any[]) =>
      prevFoodItems.map(item =>
        item.name === foodName && item.count > 0
          ? { ...item, count: item.count - 1 }
          : item
      )
    );

    // Get the appropriate eating animation for the beast
    const eatAnimation = beastsDex[beast.specie - 1].eatPicture;
    showAnimation(eatAnimation);

    // Execute the feed action wrapped in a toast.promise to show notifications
    try {
      const selectedFood = foodItems.find((item: { name: string; }) => item.name === foodName);
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
        {foodItems.map(({ name, img, count }: { name:any, img:any, count:any }) => (
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
