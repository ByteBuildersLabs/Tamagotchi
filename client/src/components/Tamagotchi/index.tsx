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
import beastsDex from "../../data/beastDex.tsx";
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
import statsIcon from '../../assets/img/stats.svg';
import Egg from "../../assets/img/egg.gif";
import Header from '../../components/Header';
import { Link } from "react-router-dom";
import './main.css';
import TamagotchiJR from "../Joyride/TamagotchiJR.tsx";

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

  const [playFeed] = useSound(feedSound, { volume: 0.7, preload: true });
  const [playClean] = useSound(cleanSound, { volume: 0.7, preload: true });
  const [playSleep] = useSound(sleepSound, { volume: 0.7, preload: true });
  const [playPlay] = useSound(playSound, { volume: 0.7, preload: true });
  const [playRevive] = useSound(reviveSound, { volume: 0.7, preload: true });

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
        bodyElement.style.padding = '15px 15px 30px';
      }
    };
    updateBackground();
  }, []);

  // Animations
  const [currentImage, setCurrentImage] = useState(beast ? beastsDex[beast.specie - 1].idlePicture : '');
  const [firstTime, isFirstTime] = useState(true);
  useEffect(() => {
    if (firstTime && beast) {
      setCurrentImage(beast ? beastsDex[beast.specie - 1].idlePicture : '')
      isFirstTime(false);
    }
  }, [beast]);

  const showAnimation = (gifPath: string) => {
    setCurrentImage(gifPath);
    setTimeout(() => {
      setCurrentImage(beast ? beastsDex[beast.specie - 1].idlePicture : '');
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
      <Header />
      <div className="tamaguchi">
        <>{beast &&
          <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Status
              beastStatus={status}
            />
            <div className="game">
              <div className="scenario flex justify-center items-column">
                <img src={currentImage} alt="Tamagotchi" className="w-40 h-40" />
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
                      setCurrentView={setCurrentView}
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
                        : <></>
              }
              <div className="beast-interaction">
                <div>
                  <img className="actions-icon" src={monster} onClick={() => (setCurrentView('actions'))} />
                  <img className="message-icon" src={message} onClick={() => setCurrentView('chat')} />
                  <img className="stats-icon" src={statsIcon} onClick={() => setCurrentView('stats')} />
                </div>
                <Link to={'/hatch'} className="hatch hatch-icon">
                  <span>Hatch Egg</span>
                  <img src={Egg} onClick={() => (setCurrentView('actions'))} />
                </Link>
              </div>
            </div>
          </Card>
        }</>
      </div>
      <TamagotchiJR />
    </>
  );
}
export default Tamagotchi;