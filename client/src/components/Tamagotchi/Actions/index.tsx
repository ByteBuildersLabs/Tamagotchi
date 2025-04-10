import { fetchStatus } from '../../../utils/tamagotchi';
import { Account } from '@dojoengine/torii-wasm';
import { Button } from '../../../components/ui/button';
import useSound from 'use-sound';
import OnlyLoading from '../../OnlyLoading';
import buttonClick from '../../../assets/sounds/click.mp3';
import Food from '../../../assets/img/Feed.svg';
import Sleep from '../../../assets/img/Sleep.svg';
import Awake from '../../../assets/img/sun.svg';
import Clean from '../../../assets/img/Clean.svg';
import Play from '../../../assets/img/Play.svg';
import beastsDex from '../../../data/beastDex';
import './main.css';

type PictureKey = 'eatPicture' | 'sleepPicture' | 'cleanPicture' | 'playPicture' | 'idlePicture' | 'cuddlePicture';

const Actions = ({ handleAction, isLoading, beast, beastStatus, account, client, setCurrentView, setStatus }: { 
  handleAction: any, 
  isLoading: any, 
  beast: any,
  beastStatus: any,
  account: any, 
  client: any,
  setCurrentView: (view: string) => void,
  setStatus: (view: string) => void,
}) => {

  const actionButtons: { label: string, img: string | null, action: string, pictureKey: PictureKey, isRevive?: boolean }[] = [
    { label: beastStatus[2] == 1 ? "Sleep" : "Awake", img: beastStatus[2] == 1 ? Sleep : Awake, action: beastStatus[2] == 1 ? "sleep" : "awake", pictureKey: beastStatus[2] == 1 ? "sleepPicture" : "idlePicture" },
    { label: "Clean", img: Clean, action: "clean", pictureKey: "cleanPicture" },
    { label: "Feed", img: Food, action: "feed", pictureKey: "eatPicture" },
    { label: "Play", img: Play, action: "play", pictureKey: "playPicture" },
  ];

  const [buttonSound] = useSound(buttonClick, { volume: 0.7, preload: true });

  return (
    <div className="actions mb-0">
      {
        isLoading ? <OnlyLoading /> :
        actionButtons.map(({ label, img, action, pictureKey }) => (
          <Button
            key={label}
            onClick={async () => {
              // For the Feed action, change the view and exit.
              if (action === 'feed') {
                buttonSound();
                setCurrentView('food');
                return;
              }

              if (action === 'play') {
                buttonSound();
                setCurrentView('play');
                return;
              }

              try {
                handleAction(
                  label, 
                  async () => await client.game[action](account as Account), 
                  beastsDex[beast.specie - 1][pictureKey]
                )

                await client.game.updateBeast(account as Account);

                let status:any = fetchStatus(account);
                if (status && Object.keys(status).length !== 0) setStatus(status);
              } catch (error) {
                console.error("Action error:", error);
              }
            }}
            disabled={ 
              isLoading || 
              !beastStatus ||
              beastStatus[1] == 0 || 
              (action != 'sleep' && action != 'awake') && beastStatus[2] == 0 || 
              (action == 'sleep' || action == 'awake') && beastStatus[4] == 100 ||
              (action == 'clean') && beastStatus[6] == 100
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
