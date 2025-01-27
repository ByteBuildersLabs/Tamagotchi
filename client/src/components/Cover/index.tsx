import { useAccount } from "@starknet-react/core";
import fight from '../../assets/img/banner.jpeg';
import SpawnBeast from "../SpawnBeast/index.tsx";
import Footer from '../Footer/index.tsx';
import { useNavigate } from "react-router-dom";

function Cover() {
  const navigate = useNavigate();
  const { account } = useAccount();

  const handleMiniGames = () => {
    navigate('/mini-games');
    (document.querySelector('.navbar-toggler') as HTMLElement)?.click();
  }

  return (
    <>
      {account ? <SpawnBeast /> :
        <>
          <div className='cover relative'>
            <div className="mb-3">
              <img className="cover-pic" src={fight} alt="" />
            </div>
            <button className="connect-btn" onClick={handleMiniGames}>
              Connect and start Play
            </button>
            <Footer />
          </div>
        </>
      }
    </>
  )
}

export default Cover;
