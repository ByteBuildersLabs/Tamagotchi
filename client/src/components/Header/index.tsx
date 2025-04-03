import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Music from "../Music";
import monster from "../../assets/img/logo.jpg";
import trophy from "../../assets/img/trophy.svg";
import book from "../../assets/img/book.svg";
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

interface MenuItem {
  to?: string;
  icon?: string;
  alt?: string;
  label?: string;
  onClick?: () => void;
  component?: React.ReactNode;
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
  }, [beasts, player]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleShareClick = () => setIsShareModalOpen(true);

  // Define menu items in a standardized way
  const menuItems: MenuItem[] = [
    { to: '/leaderboard', icon: trophy, alt: "Leaderboard", label: "Leaderboard" },
    { to: '/about', icon: book, alt: "Book", label: "About" }
  ];

  // Conditionally add Share option if on tamagotchi route
  if (isTamagotchiRoute && tamagotchiStats) {
    menuItems.push({
      icon: share,
      alt: "Share",
      label: "Share",
      onClick: handleShareClick
    });
  }

  // Add Music and Controller as regular menu items
  menuItems.push(
    { component: <Music />, label: "Music" },
    { component: <ControllerConnectButton /> }
  );

  return (
    <>
      <nav className="navbar">
        <Link to={route} className="logo">
          <img src={monster} alt="Logo" />
        </Link>
        
        <div className="side-menu-container">
          <button 
            onClick={toggleMenu}
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
            {menuItems.map((item, index) => (
              <div key={index} className="item" onClick={item.onClick}>
                {item.to ? (
                  <Link className="menu-link" to={item.to}>
                    {renderMenuItem(item)}
                  </Link>
                ) : (
                  renderMenuItem(item)
                )}
              </div>
            ))}
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

function renderMenuItem(item: MenuItem) {
  return (
    <>
      <div className="icon-container">
        {item.icon ? (
          <img src={item.icon} alt={item.alt} />
        ) : item.component}
      </div>
      {item.label && <span>{item.label}</span>}
    </>
  );
}

export default Header;
