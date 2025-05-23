import React from 'react';
import Egg from "../../../assets/img/img-egg.gif";
import SpawnButton from './SpawnButton';

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
      <div className="spawn-button-container">
        <SpawnButton 
          loading={loading} 
          onSpawn={onSpawn} 
        />
      </div>
    )}
  </div>
);

export default SpawnBeastContent; 