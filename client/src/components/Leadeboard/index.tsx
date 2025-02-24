import { useBeasts } from '../../hooks/useBeasts.tsx';
import Header from '../Header/index.tsx';
import ControllerConnectButton from '../CartridgeController/ControllerConnectButton.tsx';
import dojologo from '../../assets/img/dojo-icon.svg';
import starknet from '../../assets/img/stark.png'
import { useEffect, useState } from 'react';
import daniel from '../../assets/img/daniel.jpeg';
import './main.css';

const Leaderboard: React.FC = () => {
  const { beasts } = useBeasts();

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove('day', 'night');
      bodyElement.style.backgroundSize = 'cover';
      bodyElement.style.padding = '22px 15px';
      bodyElement.style.justifyContent = 'start';
    }
  }, []);

   const [allBeasts, setBeasts] = useState<any>(null);

  useEffect(() => {
    if (beasts) {
      setBeasts(beasts);
      console.log('Rolooo', allBeasts);
    }
  }, [beasts]);

  return (
    <>
      <Header />
      <div className="leaderboard">
        <div className='d-flex justify-content-between align-items-center'>
          <p className={'title mb-4'}>
            Leaderboard
            <span className='d-block'>How old is your beast?</span>
          </p>
        </div>
        <div className='leaderboard-container'>
          <div className="initial-info">
            <h4>
              Leaderboard
            </h4>
            <div className='row mb-4'>
              <div className='col-3'>
                Position
              </div>
              <div className='col-3'>
                Player
              </div>
              <div className='col-3'>
                Beast
              </div>
              <div className='col-3'>
                Age
              </div>
            </div>
            <div className='row'>
              <div className='col-3'>
                1  
              </div>
              <div className='col-3'>
                Rolo
              </div>
              <div className='col-3'>
                <img src={daniel} className='beast' />
              </div>
              <div className='col-3'>
                65
              </div>
            </div>
            <div className='row'>
              <div className='col-3'>
                1  
              </div>
              <div className='col-3'>
                Rolo
              </div>
              <div className='col-3'>
                <img src={daniel} className='beast' />
              </div>
              <div className='col-3'>
                65
              </div>
            </div>
            <div className='row'>
              <div className='col-3'>
                1  
              </div>
              <div className='col-3'>
                Rolo
              </div>
              <div className='col-3'>
                <img src={daniel} className='beast' />
              </div>
              <div className='col-3'>
                65
              </div>
            </div>
            <div className='row'>
              <div className='col-3'>
                1  
              </div>
              <div className='col-3'>
                Rolo
              </div>
              <div className='col-3'>
                <img src={daniel} className='beast' />
              </div>
              <div className='col-3'>
                65
              </div>
            </div>
          </div>
        </div>
        <p className='bottom-footer'>
          <span>Powered by Dojo</span>
          <img src={dojologo} />
          <span>and Starknet</span>
          <img src={starknet} />
        </p>
      </div>
    </>
  )
}

export default Leaderboard;
