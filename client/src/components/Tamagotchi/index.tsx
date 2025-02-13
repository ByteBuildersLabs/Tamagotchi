import { useEffect, useState } from "react";
import { Account } from "starknet";
import { usePlayer } from "../../hooks/usePlayers.tsx";
import { useGlobalContext } from "../../hooks/appContext.tsx";
import { SDK } from "@dojoengine/sdk";
import { Beast, BeastStats, BeastStatus, SchemaType } from "../../dojo/bindings";
import { Card } from '../../components/ui/card';
import { useDojo } from "../../dojo/useDojo.tsx";
import { useBeast } from "../../hooks/useBeasts.tsx";
import { useBeastStatus } from "../../hooks/useBeastsStatus.tsx";
import { useBeastsStats } from "../../hooks/useBeastsStats.tsx";
import initials from "../../data/initials.tsx";
import message from '../../assets/img/message.svg';
import dead from '../../assets/img/dead.gif';
import Stats from "./Stats/index.tsx";
import Actions from "./Actions/index.tsx";
import Status from "./Status/index.tsx";
import Food from "./Food/index.tsx";
import Whispers from "./Whispers/index.tsx";
import useSound from 'use-sound';
import feedSound from '../../assets/sounds/bbeating.mp3';
import cleanSound from '../../assets/sounds/bbshower.mp3';
import sleepSound from '../../assets/sounds/bbsleeps.mp3';
import playSound from '../../assets/sounds/bbjump.mp3';
import reviveSound from '../../assets/sounds/bbrevive.mp3';
import monster from '../../assets/img/logo.svg';
import goBackIcon from '../../assets/img/GoBack.svg';
import toast from 'react-hot-toast';
import './main.css';

function Tamagotchi({ sdk }: { sdk: SDK<SchemaType> }) {
  const { userAccount } = useGlobalContext();
  const { beasts } = useBeast(sdk);
  const { beastsStatus } = useBeastStatus(sdk);
  const { beastsStats } = useBeastsStats(sdk);
  const { player } = usePlayer(sdk);
  
  const beast = beasts.find((beast: Beast) => beast.beast_id === player?.current_beast_id);
  const status = beastsStatus.find((beastsStatus: BeastStatus) => beastsStatus?.beast_id === player?.current_beast_id);
  const stats = beastsStats.find((beastsStats: BeastStats) => beastsStats?.beast_id === player?.current_beast_id);

  const loadingTime = 6000;
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('actions');
  const [currentButtonImage, setCurrentButtonImage] = useState(monster);
  const [currentChatImage, setCurrentChatImage] = useState(message);
 
  const [playFeed] = useSound(feedSound, { volume: 0.7, preload: true });
  const [playClean] = useSound(cleanSound, { volume: 0.7, preload: true });
  const [playSleep] = useSound(sleepSound, { volume: 0.7, preload: true });
  const [playPlay] = useSound(playSound, { volume: 0.7, preload: true });
  const [playRevive] = useSound(reviveSound, { volume: 0.7, preload: true });

  
  // Function to handle the main button
  const handleMainButtonClick = () => {
    const nextView = currentView !== 'actions' ? 'actions' : 'stats';
    const newImage = nextView === 'actions' ? monster : goBackIcon;
    
    setCurrentButtonImage(newImage);
    setCurrentView(nextView);
  };

  // Funtion to handle the chat button
  const handleChatButtonClick = () => {
    const nextView = currentView !== 'chat' ? 'chat' : 'actions';
    const newImage = nextView === 'chat' ? goBackIcon : message;
    
    setCurrentChatImage(newImage);
    setCurrentView(nextView);
  };

  //Funtion to handle changes from other components (like Actions)
  const handleViewChange = (newView: string) => {
    if (newView === 'food' || newView === 'stats') {
      setCurrentButtonImage(goBackIcon);
    } else if (newView === 'actions') {
      setCurrentButtonImage(monster);
    }
    setCurrentView(newView);
  };

  const renderButton = (imageSrc: string, onClick: () => void) => {
    if (imageSrc.includes('GoBack')) {
      return (
        <div className="icon-circle" onClick={onClick}>
          <img src={imageSrc} alt="Go back" />
        </div>
      );
    }
    return <img src={imageSrc} onClick={onClick} alt="Action" />;
  };

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
      if (status?.is_alive && userAccount) {
        await client.actions.decreaseStatus(userAccount as Account);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [status?.is_alive]);

  useEffect(() => {
    if (status?.is_alive == false) {
      showDeathAnimation();
    }
  }, [status?.is_alive]);

  const handleCuddle = async () => {
    if (!beast || !userAccount) return;
    try {
      await toast.promise(
        handleAction(
          "Cuddle",
          // Call the cuddle action on the client (ensure it's defined in your SDK)
          () => client.actions.sleep(userAccount as Account), //change sleep action to cuddle action
          // Use the cuddle animation from your initials data
          initials[beast.specie - 1].cuddlePicture
        ),
        {
          loading: "Cuddling...",
          success: "Your tamagotchi enjoyed the cuddle!",
          error: "Cuddle action failed!",
        }
      );
    } catch (error) {
      console.error("Cuddle error:", error);
    }
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
  };

  return (
    <>
      <div className="tamaguchi">
        <>{beast &&
          <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Status 
              beastStatus={status}
            />
            <div>
              <div className="scenario flex justify-center items-column">
                <img src={currentImage} alt="Tamagotchi" className="w-40 h-40" onClick={handleCuddle} style={{ cursor: 'pointer' }}/>
              </div>
              <Whispers 
                beast={beast}
                expanded={currentView === 'chat'}
                beastStatus={status}
              />
              {
                currentView === 'stats' ? 
                  <Stats 
                    beastStats={stats}
                  /> 
                : 
                currentView === 'actions' ? 
                  <Actions 
                    handleAction={handleAction}
                    isLoading={isLoading}
                    beast={beast}
                    beastStatus={status}
                    account={userAccount}
                    client={client}
                    setCurrentView={handleViewChange}
                  />
                :
                currentView === 'chat' ? 
                  <></>
                :
                currentView === 'food' ? 
                  <Food 
                    handleAction={handleAction}
                    beast={beast}
                    account={userAccount}
                    client={client}
                    showAnimation={showAnimation}
                  />
                :<></>
              }
                <div className="beast-interaction">
                {renderButton(currentButtonImage, handleMainButtonClick)}
                {renderButton(currentChatImage, handleChatButtonClick)}
                </div>
            </div>
          </Card>
        }</>
      </div>
    </>
  );
}

export default Tamagotchi;
