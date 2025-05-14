// React and external libraries
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAccount } from "@starknet-react/core";
import { Account } from "starknet";
import { useDojoSDK } from "@dojoengine/sdk/react";

// Internal components
import Hints from "../Hints/index.tsx";
import Header from "../Header/index.tsx";

// Hooks and Contexts
import { useLocalStorage } from "../../hooks/useLocalStorage.tsx";
import useAppStore from "../../context/store.ts";
import { useSystemCalls } from "../../dojo/useSystemCalls.ts";
import { useBeasts } from "../../hooks/useBeasts.tsx";
import { usePlayer } from "../../hooks/usePlayers.tsx";

// Assets
import Egg from "../../assets/img/img-egg.gif";

// Styles
import './main.css';

// Types
interface Beast {
  player: string;
  beast_id: string;
  [key: string]: any;
}

// Constants
const SPAWN_DELAY = 2500;
const NAVIGATION_DELAY = 5000;
const MIN_BEAST_ID = 1;
const MAX_BEAST_ID = 3;

// Utility Functions
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Components
const LoadingAnimation = () => (
  <div className="loading-state">
    <div className="loading"></div>
  </div>
);

const SpawnButton = ({ 
  loading, 
  onSpawn 
}: { 
  loading: boolean; 
  onSpawn: () => Promise<void> 
}) => (
  <button
    className="button"
    onClick={onSpawn}
  >
    {loading ? <LoadingAnimation /> : 'Hatch your egg'}
  </button>
);

// Main Component
function SpawnBeast() {
  // Hooks
  const { account } = useAccount();
  const { client } = useDojoSDK();
  const { player } = usePlayer();
  const { beastsData: beasts } = useBeasts();
  const { spawn } = useSystemCalls();
  const navigate = useNavigate();
  const { zplayer, setPlayer, zbeasts, setBeasts, setCurrentBeast } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [status] = useLocalStorage('status', []);
  const [reborn] = useLocalStorage('reborn', false);

  // Effects
  useEffect(() => {
    if (player) setPlayer(player);
  }, [player, setPlayer]);
  
  useEffect(() => {
    if (beasts) setBeasts(beasts);
  }, [beasts, setBeasts]);

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove('day');
    }
  }, []);

  // Handle current beast and navigation
  useEffect(() => {
    if (!zplayer || Object.keys(zplayer).length === 0) return;
    if (!zbeasts || zbeasts.length === 0) return;

    const foundBeast = zbeasts.find((beast: Beast) => beast.player === zplayer.address);
    if (foundBeast && !reborn) {
      handleCurrentBeast(foundBeast);
    }
  }, [zplayer, zbeasts, status, player, beasts]);

  // Handlers
  const handleCurrentBeast = async (foundBeast: Beast) => {
    if (!foundBeast || !account) return;
    
    await client.player.setCurrentBeast(account as Account, foundBeast.beast_id);
    setCurrentBeast(foundBeast);
    localStorage.removeItem('reborn');
    localStorage.removeItem('status');
    navigate('/play');
  };

  const spawnPlayer = async () => {
    if (!account) return;

    try {
      if (!zplayer) {
        setLoading(true);
        await client.player.spawnPlayer(account as Account);
        await new Promise(resolve => setTimeout(resolve, SPAWN_DELAY));
        setLoading(false);
      }

      setLoading(true);
      const randomBeastId = getRandomNumber(MIN_BEAST_ID, MAX_BEAST_ID);
      await spawn(randomBeastId);
      await new Promise(resolve => setTimeout(resolve, NAVIGATION_DELAY));
      
      localStorage.removeItem('reborn');
      localStorage.removeItem('status');
      navigate('/play');
    } catch (error) {
      console.error('Error spawning player:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="spawn-beast">
        <div className='d-flex justify-content-between align-items-center'>
          <p className='title'>
            Hatch the egg
            <span className='d-block'>Collect them all!</span>
          </p>
        </div>
        <div className="initial-beast">
          <img src={Egg} className="egg" alt="beast egg" />
          <div className="initial-info">
            <h4>This is a random beast</h4>
            <p>
              Hatch your own Baby Beast and <br />take care of him!
            </p>
          </div>
          {account && (
            <SpawnButton 
              loading={loading} 
              onSpawn={spawnPlayer} 
            />
          )}
          <Hints />
        </div>
      </div>
    </>
  );
}

export default SpawnBeast;
