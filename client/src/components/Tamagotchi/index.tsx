import { useEffect, useState } from "react";
import { Account } from "starknet";
import { useGlobalContext } from "../../hooks/appContext.tsx";
import { Card } from '../../components/ui/card';
import useSound from 'use-sound';
import toast from 'react-hot-toast';
import beastsDex from "../../data/beastDex.tsx";
import dead from '../../assets/img/dead.gif';
import Actions from "./Actions/index.tsx";
import Status from "./Status/index.tsx";
import Food from "./Food/index.tsx";
import Play from "./Play/index.tsx";
import Whispers from "./Whispers/index.tsx";
import feedSound from '../../assets/sounds/bbeating.mp3';
import cleanSound from '../../assets/sounds/bbshower.mp3';
import sleepSound from '../../assets/sounds/bbsleeps.mp3';
import playSound from '../../assets/sounds/bbjump.mp3';
import reviveSound from '../../assets/sounds/bbrevive.mp3';
import Header from '../../components/Header';
import Spinner from "../ui/spinner.tsx";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { usePlayer } from "../../hooks/usePlayers.tsx";
import { useBeasts } from "../../hooks/useBeasts.tsx";
import { fetchStatus } from "../../utils/tamagotchi.tsx";
import { useLocation } from "react-router-dom";
import { useLocalStorage } from "../../hooks/useLocalStorage.tsx";
import Close from "../../assets/img/CloseWhite.svg";
import './main.css';

function Tamagotchi() {
  const { userAccount } = useGlobalContext();
  const { client } = useDojoSDK();
  const { beasts } = useBeasts();
  const { player } = usePlayer();
  const location = useLocation();

  const [beast, setBeast] = useState<any>(null);
  const [status, setStatus] = useLocalStorage('status', []);

  const loadingTime = 6000;
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('actions');

  const [playFeed] = useSound(feedSound, { volume: 0.7, preload: true });
  const [playClean] = useSound(cleanSound, { volume: 0.7, preload: true });
  const [playSleep] = useSound(sleepSound, { volume: 0.7, preload: true });
  const [playPlay] = useSound(playSound, { volume: 0.7, preload: true });
  const [playRevive] = useSound(reviveSound, { volume: 0.7, preload: true });

  useEffect(() => {
    if (!player) return
    if (beast) return
    const foundBeast = beasts.find((beast: any) => beast.player === player.address);
    if (!foundBeast) return
    setBeast(foundBeast);
    async function setBeastId() {
      await client.actions.setCurrentBeast(userAccount as Account, foundBeast?.beast_id)
    }
    setBeastId();
  }, [player, beasts]);

  useEffect(() => {
    if (!player) return
    let response: any = fetchStatus(userAccount);
    
    if (!status || status.length === 0) setIsLoading(true);
    if(status[0] != player.current_beast_id) setIsLoading(true);

    setInterval(async () => {
      if(status[1] == 0) return
      response = await fetchStatus(userAccount);
      if(response) setStatus(response);
      setIsLoading(false);
    }, 3000);
  }, [beast, location]);

  useEffect(() => {
    const updateBackground = () => {
      const bodyElement = document.querySelector('.body') as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add('day');
      }
    };
    updateBackground();
  }, []);

  // Animations
  const [currentImage, setCurrentImage] = useState<any>('');

  const showAnimation = (gifPath: string) => {
    setCurrentImage(gifPath);
    setTimeout(() => {
      setCurrentImage(beast ? beastsDex[beast.specie - 1]?.idlePicture : '');
    }, loadingTime);
  };

  useEffect(() => {
    if (!status || !beast) return;
    if (status[1] == 0) setCurrentImage(dead);
    if (status[1] == 1) setCurrentImage(beast ? beastsDex[beast.specie - 1]?.idlePicture : '')
  }, [status, beast]);

  // Twitter Share
  const getShareableStats = () => {
    if (!status || !beast) return undefined;
  
    return {
      age: beast?.age || 0,
      energy: status[4] || 0,
      hunger: status[3] || 0,
      happiness: status[5] || 0,
      clean: status[6] || 0
    };
  };
  // Helper to wrap Dojo actions with toast
  const handleAction = async (actionName: string, actionFn: () => Promise<{ transaction_hash: string } | undefined>, animation: string) => {
    setIsLoading(true);
    showAnimation(animation);
    // Trigger sound based on action
    switch (actionName) {
      case 'Feed': playFeed(); break;
      case 'Clean': playClean(); break;
      case 'Sleep': playSleep(); break;
      case 'Play': playPlay(); break;
      case 'Revive': playRevive(); break;
      case 'Wake up':
        console.warn('Missing sound for awake action');
        break;
    }
    actionFn();
    setTimeout(() => {
      setIsLoading(false);
    }, loadingTime);
  };

  const handleCuddle = async () => {
    if (!beast || !userAccount) return;
    if (status[1] == 0) return;
    try {
      await toast.promise(
        handleAction(
          "Cuddle",
          // Call the cuddle action on the client (ensure it's defined in your SDK)
          () => client.actions.pet(userAccount as Account), //change sleep action to cuddle action
          // Use the cuddle animation from your initials data
          beastsDex[beast.specie - 1].cuddlePicture
        ),
        {
          loading: "Cuddling...",
          success: "Your Baby Beast is enjoying!",
          error: "Cuddle action failed!",
        }
      );
      // Disable the button for 5 seconds
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, loadingTime);
    } catch (error) {
      console.error("Cuddle error:", error);
    }
  };

  return (
    <>
      <Header tamagotchiStats={getShareableStats()}/>
      <div className="tamaguchi">
        <>{beast &&
          <Card style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '99%'
          }}>
            <Status
              beastStatus={status}
            />
            <div className="game">
              {
                !status || status.length === 0 ? <></> :
                  <Whispers
                    beast={beast}
                    expanded={currentView === 'chat'}
                    beastStatus={status}
                  />
              }

              <div className="scenario flex justify-center items-column">
                {
                  !status || status.length === 0 ? <Spinner /> :
                    <img
                      src={currentImage}
                      alt="Tamagotchi"
                      className="w-40 h-40"
                      onClick={handleCuddle} style={{ cursor: 'pointer' }}
                    />
                }
              </div>
              <div className="beast-interaction">
                <div className="beast-buttons">
                    {beast && (
                      <div className="age-indicator">
                        <span>{beast.age}</span>
                      </div>
                    )}
                  {(currentView === 'food' || currentView === 'play') && (
                    <div className="back-button">
                      <img 
                        src={Close} 
                        onClick={() => setCurrentView('actions')} 
                        alt="Back to actions"
                      />
                    </div>
                  )}
                </div>
              </div>
                            {
                currentView === 'actions' ?
                  <Actions
                    handleAction={handleAction}
                    isLoading={isLoading}
                    beast={beast}
                    beastStatus={status}
                    setStatus={setStatus}
                    account={userAccount}
                    client={client}
                    setCurrentView={setCurrentView}
                  />
                  : currentView === 'food' ? (
                    <Food
                      handleAction={handleAction}
                      beast={beast}
                      account={userAccount}
                      client={client}
                      showAnimation={showAnimation}
                    />
                  ) : currentView === 'play' ? (
                    <Play
                      handleAction={handleAction}
                      beast={beast}
                      account={userAccount}
                      client={client}
                    />
                  ) : (
                    <></>
                  )
              }
            </div>
          </Card>
        }</>
      </div>
    </>
  );
}
export default Tamagotchi;
