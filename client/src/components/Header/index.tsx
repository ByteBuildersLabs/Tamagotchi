// React and external libraries
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAccount } from "@starknet-react/core";
import useSound from 'use-sound';

// Internal components
import { ShareProgress } from '../Twitter/ShareProgress.tsx';
import Music from "../Music";
import ControllerConnectButton from "../CartridgeController/ControllerConnectButton";
import Countdown from "../CountDown/index.tsx";

// Hooks and Contexts
import { useBeasts } from "../../hooks/useBeasts";
import { usePlayer } from "../../hooks/usePlayers";

// Types
import { HeaderProps, MenuItem } from '../../types/components';

// Assets
import buttonClick from '../../assets/sounds/click.mp3';
import monster from "../../assets/img/img-logo.jpg";
import profile from "../../assets/img/icon-profile.svg";
import about from "../../assets/img/icon-about.svg";
import menuIcon from "../../assets/img/icon-menu.svg";
import closeIcon from "../../assets/img/icon-close.svg";
import share from "../../assets/img/icon-share.svg";
import download from "../../assets/img/icon-download.svg";

// Styles
import './main.css';
import { useDojoSDK } from "@dojoengine/sdk/react";

// Constants
const WEBSITE_URL = 'https://website.bytebeasts.games';
const SOUND_VOLUME = 0.6;

// Components
const MenuItemRenderer: React.FC<{ item: MenuItem }> = ({ item }) => (
  <>
    <div className="icon-container">
      {item.icon ? (
        <img src={item.icon} alt={item.alt} />
      ) : item.component}
    </div>
    {item.label && <span>{item.label}</span>}
  </>
);

// Main Component
const Header: React.FC<HeaderProps> = ({ tamagotchiStats }) => {
  // State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [route, setRoute] = useState<string>('/');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Hooks
  const { beastsData: beasts } = useBeasts();
  const { player } = usePlayer();
  const { client } = useDojoSDK();
  const location = useLocation();
  const { account, connector } = useAccount();
  const [buttonSound] = useSound(buttonClick, { volume: SOUND_VOLUME, preload: true });

  // Derived state
  const isTamagotchiRoute = location.pathname === '/play';

  // Effects
  useEffect(() => {
    if (!player) return;
    const foundBeast = beasts.find((beast: any) => beast?.player === player.address);
    if (foundBeast) setRoute('/play');
  }, [beasts, player]);

  // Event Handlers
  const handleAchievements = useCallback(() => {
    buttonSound();
    if (!connector || !('controller' in connector)) {
      console.error("Connector not initialized");
      return;
    }
    if (connector.controller && typeof connector.controller === 'object' && 'openProfile' in connector.controller) {
      (connector.controller as { openProfile: (profile: string) => void }).openProfile("achievements");
    } else {
      console.error("Connector controller is not properly initialized");
    }
  }, [connector, buttonSound]);

  const toggleMenu = useCallback(() => {
    buttonSound();
    setIsOpen(prev => !prev);
  }, [buttonSound]);

  const handleShareClick = useCallback(() => {
    buttonSound();
    setIsShareModalOpen(true);
  }, [buttonSound]);

  // Menu Configuration
  const menuItems: MenuItem[] = [
    {
      icon: about,
      alt: "about",
      label: "About",
      onClick: () => {
        buttonSound();
        window.open(WEBSITE_URL, '_blank');
      }
    }
  ];

  if (isTamagotchiRoute && tamagotchiStats) {
    menuItems.push({
      icon: share,
      alt: "Share",
      label: "Share",
      onClick: handleShareClick
    });
  }

  menuItems.push(
    { component: <Music />, label: "Music", onClick: () => buttonSound() },
    { component: <ControllerConnectButton />, onClick: () => buttonSound() }
  );

  // Render
  return (
    <>
      <nav className="navbar">
        <Link to={route} className="logo" onClick={() => buttonSound()}>
          <img src={monster} alt="Logo" />
        </Link>

        <div onClick={() => buttonSound()}>
          <Countdown />
        </div>

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
            <div className="item" onClick={handleAchievements}>
              <div className="icon-container">
                <img src={profile} alt="download" />
              </div>
              <span>Profile</span>
            </div>
            <Link className="item" to={'/download'}>
              <div className="icon-container">
                <img src={download} alt="Profile" />
              </div>
              <span>Install App</span>
            </Link>
            {menuItems.map((item, index) => (
              <div key={index} className="item" onClick={item.onClick}>
                {item.to ? (
                  <Link className="menu-link" to={item.to}>
                    <MenuItemRenderer item={item} />
                  </Link>
                ) : (
                  <MenuItemRenderer item={item} />
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {tamagotchiStats && (
        <ShareProgress
          account={account}
          client={client}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          type="beast"
          stats={tamagotchiStats}
        />
      )}
    </>
  );
};

export default Header;
