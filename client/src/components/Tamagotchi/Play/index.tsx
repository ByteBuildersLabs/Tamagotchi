import { useState } from 'react';
import './main.css';

import beastsDex from '../../../data/beastDex.tsx';

const Play = ({ handleAction, beast, account, client, showAnimation }: { 
    handleAction: any, 
    beast: any, 
    account: any, 
    client: any,
    showAnimation: (gifPath: string) => void
  }) => {
    
    const playTamagotchi = async () => {
        if (!beast) return; 

         // Get the appropriate eating animation for the beast
        const eatAnimation = beastsDex[beast.specie - 1].eatPicture;
        showAnimation(eatAnimation);

        // Execute the feed action wrapped in a toast.promise to show notifications
        try {
            handleAction("Play", () => client.actions.play(account));
        } catch (error) {
            console.error("Error feeding beast:", error);
        }
    }

    return (
        
      );
    };
export default Play;
