import React, { useEffect } from 'react';
import type { Score, Beast, Player } from '../../../types/components';
import ScoreRow from './ScoreRow';

interface MinigamesLeaderboardProps {
  scores: Score[];
  players: Player[];
  isLoaded: boolean;
  isUserRow: (address: string) => boolean;
  findPlayerBeast: (playerAddress: string) => Beast | null;
}

export const MinigamesLeaderboard: React.FC<MinigamesLeaderboardProps> = ({
  scores,
  players,
  isLoaded,
  isUserRow,
  findPlayerBeast
}) => {
  useEffect(() => {
    const carousel = document.getElementById('carouselMinigames');
    if (carousel) {
      const bsCarousel = new (window as any).bootstrap.Carousel(carousel, {
        interval: 5000,
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
  }, []);

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
    const top15Players = players
      .sort((a, b) => (b?.total_points || 0) - (a?.total_points || 0))
      .slice(0, 15);

    return (
      <div className="minigame-table w-100">
        <h3 className="minigame-title">Total Points Ranking</h3>
        <div className="leaderboard-table w-100">
          {isLoaded && top15Players.length > 0 ? (
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

  const skyJumpScores = scores
    .filter(score => score.minigame_id === 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  const flappyBirdScores = scores
    .filter(score => score.minigame_id === 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  return (
    <div className="minigames-container">
      <div 
        id="carouselMinigames" 
        className="carousel slide" 
        data-bs-ride="carousel"
        data-bs-interval={5000}
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

export default MinigamesLeaderboard; 