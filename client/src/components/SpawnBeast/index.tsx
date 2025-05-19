// React and external libraries
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAccount } from "@starknet-react/core";
import { Account } from "starknet";
import { useDojoSDK } from "@dojoengine/sdk/react";

// Internal components
import Header from "../Header/index.tsx";
import SpawnBeastContent from './components/SpawnBeastContent';

// Hooks and Contexts
import { useSystemCalls } from "../../dojo/useSystemCalls.ts";
import { usePlayer } from "../../hooks/usePlayers.tsx";
import { fetchBeastsData, processBeastData } from "../../hooks/useBeasts";
import { fetchPlayerData, findPlayerByAddress } from "../../hooks/usePlayers";

// Types
import type { 
  SpawnBeastProps, 
  SpawnBeastState 
} from '../../types/components';
import type { Beast } from '../../types/game';

// Utils
import { getRandomNumber } from './utils/helpers';
import { MIN_BEAST_ID, MAX_BEAST_ID } from './utils/constants';

// Styles
import './main.css';

// Main Component
const SpawnBeast: React.FC<SpawnBeastProps> = ({ className = '' }) => {
  // Hooks
  const { account } = useAccount();
  const { client } = useDojoSDK();
  const { player } = usePlayer();
  const { spawn } = useSystemCalls();
  const navigate = useNavigate();
  
  // State
  const [state, setState] = useState<SpawnBeastState>({
    loading: false,
    error: null,
    spawned: false
  });

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove('day');
    }
  }, []);

  // Handle current beast and navigation
  useEffect(() => {
    if (!player || Object.keys(player).length === 0) return;
    if (parseInt(player.current_beast_id) > 0) navigate('/play');
  }, [player]);

  const spawnPlayer = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      if (!player) {
        const spawnPlayerTx = await client.player.spawnPlayer(account as Account);
        console.info('spawnPlayerTx', spawnPlayerTx);
        
        // Esperar un momento para que se actualice el player
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const randomBeastId = getRandomNumber(MIN_BEAST_ID, MAX_BEAST_ID);
      const { spawnTx } = await spawn(randomBeastId);
      // Esperar un momento para que se actualice la lista de beasts
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.info('spawnBeastTx', spawnTx)

      if (spawnTx && spawnTx.code === "SUCCESS") {
        
        let newBeast;
        do {
          // Recargar la lista de beasts usando GraphQL
          const beastsData = await fetchBeastsData();
          const processedBeasts = await processBeastData(beastsData);
          console.info('processedBeasts', processedBeasts);
          
          // Encontrar la bestia recién creada
          newBeast = processedBeasts.find((beast: Beast) => beast.player === account!.address);
          console.info('newBeast', newBeast);
        } while (!newBeast);
        
        if (newBeast) {
          const setCurrentTx = await client.player.setCurrentBeast(account!, newBeast.beast_id);
          await new Promise(resolve => setTimeout(resolve, 3000));
          console.info('setCurrentTx', setCurrentTx);
        }

        if (newBeast) navigate('/play');
      }
    } catch (error) {
      console.error('Error spawning player:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to spawn player. Please try again.' 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

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
