import { useEffect } from "react";
import { useGlobalContext } from "../../hooks/appContext.tsx";
import { useSystemCalls } from "../../dojo/useSystemCalls.ts";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import ControllerConnectButton from "../CartridgeController/ControllerConnectButton.tsx";
import Egg from "../../assets/img/egg.gif";
import Hints from "../Hints/index.tsx";
import Header from "../Header/index.tsx";
import { useDojo } from "../../dojo/useDojo.tsx";
import { SchemaType } from "../../dojo/bindings.ts";
import { SDK } from "@dojoengine/sdk";
import { Account } from "starknet";
import { usePlayer } from "../../hooks/usePlayers.tsx";
import './main.css';

function SpawnBeast({ sdk }: { sdk: SDK<SchemaType> }) {
  const { userAccount } = useGlobalContext();
  const { spawn } = useSystemCalls();

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove('day', 'night');
      bodyElement.style.backgroundSize = 'cover';
      bodyElement.style.padding = '80px 15px 30px';
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

  const {
    setup: { client }
  } = useDojo();

  const { player } = usePlayer(sdk);

  const spawnPlayer = async () => {
    if (!userAccount) return
    await client.actions.spawnPlayer(userAccount as Account);
    await client.actions.addInitialFood(userAccount as Account);
  };

  return (
    <>
      <Header />
      <div className="spawn-beast">
        <div className='d-flex justify-content-between align-items-center'>
          <p className={'title'}>
            Collect them all!
            <span className='d-block'>There are many species</span>
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
              Hatch your own Babybeasts and take care of it! Collect them all!
            </p>
          </div>
          { userAccount && !player && 
            <button
              className="button"
              onClick={async () => {
                await spawnPlayer();
              }}>Create player
            </button>}
          { userAccount && player && 
            <button
              className="button"
              onClick={async () => {
                notify();
                await spawn(randomNumber);
                await new Promise(resolve => setTimeout(resolve, 5500));
                navigate("/bag");
              }}>Hatch your egg
            </button>}
          <Hints />
          <Toaster position="bottom-center" />
        </div>
      </div>
    </>

  );
}

export default SpawnBeast;
