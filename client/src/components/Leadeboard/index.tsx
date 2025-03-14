import Header from '../Header/index.tsx';
import dojologo from '../../assets/img/dojo-icon.svg';
import starknet from '../../assets/img/stark.svg'
import { useEffect, useState } from 'react';
import './main.css';
import beastsDex from '../../data/beastDex.tsx';
import { useBeasts } from '../../hooks/useBeasts.tsx';
import Footer from '../Footer/index.tsx';

const Leaderboard = () => {
  const [allBeasts, setAllBeasts] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const { beastsData } = useBeasts();
  let beasts:any=beastsData;

  useEffect(() => {
    if (!isLoaded && beasts.length > 3) {
      const sortedBeasts = [...beasts].sort((a, b) => b?.age - a?.age);
      setAllBeasts(sortedBeasts);
      setIsLoaded(true);
    }
  }, [beasts, isLoaded]);

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove('day');
    }
  }, []);

  return (
    <>
      <Header />
      <div className="leaderboard">
        <div>
          <p className={'title mb-3'}>
            Leaderboard
            <span className='d-block'>How old is your beast?</span>
          </p>
          <div className='leaderboard-container'>
            <div className="initial-info">
              <h4>
                Leaderboard
              </h4>
              <div className='row mb-3'>
                <div className='col-3'>
                  <span>Position</span>
                </div>
                <div className='col-3'>
                  <span>Player</span>
                </div>
                <div className='col-3'>
                  <span>Beast</span>
                </div>
                <div className='col-3'>
                  <span>Age</span>
                </div>
              </div>
              {
                allBeasts && allBeasts.map((beast: any, index: number) => (
                  <div className='row mb-3' key={index}>
                    <div className='col-3'>
                      {index + 1}
                    </div>
                    <div className='col-3'>
                      ...{beast.player?.slice(-6)}
                    </div>
                    <div className='col-3'>
                      <img src={beastsDex[beast.beast_type - 1]?.idlePicture} className='beast' alt={beast.name} />
                    </div>
                    <div className='col-3'>
                      {beast.age}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <p className='bottom-footer'>
          <div className='d-flex w-100 justify-content-center'>
            <span>Powered by Dojo</span>
            <img className='copy' src={dojologo} />
            <span>and Starknet</span>
            <img className='copy' src={starknet} />
          </div>
          <Footer />
        </p>
      </div>
    </>
  )
}

export default Leaderboard;
