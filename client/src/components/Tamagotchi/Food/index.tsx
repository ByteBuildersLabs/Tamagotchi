import Apple from '../../../assets/img/food/apple.jpeg';
import Meat from '../../../assets/img/food/cookie.jpg';
import Fish from '../../../assets/img/food/fish.jpg';
import './main.css';

const foodItems = [
  { name: 'Apple', img: Apple, count: 5 },
  { name: 'Meat', img: Meat, count: 3 },
  { name: 'Fish', img: Fish, count: 2 },
];

const Food = () => {
  return (
    <div className="food">
      {foodItems.map(({ name, img, count }) => (
        <div className="food-item" key={name}>
          <div className="food-label">
            <img src={img} alt={name} />
            {name}
          </div>
          <div className="food-value">{count}</div>
        </div>
      ))}
    </div>
  );
};

export default Food;
