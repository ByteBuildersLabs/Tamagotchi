// React and external libraries
import { useEffect, useState } from 'react';
import { useAccount } from "@starknet-react/core";
import { addAddressPadding, BigNumberish } from "starknet";

// Internal components
import Header from '../Header/index.tsx';
import Spinner from '../ui/spinner.tsx';

// Hooks and Contexts
import { useBeasts } from '../../hooks/useBeasts.tsx';
import { useHighScores } from '../../hooks/useHighScore.tsx';
import { usePlayerData } from '../../hooks/usePlayersData.tsx';

// Types
import { Beast, Player, Score, LeaderboardType } from '../../types/components';

// Data
import beastsDex from '../../data/beastDex.tsx';

// Assets
import hearth from '../../assets/img/icon-heart.svg';
import skull from '../../assets/img/icon-skull.svg';

// Styles
import './main.css';

// Constants
const TOP_PLAYERS_COUNT = 15;
const CAROUSEL_INTERVAL = 5000;

// Components
const ColumnHeaders = ({ type }: { type: LeaderboardType }) => (
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
      <span>{type === 'age' ? 'Age' : 'Score'}</span>
    </div>
  </div>
);

const BeastRow = ({ 
  beast, 
  index, 
  isUserRow 
}: { 
  beast: Beast; 
  index: number; 
  isUserRow: boolean;
}) => (
  <div className={`row mb-3 ${isUserRow ? 'current-user' : ''}`} key={`top-${index}`}>
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
);

const ScoreRow = ({ 
  score, 
  index, 
  isUserRow, 
  playerBeast 
}: { 
  score: Score; 
  index: number; 
  isUserRow: boolean;
  playerBeast: Beast | null;
}) => (
  <div 
    className={`row mb-3 w-100 ${isUserRow ? 'current-user' : ''}`} 
    key={`minigame-${score.minigame_id}-${index}`}
  >
    <div className='col-4 text-center px-4'>
      <span>{index + 1}</span>
    </div>
    <div className='col-4 text-center px-4 username-col'>
      <span>{playerBeast?.userName || score.player.slice(0, 8)}</span>
    </div>
    <div className='col-4 text-center px-4'>
      <span>{score.score}</span>
    </div>
  </div>
);

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
    if (activeLeaderboard === 'minigames') {
      const carousel = document.getElementById('carouselMinigames');
      if (carousel) {
        const bsCarousel = new (window as any).bootstrap.Carousel(carousel, {
          interval: CAROUSEL_INTERVAL,
          touch: true,
          wrap: true,
          keyboard: true,
          pause: 'hover'
        });

        const prevButton = document.querySelector('.carousel-control-prev');
        const nextButton = document.querySelector('.carousel-control-next');

        const handlePrev = () => bsCarousel.prev();
        const handleNext = () => bsCarousel.next();

        prevButton?.addEventListener('click', handlePrev);
        nextButton?.addEventListener('click', handleNext);

        return () => {
          prevButton?.removeEventListener('click', handlePrev);
          nextButton?.removeEventListener('click', handleNext);
          bsCarousel.dispose();
        };
      }
    }
  }, [activeLeaderboard]);

  useEffect(() => {
    if (beastsData && beastsData.length > 0) {
      const sortedBeasts = [...beastsData].map(beast => ({
        ...beast,
        userName: beast.userName || '',
        name: beast.name || undefined
      })).sort((a, b) => {
        const ageDiff = (b?.age || 0) - (a?.age || 0);
        if (ageDiff !== 0) return ageDiff;
        return parseInt(a?.birth_date, 16) - parseInt(b?.birth_date, 16);
      });

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
      const sortedPlayers = [...playerData].map(player => ({
        ...player,
        userName: player.userName || undefined
      })).sort((a, b) => 
        (b?.total_points || 0) - (a?.total_points || 0)
      );
      setAllPlayers(sortedPlayers);
      setIsLoadedPlayers(true);
    }
  }, [playerData]);

  // Utility Functions
  const isUserRow = (address: string) => 
    userAddress ? addAddressPadding(address) === userAddress : false;

  const findPlayerBeast = (playerAddress: BigNumberish): Beast | null => {
    const beast = allBeasts.find(beast => 
      addAddressPadding(beast.player) === addAddressPadding(playerAddress)
    );
    return beast || null;
  };

  // Render Functions
  const renderAgeLeaderboard = () => {
    const top15Beasts = allBeasts.slice(0, TOP_PLAYERS_COUNT);
    const showUserSeparatelyAge = userPositionAge !== null && userPositionAge > TOP_PLAYERS_COUNT;

    return (
      <div className="leaderboard-table">
        <h3 className="table-title">Age Leaderboard</h3>
        {isLoadedBeasts && top15Beasts.length > 0 ? (
          <>
            <ColumnHeaders type="age" />
            {top15Beasts.map((beast, index) => (
              <BeastRow 
                key={`beast-${index}`}
                beast={beast}
                index={index}
                isUserRow={isUserRow(beast.player)}
              />
            ))}
            
            {showUserSeparatelyAge && userBeast && (
              <>
                <div className='row mb-3 separator'>
                  <div className='col-12'><span>...</span></div>
                </div>
                <BeastRow 
                  beast={userBeast}
                  index={userPositionAge - 1}
                  isUserRow={true}
                />
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
  };

  const renderMinigamesLeaderboard = () => {
    const skyJumpScores = scores
      .filter((score: Score) => score.minigame_id === 1)
      .sort((a: Score, b: Score) => b.score - a.score)
      .slice(0, TOP_PLAYERS_COUNT);

    const flappyBirdScores = scores
      .filter((score: Score) => score.minigame_id === 2)
      .sort((a: Score, b: Score) => b.score - a.score)
      .slice(0, TOP_PLAYERS_COUNT);

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
              {scores.map((score, index) => (
                <ScoreRow 
                  key={`score-${index}`}
                  score={score}
                  index={index}
                  isUserRow={isUserRow(score.player)}
                  playerBeast={findPlayerBeast(score.player)}
                />
              ))}
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
        .slice(0, TOP_PLAYERS_COUNT);

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
          data-bs-interval={CAROUSEL_INTERVAL}
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
            <span className="carousel-control-prev-icon" aria-hidden="true" />
          </button>
          <button 
            className="carousel-control-next" 
            type="button" 
            data-bs-target="#carouselMinigames" 
            data-bs-slide="next"
            aria-label="Next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (activeLeaderboard === 'age') {
      if (!isLoadedBeasts) {
        return <Spinner message='Loading beasts leaderboard...' />;
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
        return <Spinner message='Loading minigames leaderboard...' />;
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
    
    return activeLeaderboard === 'age' 
      ? renderAgeLeaderboard() 
      : renderMinigamesLeaderboard();
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
