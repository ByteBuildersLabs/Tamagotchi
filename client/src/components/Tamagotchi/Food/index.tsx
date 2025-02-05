import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './main.css';

import Apple from '../../../assets/img/food/apple.jpeg';
import Meat from '../../../assets/img/food/cookie.jpg';
import Fish from '../../../assets/img/food/fish.jpg';

const foodItems = [
  { name: 'Apple', img: Apple, count: 5 },
  { name: 'Meat', img: Meat, count: 3 },
  { name: 'Fish', img: Fish, count: 2 },
];

const Food = () => {
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
              <span className="food-name">{name}</span>
            </div>
            <div className="food-value">{count}</div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Food;
