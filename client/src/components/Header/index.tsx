import { Link } from "react-router-dom";
import sheep from "../../assets/img/sheep.svg";
import monster from "../../assets/img/logo.svg";
import search from "../../assets/img/search.svg";
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
          <img src={search} alt="Search" className="search" />
        </Link>
        <Link to={'/bag'} className="bag-icon">
          <img src={sheep} className="sheep" alt="Sheep" />
        </Link>
      </div>
    </nav>
  );
}

export default Header;
