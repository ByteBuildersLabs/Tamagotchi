// React and external libraries
import { useState, useEffect } from "react";

// Data
import { hints } from "../../data/hints";

// Types
import { HintsProps } from '../../types/components';

// Constants
const HINT_INTERVAL = 5000;
const FADE_DELAY = 1000;

// Main Component
const Hints: React.FC<HintsProps> = ({ className = '' }) => {
  // State
  const [currentHint, setCurrentHint] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(false);

  // Effects
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentHint((prevHint) => (prevHint + 1) % hints.length);
        setFade(true);
      }, FADE_DELAY);
    }, HINT_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFade(true);
  }, [currentHint]);

  // Render
  return (
    <p className={`info hint ${fade ? "fade-in" : ""} ${className}`}>
      {hints[currentHint]}
    </p>
  );
};

export default Hints;
