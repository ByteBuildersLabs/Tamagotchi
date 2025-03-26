import rolo from '../../assets/img/rolo.jpg';
import marco from '../../assets/img/marco.jpeg';
import luis from '../../assets/img/Luis.png';
import daniel from '../../assets/img/daniel.jpeg';
import dojologo from '../../assets/img/dojo-icon.svg';
import starknet from '../../assets/img/stark.svg'

import './main.css';

function Footer() {
  return (
    <>
      <div id="carouselExampleControls" className="carousel slide mt-4" data-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className='d-flex'>
              <a href='https://github.com/danielcdz' target='_blank'>
                <img src={daniel} className='footer-team' />
              </a>
              <div className='member-info'>
                <span>CEO</span>
                <span className='d-block'>Cairo & Dojo Dev</span>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className='d-flex'>
              <a href='https://github.com/RolandoDrRobot' target='_blank'>
                <img src={rolo} className='footer-team' />
              </a>
              <div className='member-info'>
                <span>COO</span>
                <span className='d-block'>Integration & UI Dev</span>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className='d-flex'>
              <a href='https://github.com/jimenezz22' target='_blank'>
                <img src={luis} className='footer-team' />
              </a>
              <div className='member-info'>
                <span>CMO</span>
                <span className='d-block'>Integration & UI Dev</span>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className='d-flex'>
              <a href='https://github.com/coxmars' target='_blank'>
                <img src={marco} className='footer-team' />
              </a>
              <div className='member-info'>
                <span>CPO</span>
                <span className='d-block'>Cairo & Dojo Dev</span>
              </div>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-target="#carouselExampleControls" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button className="carousel-control-next" type="button" data-target="#carouselExampleControls" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>

      <p className='bottom-footer'>
        <span>Powered by</span>
        <img src={dojologo} alt="Dojo Engine" />
        <span>&</span>
        <img src={starknet} alt="Starknet" />
      </p>
    </>
  )
}

export default Footer;
