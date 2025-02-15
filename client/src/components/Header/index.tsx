import { Link } from "react-router-dom";
import Music from "../Music";
import sheep from "../../assets/img/sheep.svg";
import monster from "../../assets/img/logo.svg";
import search from "../../assets/img/search.svg";
import GoBackButton from "../GoBack/GoBackButton"; 
import "./main.css";

function Header({ backButton = false }) {
  return (
    <nav className="navbar">
      <Link to={'/'} className="logo">
        <img src={monster} alt="Logo" />
        <h2>
          Baby <span>Beast</span>
        </h2>
      </Link>
      <div className="side-menu">
        <Music />
        <Link to={'/dex'}>
          <img src={search} alt="Search" className="search" />
        </Link>
        { backButton ? (
          <GoBackButton to={'/bag'} />
        ) : (
          <Link to={'/bag'}>
            <img src={sheep} className="sheep" alt="Sheep" />
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Header;
