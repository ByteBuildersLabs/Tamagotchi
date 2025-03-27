import Header from '../Header/index.tsx';
import { useEffect, useState } from 'react';
import './main.css';
import beastsDex from '../../data/beastDex.tsx';
import { useBeasts } from '../../hooks/useBeasts.tsx';
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";
import Spinner from '../ui/spinner.tsx';

interface Beast {
  userName: string;
  beast_type: number;
  age: number;
  name: string;
  player: string;
  beast_id: string;
  birth_date: string;
  specie: string;
}

type LeaderboardType = 'age' | 'minigames';

const Leaderboard = () => {
  const [allBeasts, setAllBeasts] = useState<Beast[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [userBeast, setUserBeast] = useState<Beast | null>(null);
  const [activeLeaderboard, setActiveLeaderboard] = useState<LeaderboardType>('age');
  
  // Get the logged-in user's account
  const { account } = useAccount();
  const userAddress = account ? addAddressPadding(account.address) : '';
  
  const { beastsData } = useBeasts();
  let beasts = beastsData as Beast[];

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) bodyElement.classList.remove('day');
  }, []);

  useEffect(() => {
    if (beasts && beasts.length > 0) {
      const sortedBeasts = [...beasts].sort((a, b) => (b?.age || 0) - (a?.age || 0));
      
      // Find the current user's position and their beast
      if (userAddress) {
        const userBeastIndex = sortedBeasts.findIndex(
          beast => addAddressPadding(beast.player) === userAddress
        );
        
        if (userBeastIndex !== -1) {
          setUserPosition(userBeastIndex + 1); // Position starts at 1
          setUserBeast(sortedBeasts[userBeastIndex]);
        }
      }
      
      setAllBeasts(sortedBeasts);
      setIsLoaded(true);
    }
  }, [beasts, userAddress]);

  // Determine which beasts to display (top 15 + user if outside the top 15)
  const top15Beasts = allBeasts.slice(0, 15);
  const showUserSeparately = userPosition !== null && userPosition > 15;

  // Function to determine if a row belongs to the user
  const isUserRow = (beastPlayer: string) => {
    if (!userAddress) return false;
    return addAddressPadding(beastPlayer) === userAddress;
  };

  // Switch between leaderboards
  const toggleLeaderboard = (type: LeaderboardType) => {
    setActiveLeaderboard(type);
  };

  // Render column headers
  const renderColumnHeaders = () => (
    <div className='row mb-3 header-row'>
      <div className='col-3'>
        <span>Position</span>
      </div>
      <div className='col-3'>
        <span>Player</span>
      </div>
      <div className='col-3'>
        <span>{activeLeaderboard === 'age' ? 'Beast' : 'Games'}</span>
      </div>
      <div className='col-3'>
        <span>{activeLeaderboard === 'age' ? 'Age' : 'Score'}</span>
      </div>
    </div>
  );

  // Render the age leaderboard
  const renderAgeLeaderboard = () => (
    <div className="leaderboard-table">
      {isLoaded && top15Beasts.length > 0 ? (
        <>
          {top15Beasts.map((beast: Beast, index: number) => (
            <div 
              className={`row mb-3 ${isUserRow(beast.player) ? 'current-user' : ''}`} 
              key={`top-${index}`}
            >
              <div className='col-3'>
                <span>{index + 1}</span>
              </div>
              <div className='col-3 username-col'>
                <span>{beast.userName}</span>
              </div>
              <div className='col-3'>
                {beast.beast_type && beastsDex[beast.beast_type - 1]?.idlePicture ? (
                  <img 
                    src={beastsDex[beast.beast_type - 1]?.idlePicture} 
                    className='beast' 
                    alt={beast.name || `Beast #${beast.beast_id}`} 
                  />
                ) : (
                  <span>-</span>
                )}
              </div>
              <div className='col-3'>
                <span>{beast.age}</span>
              </div>
            </div>
          ))}
          
          {showUserSeparately && userBeast && (
            <>
              <div className='row mb-3 separator'>
                <div className='col-12'><span>...</span></div>
              </div>
              <div className='row mb-3 current-user'>
                <div className='col-3'>
                  <span>{userPosition}</span>
                </div>
                <div className='col-3 username-col'>
                  <span>{userBeast.userName}</span>
                </div>
                <div className='col-3'>
                  {userBeast.beast_type && beastsDex[userBeast.beast_type - 1]?.idlePicture ? (
                    <img 
                      src={beastsDex[userBeast.beast_type - 1]?.idlePicture} 
                      className='beast' 
                      alt={userBeast.name || `Beast #${userBeast.beast_id}`} 
                    />
                  ) : (
                    <span>-</span>
                  )}
                </div>
                <div className='col-3'>
                  <span>{userBeast.age}</span>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className='row mb-3'>
          <div className='col-12 text-center'>
            <span>No data to display</span>
          </div>
        </div>
      )}
    </div>
  );

  // Render the minigames leaderboard (placeholder for now)
  const renderMinigamesLeaderboard = () => (
    <div className="leaderboard-table">
      {/* This is a placeholder until the real scoring system is integrated */}
      {isLoaded && top15Beasts.length > 0 ? (
        <>
          {top15Beasts.slice(0, 10).map((beast: Beast, index: number) => (
            <div 
              className={`row mb-3 ${isUserRow(beast.player) ? 'current-user' : ''}`} 
              key={`minigame-${index}`}
            >
              <div className='col-3'>
                <span>{index + 1}</span>
              </div>
              <div className='col-3 username-col'>
                <span>{beast.userName}</span>
              </div>
              <div className='col-3'>
                <span className="games-count">{Math.floor(Math.random() * 10) + 1}</span>
              </div>
              <div className='col-3'>
                <span>{Math.floor(Math.random() * 1000) + 100}</span>
              </div>
            </div>
          ))}
          
          {/* Placeholder for the user if not in the top */}
          {showUserSeparately && userBeast && (
            <>
              <div className='row mb-3 separator'>
                <div className='col-12'><span>...</span></div>
              </div>
              <div className='row mb-3 current-user'>
                <div className='col-3'>
                  <span>{Math.floor(Math.random() * 20) + 16}</span>
                </div>
                <div className='col-3 username-col'>
                  <span>{userBeast.userName}</span>
                </div>
                <div className='col-3'>
                  <span className="games-count">{Math.floor(Math.random() * 5) + 1}</span>
                </div>
                <div className='col-3'>
                  <span>{Math.floor(Math.random() * 500) + 50}</span>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className='row mb-3'>
          <div className='col-12 text-center'>
            <span>No data to display</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (!isLoaded) {
      return (
        <Spinner message='Loading leaderboard...' />
      );
    }
    
    if (allBeasts.length === 0) {
      return (
        <div className='row mb-3'>
          <div className='col-12 text-center'>
            <span>No beasts available</span>
          </div>
        </div>
      );
    }
    
    return (
      <>
        {renderColumnHeaders()}
        {activeLeaderboard === 'age' ? renderAgeLeaderboard() : renderMinigamesLeaderboard()}
      </>
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
              onClick={() => toggleLeaderboard('age')}
            >
              Age Ranking
            </button>
            <button 
              className={`tab-button ${activeLeaderboard === 'minigames' ? 'active' : ''}`}
              onClick={() => toggleLeaderboard('minigames')}
            >
              Minigames
            </button>
          </div>
          
          <p className={'title mb-3'}>
            {activeLeaderboard === 'age' ? 'Age Leaderboard' : 'Minigames Leaderboard'}
            <span className='d-block'>
              {activeLeaderboard === 'age' 
                ? 'How old is your beast?' 
                : 'Best players in minigames'}
            </span>
          </p>
          
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
