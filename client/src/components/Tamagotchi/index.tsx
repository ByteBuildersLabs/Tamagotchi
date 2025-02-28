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
import monster from '../../assets/img/logo.svg';
import share from '../../assets/img/share.svg';
import Header from '../../components/Header';
import { useDojoSDK } from "@dojoengine/sdk/react";
import { usePlayer } from "../../hooks/usePlayers.tsx";
import { useBeasts } from "../../hooks/useBeasts.tsx";
import { ShareProgress } from '../Twitter/ShareProgress.tsx';
import { fetchStatus } from "../../utils/tamagotchi.tsx";
import './main.css';
import Loading from "../Loading/index.tsx";

function Tamagotchi() {
  const { userAccount } = useGlobalContext();
  const { client } = useDojoSDK();
  const { beasts } = useBeasts();
  const { player } = usePlayer();

  const [beast, setBeast] = useState<any>(null);
  const [status, setStatus] = useState<any>([]);

  const loadingTime = 6000;
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('actions');

  const [playFeed] = useSound(feedSound, { volume: 0.7, preload: true });
  const [playClean] = useSound(cleanSound, { volume: 0.7, preload: true });
  const [playSleep] = useSound(sleepSound, { volume: 0.7, preload: true });
  const [playPlay] = useSound(playSound, { volume: 0.7, preload: true });
  const [playRevive] = useSound(reviveSound, { volume: 0.7, preload: true });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
    let status: any = fetchStatus(userAccount);
    setIsLoading(true);

    const intervalId = setInterval(async () => {
      status = await fetchStatus(userAccount);
      setStatus(status);
      setIsLoading(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [beast]);

  useEffect(() => {
    const updateBackground = () => {
      const bodyElement = document.querySelector('.body') as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add('day');
        bodyElement.style.padding = '22px 15px';
      }
    };
    updateBackground();
  }, []);

  // Animations
  const [currentImage, setCurrentImage] = useState(beast ? beastsDex[beast.specie - 1]?.idlePicture : '');
  const [firstTime, isFirstTime] = useState(true);
  useEffect(() => {
    if (firstTime && beast) {
      setCurrentImage(beast ? beastsDex[beast.specie - 1]?.idlePicture : '')
      isFirstTime(false);
    }
  }, [beast]);

  const showAnimation = (gifPath: string) => {
    setCurrentImage(gifPath);
    setTimeout(() => {
      setCurrentImage(beast ? beastsDex[beast.specie - 1]?.idlePicture : '');
    }, loadingTime);
  };

  const showDeathAnimation = () => {
    setCurrentImage(dead);
  };

  useEffect(() => {
    if (status[1] == 0) {
      showDeathAnimation();
    }
  }, [status]);

  // Twitter Share
  const getShareableStats = () => {
    if (!status) return undefined;

    return {
      age: beast?.age || 0,
      energy: status[4] || 0,
      hunger: status[3] || 0,
      happiness: status[5] || 0,
      clean: status[7] || 0
    };
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
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
    }, 6000);
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
      }, 6000);
    } catch (error) {
      console.error("Cuddle error:", error);
    }
  };

  return (
    <>
      <Header />
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
                beast == null && !status || status.length === 0 ? <></> :
                  <Whispers
                    beast={beast}
                    expanded={currentView === 'chat'}
                    beastStatus={status}
                  />
              }

              <div className="scenario flex justify-center items-column">
                {
                  beast == null && !status || status.length === 0 ? <></> :
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
                  <div className="name-section">
                    <div className="age-icon">
                      <img className="x-icon" src={share} onClick={handleShareClick} />
                    </div>
                    <div className="age-icon">
                      <span>Age {beast.age}</span>
                    </div>
                  </div>
                  <img className="actions-icon" src={monster} onClick={() => (setCurrentView('actions'))} />
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
      <ShareProgress
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        type="beast"
        stats={getShareableStats()}
      />
    </>
  );
}
export default Tamagotchi;
