import { useEffect, useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { Account } from "starknet";
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
import useAppStore from "../../context/store";

// Types
import { Message } from '../../types/game';


// Styles
import './main.css';

function Tamagotchi() {
  const { account } = useAccount();
  const { client } = useDojoSDK();
  const { beastsData: beasts } = useBeasts();
  const { player } = usePlayer();
  const { zplayer, setPlayer, zbeasts, setBeasts, zcurrentBeast, setCurrentBeast } = useAppStore();
  const [botMessage, setBotMessage] = useState<Message>({ user: '', text: '' });

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
    showAnimation
  } = useTamagotchi();

  useEffect(() => {
    if (player) setPlayer(player);
  }, [player, setPlayer]);

  useEffect(() => {
    if (beasts) setBeasts(beasts);
  }, [beasts, setBeasts]);

  async function setCurrentBeastInPlayer(foundBeast: any) {
    if (!foundBeast) return;
    await client.player.setCurrentBeast(account as Account, foundBeast?.beast_id);
  }

  useEffect(() => {
    if (!zplayer || Object.keys(zplayer).length === 0) return;
    if (!zbeasts || zbeasts.length === 0) return;
    const foundBeast = zbeasts.find((beast: any) => beast.player === zplayer.address);
    if (foundBeast) {
      setCurrentBeast(foundBeast);
      if (foundBeast.beast_id === zplayer.current_beast_id) return;
      setCurrentBeastInPlayer(foundBeast);
    }
  }, [zplayer, zbeasts]);

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

  return (
    <>
      <Header tamagotchiStats={getShareableStats()} />
      <div className="tamaguchi">
        {zcurrentBeast && (
          <Card style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '99%'
          }}>
            <Status beastStatus={status} />
            <div className="game">
              <BeastDisplay
                status={status}
                currentBeast={zcurrentBeast}
                currentImage={currentImage}
                isLoading={isLoading}
                age={age}
                birthday={birthday}
                displayBirthday={displayBirthday}
                onCuddle={handleCuddle}
                onNewEgg={handleNewEgg}
                onShowBirthday={showBirthday}
                onChatToggle={() => setCurrentView('chat')}
                onBackToActions={() => setCurrentView('actions')}
              />

              {!status || status.length === 0 || !zcurrentBeast || status[1] === 0 || status[2] === 0 ? null : (
                <Whispers
                  botMessage={botMessage}
                  setBotMessage={setBotMessage}
                  beast={zcurrentBeast}
                  expanded={currentView === 'chat'}
                  beastStatus={status}
                />
              )}

              {currentView === 'actions' ? (
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
              ) : currentView === 'food' ? (
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
                  setBotMessage={setBotMessage}
                  beast={zcurrentBeast}
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
