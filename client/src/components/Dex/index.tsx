import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import beastsData from '../../data/dex/BeastsDex.json';
import './main.css';

function DexCarousel() {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: beastsData.BeastsDex.length > 1,
    customPaging: function () {
      return <div className="indicator"></div>;
    }
  };

  return (
    <div className="dex-container">
      <h1>BeastsDex</h1>
      <Slider {...settings}>
        {beastsData.BeastsDex.map((beast, index) => (
          <div key={index} className="beast-card">
            <img src={beast.Image} alt={beast.Name} className="beast-image" />
            <h2>{beast.Name}</h2>
            <p className="beast-type">Type: {beast.BeastsType}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default DexCarousel;
