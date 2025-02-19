import { Link } from "react-router-dom";
import monster from "../../assets/img/logo.jpg";
import book from "../../assets/img/book.svg";
import dragon from "../../assets/img/dragon.svg";
import "./main.css";

function Header() {
  return (
    <nav className="navbar">
      <Link to={'/'} className="logo">
        <img src={monster} alt="Logo" />
        <h2>
          Byte <span>Beasts</span>
        </h2>
      </Link>
      <div className="side-menu">
        <Link to={'/dex'} className="dex-icon">
          <img src={book} className="Beast Dex" />
        </Link>
        <Link to={'/bag'} className="bag-icon">
          <img src={dragon} alt="Beasts Bag" />
        </Link>
      </div>
    </nav>
  );
}

export default Header;
