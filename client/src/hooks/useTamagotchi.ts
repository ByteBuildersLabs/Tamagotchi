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
  const [isActionDisabled, setIsActionDisabled] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const ACTION_COOLDOWN = 3000; // 3 seconds cooldown

  // Sound hooks
  const [playFeed] = useSound(feedSound, { volume: 0.6, preload: true });
  const [playClean] = useSound(cleanSound, { volume: 0.6, preload: true });
  const [playSleep] = useSound(sleepSound, { volume: 0.6, preload: true });
  const [playPlay] = useSound(playSound, { volume: 0.6, preload: true });
  const [playRevive] = useSound(reviveSound, { volume: 0.6, preload: true });
  const [buttonSound] = useSound(buttonClick, { volume: 0.6, preload: true });

  const loadingTime = 6000;

  const showAnimation = (gifPath: string) => {
    if (isLoading) return;
    setCurrentImage(gifPath);
    setTimeout(() => {
      setCurrentImage(currentBeast ? beastsDex[currentBeast.specie - 1]?.idlePicture : '');
    }, loadingTime);
  };

  const handleAction = async (actionName: string, actionFn: () => Promise<any>, animation: string) => {
    if (isLoading || !currentBeast || !currentBeast.beast_id || isActionDisabled) {
      return;
    }

    try {
      setIsActionDisabled(true);
      setCurrentAction(actionName);
      showAnimation(animation);
      buttonSound();
      
      switch (actionName) {
        case 'Feed': playFeed(); break;
        case 'Clean': playClean(); break;
        case 'Sleep': playSleep(); break;
        case 'Play': playPlay(); break;
        case 'Revive': playRevive(); break;
      }
      
      const tx = await actionFn();
      if (tx) {
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

      // Wait for the full cooldown period after the action is complete
      await new Promise(resolve => setTimeout(resolve, ACTION_COOLDOWN));
    } catch (error) {
      console.error("Action error:", error);
    } finally {
      setIsActionDisabled(false);
      setCurrentAction(null);
    }
  };

  const handleCuddle = async () => {
    if (isLoading || !currentBeast || !currentBeast.beast_id || !account || isActionDisabled) return;
    if (status[1] === 0 || status[2] === 0) return;

    try {
      setIsActionDisabled(true);
      setCurrentAction('Cuddle');
      showAnimation(beastsDex[currentBeast.specie - 1].cuddlePicture);
      const tx = await client.game.pet(account as Account);
      if (tx) {
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

      // Wait for the full cooldown period after the action is complete
      await new Promise(resolve => setTimeout(resolve, ACTION_COOLDOWN));
    } catch (error) {
      console.error("Cuddle error:", error);
    } finally {
      setIsActionDisabled(false);
      setCurrentAction(null);
    }
  };

  const handleNewEgg = async () => {
    if (isLoading || isActionDisabled) return;
    
    try {
      setIsActionDisabled(true);
      setCurrentAction('NewEgg');
      buttonSound();
      // Clear status before updating beast
      setStatus([]);
      setIsLoading(true);
      
      await client.game.updateBeast(account as Account);
      navigate('/spawn?reborn=true');

      // Wait for the full cooldown period after the action is complete
      await new Promise(resolve => setTimeout(resolve, ACTION_COOLDOWN));
    } catch (error) {
      console.error("Error updating beast:", error);
    } finally {
      setIsLoading(false);
      setIsActionDisabled(false);
      setCurrentAction(null);
    }
  };

  const showBirthday = async () => {
    if (isLoading || isActionDisabled) return;
    
    try {
      setIsActionDisabled(true);
      setCurrentAction('Birthday');
      setBirthday(getBirthDate(currentBeast.birth_date))
      buttonSound();
      setDisplayBirthday(true);

      // Wait for the full display period
      await new Promise(resolve => setTimeout(resolve, 5000));
      setDisplayBirthday(false);
    } catch (error) {
      console.error("Error showing birthday:", error);
    } finally {
      setIsActionDisabled(false);
      setCurrentAction(null);
    }
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

  // Efecto para manejar el estado de carga y la imagen actual
  useEffect(() => {
    if (!currentBeast) {
      setCurrentImage('');
      setIsLoading(true);
      return;
    }

    if (!account) {
      setIsLoading(true);
      return;
    }

    // Verificar que el account coincide con el player
    if (currentBeast.player !== account.address) {
      setIsLoading(true);
      return;
    }

    if (!status || status.length === 0) {
      setIsLoading(true);
      return;
    }

    // Si tenemos status y corresponde a la bestia actual
    if (status[0] === currentBeast.beast_id) {
      if (status[1] === 0) {
        setCurrentImage(dead);
        setCurrentView('actions');
        setIsLoading(false);
      } else if (status[2] === 0) {
        setCurrentImage(beastsDex[currentBeast.specie - 1]?.sleepPicture);
        setCurrentView('actions');
        setIsLoading(false);
      } else {
        setCurrentImage(beastsDex[currentBeast.specie - 1]?.idlePicture);
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
    }
  }, [status, currentBeast, account]);

  // Efecto para cargar el estado inicial y actualizaciones periódicas
  useEffect(() => {
    let isMounted = true;
    let updateInterval: NodeJS.Timeout;

    const updateStatus = async () => {
      try {
        if (!currentBeast || !currentBeast.beast_id || !account) {
          setIsLoading(true);
          return;
        }

        // Verificar que el account coincide con el player
        if (currentBeast.player !== account.address) {
          setIsLoading(true);
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
            setStatus(newStatus);
            setIsLoading(false);
          } else {
            await client.player.setCurrentBeast(account!, currentBeast.beast_id);
            console.log('Status received for different beast:', newStatus[0], 'current beast:', currentBeast.beast_id);
            setIsLoading(true);
          }
        } else {
          setIsLoading(true);
        }

        if (ageResponse) {
          setAge(Number(ageResponse));
        }
      } catch (error) {
        console.error("Error updating status:", error);
        if (isMounted) {
          setIsLoading(true);
        }
      }
    };

    // Cargar estado inicial inmediatamente
    updateStatus();
    
    // Configurar actualizaciones periódicas
    updateInterval = setInterval(updateStatus, 5000);

    return () => {
      isMounted = false;
      clearInterval(updateInterval);
    };
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
    isActionDisabled,
    currentAction
  };
}; 