import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Beast } from "../../dojo/bindings.ts";
import { useBeasts } from '../../hooks/useBeasts.tsx';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { Account } from 'starknet';
import { useGlobalContext } from '../../hooks/appContext.tsx';
import ControllerConnectButton from '../CartridgeController/ControllerConnectButton.tsx';
import beastsDex from "../../data/beastDex.tsx";
import Header from '../Header/index.tsx';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './main.css';

function Bag() {
  const { userAccount } = useGlobalContext();
  const { beasts } = useBeasts();
  const { client } = useDojoSDK();

  const settings = {
    dots: beasts.length > 1,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: beasts.length > 1,
    customPaging: function () {
      return (
        <div className="indicator"></div>
      );
    }
  };

  const getSlideContent = (beast: typeof beasts[0]) => (
    <div className="beast-slide">
      <div className="beast">
        <div className="beast-pic d-flex align-items-end">
          <img src={beastsDex[beast?.specie - 1].idlePicture} alt="beast" />
        </div>
        <div className="initial-info">
          <h4>
            {beastsDex[beast?.specie - 1].name}
          </h4>
          <p>
            Your are close to evolve {beastsDex[beast?.specie - 1].name}, keep playing to reach the next level
          </p>
        </div>
        <Link
          to={`/`}
          className="button"
          onClick={async () => {
            await client.actions.setCurrentBeast(userAccount as Account, beast?.beast_id)
          }}
        >
          PLAY
        </Link>
      </div>
    </div>
  );

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove('day', 'night');
      bodyElement.style.backgroundSize = 'cover';
      bodyElement.style.padding = '22px 15px';
    }
  }, []);

  // if no beasts are available, show an empty state
  if (beasts.length === 0) {
    return (
      <>
        <Header />
        <div className="bag">
          <div className='d-flex justify-content-between align-items-center'>
            <p className={'title'}>
              There are not Beasts
              <span className='d-block'>Go hatch an egg!</span>
            </p>
            <ControllerConnectButton />
          </div>
          <div className="initial-info">
            <h4>
              This is your Beasts Bag
            </h4>
            <p className='mb-4'>
              Go hatch and Egg, you will see the baby here
            </p>
            <Link to={'/'} className="button">Hatch Your Egg</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bag">
        <div className='d-flex justify-content-between align-items-center'>
          <p className={'title'}>
            Here are your Beasts
            <span className='d-block'>Each Baby is unique!</span>
          </p>
          <ControllerConnectButton />
        </div>
        <div className="carousel">
          {beasts.length === 1 ? (
            // if only one beast, show it directly without the slider
            getSlideContent(beasts[0])
          ) : (
            // if more than one beast, show them in a slider
            <Slider {...settings}>
              {beasts.filter((beast): beast is Beast => beast !== undefined).map((beast: Beast, index: number) => (
                <div key={index}>
                  {getSlideContent(beast)}
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </>

  );
}

export default Bag;
