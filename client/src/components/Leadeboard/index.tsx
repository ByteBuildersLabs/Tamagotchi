import './main.css';
import hearth from '../../assets/img/hearth.svg';
import skull from '../../assets/img/skull.svg';
import Header from '../Header/index.tsx';
import Spinner from '../ui/spinner.tsx';
import beastsDex from '../../data/beastDex.tsx';
import { useEffect, useState } from 'react';
import { addAddressPadding, BigNumberish } from "starknet";
import { useAccount } from "@starknet-react/core";
import { useBeasts } from '../../hooks/useBeasts.tsx';
import { useHighScores } from '../../hooks/useHighScore.tsx';
import { usePlayerData } from '../../hooks/usePlayersData.tsx';

interface Beast {
  userName: string;
  beast_type: number;
  age: number;
  name: string;
  player: string;
  beast_id: string;
  birth_date: string;
  specie: string;
  is_alive: boolean;
}

interface Player {
  address: string;
  total_points: number;
  userName: string;
}

interface Score {
  player: string;
  score: number;
  minigame_id: number;
}

type LeaderboardType = 'age' | 'minigames';

const Leaderboard = () => {
  const [allBeasts, setAllBeasts] = useState<Beast[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [isLoadedBeasts, setIsLoadedBeasts] = useState(false);
  const [isLoadedPlayers, setIsLoadedPlayers] = useState(false);
  const [userPositionAge, setUserPositionAge] = useState<number | null>(null);
  const [userBeast, setUserBeast] = useState<Beast | null>(null);
  const [activeLeaderboard, setActiveLeaderboard] = useState<LeaderboardType>('age');
  
  // Get the logged-in user's account
  const { account } = useAccount();
  const userAddress = account ? addAddressPadding(account.address) : '';
  
  // Get beast and player data
  const { beastsData } = useBeasts();
  const { playerData } = usePlayerData();
  const { scores } = useHighScores();
  
  let beasts = beastsData as Beast[];
  let players = playerData as Player[];

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) bodyElement.classList.remove('day');
    if (bodyElement) bodyElement.classList.remove('night');
    if (bodyElement) bodyElement.classList.remove('sunrise');
    if (bodyElement) bodyElement.classList.remove('sunset');
  }, []);

  // Add carousel initialization
  useEffect(() => {
    if (activeLeaderboard === 'minigames') {
      const carousel = document.getElementById('carouselMinigames');
      if (carousel) {
        const bsCarousel = new (window as any).bootstrap.Carousel(carousel, {
          interval: 5000, // 5 segundos
          touch: true,
          wrap: true,
          keyboard: true,
          pause: 'hover' // Pausa el auto-slide cuando el mouse está encima
        });

        // Add event listeners for the navigation buttons
        const prevButton = document.querySelector('.carousel-control-prev');
        const nextButton = document.querySelector('.carousel-control-next');

        if (prevButton) {
          prevButton.addEventListener('click', () => {
            bsCarousel.prev();
          });
        }

        if (nextButton) {
          nextButton.addEventListener('click', () => {
            bsCarousel.next();
          });
        }

        // Cleanup function
        return () => {
          if (prevButton) {
            prevButton.removeEventListener('click', () => bsCarousel.prev());
          }
          if (nextButton) {
            nextButton.removeEventListener('click', () => bsCarousel.next());
          }
          bsCarousel.dispose();
        };
      }
    }
  }, [activeLeaderboard]);

  // Effect to process beast data
  useEffect(() => {
    if (beasts && beasts.length > 0) {
      const sortedBeasts = [...beasts].sort((a, b) => {
        const ageDiff = (b?.age || 0) - (a?.age || 0);
        if (ageDiff !== 0) {
          return ageDiff;
        }
        const birthDateA = parseInt(a?.birth_date, 16);
        const birthDateB = parseInt(b?.birth_date, 16);
        return birthDateA - birthDateB;
      });
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
      
      setAllPlayers(sortedPlayers);
      setIsLoadedPlayers(true);
    }
  }, [players, userAddress]);

  // Determine which beasts/players to display (top 15 + user if outside the top 15)
  const top15Beasts = allBeasts.slice(0, 15);
  
  const showUserSeparatelyAge = userPositionAge !== null && userPositionAge > 15;

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
      <h3 className="table-title">Age Leaderboard</h3>
      {isLoadedBeasts && top15Beasts.length > 0 ? (
        <>
          {renderColumnHeaders()}
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
                <span className="age-container">
                  {beast.age}
                  <span className="death-indicator" title="Beast is deceased">
                    <img src={beast.is_alive ? hearth : skull} alt="" />
                  </span>
                </span>
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
                  <span className="age-container">
                    {userBeast.age}
                    {!userBeast.is_alive && (
                      <span className="death-indicator" title="Beast is deceased">💀</span>
                    )}
                  </span>
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
        {activeLeaderboard === 'age' ? renderAgeLeaderboard() : renderMinigamesLeaderboard()}
      </>
    );
  };

  const renderMinigamesLeaderboard = () => {
    // Separar los scores por minijuego
    const skyJumpScores = scores.filter((score: Score) => score.minigame_id === 1)
      .sort((a: Score, b: Score) => b.score - a.score)
      .slice(0, 15);

    const flappyBirdScores = scores.filter((score: Score) => score.minigame_id === 2)
      .sort((a: Score, b: Score) => b.score - a.score)
      .slice(0, 15);

    const renderScoreTable = (scores: Score[], title: string) => (
      <div className="minigame-table w-100">
        <h3 className="minigame-title">{title}</h3>
        <div className="leaderboard-table w-100">
          {scores.length > 0 ? (
            <>
              <div className='row mb-3 header-row w-100'>
                <div className='col-4 text-center px-4'>
                  <span>Position</span>
                </div>
                <div className='col-4 text-center px-4'>
                  <span>Player</span>
                </div>
                <div className='col-4 text-center px-4'>
                  <span>Score</span>
                </div>
              </div>
              {scores.map((scoreData: Score, index: number) => {
                const playerBeast = findPlayerBeast(scoreData.player);
                
                return (
                  <div 
                    className={`row mb-3 w-100 ${isUserRow(scoreData.player) ? 'current-user' : ''}`} 
                    key={`minigame-${scoreData.minigame_id}-${index}`}
                  >
                    <div className='col-4 text-center px-4'>
                      <span>{index + 1}</span>
                    </div>
                    <div className='col-4 text-center px-4 username-col'>
                      <span>{playerBeast?.userName || scoreData.player.slice(0, 8)}</span>
                    </div>
                    <div className='col-4 text-center px-4'>
                      <span>{scoreData.score}</span>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className='row mb-3'>
              <div className='col-12 text-center'>
                <span>No scores available for {title}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );

    const renderTotalPointsTable = () => {
      const top15Players = allPlayers
        .sort((a, b) => (b?.total_points || 0) - (a?.total_points || 0))
        .slice(0, 15);

      return (
        <div className="minigame-table w-100">
          <h3 className="minigame-title">Total Points Ranking</h3>
          <div className="leaderboard-table w-100">
            {isLoadedPlayers && top15Players.length > 0 ? (
              <>
                <div className='row mb-3 header-row w-100'>
                  <div className='col-4 text-center px-4'>
                    <span>Position</span>
                  </div>
                  <div className='col-4 text-center px-4'>
                    <span>Player</span>
                  </div>
                  <div className='col-4 text-center px-4'>
                    <span>Points</span>
                  </div>
                </div>
                {top15Players.map((player, index) => (
                  <div 
                    className={`row mb-3 w-100 ${isUserRow(player.address) ? 'current-user' : ''}`} 
                    key={`total-points-${index}`}
                  >
                    <div className='col-4 text-center px-4'>
                      <span>{index + 1}</span>
                    </div>
                    <div className='col-4 text-center px-4 username-col'>
                      <span>{player.userName || player.address.slice(0, 8)}</span>
                    </div>
                    <div className='col-4 text-center px-4'>
                      <span>{player.total_points}</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className='row mb-3'>
                <div className='col-12 text-center'>
                  <span>No players available</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="minigames-container">
        <div 
          id="carouselMinigames" 
          className="carousel slide" 
          data-bs-ride="carousel"
          data-bs-interval="5000"
          data-bs-pause="hover"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              {renderTotalPointsTable()}
            </div>
            <div className="carousel-item">
              {renderScoreTable(skyJumpScores, "Sky Jump")}
            </div>
            <div className="carousel-item">
              {renderScoreTable(flappyBirdScores, "Flappy Beasts")}
            </div>
          </div>
          <button 
            className="carousel-control-prev" 
            type="button" 
            data-bs-target="#carouselMinigames" 
            data-bs-slide="prev"
            aria-label="Previous"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true">
            </span>
          </button>
          <button 
            className="carousel-control-next" 
            type="button" 
            data-bs-target="#carouselMinigames" 
            data-bs-slide="next"
            aria-label="Next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true">
            </span>
          </button>
        </div>
      </div>
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
