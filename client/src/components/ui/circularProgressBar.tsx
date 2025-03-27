import React, { useState } from 'react';
import useSound from 'use-sound';
import buttonClick from '../../assets/sounds/click.mp3';

interface CircularProgressBarProps {
  size?: number;
  strokeWidth?: number;
  progress: number;
  color?: string;
  pic?: string;
  name?: string;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  size = 68,
  strokeWidth = 7,
  progress,
  color = '#0000004d',
  pic,
  name
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const [buttonSound] = useSound(buttonClick, { volume: 0.7, preload: true });
  const [statusInfo, setStatusInfo] = useState(false);

  const showStatus = () => {
    buttonSound();
    setStatusInfo(true);
    setTimeout(() => {
      setStatusInfo(false);
    }, 5000);
  }

  return (
    <div className="flex items-center justify-center circle-container" onClick={() => {showStatus()}}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          stroke="#0000004d"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: 'stroke-dashoffset 0.35s' }}
        />
      </svg>
      <span className={`pic ${ progress == 100 ? 'full-stat' : progress <= 30 ? 'bad-stat ' : '' }`}>
        {
          statusInfo ? 
          <span className='progress-number'>
            {progress} 
          </span> :
          <img className='status-icon' src={pic} />
        }
      </span>
      {
        statusInfo && 
        <div className='status-name'>
          <span>{name}</span>
        </div>
      }
    </div>
  );
};

export default CircularProgressBar;
