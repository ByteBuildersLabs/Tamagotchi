import { useEffect, useState } from "react";
import { Account, addAddressPadding } from "starknet";
import useAppStore from "../../context/store.ts";
import { useAccount } from "@starknet-react/core";
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
import { useLocalStorage } from "../../hooks/useLocalStorage.tsx";
import Close from "../../assets/img/CloseWhite.svg";
import './main.css';

function Tamagotchi() {
  const { account } = useAccount();
  const { client } = useDojoSDK();
  const { beastsData: beasts } = useBeasts();
  const { player } = usePlayer();

  // Fetch Beasts and Player
  const { zplayer, setPlayer, zbeasts, setBeasts, zcurrentBeast, setCurrentBeast } = useAppStore();

  useEffect(() => {
    if (player) setPlayer(player);
  }, [player, setPlayer, location]);
  
  useEffect(() => {
    if (beasts) setBeasts(beasts);
  }, [beasts, setBeasts, location]);

  async function setCurrentBeastInPlayer(foundBeast:any) {
    if (!foundBeast) return
    await client.actions.setCurrentBeast(account as Account, foundBeast?.beast_id)
  }

  useEffect(() => {
    if (!zplayer || Object.keys(zplayer).length === 0) return;
    if (!zbeasts || zbeasts.length === 0) return;
    const foundBeast = zbeasts.find((beast: any) => addAddressPadding(beast.player) ===  zplayer.address);
    if (foundBeast) {
      setCurrentBeast(foundBeast);
      if (zcurrentBeast.beast_id === zplayer.current_beast_id) return
      setCurrentBeastInPlayer(foundBeast);
    }
  }, [zplayer, zbeasts]);

  // Fetch Status
  const [status, setStatus] = useLocalStorage('status', []);

  useEffect(() => {
    if (!zplayer || !account) return
    let response: any = fetchStatus(account);
    
    if (!status || status.length === 0) setIsLoading(true);
    if(status[0] != zplayer.current_beast_id) setIsLoading(true);

    setInterval(async () => {
      if(status[1] == 0) return
      response = await fetchStatus(account);
      if (response && Object.keys(response).length !== 0) setStatus(response);
      setIsLoading(false);
    }, 3000);
  }, [zcurrentBeast, location]);

  const loadingTime = 6000;
  const [isLoading, setIsLoading] = useState(true);
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
      }
    };
    updateBackground();
  }, []);

  // Animations
  const [currentImage, setCurrentImage] = useState<any>('');

  const showAnimation = (gifPath: string) => {
    setCurrentImage(gifPath);
    setTimeout(() => {
      setCurrentImage(zcurrentBeast ? beastsDex[zcurrentBeast.specie - 1]?.idlePicture : '');
    }, loadingTime);
  };

  useEffect(() => {
    if (!status || !zcurrentBeast) return;
    if (status[1] == 0) setCurrentImage(dead);
    if (status[1] == 1) setCurrentImage(zcurrentBeast ? beastsDex[zcurrentBeast.specie - 1]?.idlePicture : '')
  }, [status, zcurrentBeast]);

  // Twitter Share
  const getShareableStats = () => {
    if (!status || !zcurrentBeast) return undefined;
  
    return {
      age: zcurrentBeast?.age || 0,
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
    if (!zcurrentBeast || !account) return;
    if (status[1] == 0) return;
    try {
      await toast.promise(
        handleAction(
          "Cuddle",
          // Call the cuddle action on the client (ensure it's defined in your SDK)
          () => client.actions.pet(account as Account), //change sleep action to cuddle action
          // Use the cuddle animation from your initials data
          beastsDex[zcurrentBeast.specie - 1].cuddlePicture
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
        <>{zcurrentBeast &&
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
                !status || status.length === 0 || !zcurrentBeast ? <></> :
                  <Whispers
                    beast={zcurrentBeast}
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
                    {zcurrentBeast && (
                      <div className="age-indicator">
                        <span>{zcurrentBeast.age}</span>
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
                    beast={zcurrentBeast}
                    beastStatus={status}
                    setStatus={setStatus}
                    account={account}
                    client={client}
                    setCurrentView={setCurrentView}
                  />
                  : currentView === 'food' ? (
                    <Food
                      handleAction={handleAction}
                      beast={zcurrentBeast}
                      account={account}
                      client={client}
                      showAnimation={showAnimation}
                    />
                  ) : currentView === 'play' ? (
                    <Play
                      handleAction={handleAction}
                      beast={zcurrentBeast}
                      account={account}
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
