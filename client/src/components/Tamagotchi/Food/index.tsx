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

interface FoodItem {
  id: string;
  name: string;
  img: string;
  count: number;
}

interface FoodProps {
  handleAction: any;
  beast: any;
  account: any;
  client: any;
  beastStatus: any;
  showAnimation: (gifPath: string) => void;
}

const Food = ({ handleAction, beast, account, client, beastStatus, showAnimation }: FoodProps) => {
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

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, food: FoodItem) => {
    if (food.count === 0) return;
    
    // Create a custom drag image
    const dragImg = new Image();
    dragImg.src = food.img;
    dragImg.width = 25;
    e.dataTransfer.setDragImage(dragImg, 12, 12);
    
    // Set food data for the drop target
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: food.id,
      name: food.name
    }));
    
    buttonSound();
  };

  return (
    <>
      <div className="food-container">
        <div className="food-carousel-container">
        <div className="food-instructions">
          <p>Drag food to your beast to feed it!</p>
        </div>
          <div className='food-carousel'>
            {!beastStatus || beastStatus[1] == 0 ? <></> :
              loading ? 'Loading Food' :
                zfoods.map((food: FoodItem) => (
                  <div 
                    key={food.name}
                    className={`food-item ${food.count === 0 ? 'disabled' : ''}`}
                    draggable={food.count > 0}
                    onDragStart={(e) => handleDragStart(e, food)}
                    onClick={() => food.count > 0 && feedTamagotchi(food.name)}
                  >
                    <span>x{food.count}</span>
                    <img alt={food.name} src={food.img} />
                    <p>{food.name}</p>
                  </div>
                ))
            }
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </>
  );
};

export default Food;
