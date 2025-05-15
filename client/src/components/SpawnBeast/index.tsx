// React and external libraries
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useAccount } from "@starknet-react/core";
import { Account } from "starknet";
import { useDojoSDK } from "@dojoengine/sdk/react";

// Internal components
import Header from "../Header/index.tsx";
import SpawnBeastContent from './components/SpawnBeastContent';

// Hooks and Contexts
import { useLocalStorage } from "../../hooks/useLocalStorage.tsx";
import useAppStore from "../../context/store.ts";
import { useSystemCalls } from "../../dojo/useSystemCalls.ts";
import { useBeasts } from "../../hooks/useBeasts.tsx";
import { usePlayer } from "../../hooks/usePlayers.tsx";

// Types
import type { 
  SpawnBeastProps, 
  BeastInfo as BeastInfoType, 
  SpawnBeastState 
} from '../../types/components';

// Utils
import { getRandomNumber } from './utils/helpers';

// Styles
import './main.css';

// Main Component
const SpawnBeast: React.FC<SpawnBeastProps> = ({ className = '' }) => {
  // Hooks
  const { account } = useAccount();
  const { client } = useDojoSDK();
  const { player } = usePlayer();
  const { beastsData: beasts } = useBeasts();
  const { spawn } = useSystemCalls();
  const navigate = useNavigate();
  const { zplayer, setPlayer, zbeasts, setBeasts, setCurrentBeast } = useAppStore();
  
  // State
  const [state, setState] = useState<SpawnBeastState>({
    loading: false,
    error: null,
    spawned: false
  });
  
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

    const foundBeast = zbeasts.find((beast: BeastInfoType) => beast.player === zplayer.address);
    if (foundBeast && !reborn) {
      handleCurrentBeast(foundBeast);
    }
  }, [zplayer, zbeasts, status, player, beasts]);

  // Handlers
  const handleCurrentBeast = useCallback(async (foundBeast: BeastInfoType) => {
    if (!foundBeast || !account) return;
    
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const tx = await client.player.setCurrentBeast(account as Account, foundBeast.beast_id);
      
      setCurrentBeast(foundBeast);
      localStorage.removeItem('reborn');
      localStorage.removeItem('status');
      console.info('Rolooo', tx);
      if (tx && tx.code === "SUCCESS") navigate('/play');
    } catch (error) {
      console.error('Error setting current beast:', error);
      setState(prev => ({ ...prev, error: 'Failed to set current beast' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [account, client, navigate, setCurrentBeast]);

  const spawnPlayer = useCallback(async () => {
    if (!account) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      if (!zplayer) {
         const spawnPlayerTx = await client.player.spawnPlayer(account as Account);
         console.info(spawnPlayerTx);
      }

      const randomBeastId = getRandomNumber(1, 3);
      const { spawnTx, setCurrentTx } = await spawn(randomBeastId);

      localStorage.removeItem('reborn');
      localStorage.removeItem('status');
      setState(prev => ({ ...prev, spawned: true }));
      if (
        spawnTx && spawnTx.code === "SUCCESS" && 
        setCurrentTx && setCurrentTx.code === "SUCCESS"
      ) navigate('/play');
    } catch (error) {
      console.error('Error spawning player:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to spawn player. Please try again.' 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [account, client, spawn, navigate, zplayer]);

  return (
    <div className={`spawn-beast ${className}`}>
      <Header />
      <div className='d-flex justify-content-between align-items-center'>
        <p className='title'>
          Hatch the egg
          <span className='d-block'>Collect them all!</span>
        </p>
      </div>
      <SpawnBeastContent 
        loading={state.loading}
        onSpawn={spawnPlayer}
        hasAccount={!!account}
      />
      {state.error && (
        <div className="error-message" role="alert">
          {state.error}
        </div>
      )}
    </div>
  );
};

export default SpawnBeast;
