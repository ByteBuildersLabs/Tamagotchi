import { SDK } from "@dojoengine/sdk";
import { Schema } from "../../dojo/bindings.ts";
import { useAccount } from "@starknet-react/core";
import { Link } from "react-router-dom";
import Bag from '../Bag';
import ControllerConnectButton from '../CartridgeController/ControllerConnectButton';
import Music from '../Music';
import sheep from '../../assets/img/sheep.gif';
import monster from '../../assets/img/logo.jpeg';
import './main.css';

function Header({ sdk }: { sdk: SDK<Schema> }) {
  const { account } = useAccount();

  return (
    <>
      <nav className="navbar">
        <div className='logo'>
          <img src={monster} alt="Logo" />
          <h2>Baby <span>Beast</span></h2>
        </div>
        <div>
          <Music />
          <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#menu" aria-controls="menu" aria-expanded="false" aria-label="Toggle navigation">
            <img src={sheep} className='sheep' alt="Sheep" />
          </button>
        </div>
        <div className="collapse navbar-collapse menu" id="menu">
          <Bag sdk={sdk} />
          { account && <Link className="connect-btn" to="/" onClick={() => (document.querySelector('.navbar-toggler') as HTMLElement)?.click()}>Spawn new Beast</Link> }
          { account && <ControllerConnectButton /> }
        </div>
      </nav>
    </>
  )
}

export default Header;
