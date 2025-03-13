import { useEffect, useState } from "react";
import { useGlobalContext } from "../../hooks/appContext.tsx";
import toast, { Toaster } from 'react-hot-toast';
import Egg from "../../assets/img/egg.gif";
import Hints from "../Hints/index.tsx";
import Header from "../Header/index.tsx";
import { Account } from "starknet";
import { usePlayer } from "../../hooks/usePlayers.tsx";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { useSystemCalls } from "../../dojo/useSystemCalls.ts";
import { useBeasts } from "../../hooks/useBeasts.tsx";
import { useNavigate } from 'react-router-dom';
import './main.css';

function SpawnBeast() {
  const { userAccount } = useGlobalContext();
  const { client } = useDojoSDK();
  const { player } = usePlayer();
  const { beastsData: beasts } = useBeasts();
  const { spawn } = useSystemCalls();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(!player) return
    const foundBeast = beasts.find((beast: any) => beast.player === player.address);
    if (foundBeast) navigate('/play');
  }, [player, beasts]);

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove('day');
    }
  }, []);

  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const randomNumber = getRandomNumber(1, 3);

  const notify = () => {
    toast("Your egg is hatching!", { duration: 5000 });
  }

  const spawnPlayer = async () => {
    if (!userAccount) return

    if (!player) {
      setLoading(true);
      await client.actions.spawnPlayer(userAccount as Account);
      await client.actions.addInitialFood(userAccount as Account);
      await new Promise(resolve => setTimeout(resolve, 2500));
      setLoading(false);
    }

    notify();
    setLoading(true);
    await spawn(randomNumber);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    navigate('/play');
  };

  const loadingAnimation = () => {
    return (
      <div className="loading-state">
        <div className="loading"></div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="spawn-beast">
        <div className='d-flex justify-content-between align-items-center'>
          <p className={'title'}>
            Hacth the egg
            <span className='d-block'>Collect them all!</span>
          </p>
        </div>
        <div className="initial-beast">
          <img src={Egg} className="egg" alt="beast" />
          <div className="initial-info">
            <h4>
              This is a random beast
            </h4>
            <p>
              Hatch your own Baby Beast and <br />take care of him!
            </p>
          </div>
          { userAccount && 
            <button
              className="button"
              onClick={async () => {
                spawnPlayer();
              }}>
                {
                  loading ? loadingAnimation() : 'Hatch your egg'
                }
            </button>}
          <Hints />
          <Toaster position="bottom-center" />
        </div>
      </div>
    </>

  );
}

export default SpawnBeast;
