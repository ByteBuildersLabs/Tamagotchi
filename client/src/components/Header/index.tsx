import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Music from "../Music";
import monster from "../../assets/img/logo.jpg";
import trophy from "../../assets/img/trophy.svg";
import menuIcon from "../../assets/img/Menu.svg";
import closeIcon from "../../assets/img/Close.svg";
import share from "../../assets/img/share.svg";
import { useBeasts } from "../../hooks/useBeasts";
import { usePlayer } from "../../hooks/usePlayers";
import ControllerConnectButton from "../CartridgeController/ControllerConnectButton";
import { ShareProgress } from '../Twitter/ShareProgress.tsx';
import "./main.css";
interface TamagotchiStats {
  age?: number;
  energy?: number;
  hunger?: number;
  happiness?: number;
  clean?: number;
}

interface HeaderProps {
  tamagotchiStats?: TamagotchiStats;
}

function Header({ tamagotchiStats }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [route, setRoute] = useState('/');
  const { beasts } = useBeasts();
  const { player } = usePlayer();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (!player) return;
    const foundBeast = beasts.find((beast) => beast?.player === player.address);
    if (foundBeast) setRoute('/play');
  }, [beasts]);

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  return (
    <>
      <nav className="navbar">
        <Link to={route} className="logo">
          <img src={monster} alt="Logo" />
        </Link>
        
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
            
            {/* Botón de compartir con el estilo consistente */}
            {tamagotchiStats && (
              <div className="item" onClick={handleShareClick}>
                <div className="share-icon">
                  <img src={share} alt="Share" />
                </div>
                <span>Share Progress</span>
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
      
      {/* Modal de compartir */}
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