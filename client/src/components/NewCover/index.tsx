import { useEffect, useState } from 'react';
import { DeveloperCode } from "../DeveloperCode/index.tsx";
import { useAccount } from '@starknet-react/core';
import { useNavigate } from 'react-router-dom';
import bbBanner from '../../assets/img/bbbanner.png';
import bbBannerTamagotchi from '../../assets/img/bbbannertamagotchi.png';
import './styles.css';

const gradients = [
  { id: 'raiseGradient', cx: 200, cy: 160, color: '#ff69b4' },
  { id: 'playGradient', cx: 130, cy: 280, color: '#9370db' },
  { id: 'evolveGradient', cx: 270, cy: 280, color: '#87ceeb' }
];

const stars = [
  { cx: 50, cy: 150, r: 3 }, { cx: 70, cy: 180, r: 2 },
  { cx: 350, cy: 180, r: 3 }, { cx: 325, cy: 140, r: 2 }
];

const twinkles = [
  { d: "M60 130 L65 140 L70 130 L65 120 Z", transform: "translate(10)" },
  { d: "M340 130 L345 140 L350 130 L345 120 Z", transform: "translate(-25, 40)" }
];

const circles = [
  { cx: 200, cy: 160, text: 'RAISE', gradient: 'raiseGradient' },
  { cx: 130, cy: 280, text: 'PLAY', gradient: 'playGradient' },
  { cx: 270, cy: 280, text: 'EVOLVE', gradient: 'evolveGradient' }
];

function NewCover() {

  // Redirect to Spawn page if account is connected
  const navigate = useNavigate();
  const { account } = useAccount();
  useEffect(() => {
    if (account) navigate('/spawn');
  }, [account]);


  const [view, setView] = useState('universe');

  const [currentCircle, setCurrentCircle] = useState('play');

  useEffect(() => {
    const sequence = ['play', 'raise', 'evolve'];
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % sequence.length;
      setCurrentCircle(sequence[currentIndex]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setView('game');
      setTimeout(() => {
        setView('cover');
      }, 2000);
    }, 2000);
  }, []);

  if (view == 'universe') {
    return (
      <div className="universe-cover">
        <img src={bbBanner} />
      </div>
    )
  }

  if (view == 'game') {
    return (
      <div className="game-cover">
        <img src={bbBannerTamagotchi} />
      </div>
    )
  }

  if (view == 'cover') {
    return (
      <div className="venn">
        <div className="venn-container">
          <h1 className="venn-title">Beasts Awaits You!</h1>
          <div className="venn-diagram">
            <svg viewBox="0 0 400 400">
              <defs>
                {gradients.map(({ id, cx, cy, color }) => (
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
                {stars.map((star, index) => <circle key={index} className="star" {...star} />)}
                {twinkles.map((twinkle, index) => <path key={index} className="twinkle" {...twinkle} />)}
              </g>
              {circles.map(({ cx, cy, text, gradient }) => (
                <g key={text} className="circle-group">
                  <circle cx={cx} cy={cy} r="100" className="circle-base" />
                  <circle cx={cx} cy={cy} r="100" fill={`url(#${gradient})`}
                    className={`circle-gradient ${currentCircle === text.toLowerCase() ? 'active' : ''}`}
                    filter="url(#glow)" />
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
  }
}

export default NewCover;
