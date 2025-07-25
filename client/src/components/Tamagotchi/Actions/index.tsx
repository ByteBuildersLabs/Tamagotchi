// React and external libraries
import { Account } from '@dojoengine/torii-wasm';
import useSound from 'use-sound';

// Internal components
import { Button } from '../../../components/ui/button';

// Services and Utils
import { fetchStatus } from '../utils';

// Data
import beastsDex from '../../../data/beastDex';

// Assets
import buttonClick from '../../../assets/sounds/click.mp3';
import Food from '../../../assets/img/icon-feed.svg';
import Sleep from '../../../assets/img/icon-sleep.svg';
import Awake from '../../../assets/img/icon-sun.svg';
import Clean from '../../../assets/img/icon-clean.svg';
import Play from '../../../assets/img/icon-play.svg';

// Styles
import './main.css';

type PictureKey = 'eatPicture' | 'sleepPicture' | 'cleanPicture' | 'playPicture' | 'idlePicture' | 'cuddlePicture';

const Actions = ({ 
  handleAction, 
  isLoading, 
  beast, 
  beastStatus, 
  account, 
  client, 
  setCurrentView, 
  setStatus,
  isActionDisabled 
}: { 
  handleAction: any, 
  isLoading: any, 
  beast: any,
  beastStatus: any,
  account: any, 
  client: any,
  setCurrentView: (view: string) => void,
  setStatus: any,
  isActionDisabled: boolean
}) => {

  const actionButtons: { label: string, img: string | null, action: string, pictureKey: PictureKey, isRevive?: boolean }[] = [
    { label: beastStatus[3] == 1 ? "Sleep" : "Awake", img: beastStatus[3] == 1 ? Sleep : Awake, action: beastStatus[3] == 1 ? "sleep" : "awake", pictureKey: beastStatus[3] == 1 ? "sleepPicture" : "idlePicture" },
    { label: "Clean", img: Clean, action: "clean", pictureKey: "cleanPicture" },
    { label: "Feed", img: Food, action: "feed", pictureKey: "eatPicture" },
    { label: "Play", img: Play, action: "play", pictureKey: "playPicture" },
  ];

  const [buttonSound] = useSound(buttonClick, { volume: 0.6, preload: true });

  return (
    <div className={`actions mb-0 ${isActionDisabled ? 'aura' : ''}`}>
      {
        actionButtons.map(({ label, img, action, pictureKey }) => (
          <Button
            key={label}
            onClick={async () => {
              // For the Feed action, change the view and exit.
              if (action === 'feed') {
                buttonSound();
                setCurrentView('food');
                await client.game.updateBeast(account as Account);
                let status:any = fetchStatus(account);
                if (status && Object.keys(status).length !== 0) setStatus(status);
                return;
              }

              if (action === 'play') {
                buttonSound();
                setCurrentView('play');
                await client.game.updateBeast(account as Account);
                let status:any = fetchStatus(account);
                if (status && Object.keys(status).length !== 0) setStatus(status);
                return;
              }

              try {
                handleAction(
                  label, 
                  async () => {
                    await client.game[action](account as Account);
                    if (action === 'sleep') {
                      await client.achieve.achieveBeastSleep(account as Account);
                    } else if (action === 'clean') {
                      await client.achieve.achieveBeastClean(account as Account);
                    }
                  },
                  beastsDex[beast.specie - 1][pictureKey]
                )

                const txUpdateBeast = await client.game.updateBeast(account as Account);

                if (!txUpdateBeast) return

                const status:any = fetchStatus(account);
                if (status && Object.keys(status).length !== 0) setStatus(status);
              } catch (error) {
                console.error("Action error:", error);
              }
            }}
            disabled={ 
              isLoading || 
              isActionDisabled ||
              !beastStatus ||
              beastStatus[2] == 0 || 
              (action != 'sleep' && action != 'awake') && beastStatus[3] == 0 || 
              (action == 'sleep' || action == 'awake') && beastStatus[5] == 100 ||
              (action == 'clean') && beastStatus[7] == 100
            } 
          >
            {img && <img src={img} alt={label} />} {label}
          </Button>
        ))
      }
    </div>
  );
}

export default Actions;
