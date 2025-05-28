import React from 'react';
import type { SpawnButtonProps } from '../../../types/components';

export const SpawnButton: React.FC<SpawnButtonProps> = ({
  loading,
  onSpawn,
  disabled = false
}) => (
  <>
    <button
      className="button"
      onClick={onSpawn}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      Hatch your egg
    </button>
  </>
);

export default SpawnButton; 