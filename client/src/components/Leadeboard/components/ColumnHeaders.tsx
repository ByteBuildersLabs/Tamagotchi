import React from 'react';
import type { LeaderboardType } from '../../../types/components';

interface ColumnHeadersProps {
  type: LeaderboardType;
}

export const ColumnHeaders: React.FC<ColumnHeadersProps> = ({ type }) => (
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

export default ColumnHeaders; 