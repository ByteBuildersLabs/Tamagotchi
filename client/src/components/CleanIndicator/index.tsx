import React from 'react';
import poopIcon from '../../assets/poop.svg';
import './main.css'; 

interface CleanlinessIndicatorProps {cleanlinessLevel: number;}
/**
 * Component that shows a cleanliness indicator based on the current level
 * 
 * Ranges:
 * - 0-20: Extremely dirty (4 emojis)
 * - 21-40: Very dirty (3 emojis)
 * - 41-60: Dirty (2 emoji)
 * - 61-80: Some dirty (1 emojis)
 * - 81-100: Clean (no emojis)
 */
const CleanlinessIndicator: React.FC<CleanlinessIndicatorProps> = ({ cleanlinessLevel }) => {
    const normalizedLevel = Math.max(0, Math.min(100, cleanlinessLevel));
    const poopCount = Math.max(0, 5 - Math.ceil(normalizedLevel / 20));
    
    if (poopCount === 0) return null;
    
    return (
        <div className="poop-indicator">
            {[...Array(poopCount)].map((_, index) => (
                <div key={index} className="poop-emoji">
                    <img src={poopIcon} alt="poop icon" />
                </div>
            ))}
        </div>
    );
};

export default CleanlinessIndicator;
