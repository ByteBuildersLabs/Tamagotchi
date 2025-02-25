import { useBeasts } from '../../hooks/useBeasts.tsx';
import Header from '../Header/index.tsx';
import dojologo from '../../assets/img/dojo-icon.svg';
import starknet from '../../assets/img/stark.png'
import { useEffect, useState } from 'react';
import './main.css';
import beastsDex from '../../data/beastDex.tsx';

const Leaderboard: React.FC = () => {

  const { beasts } = useBeasts();
  const [allBeasts, setAllBeasts] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove('day', 'night');
      bodyElement.style.backgroundSize = 'cover';
      bodyElement.style.padding = '22px 15px';
      bodyElement.style.justifyContent = 'start';
    }
  }, []);

  useEffect(() => {
    if (!isLoaded && beasts.length > 0) {
      const sortedBeasts = [...beasts].sort((a, b) => b?.age - a?.age);
      setAllBeasts(sortedBeasts);
      setIsLoaded(true);
    }
  }, [beasts, isLoaded]);

  return (
    <>
      <Header />
      <div className="leaderboard">
        <div className='d-flex justify-content-between align-items-center'>
          <p className={'title mb-5'}>
            Leaderboard
            <span className='d-block'>How old is your beast?</span>
          </p>
        </div>
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
                    <img src={beastsDex[beast.specie - 1]?.idlePicture } className='beast' alt={beast.name} />
                  </div>
                  <div className='col-3'>
                    {beast.age}
                  </div>
                </div>
              ))
            }
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
