import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/index.tsx";

interface AppLayoutProps {
  backButton?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ backButton = false }) => {
  return (
    <>
      <Header backButton={backButton} />
      <Outlet />
    </>
  );
};

export default AppLayout;
