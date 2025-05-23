import React from 'react';

interface ProgressBarProps {
    progress: number; // 0 to 100
    statusMessage: string;
    className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, statusMessage, className = '' }) => {
    return (
        <div className={`${className}`}>

            <div className="progress mb-2" style={{ height: '24px' }}>
                <div
                    className="progress-bar bg-danger"
                    role="progressbar"
                    style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(to right, var(--primary-red-gradient-start), var(--primary-red-gradient-end))'
                    }}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                ></div>
            </div>
            <p>{statusMessage}</p>
        </div>
    );
};

export default ProgressBar; 