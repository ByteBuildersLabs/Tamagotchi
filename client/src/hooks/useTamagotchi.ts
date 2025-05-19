import { useState, useEffect } from 'react';
import { useAccount } from '@starknet-react/core';
import { Account } from "starknet";
import { useDojoSDK } from "@dojoengine/sdk/react";
import useSound from 'use-sound';
import { useNavigate } from 'react-router-dom';
import beastsDex from "../data/beastDex";
import { fetchAge, fetchStatus, getBirthDate, getDayPeriod } from '../components/Tamagotchi/utils';

// Sound imports
import feedSound from '../assets/sounds/bbeating.mp3';
import cleanSound from '../assets/sounds/bbshower.mp3';
import sleepSound from '../assets/sounds/bbsleeps.mp3';
import playSound from '../assets/sounds/bbjump.mp3';
import reviveSound from '../assets/sounds/bbrevive.mp3';
import buttonClick from '../assets/sounds/click.mp3';

// Image imports
import dead from '../assets/img/img-dead.gif';

export const useTamagotchi = (currentBeast: any) => {
  console.info('currentBeast:', currentBeast);
  const { account } = useAccount();
  const { client } = useDojoSDK();
  const navigate = useNavigate();
  const [status, setStatus] = useState<number[]>([]);

  // State
  const [currentImage, setCurrentImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('actions');
  const [birthday, setBirthday] = useState<{ hours: string; minutes: string }>({ hours: '', minutes: '' });
  const [age, setAge] = useState<number>(0);
  const [displayBirthday, setDisplayBirthday] = useState(false);
  const [isStatusLoaded, setIsStatusLoaded] = useState(false);

  // Sound hooks
  const [playFeed] = useSound(feedSound, { volume: 0.6, preload: true });
  const [playClean] = useSound(cleanSound, { volume: 0.6, preload: true });
  const [playSleep] = useSound(sleepSound, { volume: 0.6, preload: true });
  const [playPlay] = useSound(playSound, { volume: 0.6, preload: true });
  const [playRevive] = useSound(reviveSound, { volume: 0.6, preload: true });
  const [buttonSound] = useSound(buttonClick, { volume: 0.6, preload: true });

  const loadingTime = 6000;

  const showAnimation = (gifPath: string) => {
    if (!isStatusLoaded) return;
    setCurrentImage(gifPath);
    setTimeout(() => {
      setCurrentImage(currentBeast ? beastsDex[currentBeast.specie - 1]?.idlePicture : '');
    }, loadingTime);
  };

  const handleAction = async (actionName: string, actionFn: () => Promise<any>, animation: string) => {
    if (!isStatusLoaded || !currentBeast || !currentBeast.beast_id) {
      return;
    }

    setIsLoading(true);
    showAnimation(animation);
    buttonSound();
    
    switch (actionName) {
      case 'Feed': playFeed(); break;
      case 'Clean': playClean(); break;
      case 'Sleep': playSleep(); break;
      case 'Play': playPlay(); break;
      case 'Revive': playRevive(); break;
    }
    
    try {
      const tx = await actionFn();
      if (tx) {
        await tx.wait();
        // Update status after transaction is confirmed
        const newStatus = await fetchStatus(account);
        if (newStatus && Object.keys(newStatus).length !== 0) {
          // Verificar que el status corresponde a la bestia actual
          if (newStatus[0] === currentBeast.beast_id) {
            setStatus(newStatus as number[]);
          } else {
            console.log('Status received for different beast:', newStatus[0], 'current beast:', currentBeast.beast_id);
          }
        }
      }
    } catch (error) {
      console.error("Action error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCuddle = async () => {
    if (!isStatusLoaded || !currentBeast || !currentBeast.beast_id || !account) return;
    if (status[1] === 0 || status[2] === 0) return;

    try {
      setIsLoading(true);
      const tx = await client.game.pet(account as Account);
      if (tx) {
        await tx.wait();
        showAnimation(beastsDex[currentBeast.specie - 1].cuddlePicture);
        await client.achieve.achieveBeastPet(account as Account);

        // Update status after transaction is confirmed
        const newStatus = await fetchStatus(account);
        if (newStatus && Object.keys(newStatus).length !== 0) {
          // Verificar que el status corresponde a la bestia actual
          if (newStatus[0] === currentBeast.beast_id) {
            setStatus(newStatus as number[]);
          } else {
            console.log('Status received for different beast:', newStatus[0], 'current beast:', currentBeast.beast_id);
          }
        }
      }
    } catch (error) {
      console.error("Cuddle error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewEgg = async () => {
    if (!isStatusLoaded) return;
    buttonSound();
    // Clear status before updating beast
    setStatus([]);
    setIsLoading(true);
    try {
      await client.game.updateBeast(account as Account);
      navigate('/spawn');
    } catch (error) {
      console.error("Error updating beast:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showBirthday = () => {
    if (!isStatusLoaded) return;
    setBirthday(getBirthDate(currentBeast.birth_date))
    buttonSound();
    setDisplayBirthday(true);
    setTimeout(() => {
      setDisplayBirthday(false);
    }, 5000);
  };

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    const time = getDayPeriod();
    ['day', 'night', 'sunrise', 'sunset'].forEach(className => 
      bodyElement?.classList.remove(className)
    );
    
    if (bodyElement) {
      switch (time) {
        case 'day': bodyElement.classList.add('day'); break;
        case 'sunrise': bodyElement.classList.add('sunrise'); break;
        case 'sunset': bodyElement.classList.add('sunset'); break;
        default: bodyElement.classList.add('night');
      }
    }

    if (!status || (bodyElement && status[1] === 0)) {
      bodyElement?.classList.remove('day');
    }
  }, [status]);

  useEffect(() => {
    if (!currentBeast) {
      setCurrentImage('');
      setIsStatusLoaded(false);
      return;
    }

    if (!status || status.length === 0) {
      setIsStatusLoaded(false);
      return;
    }

    if (status[1] === 0) {
      setCurrentImage(dead);
      setCurrentView('actions');
      setIsStatusLoaded(true);
      return;
    }
    if (status[2] === 0) {
      setCurrentImage(beastsDex[currentBeast.specie - 1]?.sleepPicture);
      setCurrentView('actions');
      setIsStatusLoaded(true);
      return;
    }
    setCurrentImage(beastsDex[currentBeast.specie - 1]?.idlePicture);
    setIsStatusLoaded(true);
  }, [status, currentBeast]);

  // Initial state setup and status updates
  useEffect(() => {
    let isMounted = true;
    let updateInterval: NodeJS.Timeout;

    const updateStatus = async () => {
      try {
        if (!currentBeast || !currentBeast.beast_id) {
          setIsStatusLoaded(false);
          return;
        }

        const [statusResponse, ageResponse] = await Promise.all([
          fetchStatus(account),
          fetchAge(account)
        ]);
        
        if (!isMounted) return;

        if (statusResponse && Object.keys(statusResponse).length !== 0) {
          const newStatus = statusResponse as number[];
          if (newStatus[0] === currentBeast.beast_id) {
            if (JSON.stringify(newStatus) !== JSON.stringify(status)) {
              setStatus(newStatus);
              setIsStatusLoaded(true);
            }
          } else {
            console.log('Status received for different beast:', newStatus[0], 'current beast:', currentBeast.beast_id);
            setIsStatusLoaded(false);
          }
        } else {
          setIsStatusLoaded(false);
        }
        if (ageResponse) {
          setAge(Number(ageResponse));
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error updating status:", error);
        if (isMounted) {
          setIsLoading(false);
          setIsStatusLoaded(false);
        }
      }
    };

    updateStatus();
    updateInterval = setInterval(updateStatus, 5000);

    return () => {
      isMounted = false;
      clearInterval(updateInterval);
    };
  }, [currentBeast, account, status]);

  // Reset loading state when beast changes
  useEffect(() => {
    if (currentBeast && currentBeast.beast_id) {
      setIsLoading(true);
      setIsStatusLoaded(false);
      if (account) {
        fetchStatus(account).then(newStatus => {
          if (newStatus && Object.keys(newStatus).length !== 0) {
            if (newStatus[0] === currentBeast.beast_id) {
              setStatus(newStatus as number[]);
              setIsStatusLoaded(true);
            } else {
              console.log('Status received for different beast:', newStatus[0], 'current beast:', currentBeast.beast_id);
              setIsStatusLoaded(false);
            }
          } else {
            setIsStatusLoaded(false);
          }
        });
      }
    }
  }, [currentBeast, account]);

  return {
    currentImage,
    isLoading,
    currentView,
    birthday,
    age,
    displayBirthday,
    status,
    setStatus,
    currentBeast,
    handleAction,
    handleCuddle,
    handleNewEgg,
    showBirthday,
    setCurrentView,
    showAnimation,
    isStatusLoaded
  };
}; 