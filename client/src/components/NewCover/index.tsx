// React and external libraries
import { useEffect, useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { useNavigate } from 'react-router-dom';

// Internal components
import { DeveloperCode } from "../DeveloperCode/index.tsx";

// Assets
import bbBanner from '../../assets/img/img-banner.png';
import bbBannerTamagotchi from '../../assets/img/img-banner-tamagotchi.png';

// Styles
import './main.css';

// Types
type View = 'universe' | 'game' | 'cover';
type CircleType = 'play' | 'raise' | 'evolve';

interface Gradient {
  id: string;
  cx: number;
  cy: number;
  color: string;
}

interface Star {
  cx: number;
  cy: number;
  r: number;
}

interface Twinkle {
  d: string;
  transform: string;
}

interface Circle {
  cx: number;
  cy: number;
  text: string;
  gradient: string;
}

// Constants
const GRADIENTS: Gradient[] = [
  { id: 'raiseGradient', cx: 200, cy: 160, color: '#ff69b4' },
  { id: 'playGradient', cx: 130, cy: 280, color: '#9370db' },
  { id: 'evolveGradient', cx: 270, cy: 280, color: '#87ceeb' }
];

const STARS: Star[] = [
  { cx: 50, cy: 150, r: 3 }, { cx: 70, cy: 180, r: 2 },
  { cx: 350, cy: 180, r: 3 }, { cx: 325, cy: 140, r: 2 }
];

const TWINKLES: Twinkle[] = [
  { d: "M60 130 L65 140 L70 130 L65 120 Z", transform: "translate(10)" },
  { d: "M340 130 L345 140 L350 130 L345 120 Z", transform: "translate(-25, 40)" }
];

const CIRCLES: Circle[] = [
  { cx: 200, cy: 160, text: 'RAISE', gradient: 'raiseGradient' },
  { cx: 130, cy: 280, text: 'PLAY', gradient: 'playGradient' },
  { cx: 270, cy: 280, text: 'EVOLVE', gradient: 'evolveGradient' }
];

// Components
const UniverseView = () => (
  <div className="universe-cover">
    <img src={bbBanner} alt="Universe Banner" />
  </div>
);

const GameView = () => (
  <div className="game-cover">
    <img src={bbBannerTamagotchi} alt="Game Banner" />
  </div>
);

const VennDiagram = ({ currentCircle }: { currentCircle: CircleType }) => (
  <div className="venn">
    <div className="venn-container">
      <h1 className="venn-title">Beasts Awaits You!</h1>
      <div className="venn-diagram">
        <svg viewBox="0 0 400 400">
          <defs>
            {GRADIENTS.map(({ id, cx, cy, color }) => (
              <radialGradient key={id} id={id} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r="100" fx={cx} fy={cy}>
                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <stop offset="60%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </radialGradient>
            ))}
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g className="stars">
            {STARS.map((star, index) => <circle key={index} className="star" {...star} />)}
            {TWINKLES.map((twinkle, index) => <path key={index} className="twinkle" {...twinkle} />)}
          </g>
          {CIRCLES.map(({ cx, cy, text, gradient }) => (
            <g key={text} className="circle-group">
              <circle cx={cx} cy={cy} r="100" className="circle-base" />
              <circle 
                cx={cx} 
                cy={cy} 
                r="100" 
                fill={`url(#${gradient})`}
                className={`circle-gradient ${currentCircle === text.toLowerCase() ? 'active' : ''}`}
                filter="url(#glow)" 
              />
              <text x={cx} y={cy} className="circle-text">{text}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className='mt-4 px-3 w-100'>
        <DeveloperCode />
      </div>
    </div>
  </div>
);

// Main Component
function NewCover() {
  const navigate = useNavigate();
  const { account } = useAccount();
  const [view, setView] = useState<View>('universe');
  const [currentCircle, setCurrentCircle] = useState<CircleType>('play');

  // Redirect to Spawn page if account is connected
  useEffect(() => {
    if (account) navigate('/spawn');
  }, [account, navigate]);

  // Handle circle animation
  useEffect(() => {
    const sequence: CircleType[] = ['play', 'raise', 'evolve'];
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % sequence.length;
      setCurrentCircle(sequence[currentIndex]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle view transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      setView('game');
      setTimeout(() => {
        setView('cover');
      }, 2000);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Render different views
  switch (view) {
    case 'universe':
      return <UniverseView />;
    case 'game':
      return <GameView />;
    case 'cover':
      return <VennDiagram currentCircle={currentCircle} />;
    default:
      return null;
  }
}

export default NewCover;
