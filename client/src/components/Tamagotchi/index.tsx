import { useEffect, useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { useDojoSDK } from "@dojoengine/sdk/react";

// Internal components
import { Card } from '../../components/ui/card';
import Header from '../Header';
import Status from "./Status";
import Actions from './Actions';
import Food from './Food';
import Play from './Play';
import Whispers from "./Whispers";
import Chat from "./Chat";
import BeastDisplay from './components/BeastDisplay';

// Hooks
import { useTamagotchi } from '../../hooks/useTamagotchi';
import { useBeasts } from '../../hooks/useBeasts';
import { usePlayer } from '../../hooks/usePlayers';

// Types
import { Message } from '../../types/game';


// Styles
import './main.css';

function Tamagotchi() {
  const { account } = useAccount();
  const { client } = useDojoSDK();
  const { player } = usePlayer();
  const { beastsData: beasts } = useBeasts();
  const [botMessage, setBotMessage] = useState<Message>({ user: '', text: '' });
  const [currentBeast, setCurrentBeast] = useState<any>({});

  const {
    currentImage,
    isLoading,
    currentView,
    birthday,
    age,
    displayBirthday,
    status,
    setStatus,
    handleAction,
    handleCuddle,
    handleNewEgg,
    showBirthday,
    setCurrentView,
    showAnimation,
    isStatusLoaded
  } = useTamagotchi(currentBeast);

  useEffect(() => {
    if (!player ) return;
    if (!beasts || beasts.length === 0) return; 
    const foundBeast = beasts.find((beast: any) => beast.player === player.address);
    if (foundBeast) setCurrentBeast(foundBeast);
  }, [player, beasts]);

  const getShareableStats = () => {
    if (!currentBeast || !status) return undefined;

    return {
      age: currentBeast?.age || 0,
      energy: status[4] || 0,
      hunger: status[3] || 0,
      happiness: status[5] || 0,
      clean: status[6] || 0
    };
  };

  return (
    <>
      <Header tamagotchiStats={getShareableStats()} />
      <div className="tamaguchi">
        {currentBeast && (
          <Card style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '99%'
          }}>
            <Status beastStatus={isStatusLoaded ? status : []} />
            <div className="game">
              {!isStatusLoaded || status[1] === 0 || status[2] === 0 ? null : (
                <Whispers
                  botMessage={botMessage}
                  setBotMessage={setBotMessage}
                  beast={currentBeast}
                  expanded={currentView === 'chat'}
                  beastStatus={status}
                />
              )}

              <BeastDisplay
                status={isStatusLoaded ? status : []}
                currentBeast={currentBeast}
                currentImage={currentImage}
                age={age}
                birthday={birthday}
                displayBirthday={displayBirthday}
                onCuddle={handleCuddle}
                onNewEgg={handleNewEgg}
                onShowBirthday={showBirthday}
                onChatToggle={() => setCurrentView('chat')}
                onBackToActions={() => setCurrentView('actions')}
                expanded={currentView === 'chat' || currentView === 'food' || currentView === 'play'}
              />

              {currentView === 'actions' ? (
                <Actions
                  handleAction={handleAction}
                  isLoading={isLoading || !isStatusLoaded}
                  beast={currentBeast}
                  beastStatus={isStatusLoaded ? status : []}
                  setStatus={setStatus}
                  account={account}
                  client={client}
                  setCurrentView={setCurrentView}
                />
              ) : currentView === 'food' ? (
                <Food
                  handleAction={handleAction}
                  beast={currentBeast}
                  account={account}
                  client={client}
                  beastStatus={isStatusLoaded ? status : []}
                  showAnimation={showAnimation}
                />
              ) : currentView === 'play' ? (
                <Play
                  handleAction={handleAction}
                  beast={currentBeast}
                  account={account}
                  client={client}
                />
              ) : currentView === 'chat' ? (
                <Chat
                  botMessage={botMessage}
                  setBotMessage={setBotMessage}
                  beast={currentBeast}
                  expanded={currentView === 'chat'}
                />
              ) : null}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}

export default Tamagotchi;
