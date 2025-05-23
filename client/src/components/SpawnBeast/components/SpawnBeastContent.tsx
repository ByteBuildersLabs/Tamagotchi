import React from 'react';
import Egg from "../../../assets/img/img-egg.gif";
import SpawnButton from './SpawnButton';
import BeastInfo from './BeastInfo';
import ProgressBar from '../../ProgressBar/ProgressBar.tsx';

interface SpawnBeastContentProps {
  loading: boolean;
  onSpawn: () => Promise<void>;
  hasAccount: boolean;
}

export const SpawnBeastContent: React.FC<SpawnBeastContentProps> = ({ 
  loading, 
  onSpawn, 
  hasAccount 
}) => (
  <div className="initial-beast">
    <img src={Egg} className="egg" alt="beast egg" />
    {hasAccount && (
      <SpawnButton 
        loading={loading} 
        onSpawn={onSpawn} 
      />
    )}
    <ProgressBar progress={0} statusMessage={'Hola como estan'} className='spawn-progress-bar' />
  </div>
);

export default SpawnBeastContent; 