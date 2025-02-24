import React from 'react';

interface CircularProgressBarProps {
  size?: number;
  strokeWidth?: number;
  progress: number;
  color?: string;
  pic?: string;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  size = 68,
  strokeWidth = 7,
  progress,
  color = '#891a29',
  pic
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center justify-center circle-container">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          stroke="#e5e7eb"
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
      <span className="pic"><img src={pic} /></span>
    </div>
  );
};

export default CircularProgressBar;
