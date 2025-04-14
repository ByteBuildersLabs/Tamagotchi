import { useEffect, useState, useRef } from 'react';
import useAppStore from '../../../context/store.ts';
import { useFood } from '../../../hooks/useFood.tsx';
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
  const [loading, setLoadingFood] = useState(true);
  const [buttonSound] = useSound(buttonClick, { volume: 0.7, preload: true });

  const [draggedFood, setDraggedFood] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const dragImageRef = useRef<HTMLDivElement>(null);

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
      handleAction("Feed", async () => await client.game.feed(account, selectedFood.id), eatAnimation)
    } catch (error) {
      console.error("Error feeding beast:", error);
    }

    setLoadingFood(true);
    setTimeout(() => {
      setLoadingFood(false);
    }, 1000);
  };

  const handleDragStart = (e: React.DragEvent, food: any) => {
    if (food.count === 0 || loading) return;
    const dragImg = new Image();
    dragImg.src = food.img;
    dragImg.width = 25;
    e.dataTransfer.setDragImage(dragImg, 12, 12);
    e.dataTransfer.setData('application/json', JSON.stringify({ id: food.id, name: food.name }));
    buttonSound();
  };

  const handleTouchStart = (e: React.TouchEvent, food: any) => {
    if (food.count === 0 || loading) return;
    buttonSound();
    setDraggedFood(food);
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    const touchTimer = setTimeout(() => setIsDragging(true), 150);
    const handleTouchEnd = () => {
      clearTimeout(touchTimer);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    document.addEventListener('touchend', handleTouchEnd, { once: true });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedFood) return;
    e.preventDefault();
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    if (!isDragging) {
      const moveDistance = Math.sqrt(
        Math.pow(touch.clientX - touchPosition.x, 2) +
        Math.pow(touch.clientY - touchPosition.y, 2)
      );
      if (moveDistance > 10) setIsDragging(true);
    }
    if (isDragging) checkDropTarget(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!draggedFood || !isDragging) {
      setDraggedFood(null);
      setIsDragging(false);
      return;
    }
    const touch = e.changedTouches[0];
    const isOverBeast = checkDropTarget(touch.clientX, touch.clientY);
    if (isOverBeast) feedTamagotchi(draggedFood.name);
    setDraggedFood(null);
    setIsDragging(false);
    document.querySelectorAll('.beast-image, .w-full.h-full').forEach(el => el.classList.remove('drag-over'));
  };

  const checkDropTarget = (x: number, y: number): boolean => {
    const beastElements = document.querySelectorAll('.beast-image, .w-full.h-full');
    for (const el of beastElements) {
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        el.classList.add('drag-over');
        return true;
      } else {
        el.classList.remove('drag-over');
      }
    }
    return false;
  };

  useEffect(() => {
    const preventScroll = (e: TouchEvent) => { if (isDragging) e.preventDefault(); };
    document.addEventListener('touchmove', preventScroll, { passive: false });
    return () => document.removeEventListener('touchmove', preventScroll);
  }, [isDragging]);

  return (
    <>
      <div className={`food-carousel-container ${loading ? 'loading-aura' : ''}`}>
        <div className='food-carousel'>
          {!beastStatus || beastStatus[1] == 0 ? <></> :
            zfoods.map((food: any) => (
              <button
                key={food.name}
                className="button food-item"
                onClick={() => feedTamagotchi(food.name)}
                onDragStart={(e) => handleDragStart(e, food)}
                onTouchStart={(e) => handleTouchStart(e, food)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                draggable={!loading && food.count > 0}
                disabled={loading || food.count === 0}
              >
                <span>x{food.count}</span>
                <img alt="option" src={food.img} />
                <p>{food.name}</p>
              </button>
            ))
          }
        </div>
      </div>

      {isDragging && draggedFood && (
        <div
          ref={dragImageRef}
          className="mobile-drag-image"
          style={{
            position: 'fixed',
            left: `${touchPosition.x - 25}px`,
            top: `${touchPosition.y - 25}px`,
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        >
          <img
            src={draggedFood.img}
            alt={draggedFood.name}
            style={{ width: '50px', height: '50px' }}
          />
        </div>
      )}
    </>
  )
};

export default Food;
