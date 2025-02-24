import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { useBeasts } from "../../hooks/useBeasts";
import Tamagotchi from "../Tamagotchi";
import SpawnBeast from "../SpawnBeast";
import NewCover from "../NewCover";

function Main() {
  const { account } = useAccount();
  const { beasts } = useBeasts();
  const [view, setView] = useState<any>('');

  useEffect(() => {
    setView(account && beasts ? <Tamagotchi /> : account ? <SpawnBeast /> : <NewCover />);
  }, [account, beasts])
  
  return view;
}

export default Main;
