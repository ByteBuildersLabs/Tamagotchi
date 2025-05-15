import { useState, useEffect } from 'react';
import { useAccount } from '@starknet-react/core';
import { Account } from "starknet";
import { useDojoSDK } from "@dojoengine/sdk/react";
import useSound from 'use-sound';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from "./useLocalStorage";
import beastsDex from "../data/beastDex";
import useAppStore from "../context/store";
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

export const useTamagotchi = () => {
  const { account } = useAccount();
  const { client } = useDojoSDK();
  const navigate = useNavigate();
  const [status, setStatus] = useLocalStorage<number[]>('status', []);
  const [reborn, setReborn] = useLocalStorage<boolean>('reborn', false);
  const { zplayer, zcurrentBeast } = useAppStore();

  // State
  const [currentImage, setCurrentImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('actions');
  const [birthday, setBirthday] = useState<{ hours: string; minutes: string }>({ hours: '', minutes: '' });
  const [age, setAge] = useState<number>(0);
  const [displayBirthday, setDisplayBirthday] = useState(false);

  // Sound hooks
  const [playFeed] = useSound(feedSound, { volume: 0.6, preload: true });
  const [playClean] = useSound(cleanSound, { volume: 0.6, preload: true });
  const [playSleep] = useSound(sleepSound, { volume: 0.6, preload: true });
  const [playPlay] = useSound(playSound, { volume: 0.6, preload: true });
  const [playRevive] = useSound(reviveSound, { volume: 0.6, preload: true });
  const [buttonSound] = useSound(buttonClick, { volume: 0.6, preload: true });

  const loadingTime = 6000;

  const showAnimation = (gifPath: string) => {
    setCurrentImage(gifPath);
    setTimeout(() => {
      setCurrentImage(zcurrentBeast ? beastsDex[zcurrentBeast.specie - 1]?.idlePicture : '');
    }, loadingTime);
  };

  const handleAction = async (actionName: string, actionFn: () => Promise<any>, animation: string) => {
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
          setStatus(newStatus as number[]);
        }
      }
    } catch (error) {
      console.error("Action error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCuddle = async () => {
    if (!zcurrentBeast || !account) return;
    if (status[1] === 0 || status[2] === 0) return;

    try {
      setIsLoading(true);
      const tx = await client.game.pet(account as Account);
      if (tx) {
        await tx.wait();
        showAnimation(beastsDex[zcurrentBeast.specie - 1].cuddlePicture);
        const achieveBeastPet = await client.achieve.achieveBeastPet(account as Account);
        console.info(achieveBeastPet);

        // Update status after transaction is confirmed
        const newStatus = await fetchStatus(account);
        if (newStatus && Object.keys(newStatus).length !== 0) {
          setStatus(newStatus as number[]);
        }
      }
    } catch (error) {
      console.error("Cuddle error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewEgg = async () => {
    buttonSound();
    // Clear status before updating beast
    setStatus([]);
    setIsLoading(true);
    try {
      await client.game.updateBeast(account as Account);
      if (!reborn) setReborn(true);
      navigate('/spawn');
    } catch (error) {
      console.error("Error updating beast:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showBirthday = () => {
    setBirthday(getBirthDate(zcurrentBeast.birth_date))
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
    if (!zcurrentBeast) {
      setCurrentImage('');
      return;
    }

    if (status[1] === 0) {
      setCurrentImage(dead);
      setCurrentView('actions');
      return;
    }
    if (status[2] === 0) {
      setCurrentImage(beastsDex[zcurrentBeast.specie - 1]?.sleepPicture);
      setCurrentView('actions');
      return;
    }
    setCurrentImage(beastsDex[zcurrentBeast.specie - 1]?.idlePicture);
  }, [status, zcurrentBeast]);

  // Initial state setup and status updates
  useEffect(() => {
    if (!zplayer || !account || !zcurrentBeast) {
      setIsLoading(true);
      return;
    }

    let isMounted = true;
    let updateInterval: NodeJS.Timeout;

    const updateStatus = async () => {
      try {
        const [statusResponse, ageResponse] = await Promise.all([
          fetchStatus(account),
          fetchAge(account)
        ]);
        
        if (!isMounted) return;

        if (statusResponse && Object.keys(statusResponse).length !== 0) {
          // Solo actualizamos el status si es diferente al actual
          const newStatus = statusResponse as number[];
          if (JSON.stringify(newStatus) !== JSON.stringify(status)) {
            setStatus(newStatus);
          }
        }
        if (ageResponse) {
          setAge(Number(ageResponse));
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error updating status:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Initial update
    updateStatus();

    // Set up interval for updates
    updateInterval = setInterval(updateStatus, 5000); // Aumentado a 5 segundos para reducir parpadeos

    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(updateInterval);
    };
  }, [zcurrentBeast, account, zplayer, status]);

  // Clean up localStorage when component unmounts or when beast changes
  useEffect(() => {
    if (!zcurrentBeast) {
      localStorage.removeItem('status');
      localStorage.removeItem('reborn');
    }
  }, [zcurrentBeast]);

  // Reset loading state when beast changes
  useEffect(() => {
    if (zcurrentBeast) {
      setIsLoading(true);
      // Actualizar el status inmediatamente cuando cambia la bestia
      if (account) {
        fetchStatus(account).then(newStatus => {
          if (newStatus && Object.keys(newStatus).length !== 0) {
            setStatus(newStatus as number[]);
          }
        });
      }
    }
  }, [zcurrentBeast, account]);

  return {
    currentImage,
    isLoading,
    currentView,
    birthday,
    age,
    displayBirthday,
    status,
    setStatus,
    zcurrentBeast,
    handleAction,
    handleCuddle,
    handleNewEgg,
    showBirthday,
    setCurrentView,
    showAnimation
  };
}; 