import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { SchemaType } from "../dojo/bindings";
import { SDK } from '@dojoengine/sdk';
import { useAccount } from '@starknet-react/core';
import { usePlayer } from "./usePlayers";

interface GlobalState {
  userAccount: any;
  setUserAccount: (data: any) => void;
  userPlayer: any;
  setUserPlayer: (data: any) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider = ({ children, sdk }: { children: ReactNode; sdk: SDK<SchemaType> }) => {
  const { account } = useAccount();
  const [userAccount, setUserAccount] = useState<any>(account);
  useEffect(() => {
    setUserAccount(account);
  }, [account]);

  const { player } = usePlayer(sdk);
  const [userPlayer, setUserPlayer] = useState<any>(account);
  useEffect(() => {
    setUserPlayer(player);
  }, [player]);

  return (
    <GlobalContext.Provider value={{ userAccount, setUserAccount, userPlayer, setUserPlayer }}>
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
