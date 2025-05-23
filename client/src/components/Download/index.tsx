// Styles
import Header from '../Header';
import monster from "../../assets/img/img-logo.jpg";
import download from "../../assets/img/icon-download-2.svg";
import app from "../../assets/img/app.png";
import './main.css';

// Main Component
const Download = () => {

  return (
    <>
      <Header />
      <div className="install-container">
        <div className="install">
          <div>
            <img src={app} className='app aura' />
          </div>
          
          <span>Tap your share button</span>
          <div className="d-flex align-items-center justify-content-center my-4">
            <img src={download} alt="download" className='download-icon' />
            <span className="btn-download mx-2">Add to Home Screen</span>
          </div>

          <div className="d-flex justify-content-center align-items-center app-cage">
            <div className='text-left'>
              <h3>Install ByteBeasts</h3>
              <p className="mb-2">Play from Home Screen</p>
            </div>
            <img
              src={monster}
              alt="Mage Duel Icon"
              className="app-icon mb-1"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Download;
