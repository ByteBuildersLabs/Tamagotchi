import toast, { Toaster } from 'react-hot-toast';
import { Account } from '@dojoengine/torii-wasm';
import { Button } from '../../../components/ui/button';
import Food from '../../../assets/img/Feed.svg';
import Sleep from '../../../assets/img/Sleep.svg';
import Clean from '../../../assets/img/Clean.svg';
import Play from '../../../assets/img/Play.svg';
import beastsDex from '../../../data/beastDex';
import './main.css';
import { fetchStatus } from '../../../utils/tamagotchi';

type PictureKey = 'eatPicture' | 'sleepPicture' | 'cleanPicture' | 'playPicture' | 'idlePicture' | 'cuddlePicture';

const actionButtons: { label: string, img: string | null, action: string, pictureKey: PictureKey, isRevive?: boolean }[] = [
  { label: "Sleep", img: Sleep, action: "sleep", pictureKey: "sleepPicture" },
  { label: "Clean", img: Clean, action: "clean", pictureKey: "cleanPicture" },
  { label: "Feed", img: Food, action: "feed", pictureKey: "eatPicture" },
  { label: "Play", img: Play, action: "play", pictureKey: "playPicture" },
];

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

  return (
    <div className="actions mb-0">
      {actionButtons.map(({ label, img, action, pictureKey }) => (
        <Button
          key={label}
          onClick={async () => {
            // For the Feed action, change the view and exit.
            if (action === 'feed') {
              setCurrentView('food');
              return;
            }

            if (action === 'play') {
              setCurrentView('play');
              return;
            }

            try {
              // Wrap the action call with toast.promise to show notifications.
              await toast.promise(
                handleAction(
                  label, 
                  () => client.actions[action](account as Account), 
                  beastsDex[beast.specie - 1][pictureKey]
                ),
                {
                  loading: `${label} in progress...`,
                  success: `${label} executed successfully!`,
                  error: `Failed to ${label.toLowerCase()}.`,
                }
              );

              await client.actions.updateBeast();

              let status:any = fetchStatus(account);
              setStatus(status);
            } catch (error) {
              console.error("Action error:", error);
            }
          }}
          disabled={ isLoading || beastStatus[1] == 0}
        >
          {img && <img src={img} alt={label} />} {label}
        </Button>
      ))}
      {/* Render the Toaster to display toast notifications */}
      <Toaster position="bottom-center" />
    </div>
  );
}

export default Actions;
