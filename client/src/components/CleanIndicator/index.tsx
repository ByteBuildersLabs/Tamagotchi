import React from 'react';
import poopIcon from '../../assets/img/poop.svg';
import './main.css';

interface CleanlinessIndicatorProps {cleanlinessLevel: number;}

/**
 * Component that shows a cleanliness indicator based on the current level
 * 
 * Ranges (based on update_clean_status):
 * - 0-10: Filthy (5 emojis)
 * - 10-30: SuperDirty (4 emojis)
 * - 30-50: VeryDirty (3 emojis)
 * - 50-70: Dirty (2 emojis)
 * - 70-90: SlightlyDirty (1 emoji)
 * - 90-100: Clean (no emojis)
 */

// Constants for cleanliness levels
const CLEANLINESS_LEVELS = {
  FILTHY: { min: 0, max: 10, poopCount: 5 },
  SUPER_DIRTY: { min: 10, max: 30, poopCount: 4 },
  VERY_DIRTY: { min: 30, max: 50, poopCount: 3 },
  DIRTY: { min: 50, max: 70, poopCount: 2 },
  SLIGHTLY_DIRTY: { min: 70, max: 90, poopCount: 1 },
  CLEAN: { min: 90, max: 100, poopCount: 0 }
};

// Constants for icon sizes based on the count
const POOP_SIZES = {
  1: [70],                     // SlightlyDirty
  2: [70, 70],                 // Dirty
  3: [80, 70, 60],             // VeryDirty
  4: [100, 90, 80, 70],        // SuperDirty
  5: [100, 90, 80, 70, 60]     // Filthy
};

// Scale factor for when there are many icons
const SCALE_FACTOR_MANY_POOPS = 0.7;
const SCALE_FACTOR_NORMAL = 1;

const CleanlinessIndicator: React.FC<CleanlinessIndicatorProps> = ({ cleanlinessLevel }) => {
  // Ensure the cleanliness level is between 0 and 100
  const normalizedLevel = Math.max(0, Math.min(100, cleanlinessLevel));

  let poopCount = 0;

  if (normalizedLevel < CLEANLINESS_LEVELS.FILTHY.max) {
    poopCount = CLEANLINESS_LEVELS.FILTHY.poopCount;

  } else if (normalizedLevel < CLEANLINESS_LEVELS.SUPER_DIRTY.max) {
    poopCount = CLEANLINESS_LEVELS.SUPER_DIRTY.poopCount;

  } else if (normalizedLevel < CLEANLINESS_LEVELS.VERY_DIRTY.max) {
    poopCount = CLEANLINESS_LEVELS.VERY_DIRTY.poopCount;

  } else if (normalizedLevel < CLEANLINESS_LEVELS.DIRTY.max) {
    poopCount = CLEANLINESS_LEVELS.DIRTY.poopCount;

  } else if (normalizedLevel < CLEANLINESS_LEVELS.SLIGHTLY_DIRTY.max) {
    poopCount = CLEANLINESS_LEVELS.SLIGHTLY_DIRTY.poopCount;
  }

  if (poopCount === 0) return null;

  // Define the sizes for each poop icon based on its index and total number of poops
  const getSizeForIndex = (index: number, totalPoops: number): number => {
    // Reduce the base size when there are many poops to prevent overflow
    const scaleFactor = totalPoops >= 4 ? SCALE_FACTOR_MANY_POOPS : SCALE_FACTOR_NORMAL;

    // Use the predefined size constants
    if (POOP_SIZES[totalPoops as keyof typeof POOP_SIZES]) {
      const sizes = POOP_SIZES[totalPoops as keyof typeof POOP_SIZES];
      return (sizes[index] || sizes[0]) * scaleFactor;
    }

    return 80 * scaleFactor; // Default size if something goes wrong
  };

  return (
    <div className="poop-indicator">
      {[...Array(poopCount)].map((_, index) => (
        <div
          key={index}
          className={`poop-emoji poop-emoji-${index}`}
          style={{
            width: `${getSizeForIndex(index, poopCount)}px`,
            height: `${getSizeForIndex(index, poopCount)}px`,
            margin: poopCount >= 4 ? '0 -5px' : '0' // Slight overlap when there are many poops
          }}
        >
          <img src={poopIcon} alt="poop icon" />
        </div>
      ))}
    </div>
  );
};

export default CleanlinessIndicator;
