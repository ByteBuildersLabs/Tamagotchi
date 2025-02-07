import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { SDK } from "@dojoengine/sdk";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Beast, SchemaType } from "../../dojo/bindings.ts";
import { useBeast } from '../../hooks/useBeasts.tsx';
import ControllerConnectButton from '../CartridgeController/ControllerConnectButton.tsx';
import initials from "../../data/initials.tsx";
import { useAccount } from '@starknet-react/core';
import { Account } from 'starknet';
import { useDojo } from '../../dojo/useDojo.tsx';
import './main.css';

function Bag({ sdk }: { sdk: SDK<SchemaType> }) {
  const { beasts } = useBeast(sdk);
  const { account } = useAccount();
  const {
    setup: { client },
  } = useDojo();

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    customPaging: function() {
      return (
        <div className="indicator"></div>
      );
    }
  };

  const getSlideContent = (beast: typeof beasts[0]) => (
    <div className="beast-slide">
      <div className="beast">
        <div className="beast-header">
          <h2>{beast.name}</h2>
        </div>
        <div className="beast-pic d-flex align-items-end">
          <img src={initials[beast.specie - 1].idlePicture} alt="beast" />
        </div>
        <div className="initial-info">
          <h4>
            {initials[beast.specie - 1].name} Lvl {beast.level}
          </h4>
          <p>
            Your are close to evolve {initials[beast.specie - 1].name}, keep playing to reach the next level
          </p>
        </div>
        <Link 
          to={`/play/${beast.beast_id}`} 
          className="button" 
          onClick={async() => {
            await client.actions.setCurrentBeast(account as Account, beast.beast_id)
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
      bodyElement.style.padding = '80px 15px 30px';
    }
  }, []);

  return (
    <div className="bag">
      <div className='d-flex justify-content-between align-items-center'>
        <p className={'title'}>
          Collect them all!
          <span className='d-block'>There are many species</span>
        </p>
        <ControllerConnectButton />
      </div>
      <div className="carousel">
        <Slider {...settings}>
          {beasts.map((beast: Beast, index: number) => (
            <div key={index}>
              {getSlideContent(beast)}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Bag;