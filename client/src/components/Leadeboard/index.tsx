import Header from '../Header/index.tsx';
import { useEffect, useState } from 'react';
import './main.css';
import beastsDex from '../../data/beastDex.tsx';
import { useBeasts } from '../../hooks/useBeasts.tsx';

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
      </div>
    </>
  )
}

export default Leaderboard;
