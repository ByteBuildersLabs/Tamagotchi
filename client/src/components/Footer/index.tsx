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
      <div className='footer my-4'>
        <a href='https://github.com/RolandoDrRobot' target='_blank'>
          <img src={rolo} className='footer-team' />
        </a>
        <a href='https://github.com/coxmars' target='_blank'>
          <img src={marco} className='footer-team' />
        </a>
        <a href='https://github.com/jimenezz22' target='_blank'>
          <img src={luis} className='footer-team' />
        </a>
        <a href='https://github.com/danielcdz' target='_blank'>
          <img src={daniel} className='footer-team' />
        </a>
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
