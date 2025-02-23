import { useState } from "react";
import { Link } from "react-router-dom";
import monster from "../../assets/img/logo.jpg";
import book from "../../assets/img/book.svg";
import game from "../../assets/img/game.svg";
import dragon from "../../assets/img/dragon.svg";
import menuIcon from "../../assets/img/Menu.svg";
import closeIcon from "../../assets/img/Close.svg";
import "./main.css";
import Music from "../Music";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link to={'/'} className="logo">
        <img src={monster} alt="Logo" />
        <h2>
          Byte <span>Beasts</span>
        </h2>
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
          <Music />
          <Link to={'/lore'} className="lore-icon">
            <img src={book} alt="Beast Lore" />
          </Link>
          <Link to={'/dex'} className="dex-icon">
            <img src={game} alt="Beast Dex" />
          </Link>
          <Link to={'/bag'} className="bag-icon">
            <img src={dragon} alt="Beasts Bag" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
