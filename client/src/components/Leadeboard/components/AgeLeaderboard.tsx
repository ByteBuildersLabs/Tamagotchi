import React from 'react';
import type { Beast } from '../../../types/components';
import ColumnHeaders from './ColumnHeaders';
import BeastRow from './BeastRow';

interface AgeLeaderboardProps {
  beasts: Beast[];
  isLoaded: boolean;
  userPosition: number | null;
  userBeast: Beast | null;
  isUserRow: (address: string) => boolean;
}

export const AgeLeaderboard: React.FC<AgeLeaderboardProps> = ({
  beasts,
  isLoaded,
  userPosition,
  userBeast,
  isUserRow
}) => {
  const top15Beasts = beasts.slice(0, 15);
  const showUserSeparately = userPosition !== null && userPosition > 15;

  if (!isLoaded) {
    return (
      <div className='row mb-3'>
        <div className='col-12 text-center'>
          <span>Loading beasts leaderboard...</span>
        </div>
      </div>
    );
  }

  if (beasts.length === 0) {
    return (
      <div className='row mb-3'>
        <div className='col-12 text-center'>
          <span>No beasts available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-table">
      <h3 className="table-title">Age Leaderboard</h3>
      <ColumnHeaders type="age" />
      {top15Beasts.map((beast, index) => (
        <BeastRow 
          key={`beast-${index}`}
          beast={beast}
          index={index}
          isUserRow={isUserRow(beast.player)}
        />
      ))}
      
      {showUserSeparately && userBeast && (
        <>
          <div className='row mb-3 separator'>
            <div className='col-12'><span>...</span></div>
          </div>
          <BeastRow 
            beast={userBeast}
            index={userPosition - 1}
            isUserRow={true}
          />
        </>
      )}
    </div>
  );
};

export default AgeLeaderboard; 