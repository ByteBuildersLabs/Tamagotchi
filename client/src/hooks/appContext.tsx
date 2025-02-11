import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAccount } from '@starknet-react/core';

interface GlobalState {
  userAccount: any;
  setUserAccount: (data: any) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const { account } = useAccount();
  const [userAccount, setUserAccount] = useState<any>(account);

  useEffect(() => {
    setUserAccount(account);
  }, [account])

  return (
    <GlobalContext.Provider value={{ userAccount, setUserAccount }}>
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
