import { useEffect, useState } from "react";
import { Account, addAddressPadding } from "starknet";
import useAppStore from "../../context/store.ts";
import { useAccount } from "@starknet-react/core";
import { Card } from '../../components/ui/card';
import useSound from 'use-sound';
import { useNavigate } from "react-router-dom";
import beastsDex from "../../data/beastDex.tsx";
import dead from '../../assets/img/dead.gif';
import Actions from "./Actions/index.tsx";
import Status from "./Status/index.tsx";
import Food from "./Food/index.tsx";
import Play from "./Play/index.tsx";
import Whispers from "./Whispers/index.tsx";
import Chat from "./Chat/index.tsx";
import CleanlinessIndicator from "../CleanIndicator/index.tsx";
import feedSound from '../../assets/sounds/bbeating.mp3';
import cleanSound from '../../assets/sounds/bbshower.mp3';
import sleepSound from '../../assets/sounds/bbsleeps.mp3';
import playSound from '../../assets/sounds/bbjump.mp3';
import reviveSound from '../../assets/sounds/bbrevive.mp3';
import buttonClick from '../../assets/sounds/click.mp3';
import Header from '../../components/Header';
import Spinner from "../ui/spinner.tsx";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { usePlayer } from "../../hooks/usePlayers.tsx";
import { useBeasts } from "../../hooks/useBeasts.tsx";
import { fetchStatus, fetchAge, getBirthDate } from "../../utils/tamagotchi.tsx";
import { useLocalStorage } from "../../hooks/useLocalStorage.tsx";
import Close from "../../assets/img/CloseWhite.svg";
import chatIcon from '../../assets/img/chat.svg';
import Egg from "../../assets/img/egg.gif";
import Cake from "../../assets/img/cake.svg";
import { Message } from "../../hooks/useBeastChat.ts";
import './main.css';

