import Header from '../Header/index.tsx';
import { useEffect, useState } from 'react';
import './main.css';
import beastsDex from '../../data/beastDex.tsx';
import { useBeasts } from '../../hooks/useBeasts.tsx';
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";
import Spinner from '../ui/spinner.tsx';

interface Beast {
  userName: string;
  beast_type: number;
  age: number;
  name: string;
  player: string;
  beast_id: string;
  birth_date: string;
  specie: string;
}

const Leaderboard = () => {
  const [allBeasts, setAllBeasts] = useState<Beast[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [userBeast, setUserBeast] = useState<Beast | null>(null);
  
  const { account } = useAccount();
  const userAddress = account ? addAddressPadding(account.address) : '';
  
  const { beastsData } = useBeasts();
  let beasts = beastsData as Beast[];

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) bodyElement.classList.remove('day');
  }, []);

  useEffect(() => {
    if (beasts && beasts.length > 0) {
      const sortedBeasts = [...beasts].sort((a, b) => (b?.age || 0) - (a?.age || 0));
      
      if (userAddress) {
        const userBeastIndex = sortedBeasts.findIndex(
          beast => addAddressPadding(beast.player) === userAddress
        );
        
        if (userBeastIndex !== -1) {
          setUserPosition(userBeastIndex + 1); // Position starts at 1
          setUserBeast(sortedBeasts[userBeastIndex]);
        }
      }
      
      setAllBeasts(sortedBeasts);
      setIsLoaded(true);
    }
  }, [beasts, userAddress]);

  const top15Beasts = allBeasts.slice(0, 15);
  const showUserSeparately = userPosition !== null && userPosition > 15;

  const isUserRow = (beastPlayer: string) => {
    if (!userAddress) return false;
    return addAddressPadding(beastPlayer) === userAddress;
  };

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
              
              {isLoaded && top15Beasts.map((beast: Beast, index: number) => (
                <div 
                  className={`row mb-3 ${isUserRow(beast.player) ? 'current-user' : ''}`} 
                  key={`top-${index}`}
                >
                  <div className='col-3'>
                    {index + 1}
                  </div>
                  <div className='col-3'>
                    {beast.userName}
                  </div>
                  <div className='col-3'>
                    <img 
                      src={beastsDex[beast.beast_type - 1]?.idlePicture} 
                      className='beast' 
                      alt={beast.name || `Beast #${beast.beast_id}`} 
                    />
                  </div>
                  <div className='col-3'>
                    {beast.age}
                  </div>
                </div>
              ))}
              
              {showUserSeparately && userBeast && (
                <>
                  <div className='row mb-3 separator'>
                    <div className='col-12'>
                      <span>...</span>
                    </div>
                  </div>
                  <div className='row mb-3 current-user'>
                    <div className='col-3'>
                      {userPosition}
                    </div>
                    <div className='col-3'>
                      {userBeast.userName}
                    </div>
                    <div className='col-3'>
                      <img 
                        src={beastsDex[userBeast.beast_type - 1]?.idlePicture} 
                        className='beast' 
                        alt={userBeast.name || `Beast #${userBeast.beast_id}`} 
                      />
                    </div>
                    <div className='col-3'>
                      {userBeast.age}
                    </div>
                  </div>
                </>
              )}
              
              {!isLoaded && (
                <Spinner message='Loading leaderboard...'/>
              )}
              
              {isLoaded && allBeasts.length === 0 && (
                <div className='row mb-3'>
                  <div className='col-12 text-center'>
                    <span>Nothing to show</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
