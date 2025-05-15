import { useState, useEffect } from 'react';
import { useAccount } from '@starknet-react/core';
import { Account } from "starknet";
import { useDojoSDK } from "@dojoengine/sdk/react";
import useSound from 'use-sound';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from "./useLocalStorage";
import beastsDex from "../data/beastDex";
import useAppStore from "../context/store";
import { fetchAge, fetchStatus, getDayPeriod } from '../components/Tamagotchi/utils';

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
  const [status, setStatus] = useLocalStorage('status', []);
  const [reborn, setReborn] = useLocalStorage('reborn', false);
  const { zplayer, zcurrentBeast } = useAppStore();

  // State
  const [currentImage, setCurrentImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('actions');
  const [birthday] = useState<{ hours: string; minutes: string }>({ hours: '', minutes: '' });
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

  const handleAction = async (actionName: string, actionFn: () => Promise<{ transaction_hash: string } | undefined>, animation: string) => {
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
    
    await actionFn();
    setTimeout(() => {
      setIsLoading(false);
    }, loadingTime);
  };

  const handleCuddle = async () => {
    if (!zcurrentBeast || !account) return;
    if (status[1] === 0 || status[2] === 0) return;

    try {
      await handleAction(
        "Cuddle",
        async () => await client.game.pet(account as Account),
        beastsDex[zcurrentBeast.specie - 1].cuddlePicture
      );

      const achieveBeastPet = await client.achieve.achieveBeastPet(account as Account);
      setIsLoading(true);
      setTimeout(() => {
        if (achieveBeastPet) setIsLoading(false);
      }, loadingTime);
    } catch (error) {
      console.error("Cuddle error:", error);
    }
  };

  const handleNewEgg = async () => {
    buttonSound();
    await client.game.updateBeast(account as Account);
    if (!reborn) setReborn(true);
    navigate('/spawn');
  };

  const showBirthday = () => {
    if (status[1] === 0) return
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
    if (status[1] === 0) {
      setCurrentImage(dead);
      setCurrentView('actions');
      return;
    }
    if (status[2] === 0) {
      setCurrentImage(zcurrentBeast ? beastsDex[zcurrentBeast.specie - 1]?.sleepPicture : '');
      setCurrentView('actions');
      return;
    }
    setCurrentImage(zcurrentBeast ? beastsDex[zcurrentBeast.specie - 1]?.idlePicture : '');
  }, [status, zcurrentBeast]);

  useEffect(() => {
    if (!zplayer || !account) return;
    let statusResponse: any = fetchStatus(account);
    let ageResponse: any = fetchAge(account);
    
    if (!status || status.length === 0) setIsLoading(true);
    if (status[0] !== zplayer.current_beast_id) setIsLoading(true);

    const interval = setInterval(async () => {
      if (status[1] === 0) return;
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

    return () => clearInterval(interval);
  }, [zcurrentBeast, account, zplayer]);

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