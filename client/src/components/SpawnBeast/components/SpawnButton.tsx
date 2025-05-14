import React from 'react';
import type { SpawnButtonProps } from '../../../types/components';
import LoadingAnimation from './LoadingAnimation';

export const SpawnButton: React.FC<SpawnButtonProps> = ({ 
  loading, 
  onSpawn,
  disabled = false 
}) => (
  <button
    className="button"
    onClick={onSpawn}
    disabled={disabled || loading}
    aria-busy={loading}
  >
    {loading ? <LoadingAnimation /> : 'Hatch your egg'}
  </button>
);

export default SpawnButton; 