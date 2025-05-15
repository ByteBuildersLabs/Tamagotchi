import React from 'react';
import type { Score, Beast } from '../../../types/components';

interface ScoreRowProps {
  score: Score;
  index: number;
  isUserRow: boolean;
  playerBeast: Beast | null;
}

export const ScoreRow: React.FC<ScoreRowProps> = ({ 
  score, 
  index, 
  isUserRow, 
  playerBeast 
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

export default ScoreRow; 