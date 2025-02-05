import { useEffect, useState } from "react";
import { Account } from "starknet";
import { useAccount } from "@starknet-react/core";
import { SDK } from "@dojoengine/sdk";
import { Beast, Schema } from "../../dojo/bindings";
import { Card } from '../../components/ui/card';
import { useDojo } from "../../dojo/useDojo.tsx";
import { useBeast } from "../../hooks/useBeasts.tsx";
import { useParams } from "react-router-dom";
import initials from "../../data/initials.tsx";
import message from '../../assets/img/message.svg';
import dead from '../../assets/img/dead.gif';
import Stats from "./Stats/index.tsx";
import Actions from "./Actions/index.tsx";
import Status from "./Status/index.tsx";
import Talk from "./Talk/index.tsx";
import Food from "./Food/index.tsx";
import Whispers from "./Whispers/index.tsx";
import useSound from 'use-sound';
import feedSound from '../../assets/sounds/bbeating.mp3';
import cleanSound from '../../assets/sounds/bbshower.mp3';
import sleepSound from '../../assets/sounds/bbsleeps.mp3';
import playSound from '../../assets/sounds/bbjump.mp3';
import reviveSound from '../../assets/sounds/bbrevive.mp3';
import monster from '../../assets/img/logo.svg';
import './main.css';

function Tamagotchi({ sdk }: { sdk: SDK<Schema> }) {
  const { beasts } = useBeast(sdk);
  const { beastId } = useParams();
  const beast = beasts.find((beast: Beast) => String(beast.beast_id) === beastId);

  const loadingTime = 6000;
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('actions');

  // Add sound hooks
  const [playFeed] = useSound(feedSound, { volume: 0.7, preload: true });
  const [playClean] = useSound(cleanSound, { volume: 0.7, preload: true });
  const [playSleep] = useSound(sleepSound, { volume: 0.7, preload: true });
  const [playPlay] = useSound(playSound, { volume: 0.7, preload: true });
  const [playRevive] = useSound(reviveSound, { volume: 0.7, preload: true });

  const [isModalOpen, setModalOpen] = useState(false);

  const {
    setup: { client },
  } = useDojo();

  useEffect(() => {
    const updateBackground = () => {
      const hour = new Date().getHours();
      const isDayTime = hour > 6 && hour < 18;
      const bodyElement = document.querySelector('.body') as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add(`${isDayTime ? 'day' : 'night'}`);
        bodyElement.style.backgroundSize = 'inherit';
        bodyElement.style.padding = '80px 15px 30px';
      }
    };
    updateBackground();
  }, []);

  const { account } = useAccount();

  // Animations
  const [currentImage, setCurrentImage] = useState(beast ? initials[beast.specie - 1].idlePicture : '');
  const [firstTime, isFirstTime] = useState(true);

  useEffect(() => {
    if (firstTime && beast) {
      setCurrentImage(beast ? initials[beast.specie - 1].idlePicture : '')
      isFirstTime(false);
    }
  }, [beast]);

  const showAnimation = (gifPath: string) => {
    setCurrentImage(gifPath);
    setTimeout(() => {
      setCurrentImage(beast ? initials[beast.specie - 1].idlePicture : '');
    }, loadingTime);
  };
  const showDeathAnimation = () => {
    setCurrentImage(dead);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (beast?.is_alive && account) {
        await client.actions.decreaseStats(account as Account);
      }
    }, 10000000);

    return () => clearInterval(interval);
  }, [beast?.is_alive]);

  useEffect(() => {
    if (beast?.is_alive == false) {
      showDeathAnimation();
    }
  }, [beast?.is_alive]);

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

  return (
    <>
      <div className="tamaguchi">
        <>{beast &&
          <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Status beast={beast} />
            <div>
              <div className="scenario flex justify-center items-column">
                <img src={currentImage} alt="Tamagotchi" className="w-40 h-40" />
              </div>
              <Whispers beast={beast}  />
              {
                currentView === 'stats' ? 
                  <Stats 
                    beast={beast} 
                  /> 
                : 
                currentView === 'actions' ? 
                  <Actions 
                    handleAction={handleAction}
                    isLoading={isLoading}
                    beast={beast}
                    account={account}
                    client={client}
                    setCurrentView={setCurrentView}
                  />
                : 
                currentView === 'food' ? 
                  <Food 
                    handleAction={handleAction}
                    beast={beast}
                    account={account}
                    client={client}
                    showAnimation={showAnimation}
                  />
                :<></>
              }
              <div className="beast-interaction">
                <img src={monster} onClick={() => ( setCurrentView(currentView !== 'actions' ? 'actions' : 'stats') )} />
                <img src={message} onClick={() => setModalOpen(true)} />
              </div>
            </div>
          </Card>
        }</>
        <Talk 
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          pic={currentImage}
          name={initials[beast?.specie - 1]?.name}
        />
      </div>
    </>
  );
}

export default Tamagotchi;
