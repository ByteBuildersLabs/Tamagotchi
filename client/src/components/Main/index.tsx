import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { usePlayer } from "../../hooks/usePlayers";
import Tamagotchi from "../Tamagotchi";
import SpawnBeast from "../SpawnBeast";
import NewCover from "../NewCover";


function Main() {
  const { account } = useAccount();
  const { player } = usePlayer();
  const [view, setView] = useState<any>('')
  useEffect(() => {
    setView(account && player?.current_beast_id ? <Tamagotchi /> : account ? <SpawnBeast /> : <NewCover />);
  }, [player, account])
  
  return view;
}

export default Main;
