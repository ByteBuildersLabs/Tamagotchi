import { useEffect, useState } from "react";
import { useGlobalContext } from "../../hooks/appContext.tsx";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import ControllerConnectButton from "../CartridgeController/ControllerConnectButton.tsx";
import Egg from "../../assets/img/egg.gif";
import Hints from "../Hints/index.tsx";
import Header from "../Header/index.tsx";
import HatchJR from "../Joyride/HatchJR.tsx";
import { Account } from "starknet";
import { usePlayer } from "../../hooks/usePlayers.tsx";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { useSystemCalls } from "../../dojo/useSystemCalls.ts";
import './main.css';


function SpawnBeast() {
  const { userAccount } = useGlobalContext();
  const { client } = useDojoSDK();
  const { spawn } = useSystemCalls();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove('day', 'night');
      bodyElement.style.backgroundSize = 'cover';
      bodyElement.style.padding = '22px 15px';
    }
  }, []);

  const navigate = useNavigate();

  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const randomNumber = getRandomNumber(1, 3);

  const notify = () => {
    toast("Your egg is hatching!", { duration: 5000 });
  }

  const { player } = usePlayer();

  const spawnPlayer = async () => {
    if (!userAccount) return
    await client.actions.spawnPlayer(userAccount as Account);
    await client.actions.addInitialFood(userAccount as Account);
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
          <ControllerConnectButton />
        </div>
        <div className="initial-beast">
          <img src={Egg} alt="beast" />
          <div className="initial-info">
            <h4>
              This is a random beast
            </h4>
            <p>
              Hatch your own Baby Beast and <br />take care of him!
            </p>
          </div>
          { userAccount && !player && 
            <button
              className="button"
              onClick={async () => {
                setLoading(true);
                await spawnPlayer();
                await new Promise(resolve => setTimeout(resolve, 5500));
                setLoading(false);
                navigate("/bag");
                navigate("/hatch");
              }}>
                {
                  loading ? loadingAnimation() : 'Create player'
                }
            </button>}
          { userAccount && player && 
            <button
              className="button"
              onClick={async () => {
                notify();
                setLoading(true);
                await spawn(randomNumber);
                await new Promise(resolve => setTimeout(resolve, 5500));
                setLoading(false);
                navigate("/bag");
              }}>
                {
                  loading ? loadingAnimation() : 'Hatch your egg'
                }
            </button>}
          <Hints />
          <Toaster position="bottom-center" />
        </div>
      </div>
      <HatchJR />
    </>

  );
}

export default SpawnBeast;
