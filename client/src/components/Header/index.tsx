import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Music from "../Music";
import monster from "../../assets/img/logo.svg";
import trophy from "../../assets/img/trophy.svg";
import menuIcon from "../../assets/img/Menu.svg";
import closeIcon from "../../assets/img/Close.svg";
import share from "../../assets/img/share.svg";
import { useBeasts } from "../../hooks/useBeasts";
import { usePlayer } from "../../hooks/usePlayers";
import ControllerConnectButton from "../CartridgeController/ControllerConnectButton";
import { ShareProgress } from '../Twitter/ShareProgress.tsx';
import "./main.css";

interface HeaderProps {
  tamagotchiStats?: {
    age?: number;
    energy?: number;
    hunger?: number;
    happiness?: number;
    clean?: number;
  };
}

function Header({ tamagotchiStats }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [route, setRoute] = useState('/');
  const { beastsData: beasts } = useBeasts();
  const { player } = usePlayer();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const location = useLocation();
  
  const isTamagotchiRoute = location.pathname === '/play';

  useEffect(() => {
    if (!player) return;
    const foundBeast = beasts.find((beast:any) => beast?.player === player.address);
    if (foundBeast) setRoute('/play');
  }, [beasts]);

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo-age-container">
          <Link to={route} className="logo">
            <img src={monster} alt="Logo" />
          </Link>
        </div>
        
        <div className="side-menu-container">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="menu-toggle"
            aria-label="Toggle menu"
          >
            <img 
              src={isOpen ? closeIcon : menuIcon} 
              alt={isOpen ? "Close menu" : "Open menu"}
              className="toggle-icon"
            />
          </button>
          <div className={`side-menu ${isOpen ? 'expanded' : ''}`}>
            <Link className="item" to={'/leaderboard'} >
              <div className="leader-icon">
                <img src={trophy} alt="Leaderboard" />
              </div>
              <span>Leaderboard</span>
            </Link>
            
            {isTamagotchiRoute && tamagotchiStats && (
              <div className="item" onClick={handleShareClick}>
                <div className="share-icon">
                  <img src={share} alt="Share" />
                </div>
                <span>Share</span>
              </div>
            )}
            
            <div className="item">
              <Music />
            </div>
            <div className="item">
              <ControllerConnectButton />
            </div>
          </div>
        </div>
      </nav>
      
      {tamagotchiStats && (
        <ShareProgress
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          type="beast"
          stats={tamagotchiStats}
        />
      )}
    </>
  );
}

export default Header;
