// React and external libraries
import { useEffect, useState } from 'react';
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";

// Internal components
import Header from '../Header/index.tsx';
import Spinner from '../ui/spinner.tsx';
import AgeLeaderboard from './components/AgeLeaderboard';
import MinigamesLeaderboard from './components/MinigamesLeaderboard';

// Hooks and Contexts
import { useBeasts } from '../../hooks/useBeasts.tsx';
import { useHighScores } from '../../hooks/useHighScore.tsx';
import { usePlayerData } from '../../hooks/usePlayersData.tsx';

// Types
import type { Beast, Player, LeaderboardType } from '../../types/components';

// Utils
import { isUserRow, findPlayerBeast, sortBeastsByAge, sortPlayersByPoints } from './utils/helpers';

// Styles
import './main.css';

// Main Component
const Leaderboard = () => {
  // State
  const [allBeasts, setAllBeasts] = useState<Beast[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [isLoadedBeasts, setIsLoadedBeasts] = useState(false);
  const [isLoadedPlayers, setIsLoadedPlayers] = useState(false);
  const [userPositionAge, setUserPositionAge] = useState<number | null>(null);
  const [userBeast, setUserBeast] = useState<Beast | null>(null);
  const [activeLeaderboard, setActiveLeaderboard] = useState<LeaderboardType>('age');
  
  // Hooks
  const { account } = useAccount();
  const userAddress = account ? addAddressPadding(account.address) : '';
  const { beastsData } = useBeasts();
  const { playerData } = usePlayerData();
  const { scores } = useHighScores();

  // Effects
  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      ['day', 'night', 'sunrise', 'sunset'].forEach(className => 
        bodyElement.classList.remove(className)
      );
    }
  }, []);

  useEffect(() => {
    if (beastsData && beastsData.length > 0) {
      const sortedBeasts = sortBeastsByAge(beastsData as unknown as Beast[]);

      if (userAddress) {
        const userBeastIndex = sortedBeasts.findIndex(
          beast => addAddressPadding(beast.player) === userAddress
        );
        
        if (userBeastIndex !== -1) {
          setUserPositionAge(userBeastIndex + 1);
          setUserBeast(sortedBeasts[userBeastIndex] as unknown as Beast || null);
        }
      }
      
      setAllBeasts(sortedBeasts as unknown as Beast[]);
      setIsLoadedBeasts(true);
    }
  }, [beastsData, userAddress]);

  useEffect(() => {
    if (playerData && playerData.length > 0) {
      const sortedPlayers = sortPlayersByPoints(playerData);
      setAllPlayers(sortedPlayers);
      setIsLoadedPlayers(true);
    }
  }, [playerData]);

  const renderContent = () => {
    if (activeLeaderboard === 'age') {
      return (
        <AgeLeaderboard
          beasts={allBeasts}
          isLoaded={isLoadedBeasts}
          userPosition={userPositionAge}
          userBeast={userBeast}
          isUserRow={(address) => isUserRow(userAddress, address)}
        />
      );
    }

    if (!isLoadedPlayers) {
      return <Spinner message='Loading minigames leaderboard...' />;
    }

    return (
      <MinigamesLeaderboard
        scores={scores}
        players={allPlayers}
        isLoaded={isLoadedPlayers}
        isUserRow={(address) => isUserRow(userAddress, address)}
        findPlayerBeast={(address) => findPlayerBeast(allBeasts, address)}
      />
    );
  };

  return (
    <>
      <Header />
      <div className="leaderboard">
        <div className="leaderboard-inner-container">
          <div className="leaderboard-tabs">
            <button 
              className={`tab-button ${activeLeaderboard === 'age' ? 'active' : ''}`}
              onClick={() => setActiveLeaderboard('age')}
            >
              Age Ranking
            </button>
            <button 
              className={`tab-button ${activeLeaderboard === 'minigames' ? 'active' : ''}`}
              onClick={() => setActiveLeaderboard('minigames')}
            >
              Minigames
            </button>
          </div>
          
          <div className='leaderboard-container'>
            <div className="initial-info">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
