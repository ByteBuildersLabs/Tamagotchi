import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dragon from '/src/assets/img/logo.jpeg';
import './MiniGamesModal.css';

export interface Game {
    id: string;
    title: string;
    image: string;
    isActive: boolean;
    route: string;
}

export const games: Game[] = [
    {
        id: 'dragon-eggs',
        title: 'Memory Challenge',
        image: '/src/assets/img/scenario-light.jpeg',
        isActive: true,
        route: '/games/dragon-eggs'
    },
    {
        id: 'dark-forest',
        title: 'Dark Forest',
        image: '/path/to/dark-forest-image.jpg',
        isActive: false,
        route: '/games/dark-forest'
    },
    {
        id: 'fire-caves',
        title: 'Fire Caves',
        image: '/path/to/fire-caves-image.jpg',
        isActive: false,
        route: '/games/fire-caves'
    },
    {
        id: 'magic-portal',
        title: 'Magic Portal',
        image: '/path/to/magic-portal-image.jpg',
        isActive: false,
        route: '/games/magic-portal'
    }
];

const MiniGamesModal: React.FC = () => {
    const navigate = useNavigate();
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setTimeout(() => {
            navigate('/');
            setIsClosing(true);
        }, 300);
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className={`modal-overlay ${isClosing ? 'closing' : ''}`}>
            <div className={`modal-container ${isClosing ? 'closing' : ''}`}>
                <div className="modal-header">
                    <h2 className="modal-title">Choose Your Adventure</h2>
                    <button onClick={handleClose} className="modal-close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="games-grid">
                   {
                    games.map((game) => (
                        <GameCard
                            title={game.title}
                            image={game.image}
                            isActive={game.isActive}
                            onClick={() => navigate(game.route)}
                        />
                    ))
                   }
                </div>
            </div>
        </div>
    );
};

export default MiniGamesModal;

export interface GameCardProps {
    title: string;
    image: string;
    isActive: boolean;
    onClick?: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, image, isActive, onClick }) => {
    return (
        <div 
            className={`game-card ${isActive ? 'active' : 'locked'}`}
            onClick={isActive ? onClick : undefined}
        >
            <img src={!isActive ? dragon : image} alt={title} className="game-image" />
            <div className="game-info">
                {isActive && <h3 className="game-title">{title}</h3>}
                {isActive ? (
                    <button className="play-button">Click to Play</button>
                ) : (
                    <div className="coming-soon">
                        <svg className="lock-icon" viewBox="0 0 24 24">
                            <path d="M12 17a2 2 0 100-4 2 2 0 000 4z" />
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H8.9V6z" />
                        </svg>
                        <span>Coming Soon</span>
                    </div>
                )}
            </div>
        </div>
    );
};