function Tamagotchi() {
  const { account } = useAccount();
  const { client } = useDojoSDK();
  const { beastsData: beasts } = useBeasts();
  const { player } = usePlayer();
  const navigate = useNavigate();
  const [ botMessage, setBotMessage ] = useState<Message>({ user: '', text: '' });
  const [isMobileDragging, setIsMobileDragging] = useState(false);
  const [ birthday, setBirthday ] = useState<any>({ }); 
  const [ age, setAge ] = useState<any>(); 

  // Fetch Beasts and Player
  const { zplayer, setPlayer, zbeasts, setBeasts, zcurrentBeast, setCurrentBeast } = useAppStore();

  useEffect(() => {
    if (player) setPlayer(player);
  }, [player, setPlayer, location]);

  useEffect(() => {
    if (beasts) setBeasts(beasts);
  }, [beasts, setBeasts, location]);

  async function setCurrentBeastInPlayer(foundBeast: any) {
    if (!foundBeast) return
    await client.player.setCurrentBeast(account as Account, foundBeast?.beast_id);
  }

  useEffect(() => {
    if (!zplayer || Object.keys(zplayer).length === 0) return;
    if (!zbeasts || zbeasts.length === 0) return;
    const foundBeast = zbeasts.find((beast: any) => addAddressPadding(beast.player) === zplayer.address);
    if (foundBeast) {
      setCurrentBeast(foundBeast);
      setBirthday(getBirthDate(zcurrentBeast.birth_date))
      if (zcurrentBeast.beast_id === zplayer.current_beast_id) return
      setCurrentBeastInPlayer(foundBeast);
    }
  }, [zplayer, zbeasts, location]);

  const handleDragOver = (e: React.DragEvent) => {
    // Prevent default to allow drop
    e.preventDefault();
    
    // Add visual indication that this is a drop target
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add('drag-over');
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    // Remove visual indication when drag leaves
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('drag-over');
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Remove drag-over class
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('drag-over');
    }
    
    // Check if beast is alive and awake
    if (!zcurrentBeast || status[1] != 1 || status[2] != 1) return;
    
    try {
      // Get the food data from dataTransfer
      const foodData = e.dataTransfer.getData('application/json');
      if (!foodData) return;
      
      const { name } = JSON.parse(foodData);
      
      // Find the food in the DOM and trigger its click event
      const foodItem = Array.from(document.querySelectorAll('.food-item'))
        .find(item => item.textContent?.includes(name));
        
      if (foodItem) {
        (foodItem as HTMLElement).click();
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  // Listen for messages from the Food component about mobile drag state
  useEffect(() => {
    const handleMobileDragMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'MOBILE_DRAG_STATE') {
        setIsMobileDragging(e.data.isDragging);
        
        // Apply body class to prevent scrolling during drag
        if (e.data.isDragging) {
          document.body.classList.add('preventing-scroll');
        } else {
          document.body.classList.remove('preventing-scroll');
        }
      }
    };
    
    window.addEventListener('message', handleMobileDragMessage);
    
    return () => {
      window.removeEventListener('message', handleMobileDragMessage);
    };
  }, []);

  // Prevent scrolling issues during mobile drag
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isMobileDragging) {
        e.preventDefault();
      }
    };
    
    // Add with passive: false to ensure preventDefault works
    document.addEventListener('touchmove', preventScroll, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isMobileDragging]);

  // Fetch Status
  const [status, setStatus] = useLocalStorage('status', []);
  const [reborn, setReborn] = useLocalStorage('reborn', false);

  useEffect(() => {
    if (!zplayer || !account) return
    let statusResponse: any = fetchStatus(account);
    let ageResponse: any = fetchAge(account);
    if (!status || status.length === 0) setIsLoading(true);
    if (status[0] != zplayer.current_beast_id) setIsLoading(true);

    setInterval(async () => {
      if (status[1] == 0) return
      statusResponse = await fetchStatus(account);
      ageResponse = await fetchAge(account);
      if (statusResponse && Object.keys(statusResponse).length !== 0) {
        setStatus(statusResponse);
      }
      if (ageResponse) {
        setAge(ageResponse);
      }
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
  const [buttonSound] = useSound(buttonClick, { volume: 0.7, preload: true });

  // Animations
  const [currentImage, setCurrentImage] = useState<any>('');

  const showAnimation = (gifPath: string) => {
    setCurrentImage(gifPath);
    setTimeout(() => {
      setCurrentImage(zcurrentBeast ? beastsDex[zcurrentBeast.specie - 1]?.idlePicture : '');
    }, loadingTime);
  };

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) bodyElement.classList.add('day');

    if (!status) return
    if (bodyElement && status[1] == 0) bodyElement.classList.remove('day');
  }, [status, zcurrentBeast, location])

  useEffect(() => {
    if (status[1] == 0) {
      setCurrentImage(dead);
      setCurrentView('actions');
      return
    }
    if (status[2] == 0) {
      setCurrentImage(zcurrentBeast ? beastsDex[zcurrentBeast.specie - 1]?.sleepPicture : '');
      setCurrentView('actions');
      return
    }
    setCurrentImage(zcurrentBeast ? beastsDex[zcurrentBeast.specie - 1]?.idlePicture : '')
  }, [status, zcurrentBeast, location]);

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
  // Helper to wrap Dojo actions
  const handleAction = async (actionName: string, actionFn: () => Promise<{ transaction_hash: string } | undefined>, animation: string) => {
    setIsLoading(true);
    showAnimation(animation);
    buttonSound();
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
    if (status[2] == 0) return;

    try {
      handleAction(
        "Cuddle",
        // Call the cuddle action on the client (ensure it's defined in your SDK)
        async () => await client.game.pet(account as Account), //change sleep action to cuddle action
        // Use the cuddle animation from your initials data
        beastsDex[zcurrentBeast.specie - 1].cuddlePicture
      )
      // Disable the button for 5 seconds
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, loadingTime);
    } catch (error) {
      console.error("Cuddle error:", error);
    }
  };

  const handleNewEgg = () => {
    buttonSound();
    if (!reborn) setReborn(true);
    navigate('/spawn');
  }

  const [ displayBirthday, setDisplayBirthday ] = useState(false);

  const showBirthday = () => {
    buttonSound();
    setDisplayBirthday(true);
    setTimeout(() => {
      setDisplayBirthday(false);
    }, 5000);
  }

  return (
    <>
      <Header tamagotchiStats={getShareableStats()} />
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
                status[1] == 0 &&
                <>
                  <button
                    className="button"
                    onClick={handleNewEgg}
                  >
                    Hatch a new Egg
                    <img src={Egg} className="new-egg" alt="beast" />
                  </button>
                </>
              }
              {
                !status || status.length === 0 || !zcurrentBeast || status[1] == 0 || status[2] == 0 ? <></> :
                  <Whispers
                    botMessage={botMessage}
                    setBotMessage={(setBotMessage)}
                    beast={zcurrentBeast}
                    expanded={currentView === 'chat'}
                    beastStatus={status}
                  />
              }
              <div className="scenario flex justify-center items-column">
                {
                  !status || status.length === 0 ? <Spinner message="Loading your beast..." /> :
                  <div className="relative w-40 h-40">
                    <img
                      src={currentImage}
                      alt="Tamagotchi"
                      className="w-full h-full" 
                      onClick={handleCuddle}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      style={{ cursor: 'pointer' }}
                    />
                    {status[1] === 1 && <CleanlinessIndicator cleanlinessLevel={status[6]} />}
                  </div>
                }
              </div>
              <div className="beast-interaction">
                <div className="beast-buttons">
                  {zcurrentBeast && (
                    <div className="d-flex position-relative">
                      <div className="age-indicator" onClick={() => { showBirthday() }}>
                        <span>{age}</span>
                      </div>
                      {
                        displayBirthday &&
                        <div className="age-info">
                          <img src={Cake} alt="cake" />
                          <span>{birthday.hours}:{birthday.minutes}</span>
                        </div>
                      }
                      {
                        status[1] == 1 && status[2] == 1 &&
                        <div className="chat-toggle" onClick={() => setCurrentView('chat')}>
                          <img src={chatIcon} alt="chat with tamagotchi" />
                        </div>
                      }
                    </div>
                  )}
                  {(currentView === 'food' || currentView === 'play' || currentView === 'chat') && (
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
                      beastStatus={status}
                      showAnimation={showAnimation}
                    />

                  ) : currentView === 'play' ? (
                    <Play
                      handleAction={handleAction}
                      beast={zcurrentBeast}
                      account={account}
                      client={client}
                    />
                  ) : currentView === 'chat' ? (
                    <Chat
                      botMessage={botMessage}
                      setBotMessage={(setBotMessage)}
                      beast={zcurrentBeast}
                      expanded={currentView === 'chat'}
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
