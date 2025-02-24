import { useEffect, useState } from "react";
import useSound from 'use-sound';
import { Account } from "starknet";
import { useGlobalContext } from "../../hooks/appContext.tsx";
import { Card } from '../../components/ui/card';
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
import Header from '../../components/Header';
import { useDojoSDK } from "@dojoengine/sdk/react";
import { usePlayer } from "../../hooks/usePlayers.tsx";
import { useBeasts } from "../../hooks/useBeasts.tsx";
import { useBeastsStatus } from "../../hooks/useBeastsStatus.tsx";
import './main.css';

function Tamagotchi() {
  const { userAccount } = useGlobalContext();
  const { client } = useDojoSDK();
  const { beasts } = useBeasts();
  const { beastsStatus } = useBeastsStatus();
  const { player } = usePlayer();

  const [beast, setBeast] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    if (player && beasts.length > 0) {
      const foundBeast = beasts[0];
      setBeast(foundBeast);
    }
  }, [player, beasts]);

  useEffect(() => {
    if (player && beastsStatus.length > 0) {
      const foundStatus = beastsStatus[0];
      setStatus(foundStatus);
    }
  }, [player, beastsStatus]);

  const loadingTime = 6000;
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('actions');

  const [playFeed] = useSound(feedSound, { volume: 0.7, preload: true });
  const [playClean] = useSound(cleanSound, { volume: 0.7, preload: true });
  const [playSleep] = useSound(sleepSound, { volume: 0.7, preload: true });
  const [playPlay] = useSound(playSound, { volume: 0.7, preload: true });
  const [playRevive] = useSound(reviveSound, { volume: 0.7, preload: true });

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
    if (status?.is_alive == false) {
      showDeathAnimation();
    }
  }, [status?.is_alive]);

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
  };

  const handleCuddle = async () => {
    if (!beast || !userAccount) return;
    if (!status?.is_alive) return;
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
      }, 5000);
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
              <Whispers
                beast={beast}
                expanded={currentView === 'chat'}
                beastStatus={status}
              />
              <div className="scenario flex justify-center items-column">
                <img
                  src={currentImage}
                  alt="Tamagotchi"
                  className="w-40 h-40"
                  onClick={handleCuddle} style={{ cursor: 'pointer' }}
                />
              </div>
              <div className="beast-interaction">
                <div className="beast-buttons">
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
