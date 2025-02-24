import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { useBeasts } from "../../hooks/useBeasts";
import Tamagotchi from "../Tamagotchi";
import SpawnBeast from "../SpawnBeast";
import NewCover from "../NewCover";
import { usePlayer } from "../../hooks/usePlayers";

function Main() {
  const { account } = useAccount();
  const { beasts } = useBeasts();
  const { player } = usePlayer();
  const [view, setView] = useState<any>('');

  useEffect(() => {
    const beast = beasts.find(beast => beast?.player === player?.address);
    console.info('player', player);
    console.info('beast', beast);
    setView(account && player && beast ? <Tamagotchi /> : account ? <SpawnBeast /> : <NewCover />);
  }, [account, beasts])
  
  return view;
}

export default Main;
