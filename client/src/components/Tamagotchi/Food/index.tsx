import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './main.css';

import Apple from '../../../assets/img/food/fruit_apple.png';
import Banana from '../../../assets/img/food/fruit_banana.png';
import Cherry from '../../../assets/img/food/fruit_cherry.png';
import Burguer from '../../../assets/img/food/burguer.png';
import CakeChoco from '../../../assets/img/food/cake_chocolate.png';
import CakeStrawberry from '../../../assets/img/food/cake_strawberry.png';
import Cheese from '../../../assets/img/food/cheese.png';
import Chiken from '../../../assets/img/food/chicken.png';
import Eggs from '../../../assets/img/food/eggs_fried.png';
import Fish from '../../../assets/img/food/fish.png';
import FrenchFries from '../../../assets/img/food/frenchfries.png';
import Blueberry from '../../../assets/img/food/fruit_blueberry.png';
import Beef from '../../../assets/img/food/meat.png';
import Pizza from '../../../assets/img/food/pizza.png';
import Corn from '../../../assets/img/food/vegetable_corn.png';
import Potato from '../../../assets/img/food/vegetable_potato.png';

import initials from '../../../data/initials.tsx';

const initialFoodItems = [
  { name: 'Apple', img: Apple, count: 5 },
  { name: 'Banana', img: Banana, count: 3 },
  { name: 'Cherry', img: Cherry, count: 2 },
  { name: 'Burguer', img: Burguer, count: 6 },
  { name: 'Cake Chocolate', img: CakeChoco, count: 4 },
  { name: 'Cake Strawberry', img: CakeStrawberry, count: 3 },
  { name: 'Cheese', img: Cheese, count: 5 },
  { name: 'Chicken', img: Chiken, count: 8 },
  { name: 'Eggs', img: Eggs, count: 5 },
  { name: 'Fish', img: Fish, count: 7 },
  { name: 'French Fries', img: FrenchFries, count: 5 },
  { name: 'Blueberry', img: Blueberry, count: 6 },
  { name: 'Beef', img: Beef, count: 10 },
  { name: 'Pizza', img: Pizza, count: 4 },
  { name: 'Corn', img: Corn, count: 4 },
  { name: 'Potato', img: Potato, count: 7 }
];

const Food = ({ handleAction, beast, account, client, showAnimation }: { 
  handleAction: any, 
  beast: any, 
  account: any, 
  client: any,
  showAnimation: (gifPath: string) => void 
}) => {
  const [foodItems, setFoodItems] = useState(initialFoodItems);

  const feedTamagotchi = (foodName: string) => {
    if (!beast) return; 

    setFoodItems(prevFoodItems =>
      prevFoodItems.map(item =>
        item.name === foodName && item.count > 0
          ? { ...item, count: item.count - 1 }
          : item
      )
    );

    // Get correct animation
    const eatAnimation = initials[beast.specie - 1].eatPicture;

    showAnimation(eatAnimation);

    // Dojo Call
    handleAction("Feed", () => client.actions.feed(account), eatAnimation);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="food-carousel">
      <Slider {...settings}>
        {foodItems.map(({ name, img, count }) => (
          <div className="food-slide" key={name}>
            <div className="food-label">
              <img src={img} alt={name} />
              <div className="food-text">
                <span className="food-name">{name}</span>
                <span className="food-value">Remaining: {count}</span>
                <button 
                  className="button" 
                  onClick={() => feedTamagotchi(name)}
                  disabled={count === 0} //Disable button if there is no food left
                >
                  Feed
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Food;