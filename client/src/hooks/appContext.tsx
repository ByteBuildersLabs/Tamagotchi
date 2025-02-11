import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { SchemaType } from "../dojo/bindings";
import { SDK } from '@dojoengine/sdk';
import { useAccount } from '@starknet-react/core';
import { usePlayer } from "./usePlayers";
import { useBeast } from "./useBeasts";
import { useBeastStatus } from "./useBeastsStatus";
import { useBeastsStats } from "./useBeastsStats";

interface GlobalState {
  userAccount: any;
  setUserAccount: (data: any) => void;
  userPlayer: any;
  setUserPlayer: (data: any) => void;
  userBeast: any;
  setUserBeast: (data: any) => void;
  userBeasts: any;
  setUserBeasts: (data: any) => void;
  userBeastStatus: any;
  setUserBeastStatus: (data: any) => void;
  userBeastsStatus: any;
  setUserBeastsStatus: (data: any) => void;
  userBeastStats: any;
  setUserBeastStats: (data: any) => void;
  userBeastsStats: any;
  setUserBeastsStats: (data: any) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider = ({ children, sdk }: { children: ReactNode; sdk: SDK<SchemaType> }) => {
  const { account } = useAccount();
  const [userAccount, setUserAccount] = useState<any>(account);
  useEffect(() => {
    setUserAccount(account);
  }, [account]);


  const { player } = usePlayer(sdk);
  const [userPlayer, setUserPlayer] = useState<any>(player);
  useEffect(() => {
    setUserPlayer(player);
  }, [player]);


  const { beast, beasts } = useBeast(sdk);
  const [ userBeast, setUserBeast ] = useState<any>(beast);
  const [ userBeasts, setUserBeasts ] = useState<any>(beasts);
  useEffect(() => {
    setUserBeast(beast);
    setUserBeasts(beasts);
  }, [beast, beasts]);


  const { beastStatus, beastsStatus } = useBeastStatus(sdk);
  const [ userBeastStatus, setUserBeastStatus ] = useState<any>(beastStatus);
  const [ userBeastsStatus, setUserBeastsStatus ] = useState<any>(beastsStatus);
  useEffect(() => {
    setUserBeastStatus(beastStatus);
    setUserBeastsStatus(beastsStatus);
  }, [beastStatus, beastsStatus]);


  const { beastStats, beastsStats } = useBeastsStats(sdk);
  const [ userBeastStats, setUserBeastStats ] = useState<any>(beastStats);
  const [ userBeastsStats, setUserBeastsStats ] = useState<any>(beastsStats);
  useEffect(() => {
    setUserBeastStats(beastStats);
    setUserBeastsStats(beastsStats);
  }, [beastStats, beastsStats]);


  return (
    <GlobalContext.Provider value={{ 
      userAccount,
      setUserAccount,
      userPlayer,
      setUserPlayer,
      userBeast,
      setUserBeast,
      userBeasts,
      setUserBeasts,
      userBeastStatus,
      setUserBeastStatus,
      userBeastsStatus,
      setUserBeastsStatus,
      userBeastStats,
      setUserBeastStats,
      userBeastsStats,
      setUserBeastsStats
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
