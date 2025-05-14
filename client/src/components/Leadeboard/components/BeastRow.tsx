import React from 'react';
import type { Beast } from '../../../types/components';
import beastsDex from '../../../data/beastDex.tsx';
import hearth from '../../../assets/img/icon-heart.svg';
import skull from '../../../assets/img/icon-skull.svg';

interface BeastRowProps {
  beast: Beast;
  index: number;
  isUserRow: boolean;
}

export const BeastRow: React.FC<BeastRowProps> = ({ 
  beast, 
  index, 
  isUserRow 
}) => (
  <div className={`row mb-3 ${isUserRow ? 'current-user' : ''}`} key={`top-${index}`}>
    <div className='col-3'>
      <span>{index + 1}</span>
    </div>
    <div className='col-3 username-col'>
      <span>{beast.userName}</span>
    </div>
    <div className='col-3'>
      {beast.beast_type && beastsDex[Number(beast.beast_type) - 1]?.idlePicture ? (
        <img 
          src={beastsDex[Number(beast.beast_type) - 1]?.idlePicture} 
          className='beast' 
          alt={beast.name || `Beast #${beast.id}`} 
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

export default BeastRow; 