import Header from '../Header/index.tsx';
import { useEffect, useState } from 'react';
import './main.css';
import beastsDex from '../../data/beastDex.tsx';
import { useBeasts } from '../../hooks/useBeasts.tsx';
import { usePlayerData } from '../../hooks/usePlayersData.tsx';
import { useAccount } from "@starknet-react/core";
import { addAddressPadding, BigNumberish } from "starknet";
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

interface Player {
  address: string;
  total_points: number;
  userName: string;
}

type LeaderboardType = 'age' | 'minigames';

const Leaderboard = () => {
  const [allBeasts, setAllBeasts] = useState<Beast[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [isLoadedBeasts, setIsLoadedBeasts] = useState(false);
  const [isLoadedPlayers, setIsLoadedPlayers] = useState(false);
  const [userPositionAge, setUserPositionAge] = useState<number | null>(null);
  const [userPositionPoints, setUserPositionPoints] = useState<number | null>(null);
  const [userBeast, setUserBeast] = useState<Beast | null>(null);
  const [userPlayer, setUserPlayer] = useState<Player | null>(null);
  const [activeLeaderboard, setActiveLeaderboard] = useState<LeaderboardType>('age');
  
  // Get the logged-in user's account
  const { account } = useAccount();
  const userAddress = account ? addAddressPadding(account.address) : '';
  
  // Get beast and player data
  const { beastsData } = useBeasts();
  const { playerData } = usePlayerData();
  
  let beasts = beastsData as Beast[];
  let players = playerData as Player[];

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) bodyElement.classList.remove('day');
  }, []);

  // Effect to process beast data
  useEffect(() => {
    if (beasts && beasts.length > 0) {
      const sortedBeasts = [...beasts].sort((a, b) => (b?.age || 0) - (a?.age || 0));
      
      // Find the current user's position and their beast
      if (userAddress) {
        const userBeastIndex = sortedBeasts.findIndex(
          beast => addAddressPadding(beast.player) === userAddress
        );
        
        if (userBeastIndex !== -1) {
          setUserPositionAge(userBeastIndex + 1); // Position starts at 1
          setUserBeast(sortedBeasts[userBeastIndex]);
        }
      }
      
      setAllBeasts(sortedBeasts);
      setIsLoadedBeasts(true);
    }
  }, [beasts, userAddress]);

  // Effect to process player data
  useEffect(() => {
    if (players && players.length > 0) {
      const sortedPlayers = [...players].sort((a, b) => (b?.total_points || 0) - (a?.total_points || 0));
      
      // Find the current user's position in scores
      if (userAddress) {
        const userPlayerIndex = sortedPlayers.findIndex(
          player => addAddressPadding(player.address) === userAddress
        );
        
        if (userPlayerIndex !== -1) {
          setUserPositionPoints(userPlayerIndex + 1); // Position starts at 1
          setUserPlayer(sortedPlayers[userPlayerIndex]);
        }
      }
      
      setAllPlayers(sortedPlayers);
      setIsLoadedPlayers(true);
    }
  }, [players, userAddress]);

  // Determine which beasts/players to display (top 15 + user if outside the top 15)
  const top15Beasts = allBeasts.slice(0, 15);
  const top15Players = allPlayers.slice(0, 15);
  
  const showUserSeparatelyAge = userPositionAge !== null && userPositionAge > 15;
  const showUserSeparatelyPoints = userPositionPoints !== null && userPositionPoints > 15;

  // Function to determine if a row belongs to the user
  const isUserRow = (address: string) => {
    if (!userAddress) return false;
    return addAddressPadding(address) === userAddress;
  };

  // Switch between leaderboards
  const toggleLeaderboard = (type: LeaderboardType) => {
    setActiveLeaderboard(type);
  };

  const renderColumnHeaders = () => {
    if (activeLeaderboard === 'age') {
      return (
        <div className='row mb-3 header-row'>
          <div className='col-3'>
            <span>Position</span>
          </div>
          <div className='col-3'>
            <span>Player</span>
          </div>
          <div className='col-3'>
            <span>Beast</span>
          </div>
          <div className='col-3'>
            <span>Age</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className='row mb-3 header-row'>
          <div className='col-3'>
            <span>Position</span>
          </div>
          <div className='col-3'>
            <span>Player</span>
          </div>
          <div className='col-3'>
            <span>Beast</span>
          </div>
          <div className='col-3'>
            <span>Score</span>
          </div>
        </div>
      );
    }
  };

  const findPlayerBeast = (playerAddress: BigNumberish) => {
    if (!allBeasts || allBeasts.length === 0) return null;
    return allBeasts.find(beast => 
      addAddressPadding(beast.player) === addAddressPadding(playerAddress)
    );
  };

  const renderAgeLeaderboard = () => (
    <div className="leaderboard-table">
      {isLoadedBeasts && top15Beasts.length > 0 ? (
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
          
          {showUserSeparatelyAge && userBeast && (
            <>
              <div className='row mb-3 separator'>
                <div className='col-12'><span>...</span></div>
              </div>
              <div className='row mb-3 current-user'>
                <div className='col-3'>
                  <span>{userPositionAge}</span>
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

  const renderMinigamesLeaderboard = () => (
    <div className="leaderboard-table">
      {isLoadedPlayers && top15Players.length > 0 ? (
        <>
          {top15Players.map((player: Player, index: number) => {
            // Encontrar la bestia de este jugador
            const playerBeast = findPlayerBeast(player.address);
            const beastType = playerBeast?.beast_type || null;
            
            return (
              <div 
                className={`row mb-3 ${isUserRow(player.address) ? 'current-user' : ''}`} 
                key={`minigame-${index}`}
              >
                <div className='col-3'>
                  <span>{index + 1}</span>
                </div>
                <div className='col-3 username-col'>
                  <span>{player.userName}</span>
                </div>
                <div className='col-3'>
                  {beastType && beastsDex[beastType - 1]?.idlePicture ? (
                    <img 
                      src={beastsDex[beastType - 1]?.idlePicture} 
                      className='beast' 
                      alt={playerBeast?.name || `Beast #${playerBeast?.beast_id}`} 
                    />
                  ) : (
                    <span>-</span>
                  )}
                </div>
                <div className='col-3'>
                  <span>{player.total_points}</span>
                </div>
              </div>
            );
          })}
          
          {/* Mostrar al usuario si está fuera del top 15 */}
          {showUserSeparatelyPoints && userPlayer && (
            <>
              <div className='row mb-3 separator'>
                <div className='col-12'><span>...</span></div>
              </div>
              <div className='row mb-3 current-user'>
                <div className='col-3'>
                  <span>{userPositionPoints}</span>
                </div>
                <div className='col-3 username-col'>
                  <span>{userPlayer.userName}</span>
                </div>
                <div className='col-3'>
                  {userBeast?.beast_type && beastsDex[userBeast.beast_type - 1]?.idlePicture ? (
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
                  <span>{userPlayer.total_points}</span>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className='row mb-3'>
          <div className='col-12 text-center'>
            <span>No scores available</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (activeLeaderboard === 'age') {
      if (!isLoadedBeasts) {
        return (
          <Spinner message='Loading beasts leaderboard...' />
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
    } else {
      if (!isLoadedPlayers) {
        return (
          <Spinner message='Loading minigames leaderboard...' />
        );
      }
      
      if (allPlayers.length === 0) {
        return (
          <div className='row mb-3'>
            <div className='col-12 text-center'>
              <span>No scores available</span>
            </div>
          </div>
        );
      }
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
                : 'Best players by total points'}
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
