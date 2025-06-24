// React and external libraries
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAccount } from "@starknet-react/core";
import { Account, addAddressPadding } from "starknet";
import { useDojoSDK } from "@dojoengine/sdk/react";

// Internal components
import Header from "../Header/index.tsx";
import SpawnBeastContent from './components/SpawnBeastContent';
import ProgressBar from '../ProgressBar/index.tsx';

// Hooks and Contexts
import { useSystemCalls } from "../../dojo/useSystemCalls.ts";
import { usePlayer } from "../../hooks/usePlayers.tsx";
import { useBeasts, fetchBeastsData } from "../../hooks/useBeasts";

// Types
import type { 
  SpawnBeastProps, 
  SpawnBeastState 
} from '../../types/components';

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
  const [searchParams] = useSearchParams();

  const userAddress = useMemo(() => 
    account ? addAddressPadding(account.address).toLowerCase() : '', 
    [account]
  );

  const { myBeastsData, refetch } = useBeasts(userAddress);

  // State
  const [state, setState] = useState<SpawnBeastState>({
    loading: false,
    error: null,
    spawned: false
  });

  const [spawnProgress, setSpawnProgress] = useState({
    progress: 0,
    message: 'Welcome to ByteBeasts'
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
    const reborn = searchParams.get('reborn') === 'true';
    if (!reborn && parseInt(player.current_beast_id) > 0) navigate('/play');
  }, [player, searchParams]);

  const spawnPlayer = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      setSpawnProgress({ progress: 0, message: 'Initializing' });

      if (!player) {
        setSpawnProgress({ progress: 20, message: 'Creating player account' });
        const spawnPlayerTx = await client.player.spawnPlayer(account as Account);

        // Esperar un momento para que se actualice el player
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSpawnProgress({ progress: 40, message: 'Player account created!' });
      }

      setSpawnProgress({ progress: 50, message: 'Generating your beast' });
      const randomBeastId = getRandomNumber(MIN_BEAST_ID, MAX_BEAST_ID);
      const { spawnTx } = await spawn(randomBeastId);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (spawnTx && spawnTx.code === "SUCCESS") {
        refetch();
        const beastsData = await fetchBeastsData();
        console.log('beastsData', beastsData);
        setSpawnProgress({ progress: 70, message: 'Beast generated! Setting as current' });
        const newBeast = myBeastsData[0];
        if (newBeast) {
          setSpawnProgress({ progress: 90, message: 'Finalizing setup' });
          setSpawnProgress({ progress: 100, message: 'Your beast is ready!' });
          setTimeout(() => {
            navigate('/play');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error spawning player:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to spawn player. Please try again.' 
      }));
      setSpawnProgress({ progress: 0, message: 'Error occurred. Please try again.' });
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className={`spawn-beast ${className}`}>
      <Header />
      <SpawnBeastContent 
        loading={state.loading}
        onSpawn={spawnPlayer}
        hasAccount={!!account}
      />
      <ProgressBar 
        progress={spawnProgress.progress}
        statusMessage={spawnProgress.message}
        className="spawn-progress-bar"
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
