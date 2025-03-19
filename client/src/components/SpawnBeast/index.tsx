import { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage.tsx";
import useAppStore from "../../context/store.ts";
import toast, { Toaster } from 'react-hot-toast';
import Egg from "../../assets/img/egg.gif";
import Hints from "../Hints/index.tsx";
import Header from "../Header/index.tsx";
import { Account, addAddressPadding } from "starknet";
import { useAccount } from "@starknet-react/core";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { useSystemCalls } from "../../dojo/useSystemCalls.ts";
import { useBeasts } from "../../hooks/useBeasts.tsx";
import { usePlayer } from "../../hooks/usePlayers.tsx";
import { useNavigate } from 'react-router-dom';
import './main.css';

function SpawnBeast() {
  const { account } = useAccount();
  const { client } = useDojoSDK();
  const { player } = usePlayer();
  const { beastsData: beasts } = useBeasts();
  const { spawn } = useSystemCalls();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { zplayer, setPlayer, zbeasts, setBeasts, setCurrentBeast } = useAppStore();

  async function setCurrentBeastInPlayer(foundBeast:any) {
    if (!foundBeast) return
    await client.actions.setCurrentBeast(account as Account, foundBeast?.beast_id)
  }
  
  useEffect(() => {
    if (player) setPlayer(player);
  }, [player, setPlayer]);
  
  useEffect(() => {
    if (beasts) setBeasts(beasts);
  }, [beasts, setBeasts]);

  const [status] = useLocalStorage('status', []);
  const [reborn] = useLocalStorage('reborn', false);

  // Set current beast and navigate to play If there is a beast for the player
  useEffect(() => {
    if (!zplayer || Object.keys(zplayer).length === 0) return;
    if (!zbeasts || zbeasts.length === 0) return;
    const foundBeast = zbeasts.find((beast: any) => addAddressPadding(beast.player) ===  zplayer.address);
    console.info('status', status);
    if (foundBeast && !reborn) {
      setCurrentBeastInPlayer(foundBeast);
      setCurrentBeast(foundBeast);
      localStorage.removeItem('reborn');
      localStorage.removeItem('status');
      navigate('/play');
    }
  }, [zplayer, zbeasts, status]);

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
    if (!account) return

    if (!zplayer) {
      setLoading(true);
      await client.actions.spawnPlayer(account as Account);
      await new Promise(resolve => setTimeout(resolve, 2500));
      setLoading(false);
    }

    await client.actions.addInitialFood(account as Account);
    notify();
    setLoading(true);
    await spawn(randomNumber);
    await new Promise(resolve => setTimeout(resolve, 5000));
    localStorage.removeItem('reborn');
    localStorage.removeItem('status');
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
          { account && 
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
