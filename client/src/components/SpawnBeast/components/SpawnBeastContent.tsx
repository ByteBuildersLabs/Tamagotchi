import React from 'react';
import Egg from "../../../assets/img/img-egg.gif";
import Hints from "../../Hints/index.tsx";
import SpawnButton from './SpawnButton';
import BeastInfo from './BeastInfo';

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
    <BeastInfo />
    {hasAccount && (
      <SpawnButton 
        loading={loading} 
        onSpawn={onSpawn} 
      />
    )}
    <Hints />
  </div>
);

export default SpawnBeastContent; 